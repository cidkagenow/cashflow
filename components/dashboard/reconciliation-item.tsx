'use client';

import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';

interface ReconciliationItemProps {
  projectName: string;
  milestoneName: string;
  amount: string;
  date: string;
  reconciliedBy?: string;
  paymentMethod?: string;
}

export function ReconciliationItem({ projectName, milestoneName, amount, date, reconciliedBy, paymentMethod = 'Transferencia' }: ReconciliationItemProps) {
  return (
    <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-card hover:bg-accent/50 transition-colors duration-200 cursor-pointer">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="mt-0.5 shrink-0">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-sm truncate">{projectName}</p>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{milestoneName}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-[11px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
              {paymentMethod}
            </Badge>
            <span className="text-xs text-muted-foreground">{date}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5 ml-4 shrink-0">
        <p className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">${amount}</p>
        {reconciliedBy && (
          <p className="text-[11px] text-muted-foreground">{reconciliedBy}</p>
        )}
      </div>
    </div>
  );
}
