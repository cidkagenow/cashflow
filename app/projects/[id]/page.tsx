'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AppLayout } from '@/components/app-layout';
import { CaseHeader } from '@/components/cases/case-header';
import { CaseSidebar } from '@/components/cases/case-sidebar';
import { ActivityFeed } from '@/components/cases/activity-feed';
import { Skeleton } from '@/components/ui/skeleton';
import { animateEntrance } from '@/lib/anime-utils';

interface ProjectDetail {
  id: string;
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
    user: { name: string; initials: string };
    action: 'call' | 'message' | 'payment' | 'reconciliation' | 'note';
    actionLabel: string;
    comment?: string;
    tags?: string[];
    timestamp: string;
  }>;
}

export default function CaseDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/projects/${projectId}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => { setProject(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [projectId]);

  useEffect(() => {
    if (loading || !project) return;
    animateEntrance({ title: '.case-header', sections: '.case-section' });
  }, [loading, project]);

  if (loading) {
    return (
      <AppLayout>
        <div className="p-6 lg:p-8 space-y-6">
          <Skeleton className="h-32" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-96" />
            <Skeleton className="h-96 lg:col-span-2" />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error || !project) {
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
      <div className="p-6 lg:p-8 space-y-6">
        <div className="case-header">
          <CaseHeader
            clientName={project.clientName}
            projectName={project.projectName}
            totalAmount={project.totalAmount}
            paidAmount={project.paidAmount}
            currency={project.currency}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="case-section lg:col-span-1">
            <CaseSidebar
              milestones={project.milestones}
              documents={project.documents}
              payments={project.payments}
            />
          </div>
          <div className="case-section lg:col-span-2">
            <ActivityFeed initialActivities={project.activities} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
