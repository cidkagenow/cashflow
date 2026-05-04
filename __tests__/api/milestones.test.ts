import { prisma } from '@/lib/prisma'
import { canTransition, getValidTransitions } from '@/lib/state-machine'

afterAll(async () => {
  await prisma.$disconnect()
})

describe('Milestone state transitions (database integration)', () => {
  let testMilestoneId: string

  beforeAll(async () => {
    const client = await prisma.client.create({
      data: { name: 'Test Client Jest' },
    })
    const project = await prisma.project.create({
      data: {
        name: 'Test Project Jest',
        totalAmount: 10000,
        clientId: client.id,
      },
    })
    const milestone = await prisma.milestone.create({
      data: {
        name: 'Test Milestone',
        amount: 5000,
        pendingAmount: 5000,
        financialStatus: 'Configurado',
        projectId: project.id,
      },
    })
    testMilestoneId = milestone.id
  })

  it('starts in Configurado state', async () => {
    const m = await prisma.milestone.findUnique({ where: { id: testMilestoneId } })
    expect(m!.financialStatus).toBe('Configurado')
  })

  it('can transition Configurado → Exigible', async () => {
    expect(canTransition('Configurado', 'Exigible')).toBe(true)
    const updated = await prisma.milestone.update({
      where: { id: testMilestoneId },
      data: { financialStatus: 'Exigible', activatedAt: new Date() },
    })
    expect(updated.financialStatus).toBe('Exigible')
    expect(updated.activatedAt).toBeTruthy()
  })

  it('can transition Exigible → Notificado', async () => {
    expect(canTransition('Exigible', 'Notificado')).toBe(true)
    const updated = await prisma.milestone.update({
      where: { id: testMilestoneId },
      data: { financialStatus: 'Notificado' },
    })
    expect(updated.financialStatus).toBe('Notificado')
  })

  it('can transition Notificado → EnMora', async () => {
    const updated = await prisma.milestone.update({
      where: { id: testMilestoneId },
      data: { financialStatus: 'EnMora', daysOverdue: 5 },
    })
    expect(updated.financialStatus).toBe('EnMora')
    expect(updated.daysOverdue).toBe(5)
  })

  it('can transition EnMora → CompromisoPago with commitment fields', async () => {
    const commitDate = new Date('2025-06-01')
    const updated = await prisma.milestone.update({
      where: { id: testMilestoneId },
      data: {
        financialStatus: 'CompromisoPago',
        commitmentDate: commitDate,
        commitmentAmount: 5000,
      },
    })
    expect(updated.financialStatus).toBe('CompromisoPago')
    expect(updated.commitmentDate).toEqual(commitDate)
    expect(updated.commitmentAmount).toBe(5000)
  })

  it('can transition CompromisoPago → PagoEnRevision', async () => {
    const updated = await prisma.milestone.update({
      where: { id: testMilestoneId },
      data: { financialStatus: 'PagoEnRevision' },
    })
    expect(updated.financialStatus).toBe('PagoEnRevision')
  })

  it('can transition PagoEnRevision → PagadoParcial', async () => {
    const updated = await prisma.milestone.update({
      where: { id: testMilestoneId },
      data: {
        financialStatus: 'PagadoParcial',
        paidAmount: 2500,
        pendingAmount: 2500,
      },
    })
    expect(updated.financialStatus).toBe('PagadoParcial')
    expect(updated.paidAmount).toBe(2500)
  })

  it('can go back PagadoParcial → PagoEnRevision → Pagado', async () => {
    await prisma.milestone.update({
      where: { id: testMilestoneId },
      data: { financialStatus: 'PagoEnRevision' },
    })
    const updated = await prisma.milestone.update({
      where: { id: testMilestoneId },
      data: {
        financialStatus: 'Pagado',
        paidAmount: 5000,
        pendingAmount: 0,
      },
    })
    expect(updated.financialStatus).toBe('Pagado')
    expect(updated.pendingAmount).toBe(0)
  })

  it('can transition Pagado → Conciliado', async () => {
    const updated = await prisma.milestone.update({
      where: { id: testMilestoneId },
      data: { financialStatus: 'Conciliado' },
    })
    expect(updated.financialStatus).toBe('Conciliado')
  })

  it('cannot transition from Conciliado (terminal state)', () => {
    const transitions = getValidTransitions('Conciliado')
    expect(transitions).toHaveLength(0)
  })

  afterAll(async () => {
    const m = await prisma.milestone.findUnique({ where: { id: testMilestoneId } })
    if (m) {
      await prisma.milestone.delete({ where: { id: testMilestoneId } })
      await prisma.project.delete({ where: { id: m.projectId } })
      const projects = await prisma.project.findMany({ where: { client: { name: 'Test Client Jest' } } })
      if (projects.length === 0) {
        await prisma.client.deleteMany({ where: { name: 'Test Client Jest' } })
      }
    }
  })
})

describe('Suspension workflow', () => {
  let testMilestoneId: string
  let projectId: string
  let clientId: string

  beforeAll(async () => {
    const client = await prisma.client.create({ data: { name: 'Suspension Test Client' } })
    clientId = client.id
    const project = await prisma.project.create({
      data: { name: 'Suspension Test Project', totalAmount: 10000, clientId: client.id },
    })
    projectId = project.id
    const milestone = await prisma.milestone.create({
      data: {
        name: 'Suspension Test Milestone',
        amount: 5000,
        pendingAmount: 5000,
        financialStatus: 'Exigible',
        projectId: project.id,
      },
    })
    testMilestoneId = milestone.id
  })

  it('can suspend an Exigible milestone with reason', async () => {
    const updated = await prisma.milestone.update({
      where: { id: testMilestoneId },
      data: {
        financialStatus: 'Suspendido',
        suspensionReason: 'Cliente en reestructuración',
        suspensionDate: new Date(),
        suspendedBy: 'María López',
      },
    })
    expect(updated.financialStatus).toBe('Suspendido')
    expect(updated.suspensionReason).toBe('Cliente en reestructuración')
    expect(updated.suspendedBy).toBe('María López')
  })

  it('can reactivate Suspendido → Exigible', async () => {
    expect(canTransition('Suspendido', 'Exigible')).toBe(true)
    const updated = await prisma.milestone.update({
      where: { id: testMilestoneId },
      data: { financialStatus: 'Exigible' },
    })
    expect(updated.financialStatus).toBe('Exigible')
  })

  afterAll(async () => {
    await prisma.milestone.delete({ where: { id: testMilestoneId } })
    await prisma.project.delete({ where: { id: projectId } })
    await prisma.client.delete({ where: { id: clientId } })
  })
})
