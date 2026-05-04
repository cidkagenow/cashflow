'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { PendingPayment } from './pending-payment-card';

interface ReconciliationHeaderProps {
  payments: PendingPayment[];
  filteredCount: number;
}

export function ReconciliationHeader({ payments, filteredCount }: ReconciliationHeaderProps) {
  const pendingCount = payments.filter((p) => p.status === 'pending').length;
  const reviewingCount = payments.filter((p) => p.status === 'reviewing').length;
  const reconciledCount = payments.filter((p) => p.status === 'reconciled').length;

  const totalPending = payments
    .filter((p) => p.status === 'pending' || p.status === 'reviewing')
    .reduce((sum, p) => sum + p.receivedAmount, 0);

  return (
    <Card className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200">
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-foreground">Conciliación de Pagos</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2 p-2 bg-white rounded border">
            <Clock className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-xs text-muted-foreground">Pendientes</p>
              <p className="text-lg font-bold text-foreground">{pendingCount}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-white rounded border">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <div>
              <p className="text-xs text-muted-foreground">En revisión</p>
              <p className="text-lg font-bold text-foreground">{reviewingCount}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-white rounded border">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-xs text-muted-foreground">Conciliados</p>
              <p className="text-lg font-bold text-foreground">{reconciledCount}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-white rounded border">
            <div>
              <p className="text-xs text-muted-foreground">Pendiente $</p>
              <p className="text-lg font-bold text-orange-600">${totalPending.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
