import {test, expect} from '@playwright/test';

test('dark mode goes off when switching pages', async ({page}) => {
    await page.goto('/');
    await page.getByTestId('navbar-theme-toggle').click();
    await expect(page.getByTestId("navbar-theme-toggle")).toContainText("Light mode");
    await page.getByTestId('navbar-item-cars').click();
    await expect(page.getByTestId("navbar-theme-toggle")).toContainText("Dark mode");
});