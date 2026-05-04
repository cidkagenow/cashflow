'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { RuleBuilder, AutomationRule } from '@/components/automation/rule-builder';
import { RuleList } from '@/components/automation/rule-list';
import { TemplateEditor, Template } from '@/components/automation/template-editor';
import { MessagePreview } from '@/components/automation/message-preview';
import { Card } from '@/components/ui/card';

// Mock templates
const MOCK_TEMPLATES: Template[] = [
  {
    id: 'tmpl-1',
    name: 'Recordatorio Suave',
    content:
      'Hola {{nombre_cliente}}, le recordamos que el hito "{{hito}}" del proyecto {{proyecto}} por {{monto_hito}} está por cobrar. Fecha límite: {{fecha_vencimiento}}. Gracias.',
    channel: 'whatsapp',
  },
  {
    id: 'tmpl-2',
    name: 'Recordatorio Urgente',
    content:
      '{{nombre_cliente}}, el pago del hito {{hito}} ({{monto_hito}}) vence hoy. Por favor efectúe la transferencia a la brevedad. Ref: {{numero_referencia}}',
    channel: 'whatsapp',
  },
  {
    id: 'tmpl-3',
    name: 'Escalada - Seguimiento Formal',
    content:
      'Estimado {{nombre_cliente}},\n\nLe comunicamos que el hito {{hito}} del proyecto {{proyecto}} se encuentra en mora por {{dias_mora}}. Monto pendiente: {{monto_hito}}.\n\nSolicitamos regularizar inmediatamente.\n\nContacto: {{email_contacto}}',
    channel: 'email',
  },
  {
    id: 'tmpl-4',
    name: 'Último Recordatorio',
    content:
      '{{nombre_cliente}}, es la última notificación. El hito {{hito}} está vencido por {{dias_mora}}. Si no recibimos pago en 48h, procederemos con acciones legales.',
    channel: 'email',
  },
];

// Mock rules
const MOCK_RULES: (AutomationRule & { templateName: string })[] = [
  {
    id: 'rule-1',
    status: 'exigible',
    days: 1,
    templateId: 'tmpl-1',
    channel: 'whatsapp',
    active: true,
    templateName: 'Recordatorio Suave',
  },
  {
    id: 'rule-2',
    status: 'exigible',
    days: 5,
    templateId: 'tmpl-2',
    channel: 'whatsapp',
    active: true,
    templateName: 'Recordatorio Urgente',
  },
  {
    id: 'rule-3',
    status: 'en-mora',
    days: 3,
    templateId: 'tmpl-3',
    channel: 'email',
    active: true,
    templateName: 'Escalada - Seguimiento Formal',
  },
  {
    id: 'rule-4',
    status: 'en-mora',
    days: 10,
    templateId: 'tmpl-4',
    channel: 'email',
    active: false,
    templateName: 'Último Recordatorio',
  },
];

export default function AutomationPage() {
  const [templates, setTemplates] = useState<Template[]>(MOCK_TEMPLATES);
  const [rules, setRules] = useState<(AutomationRule & { templateName: string })[]>(MOCK_RULES);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tmpl-1');
  const [previewChannel, setPreviewChannel] = useState<'whatsapp' | 'email'>('whatsapp');
  const [previewContent, setPreviewContent] = useState(MOCK_TEMPLATES[0].content);

  const handleRuleCreate = (rule: Omit<AutomationRule, 'id' | 'active'>) => {
    const newRule: AutomationRule & { templateName: string } = {
      ...rule,
      id: `rule-${Date.now()}`,
      active: true,
      templateName: templates.find((t) => t.id === rule.templateId)?.name || 'Sin nombre',
    };
    setRules([...rules, newRule]);
  };

  const handleToggleRule = (id: string, active: boolean) => {
    setRules(rules.map((r) => (r.id === id ? { ...r, active } : r)));
  };

  const handleDeleteRule = (id: string) => {
    setRules(rules.filter((r) => r.id !== id));
  };

  const handleTemplateChange = (template: Template) => {
    const existingIndex = templates.findIndex((t) => t.id === template.id);
    if (existingIndex >= 0) {
      const updatedTemplates = [...templates];
      updatedTemplates[existingIndex] = template;
      setTemplates(updatedTemplates);
    } else {
      setTemplates([...templates, template]);
    }

    setSelectedTemplateId(template.id);
    setPreviewContent(template.content);
    setPreviewChannel(template.channel);
  };

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Automatización</h1>
          <p className="text-muted-foreground mt-1">
            Configura reglas de cobranza y plantillas de mensajes automáticos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6">
          {/* Left Column: Rules */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Reglas de Cobranza</h2>

            <RuleBuilder
              templates={templates}
              onRuleCreate={handleRuleCreate}
            />

            <RuleList
              rules={rules}
              onToggleRule={handleToggleRule}
              onDeleteRule={handleDeleteRule}
            />
          </div>

          {/* Right Column: Templates and Preview */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Plantillas de Mensajes</h2>

            <TemplateEditor
              templates={templates}
              selectedTemplateId={selectedTemplateId}
              onTemplateChange={handleTemplateChange}
            />

            {/* Preview Section */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Vista Previa</h3>
              <MessagePreview
                content={previewContent}
                channel={previewChannel}
                templateName={selectedTemplate?.name}
              />
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
