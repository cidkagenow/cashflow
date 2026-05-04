'use client'

import { Search, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface FilterBarProps {
  onStatusChange?: (status: string) => void
  onAnalystChange?: (analyst: string) => void
  onPriorityChange?: (priority: string) => void
  onSearchChange?: (search: string) => void
  selectedStatus?: string
  selectedAnalyst?: string
  selectedPriority?: string
  searchQuery?: string
}

export function FilterBar({
  onStatusChange,
  onAnalystChange,
  onPriorityChange,
  onSearchChange,
  selectedStatus = 'todos',
  selectedAnalyst = 'todos',
  selectedPriority = 'todos',
  searchQuery = '',
}: FilterBarProps) {
  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-4">
      {/* Barra de búsqueda */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente, proyecto o hito..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>
      </div>

      {/* Filtros */}
      <div className="grid gap-3 md:grid-cols-3">
        {/* Estado */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">
            Estado
          </label>
          <Select value={selectedStatus} onValueChange={onStatusChange}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              <SelectItem value="Configurado">Configurado</SelectItem>
              <SelectItem value="Bloqueado">Bloqueado</SelectItem>
              <SelectItem value="Exigible">Exigible</SelectItem>
              <SelectItem value="Notificado">Notificado</SelectItem>
              <SelectItem value="EnMora">En mora</SelectItem>
              <SelectItem value="CompromisoPago">Compromiso de pago</SelectItem>
              <SelectItem value="PagadoParcial">Pagado parcial</SelectItem>
              <SelectItem value="PagoEnRevision">Pago en revisión</SelectItem>
              <SelectItem value="PagoObservado">Pago observado</SelectItem>
              <SelectItem value="Pagado">Pagado</SelectItem>
              <SelectItem value="Conciliado">Conciliado</SelectItem>
              <SelectItem value="Suspendido">Suspendido</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Analista */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">
            Analista
          </label>
          <Select value={selectedAnalyst} onValueChange={onAnalystChange}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los analistas</SelectItem>
              <SelectItem value="maria_lopez">María López</SelectItem>
              <SelectItem value="carlos_ruiz">Carlos Ruiz</SelectItem>
              <SelectItem value="ana_gonzalez">Ana González</SelectItem>
              <SelectItem value="juan_perez">Juan Pérez</SelectItem>
              <SelectItem value="laura_martin">Laura Martín</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Prioridad */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">
            Prioridad
          </label>
          <Select value={selectedPriority} onValueChange={onPriorityChange}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas las prioridades</SelectItem>
              <SelectItem value="critica">Crítica (vencida)</SelectItem>
              <SelectItem value="alta">Alta (próxima a vencer)</SelectItem>
              <SelectItem value="media">Media (exigible)</SelectItem>
              <SelectItem value="baja">Baja (próxima)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
