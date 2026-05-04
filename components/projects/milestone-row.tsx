import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface MilestoneRowData {
  id: string
  name: string
  amount: number
  activationType: 'firma' | 'entregable' | 'fecha' | 'aprobacion'
  scheduledDate?: string
}

interface MilestoneRowProps {
  milestone: MilestoneRowData
  onChange: (milestone: MilestoneRowData) => void
  onRemove: () => void
  index: number
}

const activationTypes = [
  { value: 'firma', label: 'Firma' },
  { value: 'entregable', label: 'Entregable' },
  { value: 'fecha', label: 'Fecha' },
  { value: 'aprobacion', label: 'Aprobación' },
]

// Función para calcular el estado automáticamente según el tipo de activación
const getComputedStatus = (activationType: string) => {
  if (activationType === 'firma') {
    return {
      label: 'Exigible',
      bgColor: 'bg-orange-500/15',
      textColor: 'text-orange-400',
    }
  }
  return {
    label: 'Bloqueado',
    bgColor: 'bg-slate-500/15',
    textColor: 'text-slate-400',
  }
}

export function MilestoneRow({
  milestone,
  onChange,
  onRemove,
  index,
}: MilestoneRowProps) {
  const computedStatus = getComputedStatus(milestone.activationType)
  const showDateField = milestone.activationType === 'fecha'

  return (
    <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-border/50">
      {/* Primera fila: Nombre, Monto, Activación, Estado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
        {/* Nombre del Hito */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Hito {index + 1}: Nombre
          </label>
          <Input
            placeholder="Ej: Diseño inicial"
            value={milestone.name}
            onChange={(e) =>
              onChange({ ...milestone, name: e.target.value })
            }
            className="h-9"
          />
        </div>

        {/* Monto */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Monto ($)
          </label>
          <Input
            type="number"
            placeholder="0"
            value={milestone.amount}
            onChange={(e) =>
              onChange({
                ...milestone,
                amount: parseFloat(e.target.value) || 0,
              })
            }
            className="h-9"
          />
        </div>

        {/* Tipo de Activación */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Activación
          </label>
          <Select
            value={milestone.activationType}
            onValueChange={(value: any) =>
              onChange({ ...milestone, activationType: value })
            }
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {activationTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Estado Calculado - Badge de Solo Lectura */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Estado
          </label>
          <Badge className={`${computedStatus.bgColor} ${computedStatus.textColor} border-0 font-medium w-full justify-center`}>
            {computedStatus.label}
          </Badge>
        </div>
      </div>

      {/* Segunda fila: Fecha Programada (condicional) y Eliminar */}
      <div className="flex gap-3 items-end">
        {showDateField && (
          <div className="flex-1">
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Fecha Programada *
            </label>
            <Input
              type="date"
              value={milestone.scheduledDate || ''}
              onChange={(e) =>
                onChange({ ...milestone, scheduledDate: e.target.value })
              }
              className="h-9"
              required
            />
          </div>
        )}

        {/* Botón Eliminar */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          title="Eliminar este hito"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
