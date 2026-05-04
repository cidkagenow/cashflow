'use client'

import { useState, useMemo } from 'react'
import { AppLayout } from '@/components/app-layout'
import { FilterBar } from '@/components/milestones/filter-bar'
import { PortfolioGrid } from '@/components/milestones/portfolio-grid'

// Mock data de hitos
const MOCK_MILESTONES = [
  {
    id: '1',
    clientName: 'TechCorp SA',
    projectName: 'Transformación Digital',
    milestoneName: 'Fase 1: Diagnóstico',
    amount: 45000,
    daysActive: 45,
    daysOverdue: 15,
    status: 'en_mora' as const,
    lastAction: 'Llamada sin respuesta',
    lastActionDate: '2024-12-28',
    responsible: 'Carlos Ruiz',
  },
  {
    id: '2',
    clientName: 'FinServ Solutions',
    projectName: 'Implementación SAP',
    milestoneName: 'Hito 2: Configuración',
    amount: 75000,
    daysActive: 38,
    daysOverdue: 8,
    status: 'en_mora' as const,
    lastAction: 'Envío de estado de cuenta',
    lastActionDate: '2024-12-27',
    responsible: 'María López',
  },
  {
    id: '3',
    clientName: 'Retail Dynamics',
    projectName: 'Auditoría Financiera',
    milestoneName: 'Fase 2: Revisión de Activos',
    amount: 32000,
    daysActive: 35,
    daysOverdue: 0,
    status: 'exigible' as const,
    lastAction: 'Notificación enviada',
    lastActionDate: '2024-12-25',
    responsible: 'Ana González',
  },
  {
    id: '4',
    clientName: 'ConsultPro Group',
    projectName: 'Consultoría FMCG',
    milestoneName: 'Estudio de Mercado',
    amount: 28000,
    daysActive: 32,
    daysOverdue: 0,
    status: 'exigible' as const,
    lastAction: 'Confirmación de recepción',
    lastActionDate: '2024-12-20',
    responsible: 'Juan Pérez',
  },
  {
    id: '5',
    clientName: 'BuildCorp Contractors',
    projectName: 'Gestión de Obra',
    milestoneName: 'Supervisión Mes 1',
    amount: 22000,
    daysActive: 28,
    daysOverdue: 0,
    status: 'notificado' as const,
    lastAction: 'Email de seguimiento',
    lastActionDate: '2024-12-24',
    responsible: 'Laura Martín',
  },
  {
    id: '6',
    clientName: 'EduTech Innovations',
    projectName: 'Plataforma de Aprendizaje',
    milestoneName: 'Integración de Módulos',
    amount: 55000,
    daysActive: 25,
    daysOverdue: 0,
    status: 'notificado' as const,
    lastAction: 'Llamada de seguimiento',
    lastActionDate: '2024-12-23',
    responsible: 'Carlos Ruiz',
  },
  {
    id: '7',
    clientName: 'LegalWorks Associates',
    projectName: 'Auditoría Legal',
    milestoneName: 'Análisis de Contratos',
    amount: 18000,
    daysActive: 20,
    daysOverdue: 0,
    status: 'compromiso' as const,
    lastAction: 'Acuerdo de pago para el 05/01',
    lastActionDate: '2024-12-22',
    responsible: 'María López',
  },
  {
    id: '8',
    clientName: 'MediCare Systems',
    projectName: 'Sistema de Gestión Clínica',
    milestoneName: 'Fase 1: Infraestructura',
    amount: 95000,
    daysActive: 18,
    daysOverdue: 0,
    status: 'compromiso' as const,
    lastAction: 'Confirmación verbal de pago',
    lastActionDate: '2024-12-21',
    responsible: 'Ana González',
  },
  {
    id: '9',
    clientName: 'AgriTech Solutions',
    projectName: 'Software Agrícola',
    milestoneName: 'Capacitación Usuarios',
    amount: 16000,
    daysActive: 15,
    daysOverdue: 0,
    status: 'exigible' as const,
    lastAction: 'Factura emitida',
    lastActionDate: '2024-12-19',
    responsible: 'Juan Pérez',
  },
  {
    id: '10',
    clientName: 'LogisticsPro',
    projectName: 'Optimización de Rutas',
    milestoneName: 'Análisis de Datos',
    amount: 38000,
    daysActive: 12,
    daysOverdue: 0,
    status: 'exigible' as const,
    lastAction: 'Presentación completada',
    lastActionDate: '2024-12-18',
    responsible: 'Laura Martín',
  },
  {
    id: '11',
    clientName: 'RealEstate Ventures',
    projectName: 'Valoración de Propiedades',
    milestoneName: 'Avalúo Inicial',
    amount: 25000,
    daysActive: 8,
    daysOverdue: 0,
    status: 'notificado' as const,
    lastAction: 'Aviso de facturación',
    lastActionDate: '2024-12-17',
    responsible: 'Carlos Ruiz',
  },
  {
    id: '12',
    clientName: 'GreenEnergy Corp',
    projectName: 'Auditoría de Sostenibilidad',
    milestoneName: 'Diagnóstico Ambiental',
    amount: 42000,
    daysActive: 5,
    daysOverdue: 0,
    status: 'exigible' as const,
    lastAction: 'Hito activado',
    lastActionDate: '2024-12-15',
    responsible: 'María López',
  },
]

export default function MilestonesPage() {
  const [selectedStatus, setSelectedStatus] = useState('todos')
  const [selectedAnalyst, setSelectedAnalyst] = useState('todos')
  const [selectedPriority, setSelectedPriority] = useState('todos')
  const [searchQuery, setSearchQuery] = useState('')

  // Lógica de filtrado
  const filteredMilestones = useMemo(() => {
    return MOCK_MILESTONES.filter((milestone) => {
      // Filtro por estado
      if (selectedStatus !== 'todos' && milestone.status !== selectedStatus) {
        return false
      }

      // Filtro por analista
      if (selectedAnalyst !== 'todos') {
        const analystMap: Record<string, string> = {
          maria_lopez: 'María López',
          carlos_ruiz: 'Carlos Ruiz',
          ana_gonzalez: 'Ana González',
          juan_perez: 'Juan Pérez',
          laura_martin: 'Laura Martín',
        }
        if (milestone.responsible !== analystMap[selectedAnalyst]) {
          return false
        }
      }

      // Filtro por prioridad
      if (selectedPriority !== 'todos') {
        const priority = getPriorityLevel(milestone)
        if (priority !== selectedPriority) {
          return false
        }
      }

      // Filtro por búsqueda
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          milestone.clientName.toLowerCase().includes(query) ||
          milestone.projectName.toLowerCase().includes(query) ||
          milestone.milestoneName.toLowerCase().includes(query) ||
          milestone.responsible.toLowerCase().includes(query)
        if (!matchesSearch) {
          return false
        }
      }

      return true
    })
  }, [selectedStatus, selectedAnalyst, selectedPriority, searchQuery])

  // Ordenar por prioridad (crítica primero)
  const sortedMilestones = useMemo(() => {
    return [...filteredMilestones].sort((a, b) => {
      const priorityA = getPriorityWeight(a)
      const priorityB = getPriorityWeight(b)
      return priorityB - priorityA
    })
  }, [filteredMilestones])

  function handleMilestoneAction(milestoneId: string, action: string) {
    console.log(`[v0] Action on milestone ${milestoneId}: ${action}`)
    // Aquí se integraría la lógica de acción real
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Encabezado */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Panel de Cartera</h1>
          <p className="text-muted-foreground">
            Gestiona los hitos que requieren acción inmediata
          </p>
        </div>

        {/* Barra de filtros */}
        <FilterBar
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedAnalyst={selectedAnalyst}
          onAnalystChange={setSelectedAnalyst}
          selectedPriority={selectedPriority}
          onPriorityChange={setSelectedPriority}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Resumen */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm">
            <span className="font-semibold text-foreground">
              {sortedMilestones.length}
            </span>
            <span className="text-muted-foreground">
              {' '}
              {sortedMilestones.length === 1 ? 'hito' : 'hitos'} encontrados
            </span>
          </div>
          <div className="flex gap-4 text-sm">
            <div>
              <span className="font-semibold text-red-600">
                {sortedMilestones.filter((m) => m.status === 'en_mora').length}
              </span>
              <span className="text-muted-foreground"> en mora</span>
            </div>
            <div>
              <span className="font-semibold text-orange-600">
                {sortedMilestones.filter((m) => m.status === 'exigible').length}
              </span>
              <span className="text-muted-foreground"> exigibles</span>
            </div>
          </div>
        </div>

        {/* Grid de hitos */}
        <PortfolioGrid
          milestones={sortedMilestones}
          onMilestoneAction={handleMilestoneAction}
        />
      </div>
    </AppLayout>
  )
}

// Funciones auxiliares
function getPriorityLevel(
  milestone: (typeof MOCK_MILESTONES)[0]
): string {
  if (milestone.daysOverdue && milestone.daysOverdue > 0) {
    return 'critica'
  }
  if (milestone.daysActive > 30) {
    return 'alta'
  }
  if (milestone.status === 'exigible') {
    return 'media'
  }
  return 'baja'
}

function getPriorityWeight(
  milestone: (typeof MOCK_MILESTONES)[0]
): number {
  if (milestone.daysOverdue && milestone.daysOverdue > 0) {
    return 4
  }
  if (milestone.daysActive > 30) {
    return 3
  }
  if (milestone.status === 'exigible') {
    return 2
  }
  return 1
}
