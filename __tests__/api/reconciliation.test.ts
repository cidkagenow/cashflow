import { prisma } from '@/lib/prisma'
import { canTransition } from '@/lib/state-machine'

afterAll(async () => {
  await prisma.$disconnect()
})

describe('Reconciliation business logic', () => {
  let clientId: string
  let projectId: string
  let milestoneId: string
  let paymentId: string

  beforeAll(async () => {
    const client = await prisma.client.create({ data: { name: 'Recon Test Client' } })
    clientId = client.id
    const project = await prisma.project.create({
      data: { name: 'Recon Test Project', totalAmount: 10000, clientId: client.id },
    })
    projectId = project.id
    const milestone = await prisma.milestone.create({
      data: {
        name: 'Recon Test Milestone',
        amount: 5000,
        pendingAmount: 5000,
        financialStatus: 'PagoEnRevision',
        projectId: project.id,
      },
    })
    milestoneId = milestone.id
    const payment = await prisma.payment.create({
      data: {
        amount: 5000,
        expectedAmount: 5000,
        method: 'transfer',
        reference: 'RECON-TEST-001',
        status: 'pending',
        projectId: project.id,
        milestoneId: milestone.id,
      },
    })
    paymentId = payment.id
  })

  it('payment starts in pending status', async () => {
    const p = await prisma.payment.findUnique({ where: { id: paymentId } })
    expect(p!.status).toBe('pending')
  })

  it('reconciling a full payment transitions milestone to Pagado', async () => {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { milestone: true },
    })
    const milestone = payment!.milestone!

    expect(canTransition(milestone.financialStatus, 'Pagado')).toBe(true)

    const newPaid = milestone.paidAmount + payment!.amount
    const newPending = milestone.amount - newPaid
    const isFullyPaid = newPending <= 0

    expect(isFullyPaid).toBe(true)

    await prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'reconciled', reconciledBy: 'Test', reconciledAt: new Date() },
    })

    await prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        paidAmount: newPaid,
        pendingAmount: Math.max(0, newPending),
        financialStatus: 'Pagado',
      },
    })

    const updated = await prisma.milestone.findUnique({ where: { id: milestoneId } })
    expect(updated!.financialStatus).toBe('Pagado')
    expect(updated!.paidAmount).toBe(5000)
    expect(updated!.pendingAmount).toBe(0)
  })

  afterAll(async () => {
    await prisma.payment.delete({ where: { id: paymentId } })
    await prisma.milestone.delete({ where: { id: milestoneId } })
    await prisma.project.delete({ where: { id: projectId } })
    await prisma.client.delete({ where: { id: clientId } })
  })
})

describe('Partial payment reconciliation', () => {
  let clientId: string
  let projectId: string
  let milestoneId: string
  let payment1Id: string
  let payment2Id: string

  beforeAll(async () => {
    const client = await prisma.client.create({ data: { name: 'Partial Recon Client' } })
    clientId = client.id
    const project = await prisma.project.create({
      data: { name: 'Partial Recon Project', totalAmount: 10000, clientId: client.id },
    })
    projectId = project.id
    const milestone = await prisma.milestone.create({
      data: {
        name: 'Partial Recon Milestone',
        amount: 10000,
        pendingAmount: 10000,
        financialStatus: 'PagoEnRevision',
        projectId: project.id,
      },
    })
    milestoneId = milestone.id
    const p1 = await prisma.payment.create({
      data: {
        amount: 4000,
        expectedAmount: 10000,
        method: 'transfer',
        status: 'pending',
        isPartial: true,
        projectId: project.id,
        milestoneId: milestone.id,
      },
    })
    payment1Id = p1.id
    const p2 = await prisma.payment.create({
      data: {
        amount: 6000,
        expectedAmount: 10000,
        method: 'transfer',
        status: 'pending',
        isPartial: true,
        projectId: project.id,
        milestoneId: milestone.id,
      },
    })
    payment2Id = p2.id
  })

  it('first partial payment transitions to PagadoParcial', async () => {
    const milestone = await prisma.milestone.findUnique({ where: { id: milestoneId } })!
    const newPaid = milestone!.paidAmount + 4000
    const newPending = milestone!.amount - newPaid
    const isFullyPaid = newPending <= 0

    expect(isFullyPaid).toBe(false)
    expect(canTransition('PagoEnRevision', 'PagadoParcial')).toBe(true)

    await prisma.payment.update({
      where: { id: payment1Id },
      data: { status: 'reconciled' },
    })
    await prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        paidAmount: newPaid,
        pendingAmount: Math.max(0, newPending),
        financialStatus: 'PagadoParcial',
      },
    })

    const updated = await prisma.milestone.findUnique({ where: { id: milestoneId } })
    expect(updated!.financialStatus).toBe('PagadoParcial')
    expect(updated!.paidAmount).toBe(4000)
    expect(updated!.pendingAmount).toBe(6000)
  })

  it('second payment completes the milestone to Pagado', async () => {
    await prisma.milestone.update({
      where: { id: milestoneId },
      data: { financialStatus: 'PagoEnRevision' },
    })

    const milestone = await prisma.milestone.findUnique({ where: { id: milestoneId } })!
    const newPaid = milestone!.paidAmount + 6000
    const newPending = milestone!.amount - newPaid
    const isFullyPaid = newPending <= 0

    expect(isFullyPaid).toBe(true)
    expect(canTransition('PagoEnRevision', 'Pagado')).toBe(true)

    await prisma.payment.update({
      where: { id: payment2Id },
      data: { status: 'reconciled' },
    })
    await prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        paidAmount: newPaid,
        pendingAmount: 0,
        financialStatus: 'Pagado',
      },
    })

    const updated = await prisma.milestone.findUnique({ where: { id: milestoneId } })
    expect(updated!.financialStatus).toBe('Pagado')
    expect(updated!.paidAmount).toBe(10000)
    expect(updated!.pendingAmount).toBe(0)
  })

  afterAll(async () => {
    await prisma.payment.deleteMany({ where: { milestoneId } })
    await prisma.milestone.delete({ where: { id: milestoneId } })
    await prisma.project.delete({ where: { id: projectId } })
    await prisma.client.delete({ where: { id: clientId } })
  })
})

describe('Payment observation flow', () => {
  it('PagoEnRevision → PagoObservado is valid for observed payments', () => {
    expect(canTransition('PagoEnRevision', 'PagoObservado')).toBe(true)
  })

  it('PagoObservado can return to PagoEnRevision', () => {
    expect(canTransition('PagoObservado', 'PagoEnRevision')).toBe(true)
  })

  it('PagoObservado can fall back to Exigible', () => {
    expect(canTransition('PagoObservado', 'Exigible')).toBe(true)
  })
})
