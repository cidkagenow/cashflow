'use client';

import { useState, useMemo } from 'react';
import { AppLayout } from '@/components/app-layout';
import { PendingPaymentCard, PendingPayment } from '@/components/reconciliation/pending-payment-card';
import { PaymentListFilter } from '@/components/reconciliation/payment-list-filter';
import { ReconciliationPanel } from '@/components/reconciliation/reconciliation-panel';
import { ReconciliationActions } from '@/components/reconciliation/reconciliation-actions';
import { ReconciliationHeader } from '@/components/reconciliation/reconciliation-header';
import { Card } from '@/components/ui/card';

// Mock data
const mockPayments: PendingPayment[] = [
  {
    id: '1',
    date: '2024-04-08',
    clientName: 'TechCorp Solutions',
    milestone: 'Implementación - Hito 3',
    expectedAmount: 200000,
    receivedAmount: 200000,
    method: 'transfer',
    reference: 'TRF-2024-4521',
    voucherImage: 'https://images.unsplash.com/photo-1554224311-beee415c15cb?w=400&h=300&fit=crop',
    status: 'pending',
  },
  {
    id: '2',
    date: '2024-04-07',
    clientName: 'FinServ International',
    milestone: 'Integración - Hito 2',
    expectedAmount: 80000,
    receivedAmount: 75000,
    method: 'yape',
    reference: 'YAPE-0847192',
    voucherImage: 'https://images.unsplash.com/photo-1553531088-e2e58c55a4d2?w=400&h=300&fit=crop',
    status: 'reviewing',
  },
  {
    id: '3',
    date: '2024-04-05',
    clientName: 'RetailCorp',
    milestone: 'Levantamiento - Hito 1',
    expectedAmount: 45000,
    receivedAmount: 45000,
    method: 'transfer',
    reference: 'TRF-2024-4498',
    voucherImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    status: 'pending',
  },
  {
    id: '4',
    date: '2024-04-04',
    clientName: 'ConsultPro',
    milestone: 'Análisis - Hito 1',
    expectedAmount: 55000,
    receivedAmount: 55000,
    method: 'transfer',
    reference: 'TRF-2024-4475',
    voucherImage: 'https://images.unsplash.com/photo-1618044733300-9472ba28f672?w=400&h=300&fit=crop',
    status: 'reconciled',
  },
  {
    id: '5',
    date: '2024-04-03',
    clientName: 'AgriTech Solutions',
    milestone: 'MVP - Hito 2',
    expectedAmount: 120000,
    receivedAmount: 110000,
    method: 'check',
    reference: 'CHQ-001298',
    voucherImage: 'https://images.unsplash.com/photo-1578926314433-f66f9c5b3429?w=400&h=300&fit=crop',
    status: 'observed',
  },
  {
    id: '6',
    date: '2024-04-02',
    clientName: 'LogisticsPro',
    milestone: 'Setup - Hito 1',
    expectedAmount: 95000,
    receivedAmount: 95000,
    method: 'transfer',
    reference: 'TRF-2024-4420',
    voucherImage: 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=400&h=300&fit=crop',
    status: 'reconciled',
  },
  {
    id: '7',
    date: '2024-03-31',
    clientName: 'GreenEnergy Inc',
    milestone: 'Diseño - Hito 1',
    expectedAmount: 65000,
    receivedAmount: 65000,
    method: 'yape',
    reference: 'YAPE-0847101',
    voucherImage: 'https://images.unsplash.com/photo-1620321503375-490eac061f47?w=400&h=300&fit=crop',
    status: 'pending',
  },
  {
    id: '8',
    date: '2024-03-30',
    clientName: 'BuildCorp',
    milestone: 'Especificación - Hito 2',
    expectedAmount: 160000,
    receivedAmount: 160000,
    method: 'transfer',
    reference: 'TRF-2024-4350',
    voucherImage: 'https://images.unsplash.com/photo-1592928302636-36b246b0d5e0?w=400&h=300&fit=crop',
    status: 'rejected',
  },
];

export default function ReconciliationPage() {
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [payments, setPayments] = useState<PendingPayment[]>(mockPayments);
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and sort payments
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
        // Pending and reviewing first, then by date
        const statusOrder = { pending: 0, reviewing: 1, observed: 2, reconciled: 3, rejected: 4 };
        const orderDiff = statusOrder[a.status] - statusOrder[b.status];
        if (orderDiff !== 0) return orderDiff;
        const dateA = typeof a.date === 'string' ? new Date(a.date).getTime() : a.date.getTime();
        const dateB = typeof b.date === 'string' ? new Date(b.date).getTime() : b.date.getTime();
        return dateB - dateA;
      });
  }, [payments, statusFilter, methodFilter, searchQuery]);

  const selectedPayment = payments.find((p) => p.id === selectedPaymentId) || null;

  const handleConfirm = () => {
    if (selectedPayment) {
      setPayments(
        payments.map((p) =>
          p.id === selectedPayment.id ? { ...p, status: 'reconciled' as const } : p
        )
      );
      // Move to next pending
      const nextPending = filteredPayments.find(
        (p) => (p.status === 'pending' || p.status === 'reviewing') && p.id !== selectedPayment.id
      );
      setSelectedPaymentId(nextPending?.id || null);
    }
  };

  const handleObserve = (reason: string) => {
    if (selectedPayment) {
      setPayments(
        payments.map((p) =>
          p.id === selectedPayment.id ? { ...p, status: 'observed' as const } : p
        )
      );
      // Move to next
      const nextPayment = filteredPayments.find((p) => p.id !== selectedPayment.id);
      setSelectedPaymentId(nextPayment?.id || null);
    }
  };

  const handleReject = (reason: string) => {
    if (selectedPayment) {
      setPayments(
        payments.map((p) =>
          p.id === selectedPayment.id ? { ...p, status: 'rejected' as const } : p
        )
      );
      // Move to next
      const nextPayment = filteredPayments.find((p) => p.id !== selectedPayment.id);
      setSelectedPaymentId(nextPayment?.id || null);
    }
  };

  const handleNext = () => {
    const currentIndex = filteredPayments.findIndex((p) => p.id === selectedPaymentId);
    if (currentIndex < filteredPayments.length - 1) {
      setSelectedPaymentId(filteredPayments[currentIndex + 1].id);
    }
  };

  const hasNext =
    selectedPaymentId && filteredPayments.findIndex((p) => p.id === selectedPaymentId) < filteredPayments.length - 1;

  return (
    <AppLayout>
      <div className="space-y-6">
        <ReconciliationHeader payments={payments} filteredCount={filteredPayments.length} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column: List of payments */}
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

          {/* Right column: Reconciliation panel and actions */}
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
