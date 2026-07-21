import { test, expect } from '@playwright/test';

test('owners landing page loads', async ({ page }) => {
  // Open the application using the baseURL from the Playwright config.
  await page.goto('/');

  // Basic check: if this page loads, the app is reachable and ready for deeper tests.
  await expect(page).toHaveURL('/');
  await expect(page.getByRole('heading', { name: 'Owners' })).toBeVisible();
});
