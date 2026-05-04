import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { canTransitionTechnical } from '@/lib/state-machine'
import { logAudit } from '@/lib/audit'

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await _request.json()
  const { technicalStatus, evidence, observationNote, reason, userName } = body

  const deliverable = await prisma.deliverable.findUnique({ where: { id } })
  if (!deliverable) {
    return NextResponse.json({ error: 'Deliverable not found' }, { status: 404 })
  }

  const data: Record<string, unknown> = {}

  if (technicalStatus) {
    if (!canTransitionTechnical(deliverable.technicalStatus, technicalStatus)) {
      return NextResponse.json(
        { error: `Invalid technical transition: ${deliverable.technicalStatus} → ${technicalStatus}` },
        { status: 400 }
      )
    }
    data.technicalStatus = technicalStatus
    if (technicalStatus === 'Observado' && observationNote) {
      data.observationNote = observationNote
    }
    if (evidence) data.evidence = evidence
  }

  const updated = await prisma.deliverable.update({ where: { id }, data })

  if (technicalStatus) {
    await logAudit({
      entityType: 'Deliverable',
      entityId: id,
      action: 'TECHNICAL_STATUS_CHANGE',
      previousState: deliverable.technicalStatus,
      newState: technicalStatus,
      reason: reason || observationNote,
      userName: userName || 'Sistema',
      projectId: deliverable.projectId,
    })
  }

  return NextResponse.json(updated)
}
