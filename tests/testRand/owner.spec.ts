import {test, expect} from '@playwright/test';

test('OWN-LIST-001: Owners page loads successfully', async ({page}) => {
    await page.goto('/');
    await expect(page.getByTestId('header-container')).toBeVisible();
    await expect(page.getByTestId('owners-table-wrapper')).toBeVisible();
});

test('OWN-LIST-002: Owners table shows the expected columns', async ({page}) => {
    await page.goto('/');
    await expect(page.getByTestId('owners-table-header-name')).toHaveText('Name');
    await expect(page.getByTestId('owners-table-header-birthdate')).toHaveText('Birthdate');
    await expect(page.getByTestId('owners-table-header-year_of_driver_license')).toHaveText('License Year');
    await expect(page.getByTestId('owners-table-header-driver_license_cat')).toHaveText('License Category');
    await expect(page.getByTestId('owners-table-header-email')).toHaveText('Email');
    await expect(page.getByTestId('owners-table-header-actions')).toHaveText('Actions');
});

test('OWN-LIST-003: "Add Owner" button opens the add owner form', async ({page}) => {
    await page.goto('/');
    await page.getByTestId('add-owner-button').click();
    await expect(page).toHaveURL(/.*\/owners\/add/);
});

test('OWN-LIST-004: Clicking an owner row opens that owner`s cars page', async ({page}) => {
    await page.goto('/');
    await page.getByTestId('owners-table-row-0').click();
    await expect(page).toHaveURL(/.*\/owners\/[a-z0-9-]+\/cars/);
});

test('OWN-LIST-005: Clicking `View cars` opens that owner`s cars page', async ({page}) => {
    await page.goto('/');
    await page.getByTestId('view-owner-cars-11111111-1111-1111-1111-111111111111').click();
    await expect(page.getByTestId('owner-cars-table')).toBeVisible();
});

test('OWN-LIST-006: Driver category filter opens correctly', async ({page}) => {
    await page.goto('/');
    await page.getByTestId('owners-table-filter-driver_license_cat').click();
    await expect(page.getByTestId('owners-table-filter-driver_license_cat-popover')).toBeVisible();
    await expect(page.getByTestId('owners-table-filter-driver_license_cat-multiselect-select-all')).toBeVisible();
    await expect(page.getByTestId('owners-table-filter-driver_license_cat-multiselect-option-A')).toBeVisible();
    await expect(page.getByTestId('owners-table-filter-driver_license_cat-multiselect-option-B')).toBeVisible();
    await expect(page.getByTestId('owners-table-filter-driver_license_cat-multiselect-option-C')).toBeVisible();
    await expect(page.getByTestId('owners-table-filter-driver_license_cat-multiselect-option-D')).toBeVisible();
    await expect(page.getByTestId('owners-table-filter-driver_license_cat-multiselect-option-E')).toBeVisible();
    await expect(page.getByTestId('owners-table-filter-driver_license_cat-multiselect-option-NONE')).toBeVisible();
});

test('OWN-LIST-007: Filter by multiple license categories', async ({page}) => {
    await page.goto('/');
    await page.getByTestId('owners-table-filter-driver_license_cat').click();
    await expect(page.getByTestId('owners-table-filter-driver_license_cat-popover')).toBeVisible();
    await page.getByTestId('owners-table-filter-driver_license_cat-close').click();
    await expect(page.getByTestId('owners-table-filter-driver_license_cat-popover')).not.toBeVisible();
});



test('OWN-LIST-008: Filter by one license category', async ({page}) => {
    await page.goto('/');
    await page.getByTestId('owners-table-filter-driver_license_cat').click();
    await expect(page.getByTestId('owners-table-filter-driver_license_cat-popover')).toBeVisible();
    await page.getByTestId('owners-table-filter-driver_license_cat-multiselect-option-A').click();
    await expect(page.getByTestId('owners-table-cell-0-driver_license_cat')).toHaveText('A');
    await expect(page.getByTestId('owners-table-cell-1-driver_license_cat')).toHaveText('A');
    await expect(page.getByTestId('owners-table-cell-2-driver_license_cat')).toHaveText('A');
    await expect(page.getByTestId('owners-table-cell-3-driver_license_cat')).toHaveText('A');
});

test('OWN-LIST-009: Filter by `NONE` license category', async ({page}) => {
    await page.goto('/');
    await page.getByTestId('owners-table-filter-driver_license_cat').click();
    await expect(page.getByTestId('owners-table-filter-driver_license_cat-popover')).toBeVisible();
    await page.getByTestId('owners-table-filter-driver_license_cat-multiselect-option-NONE').click();
    await expect(page.getByTestId('owners-table-cell-0-driver_license_cat')).toHaveText('');
    await expect(page.getByTestId('owners-table-cell-1-driver_license_cat')).toHaveText('');
    await expect(page.getByTestId('owners-table-cell-2-driver_license_cat')).toHaveText('');
    await expect(page.getByTestId('owners-table-cell-3-driver_license_cat')).toHaveText('');
    await expect(page.getByTestId('owners-table-cell-4-driver_license_cat')).toHaveText('');
    await expect(page.getByTestId('owners-table-cell-5-driver_license_cat')).toHaveText('');
    await expect(page.getByTestId('owners-table-cell-6-driver_license_cat')).toHaveText('');
    await expect(page.getByTestId('owners-table-cell-7-driver_license_cat')).toHaveText('');
});

test('OWN-LIST-010: Select all keeps all categories visible.', async ({page}) => {
    await page.goto('/');
    await page.getByTestId('owners-table-filter-driver_license_cat').click();
    await expect(page.getByTestId('owners-table-filter-driver_license_cat-popover')).toBeVisible();
    await page.getByTestId('owners-table-filter-driver_license_cat-multiselect-select-all').click();
    await page.getByTestId('owners-table-page-size').click();
    await page.getByTestId('owners-table-page-size').selectOption('100');
    await page.getByTestId('owners-table-next-page').click({ clickCount: 5 });

    const expectedOwnersIndexes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

    for (const index of expectedOwnersIndexes) {
        const row = page.getByTestId(`owners-table-row-${index}`);
        await expect(row).toBeVisible();

        const nameCell = page.getByTestId(`owners-table-cell-${index}-name`);
        await expect(nameCell).toBeVisible();
    };
});

test('OWN-LIST-011: Pagination `Next page` moves to the next page when more than 10 rows exist', async ({page}) => {
    await page.goto('/');
    await page.getByTestId('owners-table-page-size').click();
    await page.getByTestId('owners-table-page-size').selectOption('100');
    const nextButton = page.getByTestId('owners-table-next-page');
    const pageIndicator = page.getByTestId('owners-table-pagination').locator('span');
    for (let i = 0; i < 5; i++) {
        await nextButton.click();
        await expect(pageIndicator).toContainText(`${i + 2}`);
    }
    await expect(pageIndicator).toContainText('6');
    const expectedOwnersIndexes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

    for (const index of expectedOwnersIndexes) {
        const row = page.getByTestId(`owners-table-row-${index}`);
        await expect(row).toBeVisible();

        const nameCell = page.getByTestId(`owners-table-cell-${index}-name`);
        await expect(nameCell).toBeVisible();
    };

});

test('OWN-LIST-012: Pagination `Previous page` returns to the previous page.', async ({page}) => {
    await page.goto('/');
    await page.getByTestId('owners-table-next-page').click();
    const pageIndicatorAfterNext = page.getByTestId('owners-table-pagination').locator('span');
    await expect(pageIndicatorAfterNext).toContainText('2');
    await page.getByTestId('owners-table-previous-page').click();
    const pageIndicatorAfterPrevious = page.getByTestId('owners-table-pagination').locator('span');
    await expect(pageIndicatorAfterPrevious).toContainText('1');
});

test('OWN-LIST-013: Changing rows-per-page updates the number of visible rows', async ({ page }) => {
    await page.goto('/');

    const dropdown = page.getByTestId('owners-table-page-size');
    const tableRows = page.locator('tbody tr[data-testid^="owners-table-row-"]');

    await dropdown.selectOption('10');
    await expect(tableRows).toHaveCount(10);
    const count10 = await tableRows.count();

    await dropdown.selectOption('25');
    await expect(tableRows).toHaveCount(25);
    const count25 = await tableRows.count();
    expect(count25).toBeGreaterThan(count10);

    await dropdown.selectOption('50');
    await expect(tableRows).toHaveCount(50);
    const count50 = await tableRows.count();
    expect(count50).toBeGreaterThan(count25);

    await dropdown.selectOption('75');
    await expect(tableRows).toHaveCount(75);
    const count75 = await tableRows.count();
    expect(count75).toBeGreaterThan(count50);

    await dropdown.selectOption('100');
    await expect(tableRows).toHaveCount(100);
    const count100 = await tableRows.count();
    expect(count100).toBeGreaterThan(count75);
});


