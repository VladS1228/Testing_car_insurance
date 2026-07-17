import {test, expect} from '@playwright/test';

test('searching owners by "12345678" instead of email', async ({page}) => {
    await page.goto('/');
    await page.getByTestId('owners-search-input').click();
    await page.getByTestId('owners-search-input').fill('12345678');
    await expect(page.getByTestId("owners-table-empty")).toHaveText("No owners found.")
});

//describe
//npx playwright test --project chromium --grep "@(tag-ul)"





