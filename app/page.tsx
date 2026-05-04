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
import { TrendingUp, AlertTriangle, CheckCircle2, DollarSign, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { animateEntrance, animateCounters, animateScrollReveal, animateHoverButtons } from '@/lib/anime-utils';

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
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(setData);
  }, []);

  useEffect(() => {
    if (!data || animated) return;
    setAnimated(true);
    animateEntrance({
      title: '.dash-title',
      subtitle: '.dash-subtitle',
      cards: '.kpi-card',
      sections: '.dash-section',
    });
    animateScrollReveal('.dash-scroll-reveal');
    animateHoverButtons();
    animateCounters([
      { selector: '.kpi-counter-total', target: data.kpis.totalPorCobrar, prefix: '$' },
      { selector: '.kpi-counter-recovered', target: data.kpis.montoRecuperado, prefix: '$' },
      { selector: '.kpi-counter-overdue', target: data.kpis.carteraVencida, prefix: '$' },
      { selector: '.kpi-counter-days', target: data.kpis.tiempoPromedio, suffix: ' días' },
    ]);
    animateCounters([
      { selector: '.summary-projects', target: data.summaryStats.activeProjects },
      { selector: '.summary-milestones', target: data.summaryStats.hitosPorCobrar },
      { selector: '.summary-effectiveness', target: data.summaryStats.tasaEfectividad, suffix: '%' },
      { selector: '.summary-healthy', target: data.summaryStats.carteraSana, suffix: '%' },
    ]);
  }, [data, animated]);

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
            <h1 className="dash-title text-2xl font-bold text-foreground tracking-tight">
              Dashboard Ejecutivo
            </h1>
            <p className="dash-subtitle text-sm text-muted-foreground mt-1">
              Estado de cobranzas por hitos
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Generar Reporte
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="kpi-card">
            <KPICard
              label="Monto Total por Cobrar"
              value={`$${kpis.totalPorCobrar.toLocaleString()}`}
              counterClass="kpi-counter-total"
              trend={5}
              trendLabel="vs. mes anterior"
              icon={<DollarSign className="h-5 w-5" />}
              variant="default"
            />
          </div>
          <div className="kpi-card">
            <KPICard
              label="Monto Recuperado (Mes)"
              value={`$${kpis.montoRecuperado.toLocaleString()}`}
              counterClass="kpi-counter-recovered"
              trend={12}
              trendLabel="avance"
              icon={<TrendingUp className="h-5 w-5" />}
              variant="success"
            />
          </div>
          <div className="kpi-card">
            <KPICard
              label="Cartera Vencida"
              value={`$${kpis.carteraVencida.toLocaleString()}`}
              counterClass="kpi-counter-overdue"
              trend={-8}
              trendLabel="reducción vs. mes anterior"
              icon={<AlertTriangle className="h-5 w-5" />}
              variant="error"
            />
          </div>
          <div className="kpi-card">
            <KPICard
              label="Tiempo Promedio Recuperación"
              value={`${kpis.tiempoPromedio} días`}
              counterClass="kpi-counter-days"
              trend={2}
              trendLabel="mejora en ciclo"
              icon={<CheckCircle2 className="h-5 w-5" />}
              variant="success"
            />
          </div>
        </div>

        <div className="dash-scroll-reveal">
          <EffectivenessChart data={analystEffectiveness} />
        </div>

        <div className="dash-section grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Hitos Urgentes</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Hitos exigibles y en mora</p>
              </div>
              <Link href="/milestones">
                <Button variant="link" size="sm" className="text-primary">Ver todos</Button>
              </Link>
            </div>

            <div className="space-y-3">
              {alerts.overdue.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider mb-3">
                    EN MORA
                  </h3>
                  <div className="space-y-2">
                    {alerts.overdue.map((a, i) => <AlertItem key={i} {...a} />)}
                  </div>
                </div>
              )}

              {alerts.exigible.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-3">
                    EXIGIBLES
                  </h3>
                  <div className="space-y-2">
                    {alerts.exigible.map((a, i) => <AlertItem key={i} {...a} />)}
                  </div>
                </div>
              )}

              {alerts.overdue.length === 0 && alerts.exigible.length === 0 && (
                <div className="flex items-center justify-center py-12 border border-dashed rounded-lg">
                  <p className="text-sm text-muted-foreground">Sin hitos urgentes</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Últimas Conciliaciones</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Pagos validados por contabilidad</p>
              </div>
              <Link href="/reconciliation">
                <Button variant="link" size="sm" className="text-primary">Ver historial</Button>
              </Link>
            </div>

            <div className="space-y-2">
              {reconciliations.length > 0 ? (
                reconciliations.map((r, i) => <ReconciliationItem key={i} {...r} />)
              ) : (
                <div className="flex items-center justify-center py-12 border border-dashed rounded-lg">
                  <p className="text-sm text-muted-foreground">Sin conciliaciones recientes</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <Card className="dash-scroll-reveal p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-[11px] text-muted-foreground uppercase font-semibold tracking-wider">Proyectos Activos</p>
              <p className="summary-projects text-2xl font-bold text-foreground mt-1.5 tabular-nums">{summaryStats.activeProjects}</p>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground uppercase font-semibold tracking-wider">Hitos por Cobrar</p>
              <p className="summary-milestones text-2xl font-bold text-foreground mt-1.5 tabular-nums">{summaryStats.hitosPorCobrar}</p>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground uppercase font-semibold tracking-wider">Tasa de Efectividad</p>
              <p className="summary-effectiveness text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1.5 tabular-nums">{summaryStats.tasaEfectividad}%</p>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground uppercase font-semibold tracking-wider">Cartera Sana</p>
              <p className="summary-healthy text-2xl font-bold text-foreground mt-1.5 tabular-nums">{summaryStats.carteraSana}%</p>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
