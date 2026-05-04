import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get('projectId')
  const milestoneId = searchParams.get('milestoneId')
  const entityType = searchParams.get('entityType')
  const limit = parseInt(searchParams.get('limit') || '50')

  const where: Record<string, unknown> = {}
  if (projectId) where.projectId = projectId
  if (milestoneId) where.milestoneId = milestoneId
  if (entityType) where.entityType = entityType

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: Math.min(limit, 200),
    include: {
      project: { select: { name: true } },
      milestone: { select: { name: true } },
    },
  })

  return NextResponse.json(logs.map(l => ({
    id: l.id,
    entityType: l.entityType,
    entityId: l.entityId,
    action: l.action,
    previousState: l.previousState,
    newState: l.newState,
    reason: l.reason,
    userName: l.userName,
    userRole: l.userRole,
    metadata: l.metadata ? JSON.parse(l.metadata) : null,
    projectName: l.project?.name,
    milestoneName: l.milestone?.name,
    createdAt: l.createdAt.toISOString(),
  })))
}
