import {test, expect} from '@playwright/test';

test('NAV-001: Navigation is visible on every main page', async ({page}) => {
    await page.goto('/');
    await expect(page.getByTestId('navbar-logo')).toBeVisible();
    await expect(page.getByTestId('navbar-item-owners')).toBeVisible();
    await expect(page.getByTestId('navbar-item-cars')).toBeVisible();
    await expect(page.getByTestId('navbar-item-about')).toBeVisible();
});

test('NAV-002: "Owners" link opens the owners list page', async ({page}) => {
    await page.goto('/cars');
    await (page.getByTestId('navbar-item-owners')).click();
    await expect(page.getByTestId('owners-table-wrapper')).toBeVisible();
});

test('NAV-003: "Cars" link opens the cars list page', async ({page}) => {
    await page.goto('/');
    await (page.getByTestId('navbar-item-cars')).click();
    await expect(page.getByTestId('cars-table-wrapper')).toBeVisible();
});

test('NAV-004: "About" link opens the about page', async ({page}) => {
    await page.goto('/');
    await (page.getByTestId('navbar-item-about')).click();
    await expect(page.getByTestId('about-page')).toBeVisible();
});

test('NAV-005: The app title stays the same across pages', async ({page}) => {
    await page.goto('/');
    await expect(page.getByTestId('navbar-logo')).toHaveText('Car Policy');
    await page.goto('/cars');
    await await expect(page.getByTestId('navbar-logo')).toHaveText('Car Policy');
    await page.goto('/about');
    await expect(page.getByTestId('navbar-logo')).toHaveText('Car Policy');
});

test('NAV-006: Dark mode toggle is visible on all major pages', async ({page}) => {
    await page.goto('/');
    await expect(page.getByTestId('navbar-theme-toggle')).toBeVisible();
    await page.goto('/cars');
    await expect(page.getByTestId('navbar-theme-toggle')).toBeVisible();
    await page.goto('/about');
    await expect(page.getByTestId('navbar-theme-toggle')).toBeVisible();
});

test('NAV-007: Dark mode toggle changes the theme', async ({page}) => {
    await page.goto('/');
    await page.getByTestId('navbar-theme-toggle').click();
    await expect(page.getByTestId('navbar')).toHaveClass(/sc-bdDsCe bVjhdF/);
    await page.getByTestId('owners-search-input').click();
    await page.getByTestId('owners-search-input').fill('john@example.com');
    await expect(page.getByTestId('owners-table-row-0')).toBeVisible();

    await page.goto('/cars');
    await page.getByTestId('navbar-theme-toggle').click();
    await expect(page.getByTestId('navbar')).toHaveClass(/sc-bdDsCe bVjhdF/);
    await page.getByTestId('view-car-57575757-5757-5757-5757-575757575757').click();
    await expect(page.getByTestId('car-details-page')).toBeVisible();

    await page.goto('/about');
    await page.getByTestId('navbar-theme-toggle').click();
    await expect(page.getByTestId('navbar')).toHaveClass(/sc-bdDsCe bVjhdF/);
});

test('NAV-008: Navigation still works after toggling dark mode', async ({page}) => {
    await page.goto('/');
    await page.getByTestId('navbar-theme-toggle').click();
    await expect(page.getByTestId('navbar')).toHaveClass(/sc-bdDsCe bVjhdF/);
    await page.getByTestId('navbar-item-cars').click();
    await expect(page.getByTestId('navbar')).toHaveClass(/sc-bdDsCe bVjhdF/);
    await page.getByTestId('navbar-item-about').click();
    await expect(page.getByTestId('navbar')).toHaveClass(/sc-bdDsCe bVjhdF/);
    await page.getByTestId('navbar-item-owners').click();
    await expect(page.getByTestId('navbar')).toHaveClass(/sc-bdDsCe bVjhdF/);
});

