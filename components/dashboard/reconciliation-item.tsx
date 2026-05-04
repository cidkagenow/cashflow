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

export function ReconciliationItem({
  projectName,
  milestoneName,
  amount,
  date,
  reconciliedBy,
  paymentMethod = 'Transferencia',
}: ReconciliationItemProps) {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 transition">
      <div className="flex items-start gap-3 flex-1">
        <div className="mt-1">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900 dark:text-white text-sm">{projectName}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{milestoneName}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400 border-green-200 dark:border-green-800">
              {paymentMethod}
            </Badge>
            <p className="text-xs text-gray-500 dark:text-gray-500">{date}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2 ml-4">
        <p className="font-bold text-green-600 dark:text-green-500">${amount}</p>
        {reconciliedBy && (
          <p className="text-xs text-gray-500 dark:text-gray-500">{reconciliedBy}</p>
        )}
      </div>
    </div>
  );
}
