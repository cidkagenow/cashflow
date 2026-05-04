'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { PendingPayment } from './pending-payment-card';

interface ReconciliationPanelProps {
  payment: PendingPayment | null;
}

export function ReconciliationPanel({ payment }: ReconciliationPanelProps) {
  if (!payment) {
    return (
      <Card className="p-8 flex items-center justify-center min-h-96 bg-muted/30">
        <div className="text-center">
          <p className="text-muted-foreground">Selecciona un pago para revisar</p>
        </div>
      </Card>
    );
  }

  const hasDiscrepancy = Math.abs(payment.expectedAmount - payment.receivedAmount) > 0.01;
  const difference = payment.receivedAmount - payment.expectedAmount;

  return (
    <div className="space-y-4">
      {/* Header with payment info */}
      <Card className="p-4 border-blue-200 bg-blue-50">
        <div className="grid grid-cols-2 gap-4 md:gap-2">
          <div>
            <p className="text-xs text-muted-foreground">Cliente</p>
            <p className="font-semibold text-foreground">{payment.clientName}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Hito</p>
            <p className="font-semibold text-foreground">{payment.milestone}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Fecha de pago</p>
            <p className="font-semibold text-foreground">
              {format(payment.date, 'dd MMM yyyy', { locale: es })}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Referencia</p>
            <p className="font-semibold text-foreground">{payment.reference || '—'}</p>
          </div>
        </div>
      </Card>

      {/* Comparison grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Expected (Esperado) */}
        <Card className="p-4 border-green-200 bg-green-50">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <h3 className="font-semibold text-foreground">Lo Esperado</h3>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Monto esperado</p>
                <p className="text-2xl font-bold text-green-700">
                  ${payment.expectedAmount.toLocaleString()}
                </p>
              </div>

              <div className="border-t pt-3">
                <p className="text-xs text-muted-foreground mb-1">Saldo antes de este pago</p>
                <p className="text-sm text-foreground">
                  ${(payment.expectedAmount * 1.5).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Received (Recibido) */}
        <Card className={`p-4 border-2 ${hasDiscrepancy ? 'border-orange-200 bg-orange-50' : 'border-green-200 bg-green-50'}`}>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {hasDiscrepancy ? (
                <AlertCircle className="h-4 w-4 text-orange-600" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              )}
              <h3 className="font-semibold text-foreground">Lo Recibido</h3>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Monto recibido</p>
                <p className={`text-2xl font-bold ${hasDiscrepancy ? 'text-orange-700' : 'text-green-700'}`}>
                  ${payment.receivedAmount.toLocaleString()}
                </p>
              </div>

              {hasDiscrepancy && (
                <div className="bg-orange-200 rounded p-2">
                  <p className="text-xs text-orange-800">
                    <span className="font-semibold">Diferencia: </span>
                    {difference > 0 ? '+' : ''} ${difference.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Validation result */}
      <Card className={`p-4 border ${hasDiscrepancy ? 'border-orange-200 bg-orange-50' : 'border-green-200 bg-green-50'}`}>
        <div className="flex items-center gap-2">
          {hasDiscrepancy ? (
            <>
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <p className="text-sm font-semibold text-orange-800">
                Diferencia detectada - Revisar antes de conciliar
              </p>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <p className="text-sm font-semibold text-green-800">
                Los montos coinciden - Listo para conciliar
              </p>
            </>
          )}
        </div>
      </Card>

      {/* Voucher image */}
      {payment.voucherImage && (
        <Card className="p-4">
          <p className="text-sm font-semibold text-foreground mb-3">Comprobante adjunto</p>
          <img
            src={payment.voucherImage}
            alt="Comprobante"
            className="w-full rounded border"
          />
        </Card>
      )}
    </div>
  );
}
