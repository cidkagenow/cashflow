import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { canTransition, getValidTransitions, hasActiveDebt } from '@/lib/state-machine'
import { logAudit } from '@/lib/audit'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const milestone = await prisma.milestone.findUnique({
    where: { id },
    include: {
      project: { include: { client: true } },
      analyst: true,
      deliverable: true,
      payments: { orderBy: { date: 'desc' } },
      auditLogs: { orderBy: { createdAt: 'desc' }, take: 20 },
    },
  })

  if (!milestone) {
    return NextResponse.json({ error: 'Milestone not found' }, { status: 404 })
  }

  return NextResponse.json({
    ...milestone,
    validTransitions: getValidTransitions(milestone.financialStatus),
    hasActiveDebt: hasActiveDebt(milestone.financialStatus),
  })
}

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await _request.json()
  const { financialStatus, reason, userName, suspensionReason, commitmentDate, commitmentAmount, analystId } = body

  const milestone = await prisma.milestone.findUnique({
    where: { id },
    include: { project: true },
  })
  if (!milestone) {
    return NextResponse.json({ error: 'Milestone not found' }, { status: 404 })
  }

  const data: Record<string, unknown> = {}

  if (financialStatus) {
    if (!canTransition(milestone.financialStatus, financialStatus)) {
      return NextResponse.json(
        { error: `Invalid transition: ${milestone.financialStatus} → ${financialStatus}. Valid: ${getValidTransitions(milestone.financialStatus).join(', ')}` },
        { status: 400 }
      )
    }

    data.financialStatus = financialStatus
    data.lastAction = `Estado cambiado a ${financialStatus}`
    data.lastActionDate = new Date()

    if (financialStatus === 'Exigible' && !milestone.activatedAt) {
      data.activatedAt = new Date()
    }
    if (financialStatus === 'Suspendido') {
      data.suspensionReason = suspensionReason || reason || 'Sin motivo'
      data.suspensionDate = new Date()
      data.suspendedBy = userName || 'Sistema'
    }
    if (financialStatus === 'CompromisoPago') {
      if (commitmentDate) data.commitmentDate = new Date(commitmentDate)
      if (commitmentAmount) data.commitmentAmount = commitmentAmount
    }
  }

  if (analystId !== undefined) data.analystId = analystId

  const updated = await prisma.milestone.update({ where: { id }, data })

  if (financialStatus) {
    await logAudit({
      entityType: 'Milestone',
      entityId: id,
      action: 'FINANCIAL_STATUS_CHANGE',
      previousState: milestone.financialStatus,
      newState: financialStatus,
      reason: reason || suspensionReason,
      userName: userName || 'Sistema',
      projectId: milestone.projectId,
      milestoneId: id,
    })
  }

  return NextResponse.json(updated)
}
