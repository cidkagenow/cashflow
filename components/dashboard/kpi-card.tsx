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
  counterClass?: string;
}

const variantStyles = {
  default: {
    border: 'border-l-4 border-l-blue-500',
    iconBg: 'bg-blue-500/10 text-blue-500',
  },
  success: {
    border: 'border-l-4 border-l-emerald-500',
    iconBg: 'bg-emerald-500/10 text-emerald-500',
  },
  warning: {
    border: 'border-l-4 border-l-amber-500',
    iconBg: 'bg-amber-500/10 text-amber-500',
  },
  error: {
    border: 'border-l-4 border-l-red-500',
    iconBg: 'bg-red-500/10 text-red-500',
  },
};

export function KPICard({ label, value, trend, trendLabel, icon, variant = 'default', counterClass }: KPICardProps) {
  const style = variantStyles[variant];
  const trendColor = trend && trend > 0
    ? 'text-emerald-500'
    : trend && trend < 0
      ? 'text-red-500'
      : 'text-muted-foreground';

  return (
    <Card className={`p-5 ${style.border} transition-shadow duration-200 hover:shadow-md`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground truncate">{label}</p>
          <p className={`mt-1.5 text-2xl font-bold text-foreground tracking-tight ${counterClass || ''}`}>{value}</p>
          {trendLabel && (
            <p className={`mt-2 text-xs font-semibold ${trendColor} flex items-center gap-1`}>
              {trend && trend > 0 && <TrendingUp className="h-3 w-3" />}
              {trend && trend < 0 && <TrendingDown className="h-3 w-3" />}
              {trendLabel}
            </p>
          )}
        </div>
        {icon && (
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${style.iconBg}`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
