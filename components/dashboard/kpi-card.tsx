'use client';

import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string;
  trend?: number;
  trendLabel?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export function KPICard({
  label,
  value,
  trend,
  trendLabel,
  icon,
  variant = 'default',
}: KPICardProps) {
  const variantColors = {
    default: 'border-l-4 border-l-blue-500',
    success: 'border-l-4 border-l-green-500',
    warning: 'border-l-4 border-l-orange-500',
    error: 'border-l-4 border-l-red-500',
  };

  const trendColor =
    trend && trend > 0 ? 'text-green-600' : trend && trend < 0 ? 'text-red-600' : 'text-gray-500';

  return (
    <Card className={`p-6 ${variantColors[variant]} bg-white dark:bg-slate-900`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {trendLabel && (
            <p className={`mt-2 text-xs font-semibold ${trendColor} flex items-center gap-1`}>
              {trend && trend > 0 && <TrendingUp className="h-3 w-3" />}
              {trend && trend < 0 && <TrendingDown className="h-3 w-3" />}
              {trendLabel}
            </p>
          )}
        </div>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
    </Card>
  );
}
