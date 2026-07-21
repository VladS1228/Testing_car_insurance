import { test, expect } from '@playwright/test';

test('license year before birthdate', async ({ page }) => {
  const uniqueId = Date.now();

  // Open the add owner form.
  await page.goto('/');
  await page.getByTestId('add-owner-button').click();

  // Fill valid data everywhere except the license year.
  await page.getByTestId('name-input').fill('Demo Owner');
  await page.getByTestId('birthdate-input').fill('1992-06-29');
  await page.getByTestId('year_of_driver_license-input').fill('1990');
  await page.getByTestId('driver_license_cat-select').selectOption('B');
  await page.getByTestId('email-input').fill(`demo.owner.${uniqueId}@example.com`);

  // Try to save invalid data.
  await page.getByTestId('create-owner-button').click();

  // Check the validation message shown to the user.
  await expect(page.getByTestId('year_of_driver_license-input-error')).toBeVisible();
  await expect(page.getByTestId('year_of_driver_license-input-error')).toHaveText(
    'License year must be after birthdate.'
  );
});
