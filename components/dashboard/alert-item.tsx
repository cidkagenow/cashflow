'use client';

import { Badge } from '@/components/ui/badge';
import { AlertCircle, Clock } from 'lucide-react';

interface AlertItemProps {
  projectName: string;
  milestoneName: string;
  amount: string;
  status: 'exigible' | 'overdue';
  daysOverdue?: number;
  clientName?: string;
}

export function AlertItem({
  projectName,
  milestoneName,
  amount,
  status,
  daysOverdue,
  clientName,
}: AlertItemProps) {
  const isOverdue = status === 'overdue';
  const statusColor = isOverdue ? 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-900' : 'bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-900';
  const badgeVariant = isOverdue ? 'destructive' : 'default';
  const badgeLabel = isOverdue ? `${daysOverdue} días en mora` : 'Exigible';

  return (
    <div className={`flex items-center justify-between p-4 border rounded-lg ${statusColor}`}>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          {isOverdue && <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />}
          <p className="font-semibold text-gray-900 dark:text-white text-sm">{projectName}</p>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{milestoneName}</p>
        {clientName && (
          <p className="text-xs text-gray-500 dark:text-gray-500">Cliente: {clientName}</p>
        )}
      </div>
      <div className="flex flex-col items-end gap-2 ml-4">
        <p className="font-bold text-gray-900 dark:text-white">${amount}</p>
        <Badge variant={badgeVariant} className="text-xs">
          {badgeLabel}
        </Badge>
      </div>
    </div>
  );
}
