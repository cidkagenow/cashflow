'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface CaseHeaderProps {
  clientName: string;
  projectName: string;
  totalAmount: number;
  paidAmount: number;
  currency?: string;
}

export function CaseHeader({
  clientName,
  projectName,
  totalAmount,
  paidAmount,
  currency = 'USD',
}: CaseHeaderProps) {
  const owedAmount = totalAmount - paidAmount;
  const paymentPercentage = (paidAmount / totalAmount) * 100;

  return (
    <div className="space-y-4">
      <Link
        href="/milestones"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Hitos
      </Link>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Cliente</p>
            <h1 className="text-2xl font-bold text-foreground">{clientName}</h1>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Proyecto</p>
            <p className="text-lg font-semibold text-foreground">{projectName}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Monto Total</p>
              </div>
              <p className="text-xl font-bold text-foreground">
                ${totalAmount.toLocaleString()} {currency}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <p className="text-sm text-muted-foreground">Pagado</p>
              </div>
              <p className="text-xl font-bold text-green-600">
                ${paidAmount.toLocaleString()} {currency}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <p className="text-sm text-muted-foreground">Por Cobrar</p>
              </div>
              <p className="text-xl font-bold text-orange-600">
                ${owedAmount.toLocaleString()} {currency}
              </p>
            </div>
          </div>

          <div className="pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progreso de Pago</span>
              <span className="font-semibold">{Math.round(paymentPercentage)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-green-600 h-full transition-all duration-300"
                style={{ width: `${paymentPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
