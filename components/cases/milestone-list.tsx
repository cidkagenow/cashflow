'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface Milestone {
  id: string;
  name: string;
  amount: number;
  status: string;
  financialStatus?: string;
  daysActive?: number;
  daysOverdue?: number;
}

interface MilestoneListProps {
  milestones: Milestone[];
}

const statusConfig: Record<string, { icon: typeof CheckCircle2; color: string; label: string }> = {
  completed:      { icon: CheckCircle2, color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', label: 'Pagado' },
  pending:        { icon: Clock, color: 'bg-blue-500/15 text-blue-400 border-blue-500/20', label: 'Pendiente' },
  overdue:        { icon: AlertCircle, color: 'bg-red-500/15 text-red-400 border-red-500/20', label: 'En Mora' },
  Configurado:    { icon: Clock, color: 'bg-slate-500/15 text-slate-400 border-slate-500/20', label: 'Configurado' },
  Bloqueado:      { icon: Clock, color: 'bg-slate-500/15 text-slate-400 border-slate-500/20', label: 'Bloqueado' },
  Exigible:       { icon: Clock, color: 'bg-orange-500/15 text-orange-400 border-orange-500/20', label: 'Exigible' },
  Notificado:     { icon: Clock, color: 'bg-blue-500/15 text-blue-400 border-blue-500/20', label: 'Notificado' },
  EnMora:         { icon: AlertCircle, color: 'bg-red-500/15 text-red-400 border-red-500/20', label: 'En Mora' },
  CompromisoPago: { icon: Clock, color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20', label: 'Compromiso' },
  PagadoParcial:  { icon: Clock, color: 'bg-amber-500/15 text-amber-400 border-amber-500/20', label: 'Pago Parcial' },
  PagoEnRevision: { icon: Clock, color: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20', label: 'En Revisión' },
  PagoObservado:  { icon: AlertCircle, color: 'bg-red-500/15 text-red-400 border-red-500/20', label: 'Observado' },
  Pagado:         { icon: CheckCircle2, color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', label: 'Pagado' },
  Conciliado:     { icon: CheckCircle2, color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', label: 'Conciliado' },
  Suspendido:     { icon: Clock, color: 'bg-slate-500/15 text-slate-400 border-slate-500/20', label: 'Suspendido' },
};

const defaultConfig = { icon: Clock, color: 'bg-slate-500/15 text-slate-400 border-slate-500/20', label: 'Desconocido' };

export function MilestoneList({ milestones }: MilestoneListProps) {
  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Entregables e Hitos</h2>
      <div className="space-y-3">
        {milestones.map((milestone) => {
          const key = milestone.financialStatus || milestone.status;
          const config = statusConfig[key] || defaultConfig;
          const Icon = config.icon;

          return (
            <div
              key={milestone.id}
              className="flex items-start justify-between p-3 bg-secondary rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex items-start gap-3 flex-1">
                <Icon className="h-5 w-5 mt-0.5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{milestone.name}</p>
                  <p className="text-sm text-muted-foreground">${milestone.amount.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 ml-2">
                <Badge className={config.color}>{config.label}</Badge>
                {milestone.daysActive ? (
                  <span className="text-xs text-muted-foreground">{milestone.daysActive}d activo</span>
                ) : null}
                {milestone.daysOverdue ? (
                  <span className="text-xs text-red-400 font-medium">{milestone.daysOverdue}d mora</span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
