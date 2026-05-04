import { test, expect } from '@playwright/test'

test.describe('Reconciliation', () => {
  test('loads reconciliation page', async ({ page }) => {
    await page.goto('/reconciliation')
    await expect(page.getByText('Conciliación de Pagos')).toBeVisible({ timeout: 10000 })
  })

  test('displays payment cards', async ({ page }) => {
    await page.goto('/reconciliation')
    await expect(page.getByText(/Pendiente|En revisión/).first()).toBeVisible({ timeout: 10000 })
  })
})
