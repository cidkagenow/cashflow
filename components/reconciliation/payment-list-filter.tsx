'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface PaymentListFilterProps {
  statusFilter: string;
  methodFilter: string;
  searchQuery: string;
  onStatusChange: (status: string) => void;
  onMethodChange: (method: string) => void;
  onSearchChange: (query: string) => void;
}

const statuses = [
  { value: 'all', label: 'Todos' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'reviewing', label: 'En revisión' },
  { value: 'reconciled', label: 'Conciliados' },
  { value: 'rejected', label: 'Rechazados' },
];

const methods = [
  { value: 'all', label: 'Todos' },
  { value: 'transfer', label: 'Transferencia' },
  { value: 'yape', label: 'Yape' },
  { value: 'check', label: 'Cheque' },
  { value: 'cash', label: 'Efectivo' },
];

export function PaymentListFilter({
  statusFilter,
  methodFilter,
  searchQuery,
  onStatusChange,
  onMethodChange,
  onSearchChange,
}: PaymentListFilterProps) {
  return (
    <div className="space-y-4 bg-card rounded-lg border p-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Buscar</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente o referencia..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Estado</label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Medio de pago</label>
          <select
            value={methodFilter}
            onChange={(e) => onMethodChange(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
          >
            {methods.map((method) => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
