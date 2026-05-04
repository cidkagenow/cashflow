import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { canTransition } from '@/lib/state-machine'
import { logAudit } from '@/lib/audit'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const method = searchParams.get('method')
  const search = searchParams.get('search')

  const where: Record<string, unknown> = {
    status: { not: 'reconciled' },
  }
  if (status && status !== 'all') where.status = status
  if (method && method !== 'all') where.method = method

  const payments = await prisma.payment.findMany({
    where,
    include: {
      project: { include: { client: true } },
      milestone: true,
    },
    orderBy: { date: 'desc' },
  })

  let filtered = payments
  if (search) {
    const q = search.toLowerCase()
    filtered = payments.filter(p =>
      p.project.client.name.toLowerCase().includes(q) ||
      (p.milestone?.name ?? '').toLowerCase().includes(q) ||
      (p.reference ?? '').toLowerCase().includes(q)
    )
  }

  return NextResponse.json(filtered.map(p => ({
    id: p.id,
    date: p.date.toISOString(),
    clientName: p.project.client.name,
    projectName: p.project.name,
    milestone: p.milestone?.name ?? '',
    milestoneId: p.milestoneId,
    expectedAmount: p.expectedAmount ?? p.amount,
    receivedAmount: p.amount,
    method: p.method,
    reference: p.reference ?? '',
    voucherImage: p.voucherImage ?? '',
    status: p.status,
    isPartial: p.isPartial,
  })))
}

export async function PATCH(request: Request) {
  const body = await request.json()
  const { id, status, reason, userName } = body

  const payment = await prisma.payment.findUnique({
    where: { id },
    include: { milestone: true },
  })

  if (!payment) {
    return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
  }

  const data: Record<string, unknown> = { status }
  if (status === 'reconciled') {
    data.reconciledBy = userName || 'Contabilidad'
    data.reconciledAt = new Date()
  }
  if (reason) data.observedReason = reason

  const updatedPayment = await prisma.payment.update({ where: { id }, data })

  if (payment.milestoneId && payment.milestone) {
    const milestone = payment.milestone

    if (status === 'reconciled') {
      const newPaid = milestone.paidAmount + payment.amount
      const newPending = milestone.amount - newPaid
      const isFullyPaid = newPending <= 0

      let newFinancialStatus = milestone.financialStatus
      if (isFullyPaid && canTransition(milestone.financialStatus, 'Pagado')) {
        newFinancialStatus = 'Pagado'
      } else if (!isFullyPaid && canTransition(milestone.financialStatus, 'PagadoParcial')) {
        newFinancialStatus = 'PagadoParcial'
      }

      await prisma.milestone.update({
        where: { id: milestone.id },
        data: {
          paidAmount: newPaid,
          pendingAmount: Math.max(0, newPending),
          financialStatus: newFinancialStatus,
          lastAction: isFullyPaid ? 'Pago completo conciliado' : 'Pago parcial conciliado',
          lastActionDate: new Date(),
        },
      })

      if (isFullyPaid) {
        const project = await prisma.project.findUnique({ where: { id: payment.projectId } })
        if (project) {
          await prisma.project.update({
            where: { id: payment.projectId },
            data: { paidAmount: project.paidAmount + payment.amount },
          })
        }
      }

      await logAudit({
        entityType: 'Payment',
        entityId: id,
        action: 'RECONCILE',
        previousState: payment.status,
        newState: 'reconciled',
        userName: userName || 'Contabilidad',
        projectId: payment.projectId,
        milestoneId: milestone.id,
      })
    }

    if (status === 'observed') {
      if (canTransition(milestone.financialStatus, 'PagoObservado')) {
        await prisma.milestone.update({
          where: { id: milestone.id },
          data: {
            financialStatus: 'PagoObservado',
            lastAction: `Pago observado: ${reason}`,
            lastActionDate: new Date(),
          },
        })
      }

      await logAudit({
        entityType: 'Payment',
        entityId: id,
        action: 'OBSERVE',
        previousState: payment.status,
        newState: 'observed',
        reason,
        userName: userName || 'Contabilidad',
        projectId: payment.projectId,
        milestoneId: milestone.id,
      })
    }
  }

  return NextResponse.json(updatedPayment)
}
