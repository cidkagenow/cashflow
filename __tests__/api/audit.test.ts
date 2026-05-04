import { prisma } from '@/lib/prisma'
import { logAudit } from '@/lib/audit'

afterAll(async () => {
  await prisma.$disconnect()
})

describe('Audit logging', () => {
  let auditId: string
  let projectId: string
  let clientId: string

  beforeAll(async () => {
    const client = await prisma.client.create({ data: { name: 'Audit Test Client' } })
    clientId = client.id
    const project = await prisma.project.create({
      data: { name: 'Audit Test Project', totalAmount: 10000, clientId: client.id },
    })
    projectId = project.id
  })

  it('creates an audit log entry', async () => {
    const entry = await logAudit({
      entityType: 'Milestone',
      entityId: 'test-milestone-1',
      action: 'FINANCIAL_STATUS_CHANGE',
      previousState: 'Exigible',
      newState: 'Notificado',
      reason: 'Jest test transition',
      userName: 'Test User',
      userRole: 'Analista',
      projectId,
    })

    auditId = entry.id
    expect(entry.entityType).toBe('Milestone')
    expect(entry.action).toBe('FINANCIAL_STATUS_CHANGE')
    expect(entry.previousState).toBe('Exigible')
    expect(entry.newState).toBe('Notificado')
    expect(entry.reason).toBe('Jest test transition')
    expect(entry.userName).toBe('Test User')
    expect(entry.userRole).toBe('Analista')
    expect(entry.projectId).toBe(projectId)
    expect(entry.createdAt).toBeTruthy()
  })

  it('stores metadata as JSON string', async () => {
    const entry = await logAudit({
      entityType: 'Payment',
      entityId: 'test-payment-1',
      action: 'RECONCILE',
      userName: 'Contabilidad',
      metadata: { amount: 5000, method: 'transfer' },
      projectId,
    })

    expect(entry.metadata).toBe(JSON.stringify({ amount: 5000, method: 'transfer' }))

    await prisma.auditLog.delete({ where: { id: entry.id } })
  })

  it('handles optional fields as undefined', async () => {
    const entry = await logAudit({
      entityType: 'Project',
      entityId: projectId,
      action: 'CREATE',
      userName: 'Sistema',
    })

    expect(entry.previousState).toBeNull()
    expect(entry.newState).toBeNull()
    expect(entry.reason).toBeNull()
    expect(entry.metadata).toBeNull()

    await prisma.auditLog.delete({ where: { id: entry.id } })
  })

  it('links audit log to project', async () => {
    const logs = await prisma.auditLog.findMany({
      where: { projectId, id: auditId },
      include: { project: true },
    })
    expect(logs.length).toBe(1)
    expect(logs[0].project!.name).toBe('Audit Test Project')
  })

  it('links audit log to milestone when provided', async () => {
    const milestone = await prisma.milestone.create({
      data: {
        name: 'Audit Milestone',
        amount: 1000,
        pendingAmount: 1000,
        projectId,
      },
    })

    const entry = await logAudit({
      entityType: 'Milestone',
      entityId: milestone.id,
      action: 'TEST',
      userName: 'Test',
      projectId,
      milestoneId: milestone.id,
    })

    const log = await prisma.auditLog.findUnique({
      where: { id: entry.id },
      include: { milestone: true },
    })
    expect(log!.milestone!.name).toBe('Audit Milestone')

    await prisma.auditLog.delete({ where: { id: entry.id } })
    await prisma.milestone.delete({ where: { id: milestone.id } })
  })

  afterAll(async () => {
    await prisma.auditLog.deleteMany({ where: { projectId } })
    await prisma.project.delete({ where: { id: projectId } })
    await prisma.client.delete({ where: { id: clientId } })
  })
})
