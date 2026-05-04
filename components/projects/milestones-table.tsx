import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MilestoneRow, MilestoneRowData } from './milestone-row'

interface MilestonesTableProps {
  milestones: MilestoneRowData[]
  onChange: (milestones: MilestoneRowData[]) => void
}

export function MilestonesTable({
  milestones,
  onChange,
}: MilestonesTableProps) {
  const handleAddMilestone = () => {
    const newMilestone: MilestoneRowData = {
      id: `milestone-${Date.now()}`,
      name: '',
      amount: 0,
      activationType: 'firma',
    }
    onChange([...milestones, newMilestone])
  }

  const handleUpdateMilestone = (index: number, updated: MilestoneRowData) => {
    const updated_milestones = [...milestones]
    updated_milestones[index] = updated
    onChange(updated_milestones)
  }

  const handleRemoveMilestone = (index: number) => {
    onChange(milestones.filter((_, i) => i !== index))
  }

  return (
    <Card className="p-6 border-0 shadow-none bg-transparent">
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-lg font-semibold mb-1">Configuración de Hitos</h3>
          <p className="text-sm text-muted-foreground">
            Agregue los hitos de cobro que corresponden a este proyecto. Cada hito representa un monto exigible con una condición de activación.
          </p>
        </div>

        {/* Milestone Rows */}
        <div className="space-y-3">
          {milestones.map((milestone, index) => (
            <MilestoneRow
              key={milestone.id}
              milestone={milestone}
              onChange={(updated) => handleUpdateMilestone(index, updated)}
              onRemove={() => handleRemoveMilestone(index)}
              index={index}
            />
          ))}

          {/* Empty State */}
          {milestones.length === 0 && (
            <div className="p-8 text-center border border-dashed border-border rounded-lg">
              <p className="text-sm text-muted-foreground mb-3">
                No hay hitos configurados. Agregue el primero para comenzar.
              </p>
            </div>
          )}
        </div>

        {/* Add Button */}
        <Button
          onClick={handleAddMilestone}
          variant="outline"
          className="w-full sm:w-auto gap-2"
        >
          <Plus className="h-4 w-4" />
          Agregar Hito
        </Button>
      </div>
    </Card>
  )
}
