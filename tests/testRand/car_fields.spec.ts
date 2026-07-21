import {test, expect} from '@playwright/test';

test('adding a car with all fields empty', async ({page}) => {
    await page.goto('/');
    await page.getByTestId('view-owner-cars-11111111-1111-1111-1111-111111111111').click();
    await page.getByTestId('add-owner-car-button').click();
    await page.getByTestId('create-car-button').click();

    await expect(page.getByTestId('vin-input-error')).toBeVisible();
    await expect(page.getByTestId('year_of_manufacture-input-error')).toBeVisible();
    await expect(page.getByTestId('power-input-error')).toBeVisible();
    await expect(page.getByTestId('cc-input-error')).toBeVisible();


});