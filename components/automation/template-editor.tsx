'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save } from 'lucide-react';
import { VariableSelector, TEMPLATE_VARIABLES } from './variable-selector';

export interface Template {
  id: string;
  name: string;
  content: string;
  channel: 'whatsapp' | 'email';
}

interface TemplateEditorProps {
  templates: Template[];
  selectedTemplateId?: string;
  onTemplateChange: (template: Template) => void;
}

export function TemplateEditor({
  templates,
  selectedTemplateId,
  onTemplateChange,
}: TemplateEditorProps) {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [channel, setChannel] = useState<'whatsapp' | 'email'>('whatsapp');
  const [selectedTemplate, setSelectedTemplate] = useState<string>(selectedTemplateId || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load template when selected
  const handleSelectTemplate = (id: string) => {
    setSelectedTemplate(id);
    const template = templates.find((t) => t.id === id);
    if (template) {
      setName(template.name);
      setContent(template.content);
      setChannel(template.channel);
    }
  };

  const handleInsertVariable = (variable: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = content.substring(0, start);
    const after = content.substring(end);
    const newContent = before + variable + after;

    setContent(newContent);

    // Focus and set cursor after variable
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + variable.length, start + variable.length);
    }, 0);
  };

  const handleSave = () => {
    if (!name.trim() || !content.trim()) return;

    const newTemplate: Template = {
      id: selectedTemplate || `tmpl-${Date.now()}`,
      name,
      content,
      channel,
    };

    onTemplateChange(newTemplate);
    
    // Reset form
    setName('');
    setContent('');
    setChannel('whatsapp');
    setSelectedTemplate('');
  };

  const charLimit = channel === 'whatsapp' ? 160 : Infinity;
  const charCount = content.length;
  const isOverLimit = charCount > charLimit;

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Editor de Plantillas</h3>

        {/* Template Selector */}
        <div className="mb-4">
          <label className="text-sm font-medium text-foreground block mb-2">
            Plantilla Existente
          </label>
          <Select value={selectedTemplate} onValueChange={handleSelectTemplate}>
            <SelectTrigger>
              <SelectValue placeholder="Crear nueva plantilla" />
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

        {/* Template Name */}
        <div className="mb-4">
          <label className="text-sm font-medium text-foreground block mb-2">
            Nombre de Plantilla
          </label>
          <Input
            placeholder="Ej: Recordatorio Suave"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Channel Selector */}
        <div className="mb-4">
          <label className="text-sm font-medium text-foreground block mb-2">
            Canal
          </label>
          <div className="flex gap-2">
            {[
              { value: 'whatsapp', label: 'WhatsApp (160 caracteres)' },
              { value: 'email', label: 'Email (sin límite)' },
            ].map((ch) => (
              <button
                key={ch.value}
                onClick={() => setChannel(ch.value as 'whatsapp' | 'email')}
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

        {/* Content Editor */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-foreground">Contenido</label>
            <span
              className={`text-xs ${
                isOverLimit ? 'text-destructive font-semibold' : 'text-muted-foreground'
              }`}
            >
              {charCount}/{charLimit === Infinity ? '∞' : charLimit}
            </span>
          </div>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribe tu plantilla. Usa {{variable}} para insertar datos dinámicos."
            className={`w-full h-40 p-3 border rounded-md bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary ${
              isOverLimit ? 'border-destructive' : 'border-border'
            }`}
          />
          {isOverLimit && (
            <p className="text-xs text-destructive mt-1">
              Excedes el límite de caracteres para WhatsApp por {charCount - charLimit} caracteres
            </p>
          )}
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={!name.trim() || !content.trim()}
          className="w-full gap-2"
        >
          <Save className="h-4 w-4" />
          Guardar Plantilla
        </Button>
      </Card>

      {/* Variable Selector */}
      <VariableSelector onInsertVariable={handleInsertVariable} />
    </div>
  );
}
