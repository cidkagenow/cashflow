'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/app-layout';
import { RuleBuilder, AutomationRule } from '@/components/automation/rule-builder';
import { RuleList } from '@/components/automation/rule-list';
import { TemplateEditor, Template } from '@/components/automation/template-editor';
import { MessagePreview } from '@/components/automation/message-preview';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { animateEntrance, animateHoverButtons } from '@/lib/anime-utils';

export default function AutomationPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [rules, setRules] = useState<(AutomationRule & { templateName: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [previewChannel, setPreviewChannel] = useState<'whatsapp' | 'email'>('whatsapp');
  const [previewContent, setPreviewContent] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/automation/templates').then(r => r.json()),
      fetch('/api/automation/rules').then(r => r.json()),
    ]).then(([tmpl, rul]) => {
      setTemplates(tmpl);
      setRules(rul);
      if (tmpl.length > 0) {
        setSelectedTemplateId(tmpl[0].id);
        setPreviewContent(tmpl[0].content);
        setPreviewChannel(tmpl[0].channel);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (loading) return;
    animateEntrance({ title: '.auto-title', subtitle: '.auto-subtitle', sections: '.auto-section' });
    animateHoverButtons();
  }, [loading]);

  const handleRuleCreate = async (rule: Omit<AutomationRule, 'id' | 'active'>) => {
    const res = await fetch('/api/automation/rules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...rule, active: true }),
    });
    const newRule = await res.json();
    setRules([...rules, newRule]);
  };

  const handleToggleRule = async (id: string, active: boolean) => {
    await fetch('/api/automation/rules', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, active }),
    });
    setRules(rules.map((r) => (r.id === id ? { ...r, active } : r)));
  };

  const handleDeleteRule = async (id: string) => {
    await fetch(`/api/automation/rules?id=${id}`, { method: 'DELETE' });
    setRules(rules.filter((r) => r.id !== id));
  };

  const handleTemplateChange = async (template: Template) => {
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

  if (loading) {
    return (
      <AppLayout>
        <div className="p-6 lg:p-8 space-y-6">
          <Skeleton className="h-10 w-48" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-24" />)}</div>
            <div className="space-y-4">{[1,2].map(i => <Skeleton key={i} className="h-48" />)}</div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="auto-title text-3xl font-bold text-foreground">Automatización</h1>
          <p className="auto-subtitle text-muted-foreground mt-1">
            Configura reglas de cobranza y plantillas de mensajes automáticos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6">
          <div className="auto-section space-y-4">
            <h2 className="text-xl font-semibold">Reglas de Cobranza</h2>
            <RuleBuilder templates={templates} onRuleCreate={handleRuleCreate} />
            <RuleList rules={rules} onToggleRule={handleToggleRule} onDeleteRule={handleDeleteRule} />
          </div>

          <div className="auto-section space-y-4">
            <h2 className="text-xl font-semibold">Plantillas de Mensajes</h2>
            <TemplateEditor
              templates={templates}
              selectedTemplateId={selectedTemplateId}
              onTemplateChange={handleTemplateChange}
            />
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
