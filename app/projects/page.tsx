'use client';

import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FolderPlus, DollarSign, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface Project {
  id: string;
  clientName: string;
  projectName: string;
  totalAmount: number;
  paidAmount: number;
  status: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => { setProjects(data); setLoading(false); });
  }, []);

  const getStatusBadge = (status: string, paid: number, total: number) => {
    if (status === 'completed') {
      return <Badge className="bg-green-100 text-green-800">Completado</Badge>;
    }
    if (paid === total) {
      return <Badge className="bg-green-100 text-green-800">Pagado</Badge>;
    }
    if (paid > 0) {
      return <Badge className="bg-orange-100 text-orange-800">En Progreso</Badge>;
    }
    return <Badge className="bg-blue-100 text-blue-800">Sin Pagar</Badge>;
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          {[1,2,3].map(i => <Skeleton key={i} className="h-40" />)}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Proyectos</h1>
          <Link href="/projects/create">
            <Button className="gap-2">
              <FolderPlus className="h-4 w-4" />
              Crear Proyecto
            </Button>
          </Link>
        </div>

        <div className="grid gap-4">
          {projects.map((project) => {
            const owedAmount = project.totalAmount - project.paidAmount;
            const paymentPercentage = (project.paidAmount / project.totalAmount) * 100;

            return (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">{project.clientName}</p>
                        <h3 className="text-lg font-semibold text-foreground">{project.projectName}</h3>
                      </div>
                      {getStatusBadge(project.status, project.paidAmount, project.totalAmount)}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <DollarSign className="h-4 w-4" /> Total
                        </div>
                        <p className="font-semibold text-foreground">${project.totalAmount.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4" /> Pagado
                        </div>
                        <p className="font-semibold text-green-600">${project.paidAmount.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <AlertCircle className="h-4 w-4" /> Por Cobrar
                        </div>
                        <p className="font-semibold text-orange-600">${owedAmount.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progreso de Pago</span>
                        <span className="font-semibold">{Math.round(paymentPercentage)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-green-600 h-full transition-all duration-300"
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
