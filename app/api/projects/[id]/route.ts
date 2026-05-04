import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      client: true,
      milestones: { include: { analyst: true }, orderBy: { createdAt: 'asc' } },
      documents: { orderBy: { date: 'desc' } },
      payments: { include: { milestone: true }, orderBy: { date: 'desc' } },
      activities: { orderBy: { id: 'desc' } },
    },
  })

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
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
      status: m.status === 'completed' ? 'completed' : m.status === 'en_mora' ? 'overdue' : 'pending',
      daysActive: m.daysActive,
      daysOverdue: m.daysOverdue,
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
      method: p.method,
      date: p.date.toISOString().split('T')[0],
      status: p.status,
      reference: p.reference ?? '',
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
  })
}
