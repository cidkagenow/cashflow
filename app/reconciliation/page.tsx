'use client';

import { useState, useMemo, useEffect } from 'react';
import { AppLayout } from '@/components/app-layout';
import { PendingPaymentCard, PendingPayment } from '@/components/reconciliation/pending-payment-card';
import { PaymentListFilter } from '@/components/reconciliation/payment-list-filter';
import { ReconciliationPanel } from '@/components/reconciliation/reconciliation-panel';
import { ReconciliationActions } from '@/components/reconciliation/reconciliation-actions';
import { ReconciliationHeader } from '@/components/reconciliation/reconciliation-header';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ReconciliationPage() {
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [payments, setPayments] = useState<PendingPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/reconciliation')
      .then(res => res.json())
      .then(data => { setPayments(data); setLoading(false); });
  }, []);

  const filteredPayments = useMemo(() => {
    return payments
      .filter((p) => {
        if (statusFilter !== 'all' && p.status !== statusFilter) return false;
        if (methodFilter !== 'all' && p.method !== methodFilter) return false;
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            p.clientName.toLowerCase().includes(query) ||
            p.milestone.toLowerCase().includes(query) ||
            (p.reference && p.reference.toLowerCase().includes(query))
          );
        }
        return true;
      })
      .sort((a, b) => {
        const statusOrder: Record<string, number> = { pending: 0, reviewing: 1, observed: 2, reconciled: 3, rejected: 4 };
        const orderDiff = (statusOrder[a.status] ?? 5) - (statusOrder[b.status] ?? 5);
        if (orderDiff !== 0) return orderDiff;
        const dateA = typeof a.date === 'string' ? new Date(a.date).getTime() : a.date.getTime();
        const dateB = typeof b.date === 'string' ? new Date(b.date).getTime() : b.date.getTime();
        return dateB - dateA;
      });
  }, [payments, statusFilter, methodFilter, searchQuery]);

  const selectedPayment = payments.find((p) => p.id === selectedPaymentId) || null;

  const updatePaymentStatus = async (id: string, status: string, reason?: string) => {
    await fetch('/api/reconciliation', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, reason }),
    });
    setPayments(payments.map(p => p.id === id ? { ...p, status: status as PendingPayment['status'] } : p));
    const nextPending = filteredPayments.find(p => (p.status === 'pending' || p.status === 'reviewing') && p.id !== id);
    setSelectedPaymentId(nextPending?.id || null);
  };

  const handleConfirm = () => { if (selectedPayment) updatePaymentStatus(selectedPayment.id, 'reconciled'); };
  const handleObserve = (reason: string) => { if (selectedPayment) updatePaymentStatus(selectedPayment.id, 'observed', reason); };
  const handleReject = (reason: string) => { if (selectedPayment) updatePaymentStatus(selectedPayment.id, 'rejected', reason); };

  const handleNext = () => {
    const currentIndex = filteredPayments.findIndex((p) => p.id === selectedPaymentId);
    if (currentIndex < filteredPayments.length - 1) {
      setSelectedPaymentId(filteredPayments[currentIndex + 1].id);
    }
  };

  const hasNext = selectedPaymentId && filteredPayments.findIndex((p) => p.id === selectedPaymentId) < filteredPayments.length - 1;

  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <Skeleton className="h-20" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-24" />)}</div>
            <Skeleton className="h-96" />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <ReconciliationHeader payments={payments} filteredCount={filteredPayments.length} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <PaymentListFilter
              statusFilter={statusFilter}
              methodFilter={methodFilter}
              searchQuery={searchQuery}
              onStatusChange={setStatusFilter}
              onMethodChange={setMethodFilter}
              onSearchChange={setSearchQuery}
            />

            {filteredPayments.length > 0 ? (
              <div className="grid gap-3 max-h-[600px] overflow-y-auto pr-2">
                {filteredPayments.map((payment) => (
                  <PendingPaymentCard
                    key={payment.id}
                    payment={payment}
                    isSelected={selectedPaymentId === payment.id}
                    onClick={() => setSelectedPaymentId(payment.id)}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No hay pagos que coincidan con los filtros</p>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <ReconciliationPanel payment={selectedPayment} />
            <ReconciliationActions
              payment={selectedPayment}
              onConfirm={handleConfirm}
              onObserve={handleObserve}
              onReject={handleReject}
              onNext={handleNext}
              hasNext={!!hasNext}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
