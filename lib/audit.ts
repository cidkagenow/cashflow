import { prisma } from '@/lib/prisma'

interface AuditEntry {
  entityType: string
  entityId: string
  action: string
  previousState?: string
  newState?: string
  reason?: string
  userName: string
  userRole?: string
  metadata?: Record<string, unknown>
  projectId?: string
  milestoneId?: string
}

export async function logAudit(entry: AuditEntry) {
  return prisma.auditLog.create({
    data: {
      entityType: entry.entityType,
      entityId: entry.entityId,
      action: entry.action,
      previousState: entry.previousState,
      newState: entry.newState,
      reason: entry.reason,
      userName: entry.userName,
      userRole: entry.userRole,
      metadata: entry.metadata ? JSON.stringify(entry.metadata) : undefined,
      projectId: entry.projectId,
      milestoneId: entry.milestoneId,
    },
  })
}
