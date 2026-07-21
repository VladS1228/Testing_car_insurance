import {test, expect} from '@playwright/test';

test('create a car with model field empty', async ({page}) => {
    await page.goto('/');
    await page.getByTestId('view-owner-cars-11111111-1111-1111-1111-111111111111').click();
    await page.getByTestId('add-owner-car-button').click();
    await page.getByTestId('vin-input').fill('1HGCM826330052');
    await page.getByTestId('make-input').fill('Dacia');
    await page.getByTestId('year_of_manufacture-input').fill('2015');
    await page.getByTestId('power-input').fill('120');
    await page.getByTestId('cc-input').fill('1600');
    await page.getByTestId('category-select').selectOption('EURO3');
    await page.getByTestId('create-car-button').click();

    await expect(page.getByTestId('owner-cars-page')).toBeVisible();
});