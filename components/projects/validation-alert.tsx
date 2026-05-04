import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface ValidationAlertProps {
  projectTotal: number
  milestonesTotal: number
  isValid: boolean
}

export function ValidationAlert({
  projectTotal,
  milestonesTotal,
  isValid,
}: ValidationAlertProps) {
  const difference = projectTotal - milestonesTotal
  const percentage = projectTotal > 0 ? (milestonesTotal / projectTotal) * 100 : 0

  return (
    <Card
      className={`p-4 border-2 transition-all ${
        isValid
          ? 'border-emerald-500/30 bg-emerald-500/5'
          : 'border-red-500/30 bg-red-500/5'
      }`}
    >
      <div className="flex items-start gap-3">
        {isValid ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
        )}
        <div className="flex-1">
          <p
            className={`font-semibold text-sm ${
              isValid
                ? 'text-emerald-400'
                : 'text-red-400'
            }`}
          >
            {isValid
              ? 'Validación correcta'
              : 'Validación pendiente'}
          </p>
          <p className={`text-xs mt-1 ${
            isValid
              ? 'text-emerald-400/80'
              : 'text-red-400/80'
          }`}>
            Monto total del proyecto: <span className="font-semibold">${projectTotal.toLocaleString('es-ES')}</span>
            <br />
            Suma de hitos: <span className="font-semibold">${milestonesTotal.toLocaleString('es-ES')}</span> ({percentage.toFixed(1)}%)
            {!isValid && difference !== 0 && (
              <>
                <br />
                Diferencia: <span className="font-semibold">${Math.abs(difference).toLocaleString('es-ES')}</span>
              </>
            )}
          </p>
        </div>
      </div>
    </Card>
  )
}
