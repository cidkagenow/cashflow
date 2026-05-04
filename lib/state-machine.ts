// ─── Financial States (Milestone) ────────────────────────────────────
export const FINANCIAL_STATES = [
  'Configurado', 'Bloqueado', 'Exigible', 'Notificado', 'EnMora',
  'CompromisoPago', 'PagadoParcial', 'PagoEnRevision', 'PagoObservado',
  'Pagado', 'Conciliado', 'Suspendido',
] as const

export type FinancialStatus = typeof FINANCIAL_STATES[number]

// Valid transitions per spec section 7
const FINANCIAL_TRANSITIONS: Record<string, string[]> = {
  Configurado:     ['Bloqueado', 'Exigible'],
  Bloqueado:       ['Exigible', 'Suspendido'],
  Exigible:        ['Notificado', 'PagoEnRevision', 'Suspendido'],
  Notificado:      ['EnMora', 'CompromisoPago', 'PagoEnRevision', 'Suspendido'],
  EnMora:          ['CompromisoPago', 'PagoEnRevision', 'Suspendido'],
  CompromisoPago:  ['PagoEnRevision', 'EnMora', 'Suspendido'],
  PagadoParcial:   ['PagoEnRevision', 'CompromisoPago', 'EnMora', 'Suspendido'],
  PagoEnRevision:  ['PagoObservado', 'PagadoParcial', 'Pagado'],
  PagoObservado:   ['PagoEnRevision', 'Exigible'],
  Pagado:          ['Conciliado'],
  Conciliado:      [],
  Suspendido:      ['Bloqueado', 'Exigible'],
}

export function canTransition(from: string, to: string): boolean {
  return FINANCIAL_TRANSITIONS[from]?.includes(to) ?? false
}

export function getValidTransitions(from: string): string[] {
  return FINANCIAL_TRANSITIONS[from] ?? []
}

// ─── Technical States (Deliverable) ──────────────────────────────────
export const TECHNICAL_STATES = [
  'Pendiente', 'EnCurso', 'Terminado', 'Observado', 'Subsanacion', 'Aprobado',
] as const

export type TechnicalStatus = typeof TECHNICAL_STATES[number]

const TECHNICAL_TRANSITIONS: Record<string, string[]> = {
  Pendiente:    ['EnCurso'],
  EnCurso:      ['Terminado'],
  Terminado:    ['Observado', 'Aprobado'],
  Observado:    ['Subsanacion'],
  Subsanacion:  ['Terminado'],
  Aprobado:     [],
}

export function canTransitionTechnical(from: string, to: string): boolean {
  return TECHNICAL_TRANSITIONS[from]?.includes(to) ?? false
}

// ─── Project States ──────────────────────────────────────────────────
export const PROJECT_STATES = [
  'Borrador', 'PendienteAdelanto', 'EnCurso', 'Pausado', 'Finalizado', 'Cancelado',
] as const

export type ProjectStatus = typeof PROJECT_STATES[number]

const PROJECT_TRANSITIONS: Record<string, string[]> = {
  Borrador:          ['PendienteAdelanto', 'EnCurso', 'Cancelado'],
  PendienteAdelanto: ['EnCurso', 'Cancelado'],
  EnCurso:           ['Pausado', 'Finalizado', 'Cancelado'],
  Pausado:           ['EnCurso', 'Cancelado'],
  Finalizado:        [],
  Cancelado:         [],
}

export function canTransitionProject(from: string, to: string): boolean {
  return PROJECT_TRANSITIONS[from]?.includes(to) ?? false
}

// ─── States that block automatic collection (spec section 8) ─────────
export const BLOCKED_FROM_COLLECTION = [
  'Configurado', 'Bloqueado', 'Suspendido', 'PagoEnRevision', 'Pagado', 'Conciliado',
]

export function isCollectable(status: string): boolean {
  return !BLOCKED_FROM_COLLECTION.includes(status)
}

// States with active debt (can receive payments)
export const ACTIVE_DEBT_STATES = [
  'Exigible', 'Notificado', 'EnMora', 'CompromisoPago', 'PagadoParcial',
]

export function hasActiveDebt(status: string): boolean {
  return ACTIVE_DEBT_STATES.includes(status)
}
