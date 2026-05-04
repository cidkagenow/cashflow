import { test, expect } from '@playwright/test'

test.describe('Projects', () => {
  test('lists projects with correct data', async ({ page }) => {
    await page.goto('/projects')
    await expect(page.locator('h1')).toContainText('Proyectos')
  })

  test('navigates to project detail', async ({ page }) => {
    await page.goto('/projects')
    const link = page.locator('a[href*="/projects/proj-"]').first()
    await link.click()
    await page.waitForURL(/\/projects\/proj-/)
    await expect(page.getByText(/Entregables|Hitos/)).toBeVisible({ timeout: 10000 })
  })

  test('project detail shows milestones', async ({ page }) => {
    await page.goto('/projects/proj-2')
    await expect(page.getByText(/Pagado|Configurado|Exigible|Conciliado|Pendiente/).first()).toBeVisible({ timeout: 10000 })
  })
})
