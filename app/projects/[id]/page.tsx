'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { AppLayout } from '@/components/app-layout';
import { CaseHeader } from '@/components/cases/case-header';
import { CaseSidebar } from '@/components/cases/case-sidebar';
import { ActivityFeed } from '@/components/cases/activity-feed';

// Mock data
const projectsData: Record<
  string,
  {
    clientName: string;
    projectName: string;
    totalAmount: number;
    paidAmount: number;
    currency: string;
    milestones: Array<{
      id: string;
      name: string;
      amount: number;
      status: 'completed' | 'pending' | 'overdue';
      daysActive?: number;
      daysOverdue?: number;
    }>;
    documents: Array<{
      id: string;
      name: string;
      type: string;
      date: string;
      url?: string;
    }>;
    payments: Array<{
      id: string;
      amount: number;
      method: string;
      date: string;
      status: 'completed' | 'pending';
      reference: string;
    }>;
    activities: Array<{
      id: string;
      user: {
        name: string;
        initials: string;
      };
      action: 'call' | 'message' | 'payment' | 'reconciliation' | 'note';
      actionLabel: string;
      comment?: string;
      tags?: string[];
      timestamp: string;
    }>;
  }
> = {
  '1': {
    clientName: 'TechCorp Solutions',
    projectName: 'Transformación Digital - Fase 1',
    totalAmount: 450000,
    paidAmount: 225000,
    currency: 'USD',
    milestones: [
      {
        id: 'm1',
        name: 'Discovery y Análisis',
        amount: 112500,
        status: 'completed',
        daysActive: 45,
      },
      {
        id: 'm2',
        name: 'Arquitectura Técnica',
        amount: 112500,
        status: 'completed',
        daysActive: 38,
      },
      {
        id: 'm3',
        name: 'Desarrollo MVP',
        amount: 112500,
        status: 'pending',
        daysActive: 12,
      },
      {
        id: 'm4',
        name: 'Testing e Implementación',
        amount: 112500,
        status: 'overdue',
        daysOverdue: 5,
      },
    ],
    documents: [
      {
        id: 'd1',
        name: 'Factura PRO-2024-001',
        type: 'invoice',
        date: '2024-01-15',
      },
      {
        id: 'd2',
        name: 'Factura PRO-2024-002',
        type: 'invoice',
        date: '2024-02-20',
      },
      {
        id: 'd3',
        name: 'Informe de Avance',
        type: 'report',
        date: '2024-03-01',
      },
    ],
    payments: [
      {
        id: 'p1',
        amount: 112500,
        method: 'Transferencia Bancaria',
        date: '2024-01-25',
        status: 'completed',
        reference: 'TRF-001-2024',
      },
      {
        id: 'p2',
        amount: 112500,
        method: 'Transferencia Bancaria',
        date: '2024-02-28',
        status: 'completed',
        reference: 'TRF-002-2024',
      },
    ],
    activities: [
      {
        id: 'a1',
        user: {
          name: 'María López',
          initials: 'ML',
        },
        action: 'reconciliation',
        actionLabel: 'Conciliación',
        comment: 'Pago verificado en cuenta bancaria. Monto coincide con factura PRO-2024-002',
        tags: ['#ConciliacionExitosa'],
        timestamp: '10:30, 1 mar',
      },
      {
        id: 'a2',
        user: {
          name: 'Carlos Ruiz',
          initials: 'CR',
        },
        action: 'call',
        actionLabel: 'Llamada',
        comment:
          'Cliente confirma envío de segundo pago. Dicen que será procesado en los próximos 2 días.',
        tags: ['#CompromisoPago', '#AvancePositivo'],
        timestamp: '15:45, 28 feb',
      },
      {
        id: 'a3',
        user: {
          name: 'Ana González',
          initials: 'AG',
        },
        action: 'message',
        actionLabel: 'WhatsApp',
        comment:
          'Envío de recordatorio sobre factura vencida. Cliente recibió el mensaje.',
        tags: ['#Notificacion'],
        timestamp: '09:20, 25 feb',
      },
      {
        id: 'a4',
        user: {
          name: 'María López',
          initials: 'ML',
        },
        action: 'payment',
        actionLabel: 'Pago Registrado',
        comment: 'Primera cuota pagada. Transferencia bancaria confirmada.',
        tags: ['#PrimerapagoExitoso'],
        timestamp: '14:15, 25 ene',
      },
    ],
  },
  '2': {
    clientName: 'FinServ International',
    projectName: 'Plataforma de Pagos - Integración',
    totalAmount: 320000,
    paidAmount: 80000,
    currency: 'USD',
    milestones: [
      {
        id: 'm5',
        name: 'Especificaciones Técnicas',
        amount: 80000,
        status: 'completed',
        daysActive: 20,
      },
      {
        id: 'm6',
        name: 'Desarrollo Backend',
        amount: 80000,
        status: 'pending',
        daysActive: 15,
      },
      {
        id: 'm7',
        name: 'Integración Frontend',
        amount: 80000,
        status: 'pending',
        daysActive: 8,
      },
      {
        id: 'm8',
        name: 'Testing y Deployment',
        amount: 80000,
        status: 'overdue',
        daysOverdue: 3,
      },
    ],
    documents: [
      {
        id: 'd4',
        name: 'Factura PAG-2024-001',
        type: 'invoice',
        date: '2024-01-20',
      },
    ],
    payments: [
      {
        id: 'p3',
        amount: 80000,
        method: 'Transferencia Bancaria',
        date: '2024-02-05',
        status: 'completed',
        reference: 'TRF-003-2024',
      },
    ],
    activities: [
      {
        id: 'a5',
        user: {
          name: 'Juan Pérez',
          initials: 'JP',
        },
        action: 'call',
        actionLabel: 'Llamada',
        comment:
          'Cliente sin disponibilidad. Contacto principal en reunión. Reprogramar para mañana.',
        tags: ['#ClienteNoResponde', '#Reprogramar'],
        timestamp: '11:00, 15 mar',
      },
      {
        id: 'a6',
        user: {
          name: 'Laura Martín',
          initials: 'LM',
        },
        action: 'note',
        actionLabel: 'Nota',
        comment:
          'Se detectó retraso en el desarrollo. Cliente requiere actualización de estado.',
        tags: ['#Retraso', '#ActualizacionPendiente'],
        timestamp: '16:30, 12 mar',
      },
    ],
  },
};

export default function CaseDetailPage() {
  const params = useParams();
  const projectId = params.id as string;

  const project = projectsData[projectId];

  if (!project) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Proyecto no encontrado</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <CaseHeader
          clientName={project.clientName}
          projectName={project.projectName}
          totalAmount={project.totalAmount}
          paidAmount={project.paidAmount}
          currency={project.currency}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel */}
          <div className="lg:col-span-1">
            <CaseSidebar
              milestones={project.milestones}
              documents={project.documents}
              payments={project.payments}
            />
          </div>

          {/* Right panel */}
          <div className="lg:col-span-2">
            <ActivityFeed initialActivities={project.activities} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
