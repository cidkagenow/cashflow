'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const TEMPLATE_VARIABLES = [
  { variable: '{{nombre_cliente}}', example: 'Juan García', category: 'Cliente' },
  { variable: '{{monto_hito}}', example: '45,000 USD', category: 'Hito' },
  { variable: '{{fecha_vencimiento}}', example: '15 de mayo 2024', category: 'Fechas' },
  { variable: '{{dias_mora}}', example: '5 días', category: 'Fechas' },
  { variable: '{{proyecto}}', example: 'Transformación Digital', category: 'Proyecto' },
  { variable: '{{hito}}', example: 'Implementación - Fase 1', category: 'Hito' },
  { variable: '{{numero_referencia}}', example: 'REF-2024-5421', category: 'Referencia' },
  { variable: '{{email_contacto}}', example: 'contacto@empresa.com', category: 'Contacto' },
];

interface VariableSelectorProps {
  onInsertVariable: (variable: string) => void;
}

export function VariableSelector({ onInsertVariable }: VariableSelectorProps) {
  const categories = Array.from(new Set(TEMPLATE_VARIABLES.map((v) => v.category)));

  return (
    <Card className="p-4">
      <h4 className="text-sm font-semibold mb-3">Variables Disponibles</h4>
      <div className="space-y-3">
        {categories.map((category) => (
          <div key={category}>
            <p className="text-xs font-medium text-muted-foreground mb-2">{category}</p>
            <div className="flex flex-wrap gap-2">
              {TEMPLATE_VARIABLES.filter((v) => v.category === category).map((v) => (
                <Button
                  key={v.variable}
                  size="sm"
                  variant="outline"
                  onClick={() => onInsertVariable(v.variable)}
                  title={`Ejemplo: ${v.example}`}
                  className="text-xs"
                >
                  {v.variable}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
