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
          ? 'border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900'
          : 'border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900'
      }`}
    >
      <div className="flex items-start gap-3">
        {isValid ? (
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
        )}
        <div className="flex-1">
          <p
            className={`font-semibold text-sm ${
              isValid
                ? 'text-green-900 dark:text-green-200'
                : 'text-red-900 dark:text-red-200'
            }`}
          >
            {isValid
              ? 'Validación correcta'
              : 'Validación pendiente'}
          </p>
          <p className={`text-xs mt-1 ${
            isValid
              ? 'text-green-800 dark:text-green-300'
              : 'text-red-800 dark:text-red-300'
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
