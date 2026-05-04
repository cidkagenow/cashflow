import {
  canTransition,
  getValidTransitions,
  canTransitionTechnical,
  canTransitionProject,
  isCollectable,
  hasActiveDebt,
  FINANCIAL_STATES,
  TECHNICAL_STATES,
  PROJECT_STATES,
  BLOCKED_FROM_COLLECTION,
  ACTIVE_DEBT_STATES,
} from '@/lib/state-machine'

// ─── Financial State Machine ────────────────────────────────────────

describe('Financial State Machine', () => {
  describe('FINANCIAL_STATES', () => {
    it('has exactly 12 states', () => {
      expect(FINANCIAL_STATES).toHaveLength(12)
    })

    it('contains all required states', () => {
      const expected = [
        'Configurado', 'Bloqueado', 'Exigible', 'Notificado', 'EnMora',
        'CompromisoPago', 'PagadoParcial', 'PagoEnRevision', 'PagoObservado',
        'Pagado', 'Conciliado', 'Suspendido',
      ]
      for (const state of expected) {
        expect(FINANCIAL_STATES).toContain(state)
      }
    })
  })

  describe('canTransition', () => {
    // Configurado transitions
    it('allows Configurado → Bloqueado', () => {
      expect(canTransition('Configurado', 'Bloqueado')).toBe(true)
    })
    it('allows Configurado → Exigible', () => {
      expect(canTransition('Configurado', 'Exigible')).toBe(true)
    })
    it('rejects Configurado → Pagado', () => {
      expect(canTransition('Configurado', 'Pagado')).toBe(false)
    })
    it('rejects Configurado → Notificado', () => {
      expect(canTransition('Configurado', 'Notificado')).toBe(false)
    })

    // Bloqueado transitions
    it('allows Bloqueado → Exigible', () => {
      expect(canTransition('Bloqueado', 'Exigible')).toBe(true)
    })
    it('allows Bloqueado → Suspendido', () => {
      expect(canTransition('Bloqueado', 'Suspendido')).toBe(true)
    })
    it('rejects Bloqueado → Pagado', () => {
      expect(canTransition('Bloqueado', 'Pagado')).toBe(false)
    })

    // Exigible transitions
    it('allows Exigible → Notificado', () => {
      expect(canTransition('Exigible', 'Notificado')).toBe(true)
    })
    it('allows Exigible → PagoEnRevision', () => {
      expect(canTransition('Exigible', 'PagoEnRevision')).toBe(true)
    })
    it('allows Exigible → Suspendido', () => {
      expect(canTransition('Exigible', 'Suspendido')).toBe(true)
    })
    it('rejects Exigible → EnMora (must go through Notificado)', () => {
      expect(canTransition('Exigible', 'EnMora')).toBe(false)
    })

    // Notificado transitions
    it('allows Notificado → EnMora', () => {
      expect(canTransition('Notificado', 'EnMora')).toBe(true)
    })
    it('allows Notificado → CompromisoPago', () => {
      expect(canTransition('Notificado', 'CompromisoPago')).toBe(true)
    })
    it('allows Notificado → PagoEnRevision', () => {
      expect(canTransition('Notificado', 'PagoEnRevision')).toBe(true)
    })
    it('allows Notificado → Suspendido', () => {
      expect(canTransition('Notificado', 'Suspendido')).toBe(true)
    })

    // EnMora transitions
    it('allows EnMora → CompromisoPago', () => {
      expect(canTransition('EnMora', 'CompromisoPago')).toBe(true)
    })
    it('allows EnMora → PagoEnRevision', () => {
      expect(canTransition('EnMora', 'PagoEnRevision')).toBe(true)
    })
    it('allows EnMora → Suspendido', () => {
      expect(canTransition('EnMora', 'Suspendido')).toBe(true)
    })
    it('rejects EnMora → Exigible (cannot go backwards)', () => {
      expect(canTransition('EnMora', 'Exigible')).toBe(false)
    })

    // CompromisoPago transitions
    it('allows CompromisoPago → PagoEnRevision', () => {
      expect(canTransition('CompromisoPago', 'PagoEnRevision')).toBe(true)
    })
    it('allows CompromisoPago → EnMora (broken commitment)', () => {
      expect(canTransition('CompromisoPago', 'EnMora')).toBe(true)
    })
    it('allows CompromisoPago → Suspendido', () => {
      expect(canTransition('CompromisoPago', 'Suspendido')).toBe(true)
    })

    // PagadoParcial transitions
    it('allows PagadoParcial → PagoEnRevision', () => {
      expect(canTransition('PagadoParcial', 'PagoEnRevision')).toBe(true)
    })
    it('allows PagadoParcial → CompromisoPago', () => {
      expect(canTransition('PagadoParcial', 'CompromisoPago')).toBe(true)
    })
    it('allows PagadoParcial → EnMora', () => {
      expect(canTransition('PagadoParcial', 'EnMora')).toBe(true)
    })
    it('allows PagadoParcial → Suspendido', () => {
      expect(canTransition('PagadoParcial', 'Suspendido')).toBe(true)
    })

    // PagoEnRevision transitions
    it('allows PagoEnRevision → PagoObservado', () => {
      expect(canTransition('PagoEnRevision', 'PagoObservado')).toBe(true)
    })
    it('allows PagoEnRevision → PagadoParcial', () => {
      expect(canTransition('PagoEnRevision', 'PagadoParcial')).toBe(true)
    })
    it('allows PagoEnRevision → Pagado', () => {
      expect(canTransition('PagoEnRevision', 'Pagado')).toBe(true)
    })
    it('rejects PagoEnRevision → Conciliado (must go through Pagado)', () => {
      expect(canTransition('PagoEnRevision', 'Conciliado')).toBe(false)
    })

    // PagoObservado transitions
    it('allows PagoObservado → PagoEnRevision', () => {
      expect(canTransition('PagoObservado', 'PagoEnRevision')).toBe(true)
    })
    it('allows PagoObservado → Exigible', () => {
      expect(canTransition('PagoObservado', 'Exigible')).toBe(true)
    })
    it('rejects PagoObservado → Pagado', () => {
      expect(canTransition('PagoObservado', 'Pagado')).toBe(false)
    })

    // Pagado transitions
    it('allows Pagado → Conciliado', () => {
      expect(canTransition('Pagado', 'Conciliado')).toBe(true)
    })
    it('rejects Pagado → anything else', () => {
      expect(canTransition('Pagado', 'Exigible')).toBe(false)
      expect(canTransition('Pagado', 'EnMora')).toBe(false)
    })

    // Terminal states
    it('rejects all transitions from Conciliado', () => {
      for (const state of FINANCIAL_STATES) {
        expect(canTransition('Conciliado', state)).toBe(false)
      }
    })

    // Suspendido reactivation
    it('allows Suspendido → Bloqueado', () => {
      expect(canTransition('Suspendido', 'Bloqueado')).toBe(true)
    })
    it('allows Suspendido → Exigible', () => {
      expect(canTransition('Suspendido', 'Exigible')).toBe(true)
    })
    it('rejects Suspendido → Pagado', () => {
      expect(canTransition('Suspendido', 'Pagado')).toBe(false)
    })

    // Unknown state
    it('returns false for unknown source state', () => {
      expect(canTransition('Unknown', 'Exigible')).toBe(false)
    })
    it('returns false for unknown target state', () => {
      expect(canTransition('Configurado', 'Unknown')).toBe(false)
    })
  })

  describe('getValidTransitions', () => {
    it('returns correct transitions for Configurado', () => {
      expect(getValidTransitions('Configurado')).toEqual(['Bloqueado', 'Exigible'])
    })
    it('returns empty array for Conciliado (terminal)', () => {
      expect(getValidTransitions('Conciliado')).toEqual([])
    })
    it('returns empty array for Cancelado (terminal)', () => {
      expect(getValidTransitions('Cancelado')).toEqual([])
    })
    it('returns empty array for unknown state', () => {
      expect(getValidTransitions('Unknown')).toEqual([])
    })
    it('returns 4 transitions for Notificado', () => {
      const transitions = getValidTransitions('Notificado')
      expect(transitions).toHaveLength(4)
      expect(transitions).toContain('EnMora')
      expect(transitions).toContain('CompromisoPago')
      expect(transitions).toContain('PagoEnRevision')
      expect(transitions).toContain('Suspendido')
    })
  })

  describe('no self-transitions', () => {
    it('does not allow any state to transition to itself', () => {
      for (const state of FINANCIAL_STATES) {
        expect(canTransition(state, state)).toBe(false)
      }
    })
  })

  describe('happy path: full lifecycle', () => {
    it('supports Configurado → Exigible → Notificado → EnMora → PagoEnRevision → Pagado → Conciliado', () => {
      expect(canTransition('Configurado', 'Exigible')).toBe(true)
      expect(canTransition('Exigible', 'Notificado')).toBe(true)
      expect(canTransition('Notificado', 'EnMora')).toBe(true)
      expect(canTransition('EnMora', 'PagoEnRevision')).toBe(true)
      expect(canTransition('PagoEnRevision', 'Pagado')).toBe(true)
      expect(canTransition('Pagado', 'Conciliado')).toBe(true)
    })

    it('supports partial payment path: PagoEnRevision → PagadoParcial → PagoEnRevision → Pagado', () => {
      expect(canTransition('PagoEnRevision', 'PagadoParcial')).toBe(true)
      expect(canTransition('PagadoParcial', 'PagoEnRevision')).toBe(true)
      expect(canTransition('PagoEnRevision', 'Pagado')).toBe(true)
    })

    it('supports suspension and reactivation: Exigible → Suspendido → Exigible', () => {
      expect(canTransition('Exigible', 'Suspendido')).toBe(true)
      expect(canTransition('Suspendido', 'Exigible')).toBe(true)
    })

    it('supports observed payment path: PagoEnRevision → PagoObservado → PagoEnRevision → Pagado', () => {
      expect(canTransition('PagoEnRevision', 'PagoObservado')).toBe(true)
      expect(canTransition('PagoObservado', 'PagoEnRevision')).toBe(true)
      expect(canTransition('PagoEnRevision', 'Pagado')).toBe(true)
    })
  })
})

// ─── Technical State Machine ────────────────────────────────────────

describe('Technical State Machine', () => {
  describe('TECHNICAL_STATES', () => {
    it('has exactly 6 states', () => {
      expect(TECHNICAL_STATES).toHaveLength(6)
    })
  })

  describe('canTransitionTechnical', () => {
    it('allows Pendiente → EnCurso', () => {
      expect(canTransitionTechnical('Pendiente', 'EnCurso')).toBe(true)
    })
    it('allows EnCurso → Terminado', () => {
      expect(canTransitionTechnical('EnCurso', 'Terminado')).toBe(true)
    })
    it('allows Terminado → Observado', () => {
      expect(canTransitionTechnical('Terminado', 'Observado')).toBe(true)
    })
    it('allows Terminado → Aprobado', () => {
      expect(canTransitionTechnical('Terminado', 'Aprobado')).toBe(true)
    })
    it('allows Observado → Subsanacion', () => {
      expect(canTransitionTechnical('Observado', 'Subsanacion')).toBe(true)
    })
    it('allows Subsanacion → Terminado', () => {
      expect(canTransitionTechnical('Subsanacion', 'Terminado')).toBe(true)
    })

    it('rejects Aprobado → anything (terminal)', () => {
      for (const state of TECHNICAL_STATES) {
        expect(canTransitionTechnical('Aprobado', state)).toBe(false)
      }
    })

    it('rejects skipping states: Pendiente → Terminado', () => {
      expect(canTransitionTechnical('Pendiente', 'Terminado')).toBe(false)
    })
    it('rejects backwards: Terminado → EnCurso', () => {
      expect(canTransitionTechnical('Terminado', 'EnCurso')).toBe(false)
    })
    it('rejects Observado → Aprobado (must go through Subsanacion → Terminado)', () => {
      expect(canTransitionTechnical('Observado', 'Aprobado')).toBe(false)
    })

    it('supports observation cycle: Terminado → Observado → Subsanacion → Terminado → Aprobado', () => {
      expect(canTransitionTechnical('Terminado', 'Observado')).toBe(true)
      expect(canTransitionTechnical('Observado', 'Subsanacion')).toBe(true)
      expect(canTransitionTechnical('Subsanacion', 'Terminado')).toBe(true)
      expect(canTransitionTechnical('Terminado', 'Aprobado')).toBe(true)
    })
  })
})

// ─── Project State Machine ──────────────────────────────────────────

describe('Project State Machine', () => {
  describe('PROJECT_STATES', () => {
    it('has exactly 6 states', () => {
      expect(PROJECT_STATES).toHaveLength(6)
    })
  })

  describe('canTransitionProject', () => {
    it('allows Borrador → PendienteAdelanto', () => {
      expect(canTransitionProject('Borrador', 'PendienteAdelanto')).toBe(true)
    })
    it('allows Borrador → EnCurso', () => {
      expect(canTransitionProject('Borrador', 'EnCurso')).toBe(true)
    })
    it('allows Borrador → Cancelado', () => {
      expect(canTransitionProject('Borrador', 'Cancelado')).toBe(true)
    })
    it('allows PendienteAdelanto → EnCurso', () => {
      expect(canTransitionProject('PendienteAdelanto', 'EnCurso')).toBe(true)
    })
    it('allows PendienteAdelanto → Cancelado', () => {
      expect(canTransitionProject('PendienteAdelanto', 'Cancelado')).toBe(true)
    })
    it('allows EnCurso → Pausado', () => {
      expect(canTransitionProject('EnCurso', 'Pausado')).toBe(true)
    })
    it('allows EnCurso → Finalizado', () => {
      expect(canTransitionProject('EnCurso', 'Finalizado')).toBe(true)
    })
    it('allows EnCurso → Cancelado', () => {
      expect(canTransitionProject('EnCurso', 'Cancelado')).toBe(true)
    })
    it('allows Pausado → EnCurso', () => {
      expect(canTransitionProject('Pausado', 'EnCurso')).toBe(true)
    })
    it('allows Pausado → Cancelado', () => {
      expect(canTransitionProject('Pausado', 'Cancelado')).toBe(true)
    })

    // Terminal states
    it('rejects all transitions from Finalizado', () => {
      for (const state of PROJECT_STATES) {
        expect(canTransitionProject('Finalizado', state)).toBe(false)
      }
    })
    it('rejects all transitions from Cancelado', () => {
      for (const state of PROJECT_STATES) {
        expect(canTransitionProject('Cancelado', state)).toBe(false)
      }
    })

    // Invalid transitions
    it('rejects Borrador → Finalizado', () => {
      expect(canTransitionProject('Borrador', 'Finalizado')).toBe(false)
    })
    it('rejects Borrador → Pausado', () => {
      expect(canTransitionProject('Borrador', 'Pausado')).toBe(false)
    })
    it('rejects Pausado → Finalizado (must resume first)', () => {
      expect(canTransitionProject('Pausado', 'Finalizado')).toBe(false)
    })
  })
})

// ─── Collection & Debt Helpers ──────────────────────────────────────

describe('isCollectable', () => {
  it('returns false for states blocked from collection', () => {
    for (const state of BLOCKED_FROM_COLLECTION) {
      expect(isCollectable(state)).toBe(false)
    }
  })

  it('returns true for active collection states', () => {
    const collectableStates = ['Exigible', 'Notificado', 'EnMora', 'CompromisoPago', 'PagadoParcial', 'PagoObservado']
    for (const state of collectableStates) {
      expect(isCollectable(state)).toBe(true)
    }
  })
})

describe('hasActiveDebt', () => {
  it('returns true for states with active debt', () => {
    for (const state of ACTIVE_DEBT_STATES) {
      expect(hasActiveDebt(state)).toBe(true)
    }
  })

  it('returns false for non-debt states', () => {
    const noDebt = ['Configurado', 'Bloqueado', 'PagoEnRevision', 'PagoObservado', 'Pagado', 'Conciliado', 'Suspendido']
    for (const state of noDebt) {
      expect(hasActiveDebt(state)).toBe(false)
    }
  })
})
