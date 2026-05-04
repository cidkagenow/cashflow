'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AppLayout } from '@/components/app-layout'
import { ProjectFormSection, ProjectData } from '@/components/projects/project-form-section'
import { MilestonesTable } from '@/components/projects/milestones-table'
import { ValidationAlert } from '@/components/projects/validation-alert'
import { MilestoneRowData } from '@/components/projects/milestone-row'

export default function CreateProjectPage() {
  const router = useRouter()
  const [projectData, setProjectData] = useState<ProjectData>({
    clientId: '',
    contactName: '',
    projectName: '',
    service: '',
    totalAmount: 0,
    currency: 'USD',
  })

  const [milestones, setMilestones] = useState<MilestoneRowData[]>([])

  // Calculate total from milestones
  const milestonesTotal = useMemo(() => {
    return milestones.reduce((sum, m) => sum + (m.amount || 0), 0)
  }, [milestones])

  // Validation
  const isValid = useMemo(() => {
    if (projectData.totalAmount === 0) return false
    return milestonesTotal === projectData.totalAmount
  }, [projectData.totalAmount, milestonesTotal])

  const canSubmit = useMemo(() => {
    return (
      projectData.clientId &&
      projectData.contactName &&
      projectData.projectName &&
      projectData.service &&
      projectData.totalAmount > 0 &&
      milestones.length > 0 &&
      isValid
    )
  }, [projectData, milestones, isValid])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...projectData, milestones }),
    })

    if (res.ok) {
      const project = await res.json()
      router.push(`/projects/${project.id}`)
    }
  }

  return (
    <AppLayout>
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Link
                    href="/projects"
                    className="hover:text-foreground transition-colors"
                  >
                    Proyectos
                  </Link>
                  <span>/</span>
                  <span>Crear Proyecto</span>
                </div>
                <h1 className="text-2xl font-bold">Crear Nuevo Proyecto</h1>
              </div>
              <Link href="/projects">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Atrás</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Form Content */}
          <div className="px-4 sm:px-6 py-8 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Sección 1: Datos del Proyecto */}
              <ProjectFormSection
                data={projectData}
                onChange={setProjectData}
              />

              {/* Sección 2: Configuración de Hitos */}
              <MilestonesTable
                milestones={milestones}
                onChange={setMilestones}
              />

              {/* Validación */}
              {(milestones.length > 0 || projectData.totalAmount > 0) && (
                <ValidationAlert
                  projectTotal={projectData.totalAmount}
                  milestonesTotal={milestonesTotal}
                  isValid={isValid}
                />
              )}

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-between border-t pt-6">
                <Link href="/projects">
                  <Button variant="outline">Cancelar</Button>
                </Link>

                <Button
                  type="submit"
                  disabled={!canSubmit}
                  className="gap-2 sm:min-w-32"
                >
                  <Save className="h-4 w-4" />
                  Crear Proyecto
                </Button>
              </div>

              {/* Validation Messages */}
              {!canSubmit && (
                <Card className="p-4 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
                  <p className="text-sm text-amber-900 dark:text-amber-200">
                    {!projectData.clientId || !projectData.projectName
                      ? '✓ Completa los datos básicos del proyecto'
                      : !projectData.totalAmount
                      ? '✓ Ingresa el monto total del proyecto'
                      : milestones.length === 0
                      ? '✓ Agrega al menos un hito de cobro'
                      : !isValid
                      ? `✓ La suma de los hitos (${milestonesTotal.toLocaleString('es-ES')}) debe coincidir con el monto total (${projectData.totalAmount.toLocaleString('es-ES')})`
                      : 'Por favor completa todos los campos requeridos'}
                  </p>
                </Card>
              )}
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
