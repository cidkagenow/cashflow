'use client'

import { MilestoneCard } from './milestone-card'

interface Milestone {
  id: string
  clientName: string
  projectName: string
  milestoneName: string
  amount: number
  daysActive: number
  daysOverdue?: number
  status: string
  lastAction: string
  lastActionDate: string
  responsible: string
}

interface PortfolioGridProps {
  milestones: Milestone[]
  onMilestoneAction?: (milestoneId: string, action: string) => void
}

export function PortfolioGrid({ milestones, onMilestoneAction }: PortfolioGridProps) {
  if (milestones.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground">
            No hay hitos que coincidan con los filtros
          </p>
          <p className="text-xs text-muted-foreground">
            Intenta ajustar tus filtros de búsqueda
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {milestones.map((milestone) => (
        <MilestoneCard
          key={milestone.id}
          {...milestone}
          onWhatsApp={() => onMilestoneAction?.(milestone.id, 'whatsapp')}
          onCall={() => onMilestoneAction?.(milestone.id, 'call')}
          onPayment={() => onMilestoneAction?.(milestone.id, 'payment')}
          onHistory={() => onMilestoneAction?.(milestone.id, 'history')}
        />
      ))}
    </div>
  )
}
