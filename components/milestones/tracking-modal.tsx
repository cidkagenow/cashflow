'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Calendar, X } from 'lucide-react';

export interface TrackingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  milestoneId: string;
  clientName: string;
  milestoneName: string;
}

const actionTypes = ['Llamada', 'WhatsApp', 'Email', 'Visita'];
const availableTags = [
  '#CompromisoPago',
  '#ClienteNoResponde',
  '#FaltaFirma',
  '#NoContesta',
  '#FueraDeOficina',
  '#DocumentosPendientes',
];
const nextActionOptions = [
  { value: 'none', label: 'Sin programar' },
  { value: 'tomorrow', label: 'Mañana' },
  { value: '3days', label: 'En 3 días' },
  { value: '1week', label: 'En 1 semana' },
  { value: 'custom', label: 'Personalizado' },
];

export function TrackingModal({
  open,
  onOpenChange,
  milestoneId,
  clientName,
  milestoneName,
}: TrackingModalProps) {
  const [actionType, setActionType] = useState('Llamada');
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [nextAction, setNextAction] = useState('none');
  const [scheduledDate, setScheduledDate] = useState('');

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = () => {
    if (!actionType || !comment) {
      alert('Por favor completa Tipo de Acción y Comentario');
      return;
    }

    console.log('[v0] Tracking registered:', {
      milestoneId,
      actionType,
      comment,
      tags: selectedTags,
      nextAction,
      scheduledDate: nextAction === 'custom' ? scheduledDate : nextAction,
    });

    // Reset form
    setActionType('Llamada');
    setComment('');
    setSelectedTags([]);
    setNextAction('none');
    setScheduledDate('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Registrar Seguimiento de Cobranza</DialogTitle>
          <DialogDescription>
            {clientName} • {milestoneName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Action Type */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Tipo de Acción</Label>
            <RadioGroup value={actionType} onValueChange={setActionType}>
              <div className="grid grid-cols-2 gap-3">
                {actionTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <RadioGroupItem value={type} id={type} />
                    <Label htmlFor={type} className="cursor-pointer font-normal">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment" className="text-base font-semibold">
              Comentario / Observación
            </Label>
            <Textarea
              id="comment"
              placeholder="Describe lo que se conversó, acordó o pasó en esta gestión..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-24 resize-none"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Etiquetas (Tags)</Label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Next Action */}
          <div className="space-y-3">
            <Label htmlFor="nextAction" className="text-base font-semibold">
              Próxima Acción
            </Label>
            <select
              id="nextAction"
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm bg-background"
            >
              {nextActionOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Scheduled Date - only show if custom */}
          {nextAction === 'custom' && (
            <div className="space-y-2">
              <Label htmlFor="scheduledDate" className="text-base font-semibold">
                Fecha Programada
              </Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="scheduledDate"
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Guardar Seguimiento</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
