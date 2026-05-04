'use client';

import { MessageCircle, Mail, Trash2, Edit2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { AutomationRule } from './rule-builder';

interface RuleItemProps {
  rule: AutomationRule & { templateName: string };
  onToggle: (id: string, active: boolean) => void;
  onDelete: (id: string) => void;
}

export function RuleItem({ rule, onToggle, onDelete }: RuleItemProps) {
  const statusLabels: Record<string, string> = {
    exigible: 'Exigible',
    notificado: 'Notificado',
    'en-mora': 'En mora',
    vencido: 'Vencido',
  };

  const conditionText = `Si hito está ${statusLabels[rule.status]} y han pasado ${rule.days} día${rule.days !== 1 ? 's' : ''}`;

  return (
    <Card className={`p-4 ${rule.active ? 'bg-card' : 'bg-muted/40'}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-foreground">{conditionText}</p>
          </div>

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="px-2 py-1 bg-blue-500/15 text-blue-400 rounded text-xs font-medium">
              {rule.templateName}
            </span>
            
            <div className="flex items-center gap-1">
              {rule.channel === 'whatsapp' ? (
                <>
                  <MessageCircle className="h-4 w-4 text-green-600" />
                  <span>WhatsApp</span>
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span>Email</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            checked={rule.active}
            onCheckedChange={(checked) => onToggle(rule.id, checked)}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(rule.id)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
