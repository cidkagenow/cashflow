import { prisma } from '@/lib/prisma'
import { canTransitionTechnical } from '@/lib/state-machine'

afterAll(async () => {
  await prisma.$disconnect()
})

describe('Deliverable technical state transitions', () => {
  let deliverableId: string
  let projectId: string
  let clientId: string

  beforeAll(async () => {
    const client = await prisma.client.create({ data: { name: 'Deliverable Test Client' } })
    clientId = client.id
    const project = await prisma.project.create({
      data: { name: 'Deliverable Test Project', totalAmount: 10000, clientId: client.id },
    })
    projectId = project.id
    const deliverable = await prisma.deliverable.create({
      data: {
        name: 'Test Deliverable',
        description: 'Unit test deliverable',
        technicalStatus: 'Pendiente',
        projectId: project.id,
      },
    })
    deliverableId = deliverable.id
  })

  it('starts in Pendiente state', async () => {
    const d = await prisma.deliverable.findUnique({ where: { id: deliverableId } })
    expect(d!.technicalStatus).toBe('Pendiente')
  })

  it('transitions Pendiente → EnCurso', async () => {
    expect(canTransitionTechnical('Pendiente', 'EnCurso')).toBe(true)
    const updated = await prisma.deliverable.update({
      where: { id: deliverableId },
      data: { technicalStatus: 'EnCurso' },
    })
    expect(updated.technicalStatus).toBe('EnCurso')
  })

  it('transitions EnCurso → Terminado', async () => {
    const updated = await prisma.deliverable.update({
      where: { id: deliverableId },
      data: { technicalStatus: 'Terminado', evidence: 'Link to evidence' },
    })
    expect(updated.technicalStatus).toBe('Terminado')
    expect(updated.evidence).toBe('Link to evidence')
  })

  it('transitions Terminado → Observado with observation note', async () => {
    const updated = await prisma.deliverable.update({
      where: { id: deliverableId },
      data: { technicalStatus: 'Observado', observationNote: 'Needs revision on section 3' },
    })
    expect(updated.technicalStatus).toBe('Observado')
    expect(updated.observationNote).toBe('Needs revision on section 3')
  })

  it('transitions Observado → Subsanacion', async () => {
    const updated = await prisma.deliverable.update({
      where: { id: deliverableId },
      data: { technicalStatus: 'Subsanacion' },
    })
    expect(updated.technicalStatus).toBe('Subsanacion')
  })

  it('transitions Subsanacion → Terminado (re-submission)', async () => {
    const updated = await prisma.deliverable.update({
      where: { id: deliverableId },
      data: { technicalStatus: 'Terminado' },
    })
    expect(updated.technicalStatus).toBe('Terminado')
  })

  it('transitions Terminado → Aprobado', async () => {
    const updated = await prisma.deliverable.update({
      where: { id: deliverableId },
      data: { technicalStatus: 'Aprobado' },
    })
    expect(updated.technicalStatus).toBe('Aprobado')
  })

  it('cannot transition from Aprobado (terminal)', () => {
    expect(canTransitionTechnical('Aprobado', 'Pendiente')).toBe(false)
    expect(canTransitionTechnical('Aprobado', 'EnCurso')).toBe(false)
    expect(canTransitionTechnical('Aprobado', 'Observado')).toBe(false)
  })

  it('rejects invalid transitions', () => {
    expect(canTransitionTechnical('Pendiente', 'Terminado')).toBe(false)
    expect(canTransitionTechnical('EnCurso', 'Aprobado')).toBe(false)
    expect(canTransitionTechnical('Observado', 'Aprobado')).toBe(false)
  })

  afterAll(async () => {
    await prisma.deliverable.delete({ where: { id: deliverableId } })
    await prisma.project.delete({ where: { id: projectId } })
    await prisma.client.delete({ where: { id: clientId } })
  })
})

describe('Deliverable-milestone link', () => {
  it('milestones can reference deliverables', async () => {
    const milestones = await prisma.milestone.findMany({
      where: { deliverableId: { not: null } },
      include: { deliverable: true },
    })
    expect(milestones.length).toBeGreaterThan(0)
    for (const m of milestones) {
      expect(m.deliverable).toBeTruthy()
      expect(m.deliverable!.name).toBeTruthy()
    }
  })
})
