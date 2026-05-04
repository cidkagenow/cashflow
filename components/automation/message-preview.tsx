'use client';

import { TEMPLATE_VARIABLES } from './variable-selector';

interface MessagePreviewProps {
  content: string;
  channel: 'whatsapp' | 'email';
  templateName?: string;
}

export function MessagePreview({ content, channel, templateName }: MessagePreviewProps) {
  let previewContent = content;
  TEMPLATE_VARIABLES.forEach((v) => {
    previewContent = previewContent.replace(new RegExp(v.variable, 'g'), v.example);
  });

  if (channel === 'whatsapp') {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-xs bg-black rounded-3xl p-3 shadow-2xl">
          <div className="bg-black rounded-b-3xl h-6 mx-auto w-3/5 mb-1" />
          <div className="bg-gradient-to-br from-emerald-900/40 to-emerald-950/60 rounded-2xl overflow-hidden flex flex-col h-96">
            <div className="bg-emerald-600 text-white p-3 text-sm font-semibold">
              <p className="truncate">{templateName || 'Vista Previa'}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
              <div className="flex justify-start">
                <div className="bg-secondary text-foreground rounded-2xl rounded-tl-none px-3 py-2 text-sm max-w-xs shadow-sm">
                  <p className="text-xs text-muted-foreground">Vista previa del mensaje</p>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-emerald-600 text-white rounded-2xl rounded-tr-none px-3 py-2 text-sm max-w-xs shadow-sm">
                  <p className="whitespace-pre-wrap text-xs">{previewContent}</p>
                </div>
              </div>
            </div>
            <div className="bg-secondary/50 p-2 flex gap-2 items-center border-t border-border">
              <div className="flex-1 bg-secondary rounded-full px-3 py-2 text-xs text-muted-foreground">
                Escribe un mensaje...
              </div>
              <button className="text-emerald-500 text-xl">⏩</button>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">{content.length} / 160 caracteres</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
        <div className="bg-secondary p-4 border-b border-border">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">De:</span>
              <span className="font-medium text-foreground">IASSAT PayFlow &lt;noreply@iassat.com&gt;</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Para:</span>
              <span className="font-medium text-foreground">cliente@empresa.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Asunto:</span>
              <span className="font-medium text-foreground">{templateName || 'Notificación'}</span>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{previewContent}</div>
          <div className="border-t border-border pt-4 mt-4">
            <p className="text-xs text-muted-foreground">
              IASSAT PayFlow<br />
              Sistema de Gestión de Cobranzas<br />
              contacto@iassat.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
