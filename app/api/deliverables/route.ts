import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { logAudit } from '@/lib/audit'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get('projectId')

  const where: Record<string, unknown> = {}
  if (projectId) where.projectId = projectId

  const deliverables = await prisma.deliverable.findMany({
    where,
    include: { responsible: true, project: true, milestones: true },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json(deliverables)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { name, description, projectId, responsibleId } = body

  const deliverable = await prisma.deliverable.create({
    data: { name, description, projectId, responsibleId },
    include: { responsible: true },
  })

  await logAudit({
    entityType: 'Deliverable',
    entityId: deliverable.id,
    action: 'CREATE',
    newState: 'Pendiente',
    userName: 'Sistema',
    projectId,
  })

  return NextResponse.json(deliverable, { status: 201 })
}
