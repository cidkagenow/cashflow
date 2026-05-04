'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export interface PendingPayment {
  id: string;
  date: Date | string;
  clientName: string;
  milestone: string;
  expectedAmount: number;
  receivedAmount: number;
  method: 'transfer' | 'yape' | 'check' | 'cash';
  reference?: string;
  voucherImage?: string;
  status: 'pending' | 'reviewing' | 'observed' | 'reconciled' | 'rejected';
}

interface PendingPaymentCardProps {
  payment: PendingPayment;
  isSelected?: boolean;
  onClick?: () => void;
}

const methodLabels: Record<string, string> = {
  transfer: 'Transferencia',
  yape: 'Yape',
  check: 'Cheque',
  cash: 'Efectivo',
};

const statusConfig = {
  pending: { badge: 'Pendiente', icon: Clock, border: 'border-blue-500/30' },
  reviewing: { badge: 'En revisión', icon: Clock, border: 'border-yellow-500/30' },
  observed: { badge: 'Observado', icon: AlertCircle, border: 'border-orange-500/30' },
  reconciled: { badge: 'Conciliado', icon: CheckCircle2, border: 'border-emerald-500/30' },
  rejected: { badge: 'Rechazado', icon: XCircle, border: 'border-red-500/30' },
};

const badgeVariants: Record<string, string> = {
  pending: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  reviewing: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  observed: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  reconciled: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  rejected: 'bg-red-500/15 text-red-400 border-red-500/20',
};

export function PendingPaymentCard({ payment, isSelected, onClick }: PendingPaymentCardProps) {
  const config = statusConfig[payment.status];
  const hasDiscrepancy = Math.abs(payment.expectedAmount - payment.receivedAmount) > 0.01;
  const difference = payment.receivedAmount - payment.expectedAmount;

  return (
    <Card
      onClick={onClick}
      className={`p-4 cursor-pointer transition-all border ${
        isSelected
          ? 'ring-2 ring-primary shadow-lg'
          : 'hover:shadow-md'
      } ${config.border} bg-card`}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{payment.clientName}</p>
            <p className="text-xs text-muted-foreground">{payment.milestone}</p>
          </div>
          <Badge className={badgeVariants[payment.status]} variant="outline">
            {config.badge}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Fecha</p>
            <p className="font-medium text-foreground" suppressHydrationWarning>
              {format(typeof payment.date === 'string' ? new Date(payment.date) : payment.date, 'dd MMM yyyy', { locale: es })}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Medio</p>
            <p className="font-medium text-foreground">{methodLabels[payment.method]}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-secondary rounded p-2">
            <p className="text-xs text-muted-foreground">Esperado</p>
            <p className="font-bold text-foreground">${payment.expectedAmount.toLocaleString()}</p>
          </div>
          <div className={`rounded p-2 ${hasDiscrepancy ? 'bg-orange-500/10' : 'bg-emerald-500/10'}`}>
            <p className="text-xs text-muted-foreground">Recibido</p>
            <p className={`font-bold ${hasDiscrepancy ? 'text-orange-400' : 'text-emerald-400'}`}>
              ${payment.receivedAmount.toLocaleString()}
            </p>
          </div>
        </div>

        {hasDiscrepancy && (
          <div className="bg-orange-500/10 border border-orange-500/20 rounded p-2">
            <p className="text-xs text-orange-400">
              <span className="font-semibold">Diferencia:</span> {difference > 0 ? '+' : ''} ${difference.toLocaleString()}
            </p>
          </div>
        )}

        {payment.voucherImage && (
          <div className="rounded overflow-hidden border border-border h-24 bg-secondary flex items-center justify-center">
            <img src={payment.voucherImage} alt="Comprobante" className="w-full h-full object-cover" />
          </div>
        )}

        {payment.reference && (
          <div className="text-xs text-muted-foreground truncate">
            <span className="font-medium">Ref:</span> {payment.reference}
          </div>
        )}
      </div>
    </Card>
  );
}
