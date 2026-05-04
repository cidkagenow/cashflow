import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { logAudit } from '@/lib/audit'

export async function GET() {
  const projects = await prisma.project.findMany({
    include: { client: true, milestones: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(projects.map(p => ({
    id: p.id,
    clientName: p.client.name,
    projectName: p.name,
    service: p.service,
    totalAmount: p.totalAmount,
    paidAmount: p.paidAmount,
    currency: p.currency,
    status: p.status,
    milestoneCount: p.milestones.length,
    activeMilestones: p.milestones.filter(m => !['Configurado', 'Bloqueado', 'Pagado', 'Conciliado'].includes(m.financialStatus)).length,
  })))
}

export async function POST(request: Request) {
  const body = await request.json()
  const { clientId, projectName, service, totalAmount, currency, milestones } = body

  const project = await prisma.project.create({
    data: {
      name: projectName,
      service,
      totalAmount,
      currency: currency || 'USD',
      clientId,
      milestones: {
        create: (milestones ?? []).map((m: { name: string; amount: number; activationType?: string }) => ({
          name: m.name,
          amount: m.amount,
          pendingAmount: m.amount,
          financialStatus: 'Configurado',
          activationType: m.activationType || 'manual',
        })),
      },
    },
    include: { milestones: true, client: true },
  })

  await logAudit({
    entityType: 'Project',
    entityId: project.id,
    action: 'CREATE',
    newState: 'Borrador',
    userName: 'Sistema',
    projectId: project.id,
  })

  return NextResponse.json(project, { status: 201 })
}
