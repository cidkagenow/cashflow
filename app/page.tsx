'use client';

import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { KPICard } from '@/components/dashboard/kpi-card';
import { AlertItem } from '@/components/dashboard/alert-item';
import { ReconciliationItem } from '@/components/dashboard/reconciliation-item';
import { EffectivenessChart } from '@/components/dashboard/effectiveness-chart';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, AlertTriangle, CheckCircle2, DollarSign } from 'lucide-react';

interface DashboardData {
  kpis: {
    totalPorCobrar: number;
    montoRecuperado: number;
    carteraVencida: number;
    tiempoPromedio: number;
  };
  alerts: {
    overdue: Array<{
      projectName: string;
      milestoneName: string;
      amount: string;
      status: 'overdue';
      daysOverdue: number;
      clientName: string;
    }>;
    exigible: Array<{
      projectName: string;
      milestoneName: string;
      amount: string;
      status: 'exigible';
      clientName: string;
    }>;
  };
  reconciliations: Array<{
    projectName: string;
    milestoneName: string;
    amount: string;
    date: string;
    reconciliedBy: string;
    paymentMethod: string;
  }>;
  summaryStats: {
    activeProjects: number;
    hitosPorCobrar: number;
    tasaEfectividad: number;
    carteraSana: number;
  };
  analystEffectiveness: Array<{
    name: string;
    efectividad: number;
    cobrado: number;
    exigible: number;
  }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) {
    return (
      <AppLayout>
        <div className="p-6 lg:p-8 space-y-8">
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-32" />)}
          </div>
          <Skeleton className="h-64" />
        </div>
      </AppLayout>
    );
  }

  const { kpis, alerts, reconciliations, summaryStats, analystEffectiveness } = data;

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard Ejecutivo
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Estado de cobranzas por hitos
            </p>
          </div>
          <Button variant="outline">Generar Reporte</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            label="Monto Total por Cobrar"
            value={`$${kpis.totalPorCobrar.toLocaleString()}`}
            trend={5}
            trendLabel="vs. mes anterior"
            icon={<DollarSign className="h-8 w-8" />}
            variant="default"
          />
          <KPICard
            label="Monto Recuperado (Este Mes)"
            value={`$${kpis.montoRecuperado.toLocaleString()}`}
            trend={12}
            trendLabel="avance"
            icon={<TrendingUp className="h-8 w-8" />}
            variant="success"
          />
          <KPICard
            label="Cartera Vencida"
            value={`$${kpis.carteraVencida.toLocaleString()}`}
            trend={-8}
            trendLabel="reducción vs. mes anterior"
            icon={<AlertTriangle className="h-8 w-8" />}
            variant="error"
          />
          <KPICard
            label="Tiempo Promedio de Recuperación"
            value={`${kpis.tiempoPromedio} días`}
            trend={2}
            trendLabel="mejora en ciclo"
            icon={<CheckCircle2 className="h-8 w-8" />}
            variant="success"
          />
        </div>

        <EffectivenessChart data={analystEffectiveness} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Hitos Urgentes
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Hitos exigibles y en mora
                </p>
              </div>
              <Button variant="link" className="text-primary">Ver todos</Button>
            </div>

            <div className="space-y-3">
              {alerts.overdue.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide mb-3">
                    EN MORA
                  </h3>
                  <div className="space-y-3">
                    {alerts.overdue.map((a, i) => <AlertItem key={i} {...a} />)}
                  </div>
                </div>
              )}

              {alerts.exigible.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wide mb-3">
                    EXIGIBLES
                  </h3>
                  <div className="space-y-3">
                    {alerts.exigible.map((a, i) => <AlertItem key={i} {...a} />)}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Últimas Conciliaciones
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Pagos validados por contabilidad
                </p>
              </div>
              <Button variant="link" className="text-primary">Ver historial</Button>
            </div>

            <div className="space-y-3">
              {reconciliations.map((r, i) => <ReconciliationItem key={i} {...r} />)}
            </div>
          </div>
        </div>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">Proyectos Activos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{summaryStats.activeProjects}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">Hitos por Cobrar</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{summaryStats.hitosPorCobrar}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">Tasa de Efectividad</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-500 mt-2">{summaryStats.tasaEfectividad}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">Cartera Sana</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{summaryStats.carteraSana}%</p>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
