import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const [projects, milestones, recentPayments, analysts] = await Promise.all([
    prisma.project.findMany({ include: { client: true } }),
    prisma.milestone.findMany({ include: { project: { include: { client: true } }, analyst: true } }),
    prisma.payment.findMany({
      where: { status: 'reconciled' },
      include: { project: true, milestone: true },
      orderBy: { date: 'desc' },
      take: 5,
    }),
    prisma.analyst.findMany(),
  ])

  const totalPorCobrar = milestones
    .filter(m => !['completed', 'pagado'].includes(m.status))
    .reduce((sum, m) => sum + m.amount, 0)

  const montoRecuperado = recentPayments.reduce((sum, p) => sum + p.amount, 0)

  const carteraVencida = milestones
    .filter(m => m.status === 'en_mora')
    .reduce((sum, m) => sum + m.amount, 0)

  const completedMilestones = milestones.filter(m => ['completed', 'pagado'].includes(m.status))
  const avgDays = completedMilestones.length > 0
    ? Math.round(completedMilestones.reduce((sum, m) => sum + m.daysActive, 0) / completedMilestones.length)
    : 0

  const kpis = {
    totalPorCobrar,
    montoRecuperado,
    carteraVencida,
    tiempoPromedio: avgDays,
  }

  const overdue = milestones
    .filter(m => m.status === 'en_mora')
    .map(m => ({
      projectName: m.project.name,
      milestoneName: m.name,
      amount: m.amount.toLocaleString(),
      status: 'overdue' as const,
      daysOverdue: m.daysOverdue,
      clientName: m.project.client.name,
    }))

  const exigible = milestones
    .filter(m => m.status === 'exigible')
    .map(m => ({
      projectName: m.project.name,
      milestoneName: m.name,
      amount: m.amount.toLocaleString(),
      status: 'exigible' as const,
      clientName: m.project.client.name,
    }))

  const reconciliations = recentPayments.map(p => ({
    projectName: p.project.name,
    milestoneName: p.milestone?.name ?? '',
    amount: p.amount.toLocaleString(),
    date: p.date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }),
    reconciliedBy: p.reconciledBy ?? 'Contabilidad',
    paymentMethod: p.method === 'transfer' ? 'Transferencia' : p.method === 'check' ? 'Cheque' : p.method === 'yape' ? 'Yape' : 'Efectivo',
  }))

  const activeProjects = projects.filter(p => p.status === 'in-progress').length
  const hitosPorCobrar = milestones.filter(m => !['completed', 'pagado'].includes(m.status)).length
  const allCollectable = milestones.filter(m => !['pendiente'].includes(m.status))
  const collected = allCollectable.filter(m => ['completed', 'pagado'].includes(m.status))
  const tasaEfectividad = allCollectable.length > 0 ? Math.round((collected.length / allCollectable.length) * 100) : 0
  const carteraSana = milestones.length > 0 ? Math.round(((milestones.length - milestones.filter(m => m.status === 'en_mora').length) / milestones.length) * 100) : 0

  const summaryStats = { activeProjects, hitosPorCobrar, tasaEfectividad, carteraSana }

  const analystEffectiveness = analysts.map(a => {
    const analystMilestones = milestones.filter(m => m.analystId === a.id)
    const cobrado = analystMilestones.filter(m => ['completed', 'pagado'].includes(m.status)).reduce((s, m) => s + m.amount, 0)
    const exigibleAmount = analystMilestones.filter(m => !['pendiente'].includes(m.status)).reduce((s, m) => s + m.amount, 0)
    const efectividad = exigibleAmount > 0 ? Math.round((cobrado / exigibleAmount) * 100) : 0
    return { name: a.name, efectividad, cobrado, exigible: exigibleAmount }
  })

  return NextResponse.json({
    kpis,
    alerts: { overdue, exigible },
    reconciliations,
    summaryStats,
    analystEffectiveness,
  })
}
