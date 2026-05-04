'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { MilestoneList } from './milestone-list';
import { DocumentList } from './document-list';
import { PaymentList } from './payment-list';

interface Milestone {
  id: string;
  name: string;
  amount: number;
  status: 'completed' | 'pending' | 'overdue';
  daysActive?: number;
  daysOverdue?: number;
}

interface Document {
  id: string;
  name: string;
  type: string;
  date: string;
  url?: string;
}

interface Payment {
  id: string;
  amount: number;
  method: string;
  date: string;
  status: 'completed' | 'pending';
  reference: string;
}

interface CaseSidebarProps {
  milestones: Milestone[];
  documents: Document[];
  payments: Payment[];
}

export function CaseSidebar({ milestones, documents, payments }: CaseSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    milestones: true,
    documents: true,
    payments: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2 px-1">
        <h2 className="text-lg font-semibold text-foreground">Panel de Control</h2>
      </div>

      <div className="space-y-4">
        <div>
          <Button
            variant="ghost"
            className="w-full justify-between px-2 mb-2 hover:bg-muted"
            onClick={() => toggleSection('milestones')}
          >
            <span className="text-sm font-semibold">Entregables e Hitos</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                expandedSections.milestones ? '' : '-rotate-90'
              }`}
            />
          </Button>
          {expandedSections.milestones && <MilestoneList milestones={milestones} />}
        </div>

        <div>
          <Button
            variant="ghost"
            className="w-full justify-between px-2 mb-2 hover:bg-muted"
            onClick={() => toggleSection('documents')}
          >
            <span className="text-sm font-semibold">Comprobantes Emitidos</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                expandedSections.documents ? '' : '-rotate-90'
              }`}
            />
          </Button>
          {expandedSections.documents && <DocumentList documents={documents} />}
        </div>

        <div>
          <Button
            variant="ghost"
            className="w-full justify-between px-2 mb-2 hover:bg-muted"
            onClick={() => toggleSection('payments')}
          >
            <span className="text-sm font-semibold">Pagos Registrados</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                expandedSections.payments ? '' : '-rotate-90'
              }`}
            />
          </Button>
          {expandedSections.payments && <PaymentList payments={payments} />}
        </div>
      </div>
    </div>
  );
}
