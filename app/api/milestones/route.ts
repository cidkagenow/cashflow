import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const analyst = searchParams.get('analyst')

  const where: Record<string, unknown> = {}
  if (status && status !== 'todos') where.status = status
  if (analyst && analyst !== 'todos') where.analystId = analyst

  const milestones = await prisma.milestone.findMany({
    where,
    include: {
      project: { include: { client: true } },
      analyst: true,
    },
    orderBy: { daysOverdue: 'desc' },
  })

  return NextResponse.json(milestones.map(m => ({
    id: m.id,
    clientName: m.project.client.name,
    projectName: m.project.name,
    milestoneName: m.name,
    amount: m.amount,
    daysActive: m.daysActive,
    daysOverdue: m.daysOverdue,
    status: m.status,
    lastAction: m.lastAction ?? '',
    lastActionDate: m.lastActionDate ?? '',
    responsible: m.analyst?.name ?? 'Sin asignar',
  })))
}
