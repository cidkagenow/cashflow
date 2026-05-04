'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, CheckCircle2 } from 'lucide-react';

interface Payment {
  id: string;
  amount: number;
  method: string;
  date: string;
  status: 'completed' | 'pending';
  reference: string;
}

interface PaymentListProps {
  payments: Payment[];
}

export function PaymentList({ payments }: PaymentListProps) {
  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Pagos Registrados</h2>
      <div className="space-y-3">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="flex items-start justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
          >
            <div className="flex items-start gap-3 flex-1">
              <CreditCard className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground text-sm">${payment.amount.toLocaleString()}</p>
                  {payment.status === 'completed' && (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{payment.method}</p>
                <p className="text-xs text-muted-foreground">Ref: {payment.reference}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground whitespace-nowrap ml-2">{payment.date}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
