import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { ACTIVE_DEBT_STATES, BLOCKED_FROM_COLLECTION } from '@/lib/state-machine'

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

  const activeMilestones = milestones.filter(m =>
    !['Pagado', 'Conciliado', 'Configurado', 'Bloqueado'].includes(m.financialStatus)
  )

  const totalPorCobrar = activeMilestones.reduce((sum, m) => sum + m.amount - m.paidAmount, 0)
  const montoRecuperado = recentPayments.reduce((sum, p) => sum + p.amount, 0)
  const carteraVencida = milestones
    .filter(m => m.financialStatus === 'EnMora')
    .reduce((sum, m) => sum + m.amount - m.paidAmount, 0)

  const paidMilestones = milestones.filter(m => ['Pagado', 'Conciliado'].includes(m.financialStatus))
  const avgDays = paidMilestones.length > 0
    ? Math.round(paidMilestones.reduce((sum, m) => sum + m.daysActive, 0) / paidMilestones.length)
    : 0

  const kpis = { totalPorCobrar, montoRecuperado, carteraVencida, tiempoPromedio: avgDays }

  const overdue = milestones
    .filter(m => m.financialStatus === 'EnMora')
    .map(m => ({
      projectName: m.project.name,
      milestoneName: m.name,
      amount: (m.amount - m.paidAmount).toLocaleString(),
      status: 'overdue' as const,
      daysOverdue: m.daysOverdue,
      clientName: m.project.client.name,
    }))

  const exigible = milestones
    .filter(m => m.financialStatus === 'Exigible')
    .map(m => ({
      projectName: m.project.name,
      milestoneName: m.name,
      amount: (m.amount - m.paidAmount).toLocaleString(),
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

  const activeProjects = projects.filter(p => p.status === 'EnCurso').length
  const hitosPorCobrar = milestones.filter(m => ACTIVE_DEBT_STATES.includes(m.financialStatus)).length
  const collectableMilestones = milestones.filter(m => !BLOCKED_FROM_COLLECTION.includes(m.financialStatus))
  const collected = milestones.filter(m => ['Pagado', 'Conciliado'].includes(m.financialStatus))
  const tasaEfectividad = (collectableMilestones.length + collected.length) > 0
    ? Math.round((collected.length / (collectableMilestones.length + collected.length)) * 100)
    : 0
  const enMoraCount = milestones.filter(m => m.financialStatus === 'EnMora').length
  const carteraSana = milestones.length > 0 ? Math.round(((milestones.length - enMoraCount) / milestones.length) * 100) : 0

  const summaryStats = { activeProjects, hitosPorCobrar, tasaEfectividad, carteraSana }

  const analystEffectiveness = analysts.map(a => {
    const am = milestones.filter(m => m.analystId === a.id)
    const cobrado = am.filter(m => ['Pagado', 'Conciliado'].includes(m.financialStatus)).reduce((s, m) => s + m.amount, 0)
    const exigibleAmount = am.filter(m => !['Configurado', 'Bloqueado'].includes(m.financialStatus)).reduce((s, m) => s + m.amount, 0)
    const efectividad = exigibleAmount > 0 ? Math.round((cobrado / exigibleAmount) * 100) : 0
    return { name: a.name, efectividad, cobrado, exigible: exigibleAmount }
  })

  return NextResponse.json({ kpis, alerts: { overdue, exigible }, reconciliations, summaryStats, analystEffectiveness })
}
