'use client'

import { useState } from 'react'
import { MessageCircle, Phone, CheckCircle, History, AlertCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { TrackingModal } from './tracking-modal'
import { PaymentModal } from './payment-modal'

interface MilestoneCardProps {
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
  onWhatsApp?: () => void
  onCall?: () => void
  onPayment?: () => void
  onHistory?: () => void
}

const STATUS_BADGE: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  Configurado:    { label: 'Configurado', variant: 'outline' },
  Bloqueado:      { label: 'Bloqueado', variant: 'outline' },
  Exigible:       { label: 'Exigible', variant: 'secondary' },
  Notificado:     { label: 'Notificado', variant: 'outline' },
  EnMora:         { label: 'En mora', variant: 'destructive' },
  CompromisoPago: { label: 'Compromiso', variant: 'outline' },
  PagadoParcial:  { label: 'Pago parcial', variant: 'secondary' },
  PagoEnRevision: { label: 'En revisión', variant: 'outline' },
  PagoObservado:  { label: 'Observado', variant: 'destructive' },
  Pagado:         { label: 'Pagado', variant: 'default' },
  Conciliado:     { label: 'Conciliado', variant: 'default' },
  Suspendido:     { label: 'Suspendido', variant: 'outline' },
}

const STATUS_CARD_STYLE: Record<string, string> = {
  Configurado:    'border-border',
  Bloqueado:      'border-slate-500/20',
  Exigible:       'border-amber-500/30 bg-amber-500/5',
  Notificado:     'border-blue-500/30 bg-blue-500/5',
  EnMora:         'border-red-500/30 bg-red-500/5',
  CompromisoPago: 'border-yellow-500/30 bg-yellow-500/5',
  PagadoParcial:  'border-amber-500/30 bg-amber-500/5',
  PagoEnRevision: 'border-indigo-500/30 bg-indigo-500/5',
  PagoObservado:  'border-red-500/30 bg-red-500/5',
  Pagado:         'border-emerald-500/30 bg-emerald-500/5',
  Conciliado:     'border-emerald-500/30 bg-emerald-500/5',
  Suspendido:     'border-slate-500/20 bg-slate-500/5',
}

export function MilestoneCard({
  id, clientName, projectName, milestoneName, amount,
  daysActive, daysOverdue = 0, status, lastAction, lastActionDate,
  responsible, onWhatsApp, onCall, onPayment, onHistory,
}: MilestoneCardProps) {
  const [trackingOpen, setTrackingOpen] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(false)

  const badgeConfig = STATUS_BADGE[status] ?? { label: status, variant: 'outline' as const }
  const cardStyle = STATUS_CARD_STYLE[status] ?? 'border-border'

  return (
    <Card className={`${cardStyle} flex flex-col overflow-hidden transition-all duration-200 hover:shadow-md`}>
      <div className="border-b border-current/5 px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">{clientName}</p>
            <p className="truncate font-semibold text-foreground text-sm mt-0.5">{projectName}</p>
          </div>
          <Badge variant={badgeConfig.variant} className="whitespace-nowrap text-[11px] shrink-0">
            {badgeConfig.label}
          </Badge>
        </div>
      </div>

      <div className="flex-1 space-y-3 px-4 py-3">
        <p className="text-sm font-medium text-foreground">{milestoneName}</p>

        <div className="rounded-lg bg-card border border-border/50 px-3 py-2.5">
          <p className="text-[11px] text-muted-foreground">Monto exigible</p>
          <p className="text-lg font-bold text-foreground tabular-nums">
            ${amount.toLocaleString('es-AR')}
          </p>
        </div>

        <div className="flex items-center justify-between">
          {daysOverdue > 0 ? (
            <div className="flex items-center gap-1.5 rounded-md bg-red-100 dark:bg-red-900/30 px-2.5 py-1">
              <AlertCircle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
              <span className="text-xs font-semibold text-red-600 dark:text-red-400 tabular-nums">{daysOverdue}d mora</span>
            </div>
          ) : daysActive > 30 ? (
            <div className="flex items-center gap-1.5 rounded-md bg-amber-100 dark:bg-amber-900/30 px-2.5 py-1">
              <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 tabular-nums">{daysActive}d</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30 px-2.5 py-1">
              <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 tabular-nums">{daysActive}d</span>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-current/5 space-y-1.5 px-4 py-2.5">
        <div className="text-xs text-muted-foreground">
          <p className="truncate">
            <span className="font-medium">Última acción:</span> {lastAction || 'Sin acciones'}
          </p>
          {lastActionDate && <p className="text-[11px] mt-0.5">{lastActionDate}</p>}
        </div>
        <p className="text-xs text-foreground">
          Responsable: <span className="font-semibold">{responsible}</span>
        </p>
      </div>

      <div className="flex gap-1 border-t border-current/5 bg-muted/30 p-1.5">
        <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" aria-label="Notificar por WhatsApp" onClick={onWhatsApp}>
          <MessageCircle className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" aria-label="Registrar seguimiento" onClick={() => { setTrackingOpen(true); onCall?.() }}>
          <Phone className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" aria-label="Registrar pago" onClick={() => { setPaymentOpen(true); onPayment?.() }}>
          <CheckCircle className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" aria-label="Ver historial" onClick={onHistory}>
          <History className="h-4 w-4" />
        </Button>
      </div>

      <TrackingModal open={trackingOpen} onOpenChange={setTrackingOpen} milestoneId={id} clientName={clientName} milestoneName={milestoneName} />
      <PaymentModal open={paymentOpen} onOpenChange={setPaymentOpen} milestoneId={id} clientName={clientName} milestoneName={milestoneName} expectedAmount={amount} />
    </Card>
  )
}
