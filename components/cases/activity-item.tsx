'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Phone, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface ActivityItemProps {
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

const actionConfig = {
  call: {
    icon: Phone,
    color: 'bg-blue-500/15 text-blue-400',
    label: 'Llamada',
  },
  message: {
    icon: MessageSquare,
    color: 'bg-purple-500/15 text-purple-400',
    label: 'WhatsApp',
  },
  payment: {
    icon: CheckCircle2,
    color: 'bg-emerald-500/15 text-emerald-400',
    label: 'Pago Registrado',
  },
  reconciliation: {
    icon: FileText,
    color: 'bg-orange-500/15 text-orange-400',
    label: 'Conciliación',
  },
  note: {
    icon: AlertCircle,
    color: 'bg-slate-500/15 text-slate-400',
    label: 'Nota',
  },
};

export function ActivityItem({
  id,
  user,
  action,
  actionLabel,
  comment,
  tags,
  timestamp,
}: ActivityItemProps) {
  const config = actionConfig[action];
  const Icon = config.icon;

  return (
    <div className="flex gap-4 pb-6 relative">
      {/* Timeline dot and line */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className={`w-10 h-10 rounded-full ${config.color} flex items-center justify-center`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="w-0.5 h-12 bg-border mt-2" />
      </div>

      {/* Content */}
      <div className="flex-1 pt-1">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs bg-muted text-foreground">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-sm text-foreground">{user.name}</span>
            <Badge variant="secondary" className="text-xs">
              {actionLabel}
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{timestamp}</span>
        </div>

        {comment && (
          <p className="text-sm text-foreground bg-muted p-3 rounded-lg mt-2 mb-2">{comment}</p>
        )}

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
