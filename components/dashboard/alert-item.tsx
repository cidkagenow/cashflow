'use client';

import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';

interface AlertItemProps {
  projectName: string;
  milestoneName: string;
  amount: string;
  status: 'exigible' | 'overdue';
  daysOverdue?: number;
  clientName?: string;
}

export function AlertItem({ projectName, milestoneName, amount, status, daysOverdue, clientName }: AlertItemProps) {
  const isOverdue = status === 'overdue';

  return (
    <div className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm ${
      isOverdue
        ? 'border-red-500/20 bg-red-500/5 hover:bg-red-500/10'
        : 'border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10'
    }`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {isOverdue && <AlertCircle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />}
          <p className="font-semibold text-foreground text-sm truncate">{projectName}</p>
        </div>
        <p className="text-xs text-muted-foreground truncate">{milestoneName}</p>
        {clientName && (
          <p className="text-xs text-muted-foreground/70 mt-1">Cliente: {clientName}</p>
        )}
      </div>
      <div className="flex flex-col items-end gap-2 ml-4 shrink-0">
        <p className="font-bold text-foreground tabular-nums">${amount}</p>
        <Badge variant={isOverdue ? 'destructive' : 'default'} className="text-xs">
          {isOverdue ? `${daysOverdue}d en mora` : 'Exigible'}
        </Badge>
      </div>
    </div>
  );
}
