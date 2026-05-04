'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ActivityInput } from './activity-input';
import { ActivityItem } from './activity-item';

interface Activity {
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
}

interface ActivityFeedProps {
  initialActivities: Activity[];
}

export function ActivityFeed({ initialActivities }: ActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);

  const handleAddActivity = (data: {
    action: 'call' | 'message' | 'payment' | 'reconciliation' | 'note';
    comment: string;
    tags: string[];
  }) => {
    const actionLabels = {
      call: 'Llamada',
      message: 'WhatsApp',
      payment: 'Pago',
      reconciliation: 'Conciliación',
      note: 'Nota',
    };

    const newActivity: Activity = {
      id: `activity-${Date.now()}`,
      user: {
        name: 'Tu usuario',
        initials: 'TU',
      },
      action: data.action,
      actionLabel: actionLabels[data.action],
      comment: data.comment,
      tags: data.tags,
      timestamp: new Date().toLocaleString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: 'short',
      }),
    };

    setActivities([newActivity, ...activities]);
  };

  return (
    <div className="space-y-4">
      <ActivityInput onSubmit={handleAddActivity} />

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-6 text-foreground">Bitácora de Actividades</h2>

        {activities.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No hay actividades registradas aún
          </p>
        ) : (
          <div className="space-y-2">
            {activities.map((activity) => (
              <ActivityItem key={activity.id} {...activity} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
