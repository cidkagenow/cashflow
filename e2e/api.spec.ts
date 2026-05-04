import { test, expect } from '@playwright/test'

test.describe('API Routes', () => {
  test('GET /api/dashboard returns KPIs', async ({ request }) => {
    const res = await request.get('/api/dashboard')
    expect(res.status()).toBe(200)
    const data = await res.json()
    expect(data.kpis).toBeDefined()
    expect(data.kpis.totalPorCobrar).toBeGreaterThan(0)
    expect(data.alerts.overdue).toBeInstanceOf(Array)
    expect(data.alerts.exigible).toBeInstanceOf(Array)
    expect(data.summaryStats).toBeDefined()
    expect(data.analystEffectiveness).toBeInstanceOf(Array)
  })

  test('GET /api/projects returns project list', async ({ request }) => {
    const res = await request.get('/api/projects')
    expect(res.status()).toBe(200)
    const data = await res.json()
    expect(data.length).toBeGreaterThan(0)
    expect(data[0].projectName).toBeDefined()
    expect(data[0].status).toBeDefined()
  })

  test('GET /api/milestones returns milestones with financialStatus', async ({ request }) => {
    const res = await request.get('/api/milestones')
    expect(res.status()).toBe(200)
    const data = await res.json()
    expect(data.length).toBeGreaterThan(0)
    expect(data[0].financialStatus).toBeDefined()
    expect(data[0].responsible).toBeDefined()
  })

  test('GET /api/milestones?status=EnMora filters correctly', async ({ request }) => {
    const res = await request.get('/api/milestones?status=EnMora')
    expect(res.status()).toBe(200)
    const data = await res.json()
    for (const m of data) {
      expect(m.financialStatus).toBe('EnMora')
    }
  })

  test('PATCH /api/milestones/:id validates state transitions', async ({ request }) => {
    const res = await request.patch('/api/milestones/ms-1', {
      data: { financialStatus: 'Pagado', userName: 'test' },
    })
    expect(res.status()).toBe(400)
    const data = await res.json()
    expect(data.error).toContain('Invalid transition')
  })

  test('PATCH /api/milestones/:id allows valid transitions', async ({ request }) => {
    const res = await request.patch('/api/milestones/ms-35', {
      data: { financialStatus: 'Notificado', userName: 'Test User', reason: 'E2E test' },
    })
    expect(res.status()).toBe(200)
    const data = await res.json()
    expect(data.financialStatus).toBe('Notificado')
  })

  test('GET /api/audit returns audit logs', async ({ request }) => {
    const res = await request.get('/api/audit')
    expect(res.status()).toBe(200)
    const data = await res.json()
    expect(data.length).toBeGreaterThan(0)
    expect(data[0].entityType).toBeDefined()
    expect(data[0].action).toBeDefined()
  })

  test('GET /api/deliverables returns deliverables', async ({ request }) => {
    const res = await request.get('/api/deliverables?projectId=proj-4')
    expect(res.status()).toBe(200)
    const data = await res.json()
    expect(data.length).toBeGreaterThan(0)
    expect(data[0].technicalStatus).toBeDefined()
  })

  test('PATCH /api/deliverables/:id validates technical transitions', async ({ request }) => {
    const res = await request.patch('/api/deliverables/del-1', {
      data: { technicalStatus: 'Aprobado', userName: 'test' },
    })
    // del-1 is in EnCurso state, can only go to Terminado
    expect(res.status()).toBe(400)
    const data = await res.json()
    expect(data.error).toContain('Invalid technical transition')
  })

  test('GET /api/reconciliation returns payments', async ({ request }) => {
    const res = await request.get('/api/reconciliation')
    expect(res.status()).toBe(200)
    const data = await res.json()
    expect(data).toBeInstanceOf(Array)
  })

  test('GET /api/clients returns clients', async ({ request }) => {
    const res = await request.get('/api/clients')
    expect(res.status()).toBe(200)
    const data = await res.json()
    expect(data.length).toBeGreaterThan(0)
  })

  test('GET /api/analysts returns analysts', async ({ request }) => {
    const res = await request.get('/api/analysts')
    expect(res.status()).toBe(200)
    const data = await res.json()
    expect(data.length).toBe(5)
  })

  test('PATCH /api/projects/:id validates project transitions', async ({ request }) => {
    const res = await request.patch('/api/projects/proj-3', {
      data: { status: 'Cancelado', userName: 'test' },
    })
    // proj-3 is Finalizado, can't transition
    expect(res.status()).toBe(400)
  })
})
