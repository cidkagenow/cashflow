'use client';

import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FolderPlus, DollarSign, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { animateEntrance, animateHoverButtons } from '@/lib/anime-utils';

interface Project {
  id: string;
  clientName: string;
  projectName: string;
  service?: string;
  totalAmount: number;
  paidAmount: number;
  status: string;
  milestoneCount?: number;
  activeMilestones?: number;
}

const PROJECT_STATUS: Record<string, { label: string; className: string }> = {
  Borrador:           { label: 'Borrador', className: 'bg-slate-500/15 text-slate-400' },
  PendienteAdelanto:  { label: 'Pend. Adelanto', className: 'bg-amber-500/15 text-amber-400' },
  EnCurso:            { label: 'En Curso', className: 'bg-blue-500/15 text-blue-400' },
  Pausado:            { label: 'Pausado', className: 'bg-orange-500/15 text-orange-400' },
  Finalizado:         { label: 'Finalizado', className: 'bg-emerald-500/15 text-emerald-400' },
  Cancelado:          { label: 'Cancelado', className: 'bg-red-500/15 text-red-400' },
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => { setProjects(data); setLoading(false); });
  }, []);

  useEffect(() => {
    if (loading || animated) return;
    setAnimated(true);
    animateEntrance({ title: '.proj-title', subtitle: '.proj-subtitle', cards: '.proj-card' });
    animateHoverButtons();
  }, [loading, animated]);

  if (loading) {
    return (
      <AppLayout>
        <div className="p-6 lg:p-8 space-y-6">
          <Skeleton className="h-10 w-48" />
          <div className="space-y-4">
            {[1,2,3].map(i => <Skeleton key={i} className="h-36" />)}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="proj-title text-2xl font-bold text-foreground tracking-tight">Proyectos</h1>
            <p className="proj-subtitle text-sm text-muted-foreground mt-1">{projects.length} proyectos</p>
          </div>
          <Link href="/projects/create">
            <Button size="sm" className="gap-2">
              <FolderPlus className="h-4 w-4" />
              Crear Proyecto
            </Button>
          </Link>
        </div>

        <div className="grid gap-3">
          {projects.map((project) => {
            const owedAmount = project.totalAmount - project.paidAmount;
            const paymentPercentage = project.totalAmount > 0
              ? Math.min((project.paidAmount / project.totalAmount) * 100, 100)
              : 0;
            const statusConfig = PROJECT_STATUS[project.status] ?? { label: project.status, className: 'bg-muted text-muted-foreground' };

            return (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="proj-card p-5 hover:shadow-md transition-all duration-200 cursor-pointer border-border hover:border-primary/20">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-muted-foreground">{project.clientName}</p>
                        <h3 className="text-base font-semibold text-foreground mt-0.5 truncate">{project.projectName}</h3>
                        {project.service && (
                          <p className="text-xs text-muted-foreground/70 mt-0.5">{project.service}</p>
                        )}
                      </div>
                      <Badge className={`${statusConfig.className} shrink-0 text-xs`}>
                        {statusConfig.label}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <DollarSign className="h-3.5 w-3.5" />
                          <span>Total</span>
                        </div>
                        <p className="font-semibold text-foreground text-sm tabular-nums">${project.totalAmount.toLocaleString()}</p>
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Pagado</span>
                        </div>
                        <p className="font-semibold text-emerald-400 text-sm tabular-nums">${project.paidAmount.toLocaleString()}</p>
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <AlertCircle className="h-3.5 w-3.5" />
                          <span>Por Cobrar</span>
                        </div>
                        <p className="font-semibold text-amber-400 text-sm tabular-nums">${owedAmount.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Progreso de Pago</span>
                        <span className="font-semibold text-foreground tabular-nums">{Math.round(paymentPercentage)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${paymentPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
