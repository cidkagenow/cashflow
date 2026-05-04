'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, MessageSquare, FileText, Send } from 'lucide-react';

interface ActivityInputProps {
  onSubmit?: (data: {
    action: 'call' | 'message' | 'payment' | 'reconciliation' | 'note';
    comment: string;
    tags: string[];
  }) => void;
}

export function ActivityInput({ onSubmit }: ActivityInputProps) {
  const [comment, setComment] = useState('');
  const [selectedAction, setSelectedAction] = useState<'call' | 'message' | 'note'>('note');
  const [tags, setTags] = useState('');

  const handleSubmit = () => {
    if (!comment.trim()) return;

    const tagArray = tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t);

    onSubmit?.({
      action: selectedAction,
      comment,
      tags: tagArray,
    });

    setComment('');
    setTags('');
    setSelectedAction('note');
  };

  return (
    <Card className="p-4 mb-6">
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">Tipo de Acción</label>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedAction === 'call' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedAction('call')}
              className="gap-2"
            >
              <Phone className="h-4 w-4" />
              Llamada
            </Button>
            <Button
              variant={selectedAction === 'message' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedAction('message')}
              className="gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              WhatsApp
            </Button>
            <Button
              variant={selectedAction === 'note' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedAction('note')}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              Nota
            </Button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground block mb-2">Comentario</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Describe la acción realizada..."
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            rows={3}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Etiquetas (separadas por coma)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="ej: #ClienteNoResponde, #CompromisoPago"
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!comment.trim()}
          className="w-full gap-2"
        >
          <Send className="h-4 w-4" />
          Registrar Acción
        </Button>
      </div>
    </Card>
  );
}
