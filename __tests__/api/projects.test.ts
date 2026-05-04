import { prisma } from '@/lib/prisma'
import { canTransitionProject } from '@/lib/state-machine'

afterAll(async () => {
  await prisma.$disconnect()
})

describe('Project state transitions', () => {
  let projectId: string
  let clientId: string

  beforeAll(async () => {
    const client = await prisma.client.create({ data: { name: 'Project Test Client' } })
    clientId = client.id
    const project = await prisma.project.create({
      data: { name: 'Project State Test', totalAmount: 50000, clientId: client.id },
    })
    projectId = project.id
  })

  it('starts in Borrador state', async () => {
    const p = await prisma.project.findUnique({ where: { id: projectId } })
    expect(p!.status).toBe('Borrador')
  })

  it('transitions Borrador → PendienteAdelanto', async () => {
    expect(canTransitionProject('Borrador', 'PendienteAdelanto')).toBe(true)
    const updated = await prisma.project.update({
      where: { id: projectId },
      data: { status: 'PendienteAdelanto' },
    })
    expect(updated.status).toBe('PendienteAdelanto')
  })

  it('transitions PendienteAdelanto → EnCurso', async () => {
    expect(canTransitionProject('PendienteAdelanto', 'EnCurso')).toBe(true)
    const updated = await prisma.project.update({
      where: { id: projectId },
      data: { status: 'EnCurso' },
    })
    expect(updated.status).toBe('EnCurso')
  })

  it('transitions EnCurso → Pausado', async () => {
    expect(canTransitionProject('EnCurso', 'Pausado')).toBe(true)
    const updated = await prisma.project.update({
      where: { id: projectId },
      data: { status: 'Pausado' },
    })
    expect(updated.status).toBe('Pausado')
  })

  it('transitions Pausado → EnCurso (resume)', async () => {
    expect(canTransitionProject('Pausado', 'EnCurso')).toBe(true)
    const updated = await prisma.project.update({
      where: { id: projectId },
      data: { status: 'EnCurso' },
    })
    expect(updated.status).toBe('EnCurso')
  })

  it('transitions EnCurso → Finalizado', async () => {
    expect(canTransitionProject('EnCurso', 'Finalizado')).toBe(true)
    const updated = await prisma.project.update({
      where: { id: projectId },
      data: { status: 'Finalizado' },
    })
    expect(updated.status).toBe('Finalizado')
  })

  it('cannot transition from Finalizado (terminal)', () => {
    expect(canTransitionProject('Finalizado', 'EnCurso')).toBe(false)
    expect(canTransitionProject('Finalizado', 'Cancelado')).toBe(false)
    expect(canTransitionProject('Finalizado', 'Borrador')).toBe(false)
  })

  afterAll(async () => {
    await prisma.project.delete({ where: { id: projectId } })
    await prisma.client.delete({ where: { id: clientId } })
  })
})

describe('Project with milestones', () => {
  it('project totalAmount matches sum of milestone amounts for seeded projects', async () => {
    const projects = await prisma.project.findMany({
      include: { milestones: true },
    })
    for (const p of projects) {
      if (p.milestones.length > 0) {
        const milestoneSum = p.milestones.reduce((s, m) => s + m.amount, 0)
        expect(milestoneSum).toBeCloseTo(p.totalAmount, 0)
      }
    }
  })

  it('project paidAmount does not exceed totalAmount', async () => {
    const projects = await prisma.project.findMany()
    for (const p of projects) {
      expect(p.paidAmount).toBeLessThanOrEqual(p.totalAmount)
      expect(p.paidAmount).toBeGreaterThanOrEqual(0)
    }
  })
})

describe('Cancellation from any active state', () => {
  it('allows cancellation from Borrador', () => {
    expect(canTransitionProject('Borrador', 'Cancelado')).toBe(true)
  })
  it('allows cancellation from PendienteAdelanto', () => {
    expect(canTransitionProject('PendienteAdelanto', 'Cancelado')).toBe(true)
  })
  it('allows cancellation from EnCurso', () => {
    expect(canTransitionProject('EnCurso', 'Cancelado')).toBe(true)
  })
  it('allows cancellation from Pausado', () => {
    expect(canTransitionProject('Pausado', 'Cancelado')).toBe(true)
  })
  it('does not allow cancellation from Finalizado', () => {
    expect(canTransitionProject('Finalizado', 'Cancelado')).toBe(false)
  })
  it('does not allow cancellation from Cancelado', () => {
    expect(canTransitionProject('Cancelado', 'Cancelado')).toBe(false)
  })
})
