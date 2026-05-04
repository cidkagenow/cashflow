import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const method = searchParams.get('method')
  const search = searchParams.get('search')

  const where: Record<string, unknown> = {
    status: { not: 'completed' },
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
    milestone: p.milestone?.name ?? '',
    expectedAmount: p.expectedAmount ?? p.amount,
    receivedAmount: p.amount,
    method: p.method,
    reference: p.reference ?? '',
    voucherImage: p.voucherImage ?? '',
    status: p.status,
  })))
}

export async function PATCH(request: Request) {
  const body = await request.json()
  const { id, status, reason } = body

  const data: Record<string, unknown> = { status }
  if (status === 'reconciled') {
    data.reconciledBy = 'Contabilidad'
    data.reconciledAt = new Date()
  }
  if (reason) data.observedReason = reason

  const payment = await prisma.payment.update({
    where: { id },
    data,
  })

  return NextResponse.json(payment)
}
