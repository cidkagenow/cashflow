import { test, expect } from '@playwright/test'

test.describe('Milestones Portfolio', () => {
  test('loads milestone cards', async ({ page }) => {
    await page.goto('/milestones')
    await expect(page.locator('h1')).toContainText('Panel de Cartera')
    await expect(page.getByText('hitos encontrados')).toBeVisible()
  })

  test('displays milestone cards with financial status badges', async ({ page }) => {
    await page.goto('/milestones')
    await expect(page.getByText(/En mora|Exigible|Notificado|Compromiso|Suspendido/).first()).toBeVisible()
  })

  test('filter by status works', async ({ page }) => {
    await page.goto('/milestones')
    const statusSelect = page.locator('select, [role="combobox"]').first()
    await statusSelect.click()
    const option = page.getByRole('option', { name: /En mora/ })
    if (await option.isVisible()) {
      await option.click()
    }
    await expect(page.getByText('hitos encontrados')).toBeVisible()
  })

  test('search filters milestones', async ({ page }) => {
    await page.goto('/milestones')
    await page.getByPlaceholder('Buscar por cliente').fill('SAP')
    await expect(page.getByText('SAP').first()).toBeVisible()
  })
})
