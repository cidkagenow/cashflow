'use client';

import { AppLayout } from '@/components/app-layout';
import { KPICard } from '@/components/dashboard/kpi-card';
import { AlertItem } from '@/components/dashboard/alert-item';
import { ReconciliationItem } from '@/components/dashboard/reconciliation-item';
import { EffectivenessChart } from '@/components/dashboard/effectiveness-chart';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, AlertTriangle, CheckCircle2, DollarSign } from 'lucide-react';

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard Ejecutivo
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Estado de cobranzas por hitos - Mayo 2024
            </p>
          </div>
          <Button variant="outline">Generar Reporte</Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            label="Monto Total por Cobrar"
            value="$2,450,000"
            trend={5}
            trendLabel="vs. mes anterior"
            icon={<DollarSign className="h-8 w-8" />}
            variant="default"
          />
          <KPICard
            label="Monto Recuperado (Este Mes)"
            value="$1,180,500"
            trend={12}
            trendLabel="48% de avance"
            icon={<TrendingUp className="h-8 w-8" />}
            variant="success"
          />
          <KPICard
            label="Cartera Vencida"
            value="$385,200"
            trend={-8}
            trendLabel="reducción vs. mes anterior"
            icon={<AlertTriangle className="h-8 w-8" />}
            variant="error"
          />
          <KPICard
            label="Tiempo Promedio de Recuperación"
            value="18 días"
            trend={2}
            trendLabel="mejora en ciclo"
            icon={<CheckCircle2 className="h-8 w-8" />}
            variant="success"
          />
        </div>

        {/* Effectiveness Chart */}
        <EffectivenessChart />

        {/* Two Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alerts Section */}
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
              <Button variant="link" className="text-primary">
                Ver todos
              </Button>
            </div>

            <div className="space-y-3">
              {/* Overdue Items */}
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide mb-3">
                  EN MORA
                </h3>
                <div className="space-y-3">
                  <AlertItem
                    projectName="Proyecto SAP Implementation"
                    milestoneName="Fase 2: Configuración de Módulos"
                    amount="125,000"
                    status="overdue"
                    daysOverdue={14}
                    clientName="Grupo Industrial XYZ"
                  />
                  <AlertItem
                    projectName="Transformación Digital Retail"
                    milestoneName="Hito 3: Integración de Sistemas"
                    amount="85,000"
                    status="overdue"
                    daysOverdue={7}
                    clientName="Cadena Retail ABC"
                  />
                </div>
              </div>

              {/* Exigible Items */}
              <div>
                <h3 className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wide mb-3">
                  EXIGIBLES
                </h3>
                <div className="space-y-3">
                  <AlertItem
                    projectName="Consultoría Estratégica FMCG"
                    milestoneName="Entrega Final: Plan de Acción"
                    amount="95,000"
                    status="exigible"
                    clientName="Compañía de Consumo Masivo"
                  />
                  <AlertItem
                    projectName="Auditoría Financiera Integral"
                    milestoneName="Hito 2: Auditoría de Procesos"
                    amount="110,500"
                    status="exigible"
                    clientName="Banco Regional Sur"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Reconciliation Section */}
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
              <Button variant="link" className="text-primary">
                Ver historial
              </Button>
            </div>

            <div className="space-y-3">
              <ReconciliationItem
                projectName="Sistema CRM Enterprise"
                milestoneName="Implementación Fase 1"
                amount="150,000"
                date="4 de mayo"
                reconciliedBy="Contabilidad"
                paymentMethod="Transferencia"
              />
              <ReconciliationItem
                projectName="Renovación Identidad Corporativa"
                milestoneName="Diseño Ejecutivo"
                amount="65,000"
                date="2 de mayo"
                reconciliedBy="Contabilidad"
                paymentMethod="Tarjeta de Crédito"
              />
              <ReconciliationItem
                projectName="Optimización de Procesos Manufactura"
                milestoneName="Diagnóstico Inicial"
                amount="85,000"
                date="30 de abril"
                reconciliedBy="Contabilidad"
                paymentMethod="Transferencia"
              />
              <ReconciliationItem
                projectName="Consultoría en Gestión Talento"
                milestoneName="Fase 1: Evaluación de Competencias"
                amount="55,000"
                date="28 de abril"
                reconciliedBy="Contabilidad"
                paymentMethod="Cheque"
              />
              <ReconciliationItem
                projectName="Desarrollo Portal Web B2B"
                milestoneName="Backend y APIs"
                amount="120,000"
                date="25 de abril"
                reconciliedBy="Contabilidad"
                paymentMethod="Transferencia"
              />
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">
                Proyectos Activos
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">12</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">
                Hitos por Cobrar
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">28</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">
                Tasa de Efectividad
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-500 mt-2">88%</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">
                Cartera Sana
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">68%</p>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
