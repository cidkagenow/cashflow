'use client'

import { useState, useMemo, useEffect } from 'react'
import { AppLayout } from '@/components/app-layout'
import { FilterBar } from '@/components/milestones/filter-bar'
import { PortfolioGrid } from '@/components/milestones/portfolio-grid'
import { Skeleton } from '@/components/ui/skeleton'
import { animateEntrance } from '@/lib/anime-utils'

interface Milestone {
  id: string;
  clientName: string;
  projectName: string;
  milestoneName: string;
  amount: number;
  daysActive: number;
  daysOverdue: number;
  status: string;
  financialStatus?: string;
  lastAction: string;
  lastActionDate: string;
  responsible: string;
}

export default function MilestonesPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState('todos')
  const [selectedAnalyst, setSelectedAnalyst] = useState('todos')
  const [selectedPriority, setSelectedPriority] = useState('todos')
  const [searchQuery, setSearchQuery] = useState('')
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    fetch('/api/milestones')
      .then(res => res.json())
      .then(data => { setMilestones(data); setLoading(false); })
  }, [])

  useEffect(() => {
    if (loading || animated) return
    setAnimated(true)
    
      animateEntrance({ title: '.ms-title', subtitle: '.ms-subtitle', sections: '.ms-section' })


  }, [loading, animated])

  const filteredMilestones = useMemo(() => {
    return milestones.filter((milestone) => {
      if (selectedStatus !== 'todos' && milestone.status !== selectedStatus && milestone.financialStatus !== selectedStatus) return false

      if (selectedAnalyst !== 'todos') {
        const analystMap: Record<string, string> = {
          maria_lopez: 'María López',
          carlos_ruiz: 'Carlos Ruiz',
          ana_gonzalez: 'Ana González',
          juan_perez: 'Juan Pérez',
          laura_martin: 'Laura Martín',
        }
        if (milestone.responsible !== analystMap[selectedAnalyst]) return false
      }

      if (selectedPriority !== 'todos') {
        const priority = getPriorityLevel(milestone)
        if (priority !== selectedPriority) return false
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          milestone.clientName.toLowerCase().includes(query) ||
          milestone.projectName.toLowerCase().includes(query) ||
          milestone.milestoneName.toLowerCase().includes(query) ||
          milestone.responsible.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      return true
    })
  }, [milestones, selectedStatus, selectedAnalyst, selectedPriority, searchQuery])

  const sortedMilestones = useMemo(() => {
    return [...filteredMilestones].sort((a, b) => {
      const priorityA = getPriorityWeight(a)
      const priorityB = getPriorityWeight(b)
      return priorityB - priorityA
    })
  }, [filteredMilestones])

  function handleMilestoneAction(milestoneId: string, action: string) {
    console.log(`Action on milestone ${milestoneId}: ${action}`)
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="p-6 lg:p-8 space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-16" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-48" />)}
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="ms-title text-2xl font-bold text-foreground tracking-tight">Panel de Cartera</h1>
          <p className="ms-subtitle text-muted-foreground">Gestiona los hitos que requieren acción inmediata</p>
        </div>

        <div className="ms-section"><FilterBar
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedAnalyst={selectedAnalyst}
          onAnalystChange={setSelectedAnalyst}
          selectedPriority={selectedPriority}
          onPriorityChange={setSelectedPriority}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        /></div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm">
            <span className="font-semibold text-foreground">{sortedMilestones.length}</span>
            <span className="text-muted-foreground"> {sortedMilestones.length === 1 ? 'hito' : 'hitos'} encontrados</span>
          </div>
          <div className="flex gap-4 text-sm">
            <div>
              <span className="font-semibold text-red-600">{sortedMilestones.filter(m => m.status === 'EnMora').length}</span>
              <span className="text-muted-foreground"> en mora</span>
            </div>
            <div>
              <span className="font-semibold text-orange-600">{sortedMilestones.filter(m => m.status === 'Exigible').length}</span>
              <span className="text-muted-foreground"> exigibles</span>
            </div>
          </div>
        </div>

        <PortfolioGrid milestones={sortedMilestones} onMilestoneAction={handleMilestoneAction} />
      </div>
    </AppLayout>
  )
}

function getPriorityLevel(milestone: Milestone): string {
  if (milestone.daysOverdue && milestone.daysOverdue > 0) return 'critica'
  if (milestone.daysActive > 30) return 'alta'
  if (milestone.status === 'Exigible') return 'media'
  return 'baja'
}

function getPriorityWeight(milestone: Milestone): number {
  if (milestone.daysOverdue && milestone.daysOverdue > 0) return 4
  if (milestone.daysActive > 30) return 3
  if (milestone.status === 'Exigible') return 2
  return 1
}
