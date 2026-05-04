import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { canTransitionProject } from '@/lib/state-machine'
import { logAudit } from '@/lib/audit'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      client: true,
      milestones: { include: { analyst: true, deliverable: true, payments: true }, orderBy: { createdAt: 'asc' } },
      deliverables: { include: { responsible: true }, orderBy: { createdAt: 'asc' } },
      documents: { orderBy: { date: 'desc' } },
      payments: { include: { milestone: true }, orderBy: { date: 'desc' } },
      activities: { orderBy: { id: 'desc' } },
      auditLogs: { orderBy: { createdAt: 'desc' }, take: 20 },
    },
  })

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }

  const statusToDisplay = (fs: string) => {
    if (['Pagado', 'Conciliado'].includes(fs)) return 'completed'
    if (fs === 'EnMora') return 'overdue'
    return 'pending'
  }

  return NextResponse.json({
    id: project.id,
    clientName: project.client.name,
    projectName: project.name,
    totalAmount: project.totalAmount,
    paidAmount: project.paidAmount,
    currency: project.currency,
    status: project.status,
    milestones: project.milestones.map(m => ({
      id: m.id,
      name: m.name,
      amount: m.amount,
      paidAmount: m.paidAmount,
      pendingAmount: m.pendingAmount,
      financialStatus: m.financialStatus,
      status: statusToDisplay(m.financialStatus),
      activationType: m.activationType,
      daysActive: m.daysActive,
      daysOverdue: m.daysOverdue,
      dueDate: m.dueDate?.toISOString() ?? null,
      analyst: m.analyst ? { id: m.analyst.id, name: m.analyst.name, initials: m.analyst.initials } : null,
      deliverable: m.deliverable ? { id: m.deliverable.id, name: m.deliverable.name, technicalStatus: m.deliverable.technicalStatus } : null,
      suspensionReason: m.suspensionReason,
      commitmentDate: m.commitmentDate?.toISOString() ?? null,
      commitmentAmount: m.commitmentAmount,
      lastAction: m.lastAction,
      lastActionDate: m.lastActionDate?.toISOString() ?? null,
    })),
    deliverables: project.deliverables.map(d => ({
      id: d.id,
      name: d.name,
      description: d.description,
      technicalStatus: d.technicalStatus,
      evidence: d.evidence,
      observationNote: d.observationNote,
      responsible: d.responsible ? { id: d.responsible.id, name: d.responsible.name } : null,
    })),
    documents: project.documents.map(d => ({
      id: d.id,
      name: d.name,
      type: d.type,
      date: d.date,
      url: d.url,
    })),
    payments: project.payments.map(p => ({
      id: p.id,
      amount: p.amount,
      expectedAmount: p.expectedAmount,
      method: p.method,
      date: p.date.toISOString().split('T')[0],
      status: p.status,
      reference: p.reference ?? '',
      isPartial: p.isPartial,
      milestoneName: p.milestone?.name ?? '',
    })),
    activities: project.activities.map(a => ({
      id: a.id,
      user: { name: a.userName, initials: a.userInitials },
      action: a.action,
      actionLabel: a.actionLabel,
      comment: a.comment,
      tags: a.tags ? a.tags.split(',') : [],
      timestamp: a.timestamp,
    })),
    auditLogs: project.auditLogs.map(l => ({
      id: l.id,
      entityType: l.entityType,
      action: l.action,
      previousState: l.previousState,
      newState: l.newState,
      reason: l.reason,
      userName: l.userName,
      createdAt: l.createdAt.toISOString(),
    })),
  })
}

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await _request.json()
  const { status, reason, userName } = body

  const project = await prisma.project.findUnique({ where: { id } })
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }

  if (status) {
    if (!canTransitionProject(project.status, status)) {
      return NextResponse.json(
        { error: `Cannot transition from ${project.status} to ${status}` },
        { status: 400 }
      )
    }

    const updated = await prisma.project.update({
      where: { id },
      data: { status },
    })

    await logAudit({
      entityType: 'Project',
      entityId: id,
      action: 'STATUS_CHANGE',
      previousState: project.status,
      newState: status,
      reason,
      userName: userName || 'Sistema',
      projectId: id,
    })

    return NextResponse.json(updated)
  }

  return NextResponse.json({ error: 'No valid update fields' }, { status: 400 })
}
