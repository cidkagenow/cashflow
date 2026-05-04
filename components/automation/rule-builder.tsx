'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

export interface AutomationRule {
  id: string;
  status: 'exigible' | 'notificado' | 'en-mora' | 'vencido';
  days: number;
  templateId: string;
  channel: 'whatsapp' | 'email';
  active: boolean;
}

interface RuleBuilderProps {
  templates: Array<{ id: string; name: string }>;
  onRuleCreate: (rule: Omit<AutomationRule, 'id' | 'active'>) => void;
}

export function RuleBuilder({ templates, onRuleCreate }: RuleBuilderProps) {
  const [status, setStatus] = useState<string>('');
  const [days, setDays] = useState<string>('');
  const [templateId, setTemplateId] = useState<string>('');
  const [channel, setChannel] = useState<string>('');

  const statusOptions = [
    { value: 'exigible', label: 'Exigible' },
    { value: 'notificado', label: 'Notificado' },
    { value: 'en-mora', label: 'En mora' },
    { value: 'vencido', label: 'Vencido' },
  ];

  const isValid = status && days && templateId && channel;

  const handleCreate = () => {
    if (!isValid) return;

    onRuleCreate({
      status: status as AutomationRule['status'],
      days: parseInt(days),
      templateId,
      channel: channel as AutomationRule['channel'],
    });

    // Reset form
    setStatus('');
    setDays('');
    setTemplateId('');
    setChannel('');
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Crear Nueva Regla</h3>
      
      <div className="space-y-4">
        {/* Status Selector */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Estado del Hito
          </label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un estado" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Days Input */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Después de (días)
          </label>
          <Input
            type="number"
            min="1"
            max="90"
            placeholder="Ej: 3"
            value={days}
            onChange={(e) => setDays(e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enviar recordatorio después de X días en ese estado
          </p>
        </div>

        {/* Template Selector */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Plantilla
          </label>
          <Select value={templateId} onValueChange={setTemplateId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una plantilla" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((tmpl) => (
                <SelectItem key={tmpl.id} value={tmpl.id}>
                  {tmpl.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Channel Selector */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Canal de Envío
          </label>
          <div className="flex gap-2">
            {[
              { value: 'whatsapp', label: 'WhatsApp' },
              { value: 'email', label: 'Email' },
            ].map((ch) => (
              <button
                key={ch.value}
                onClick={() => setChannel(ch.value)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  channel === ch.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                {ch.label}
              </button>
            ))}
          </div>
        </div>

        {/* Create Button */}
        <Button
          onClick={handleCreate}
          disabled={!isValid}
          className="w-full gap-2"
        >
          <Plus className="h-4 w-4" />
          Crear Regla
        </Button>
      </div>
    </Card>
  );
}
