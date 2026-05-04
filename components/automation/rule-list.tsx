'use client';

import { RuleItem } from './rule-item';
import { Card } from '@/components/ui/card';
import { AutomationRule } from './rule-builder';

interface RuleListProps {
  rules: Array<AutomationRule & { templateName: string }>;
  onToggleRule: (id: string, active: boolean) => void;
  onDeleteRule: (id: string) => void;
}

export function RuleList({ rules, onToggleRule, onDeleteRule }: RuleListProps) {
  const activeRules = rules.filter((r) => r.active);
  const inactiveRules = rules.filter((r) => !r.active);

  if (rules.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">
          No hay reglas configuradas. Crea una para comenzar.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {activeRules.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">
            Activas ({activeRules.length})
          </h4>
          <div className="space-y-2">
            {activeRules.map((rule) => (
              <RuleItem
                key={rule.id}
                rule={rule}
                onToggle={onToggleRule}
                onDelete={onDeleteRule}
              />
            ))}
          </div>
        </div>
      )}

      {inactiveRules.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground mb-3">
            Inactivas ({inactiveRules.length})
          </h4>
          <div className="space-y-2 opacity-60">
            {inactiveRules.map((rule) => (
              <RuleItem
                key={rule.id}
                rule={rule}
                onToggle={onToggleRule}
                onDelete={onDeleteRule}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
