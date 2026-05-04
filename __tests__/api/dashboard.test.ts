import { prisma } from '@/lib/prisma'

beforeAll(async () => {
  const count = await prisma.project.count()
  if (count === 0) throw new Error('Database not seeded — run pnpm seed first')
})

afterAll(async () => {
  await prisma.$disconnect()
})

describe('Dashboard data integrity', () => {
  it('has projects with valid statuses', async () => {
    const validStatuses = ['Borrador', 'PendienteAdelanto', 'EnCurso', 'Pausado', 'Finalizado', 'Cancelado']
    const projects = await prisma.project.findMany()
    expect(projects.length).toBeGreaterThan(0)
    for (const p of projects) {
      expect(validStatuses).toContain(p.status)
    }
  })

  it('has milestones with valid financial statuses', async () => {
    const validStatuses = [
      'Configurado', 'Bloqueado', 'Exigible', 'Notificado', 'EnMora',
      'CompromisoPago', 'PagadoParcial', 'PagoEnRevision', 'PagoObservado',
      'Pagado', 'Conciliado', 'Suspendido',
    ]
    const milestones = await prisma.milestone.findMany()
    expect(milestones.length).toBeGreaterThan(0)
    for (const m of milestones) {
      expect(validStatuses).toContain(m.financialStatus)
    }
  })

  it('has milestones where paidAmount + pendingAmount equals amount', async () => {
    const milestones = await prisma.milestone.findMany()
    for (const m of milestones) {
      const sum = m.paidAmount + m.pendingAmount
      expect(Math.abs(sum - m.amount)).toBeLessThan(0.01)
    }
  })

  it('has EnMora milestones with daysOverdue > 0', async () => {
    const overdue = await prisma.milestone.findMany({
      where: { financialStatus: 'EnMora' },
    })
    for (const m of overdue) {
      expect(m.daysOverdue).toBeGreaterThan(0)
    }
  })

  it('has Suspendido milestones with suspensionReason', async () => {
    const suspended = await prisma.milestone.findMany({
      where: { financialStatus: 'Suspendido' },
    })
    for (const m of suspended) {
      expect(m.suspensionReason).toBeTruthy()
    }
  })

  it('computes totalPorCobrar correctly from active milestones', async () => {
    const milestones = await prisma.milestone.findMany()
    const active = milestones.filter(m =>
      !['Pagado', 'Conciliado', 'Configurado', 'Bloqueado'].includes(m.financialStatus)
    )
    const totalPorCobrar = active.reduce((sum, m) => sum + m.amount - m.paidAmount, 0)
    expect(totalPorCobrar).toBeGreaterThan(0)
  })

  it('has analysts assigned to milestones', async () => {
    const analysts = await prisma.analyst.findMany()
    expect(analysts.length).toBe(5)
    const milestonesWithAnalyst = await prisma.milestone.findMany({
      where: { analystId: { not: null } },
    })
    expect(milestonesWithAnalyst.length).toBeGreaterThan(0)
  })
})
