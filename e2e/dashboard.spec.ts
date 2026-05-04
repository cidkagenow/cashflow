import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test('loads and displays KPI cards', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('Dashboard Ejecutivo')
    await expect(page.getByText('Monto Total por Cobrar')).toBeVisible()
    await expect(page.getByText('Monto Recuperado')).toBeVisible()
    await expect(page.getByText('Cartera Vencida')).toBeVisible()
    await expect(page.getByText('Tiempo Promedio')).toBeVisible()
  })

  test('displays overdue alerts', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Hitos Urgentes')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'EN MORA' })).toBeVisible()
  })

  test('displays reconciliation section', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Últimas Conciliaciones')).toBeVisible()
  })

  test('displays summary stats', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Proyectos Activos')).toBeVisible()
    await expect(page.getByText('Hitos por Cobrar')).toBeVisible()
    await expect(page.getByText('Tasa de Efectividad')).toBeVisible()
    await expect(page.getByText('Cartera Sana')).toBeVisible()
  })
})
