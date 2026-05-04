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
  pending: { badge: 'Pendiente', icon: Clock, bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  reviewing: { badge: 'En revisión', icon: Clock, bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
  observed: { badge: 'Observado', icon: AlertCircle, bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
  reconciled: { badge: 'Conciliado', icon: CheckCircle2, bgColor: 'bg-green-50', borderColor: 'border-green-200' },
  rejected: { badge: 'Rechazado', icon: XCircle, bgColor: 'bg-red-50', borderColor: 'border-red-200' },
};

export function PendingPaymentCard({ payment, isSelected, onClick }: PendingPaymentCardProps) {
  const config = statusConfig[payment.status];
  const StatusIcon = config.icon;
  const hasDiscrepancy = Math.abs(payment.expectedAmount - payment.receivedAmount) > 0.01;
  const difference = payment.receivedAmount - payment.expectedAmount;

  const badgeVariants: Record<string, string> = {
    pending: 'bg-blue-100 text-blue-800',
    reviewing: 'bg-yellow-100 text-yellow-800',
    observed: 'bg-orange-100 text-orange-800',
    reconciled: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  return (
    <Card
      onClick={onClick}
      className={`p-4 cursor-pointer transition-all ${
        isSelected
          ? 'ring-2 ring-blue-500 shadow-lg'
          : 'hover:shadow-md'
      } ${config.bgColor} border-2 ${config.borderColor}`}
    >
      <div className="space-y-3">
        {/* Header with status */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{payment.clientName}</p>
            <p className="text-xs text-muted-foreground">{payment.milestone}</p>
          </div>
          <Badge className={badgeVariants[payment.status]} variant="outline">
            {config.badge}
          </Badge>
        </div>

        {/* Date and method */}
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

        {/* Amounts */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/50 rounded p-2">
            <p className="text-xs text-muted-foreground">Esperado</p>
            <p className="font-bold text-foreground">${payment.expectedAmount.toLocaleString()}</p>
          </div>
          <div className={`rounded p-2 ${hasDiscrepancy ? 'bg-orange-100' : 'bg-green-100'}`}>
            <p className="text-xs text-muted-foreground">Recibido</p>
            <p className={`font-bold ${hasDiscrepancy ? 'text-orange-800' : 'text-green-800'}`}>
              ${payment.receivedAmount.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Discrepancy alert */}
        {hasDiscrepancy && (
          <div className="bg-orange-100 border border-orange-200 rounded p-2">
            <p className="text-xs text-orange-800">
              <span className="font-semibold">Diferencia:</span> {difference > 0 ? '+' : ''} ${difference.toLocaleString()}
            </p>
          </div>
        )}

        {/* Voucher thumbnail */}
        {payment.voucherImage && (
          <div className="rounded overflow-hidden border border-gray-200 h-24 bg-gray-100 flex items-center justify-center">
            <img
              src={payment.voucherImage}
              alt="Comprobante"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Reference */}
        {payment.reference && (
          <div className="text-xs text-muted-foreground truncate">
            <span className="font-medium">Ref:</span> {payment.reference}
          </div>
        )}
      </div>
    </Card>
  );
}
