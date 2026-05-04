import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const analyst = searchParams.get('analyst')

  const where: Record<string, unknown> = {}
  if (status && status !== 'todos') where.financialStatus = status
  if (analyst && analyst !== 'todos') where.analystId = analyst

  const milestones = await prisma.milestone.findMany({
    where,
    include: {
      project: { include: { client: true } },
      analyst: true,
      deliverable: true,
    },
    orderBy: { daysOverdue: 'desc' },
  })

  return NextResponse.json(milestones.map(m => ({
    id: m.id,
    clientName: m.project.client.name,
    projectName: m.project.name,
    projectId: m.projectId,
    milestoneName: m.name,
    amount: m.amount,
    paidAmount: m.paidAmount,
    pendingAmount: m.pendingAmount,
    daysActive: m.daysActive,
    daysOverdue: m.daysOverdue,
    financialStatus: m.financialStatus,
    status: m.financialStatus,
    activationType: m.activationType,
    dueDate: m.dueDate?.toISOString() ?? null,
    lastAction: m.lastAction ?? '',
    lastActionDate: m.lastActionDate?.toISOString() ?? '',
    responsible: m.analyst?.name ?? 'Sin asignar',
    deliverable: m.deliverable ? { name: m.deliverable.name, technicalStatus: m.deliverable.technicalStatus } : null,
    suspensionReason: m.suspensionReason,
    commitmentDate: m.commitmentDate?.toISOString() ?? null,
    commitmentAmount: m.commitmentAmount,
  })))
}
