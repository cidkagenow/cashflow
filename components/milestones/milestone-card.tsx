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
  CompromisoPago: { label: 'Compromiso de pago', variant: 'outline' },
  PagadoParcial:  { label: 'Pagado parcial', variant: 'secondary' },
  PagoEnRevision: { label: 'Pago en revisión', variant: 'outline' },
  PagoObservado:  { label: 'Pago observado', variant: 'destructive' },
  Pagado:         { label: 'Pagado', variant: 'default' },
  Conciliado:     { label: 'Conciliado', variant: 'default' },
  Suspendido:     { label: 'Suspendido', variant: 'outline' },
}

const STATUS_COLOR: Record<string, string> = {
  Configurado:    'border-gray-200 bg-gray-50',
  Bloqueado:      'border-gray-200 bg-gray-50',
  Exigible:       'border-orange-200 bg-orange-50',
  Notificado:     'border-blue-200 bg-blue-50',
  EnMora:         'border-red-200 bg-red-50',
  CompromisoPago: 'border-yellow-200 bg-yellow-50',
  PagadoParcial:  'border-amber-200 bg-amber-50',
  PagoEnRevision: 'border-indigo-200 bg-indigo-50',
  PagoObservado:  'border-red-200 bg-red-50',
  Pagado:         'border-green-200 bg-green-50',
  Conciliado:     'border-green-200 bg-green-50',
  Suspendido:     'border-gray-300 bg-gray-100',
}

export function MilestoneCard({
  id,
  clientName,
  projectName,
  milestoneName,
  amount,
  daysActive,
  daysOverdue = 0,
  status,
  lastAction,
  lastActionDate,
  responsible,
  onWhatsApp,
  onCall,
  onPayment,
  onHistory,
}: MilestoneCardProps) {
  const [trackingOpen, setTrackingOpen] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(false)

  const badgeConfig = STATUS_BADGE[status] ?? { label: status, variant: 'outline' as const }
  const cardColor = STATUS_COLOR[status] ?? 'border-border'

  const getPriorityIndicator = (): React.ReactNode => {
    if (daysOverdue > 0) {
      return (
        <div className="flex items-center gap-1 rounded-md bg-red-100 px-2 py-1">
          <AlertCircle className="h-3.5 w-3.5 text-red-600" />
          <span className="text-xs font-semibold text-red-600">{daysOverdue}d mora</span>
        </div>
      )
    }
    if (daysActive > 30) {
      return (
        <div className="flex items-center gap-1 rounded-md bg-orange-100 px-2 py-1">
          <Clock className="h-3.5 w-3.5 text-orange-600" />
          <span className="text-xs font-semibold text-orange-600">{daysActive}d</span>
        </div>
      )
    }
    return (
      <div className="flex items-center gap-1 rounded-md bg-blue-100 px-2 py-1">
        <Clock className="h-3.5 w-3.5 text-blue-600" />
        <span className="text-xs font-semibold text-blue-600">{daysActive}d</span>
      </div>
    )
  }

  return (
    <Card className={`${cardColor} flex flex-col overflow-hidden transition-all hover:shadow-md`}>
      <div className="border-b border-current border-opacity-10 px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground">{clientName}</p>
            <p className="truncate font-semibold text-foreground">{projectName}</p>
          </div>
          <Badge variant={badgeConfig.variant} className="whitespace-nowrap">
            {badgeConfig.label}
          </Badge>
        </div>
      </div>

      <div className="flex-1 space-y-3 px-4 py-3">
        <div>
          <p className="text-sm font-medium text-foreground">{milestoneName}</p>
        </div>
        <div className="rounded-md bg-white bg-opacity-60 px-3 py-2">
          <p className="text-xs text-muted-foreground">Monto exigible</p>
          <p className="text-lg font-bold text-foreground">
            ${amount.toLocaleString('es-AR')}
          </p>
        </div>
        <div className="flex items-center justify-between">
          {getPriorityIndicator()}
        </div>
      </div>

      <div className="border-t border-current border-opacity-10 space-y-2 px-4 py-3">
        <div className="text-xs text-muted-foreground">
          <p className="truncate">
            <span className="font-medium">Última acción:</span> {lastAction}
          </p>
          <p className="text-xs">{lastActionDate}</p>
        </div>
        <p className="text-xs font-medium text-foreground">
          Responsable: <span className="font-semibold">{responsible}</span>
        </p>
      </div>

      <div className="flex gap-2 border-t border-current border-opacity-10 bg-white bg-opacity-30 p-2">
        <Button variant="ghost" size="icon" className="h-8 w-8" title="Notificar por WhatsApp" onClick={onWhatsApp}>
          <MessageCircle className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" title="Registrar seguimiento" onClick={() => { setTrackingOpen(true); onCall?.() }}>
          <Phone className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" title="Registrar pago" onClick={() => { setPaymentOpen(true); onPayment?.() }}>
          <CheckCircle className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" title="Ver historial" onClick={onHistory}>
          <History className="h-4 w-4" />
        </Button>
      </div>

      <TrackingModal open={trackingOpen} onOpenChange={setTrackingOpen} milestoneId={id} clientName={clientName} milestoneName={milestoneName} />
      <PaymentModal open={paymentOpen} onOpenChange={setPaymentOpen} milestoneId={id} clientName={clientName} milestoneName={milestoneName} expectedAmount={amount} />
    </Card>
  )
}
