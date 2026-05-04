'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { useState } from 'react';
import { PendingPayment } from './pending-payment-card';

interface ReconciliationActionsProps {
  payment: PendingPayment | null;
  onConfirm: () => void;
  onObserve: (reason: string) => void;
  onReject: (reason: string) => void;
  onNext: () => void;
  hasNext: boolean;
  isLoading?: boolean;
}

export function ReconciliationActions({
  payment,
  onConfirm,
  onObserve,
  onReject,
  onNext,
  hasNext,
  isLoading = false,
}: ReconciliationActionsProps) {
  const [observeOpen, setObserveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [observeReason, setObserveReason] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  const hasDiscrepancy = payment ? Math.abs(payment.expectedAmount - payment.receivedAmount) > 0.01 : false;

  const handleObserve = () => {
    if (observeReason.trim()) {
      onObserve(observeReason);
      setObserveReason('');
      setObserveOpen(false);
    }
  };

  const handleReject = () => {
    if (rejectReason.trim()) {
      onReject(rejectReason);
      setRejectReason('');
      setRejectOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Main action buttons */}
      <Card className="p-4 space-y-3">
        <Button
          onClick={onConfirm}
          disabled={!payment || isLoading}
          className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white"
          size="lg"
        >
          <CheckCircle2 className="h-5 w-5" />
          Confirmar Conciliación
        </Button>

        <Button
          onClick={() => setObserveOpen(true)}
          disabled={!payment || isLoading}
          variant="outline"
          className="w-full gap-2 border-yellow-200 text-yellow-800 hover:bg-yellow-50"
          size="lg"
        >
          <AlertCircle className="h-5 w-5" />
          Observar Pago
        </Button>

        <Button
          onClick={() => setRejectOpen(true)}
          disabled={!payment || isLoading}
          variant="outline"
          className="w-full gap-2 border-red-200 text-red-800 hover:bg-red-50"
          size="lg"
        >
          <XCircle className="h-5 w-5" />
          Rechazar Pago
        </Button>
      </Card>

      {/* Next button */}
      {hasNext && (
        <Button
          onClick={onNext}
          disabled={!payment || isLoading}
          variant="outline"
          className="w-full"
        >
          Siguiente pago →
        </Button>
      )}

      {/* Observe modal */}
      {observeOpen && (
        <Card className="p-4 border-yellow-200 bg-yellow-50">
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Motivo de la observación</h4>
            <textarea
              value={observeReason}
              onChange={(e) => setObserveReason(e.target.value)}
              placeholder="Describe el motivo de la observación (ej: Monto inferior al esperado, Documento incompleto...)"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-24"
            />
            <div className="flex gap-2 justify-end">
              <Button
                onClick={() => {
                  setObserveOpen(false);
                  setObserveReason('');
                }}
                variant="outline"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleObserve}
                disabled={!observeReason.trim() || isLoading}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                Guardar observación
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Reject modal */}
      {rejectOpen && (
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Motivo del rechazo</h4>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Describe el motivo del rechazo (ej: Monto insuficiente, Documento fraudulento...)"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-24"
            />
            <div className="flex gap-2 justify-end">
              <Button
                onClick={() => {
                  setRejectOpen(false);
                  setRejectReason('');
                }}
                variant="outline"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleReject}
                disabled={!rejectReason.trim() || isLoading}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Rechazar pago
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
