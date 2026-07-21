import { test, expect } from '../../fixtures/fixtures';
import { generateOwnerData } from '../../../shared/data/test-data';
test.describe('Owner Table Functionality @owners', () => {
    test.beforeEach(async ({ ownersPage }) => {
        await ownersPage.navigate();
    });
    
    test('OWN-LIST-008: Filter by one license category @smoke', async ({ ownersPage }) => {
        await ownersPage.openCategoryFilter();
        await ownersPage.selectCategoryFilter('A');
        await ownersPage.closeCategoryFilter();

        const count = await ownersPage.getVisibleRowsCount();
        for (let i = 0; i < count; i++) {
            const category = await ownersPage.getCellText(i, 'driver_license_cat');
            expect(category).toContain('A');
        }
    });

    test('OWN-LIST-007: Filter by multiple license categories @regression', async ({ ownersPage }) => {
        await ownersPage.openCategoryFilter();
        await ownersPage.selectCategoryFilter('A');
        await ownersPage.selectCategoryFilter('B');
        await ownersPage.closeCategoryFilter();

        const count = await ownersPage.getVisibleRowsCount();
        expect(count).toBeGreaterThan(0);
    });

    test('OWN-LIST-009: Filter by `NONE` license category @regression', async ({ ownersPage }) => {
        await ownersPage.openCategoryFilter();
        await ownersPage.selectCategoryFilter('NONE');
        await ownersPage.closeCategoryFilter();

        const count = await ownersPage.getVisibleRowsCount();
        for (let i = 0; i < count; i++) {
            const category = await ownersPage.getCellText(i, 'driver_license_cat');
            expect(category.trim()).toBe('');
        }
    });

    test('OWN-LIST-010: Select all keeps all categories visible @regression', async ({ ownersPage }) => {
        await ownersPage.setPageSize('100'); 
        
        await ownersPage.openCategoryFilter();
        await ownersPage.selectAllCategories();
        await ownersPage.closeCategoryFilter();

        const count = await ownersPage.getVisibleRowsCount();
        expect(count).toBeGreaterThan(0);
        
        const firstRowName = await ownersPage.getCellText(0, 'name');
        expect(firstRowName.length).toBeGreaterThan(0);
    });
});


test.describe('Owner Navigation and Accessibility @owners', () => {
    test.beforeEach(async ({ ownersPage }) => {
            await ownersPage.navigate();
        });

    test('OWN-LIST-003: "Add Owner" button opens the add owner form @smoke', async ({ page, ownersPage }) => {
        await ownersPage.clickAddOwner();
        await expect(page).toHaveURL(/.*\/owners\/add/);
    });    

    test('OWN-LIST-004: Clicking an owner row opens that owner`s cars page @smoke', async ({ page, ownersPage }) => {
        await ownersPage.clickRow(0);
        await expect(page).toHaveURL(/.*\/owners\/[a-zA-Z0-9-]+\/cars/);
    });

    test('OWN-LIST-005: Clicking `View cars` action opens cars page @regression', async ({ page, ownersPage }) => {
    // Luăm direct primul rând din tabel
    const firstRow = await ownersPage.getRowByIndex(0);
    
    // Căutăm butonul din interiorul celulei de acțiuni a primului rând
    // Folosim o cautare genérica dupa partial match pe data-testid
    const viewBtn = firstRow.locator('[data-testid*="view-owner-cars"]');
    
    await viewBtn.waitFor({ state: 'visible' });
    await viewBtn.click();

    // Validăm schimbarea URL-ului
    await expect(page).toHaveURL(/.*\/owners\/[a-zA-Z0-9-]+\/cars/);
});

    test('OWN-LIST-015: Returning to the owners page from cars page @regression', async ({ page, ownersPage }) => {
        await ownersPage.clickRow(0);
        await expect(page).toHaveURL(/.*\/owners\/[a-zA-Z0-9-]+\/cars/);
        await page.goBack();
        await expect(ownersPage.tableWrapper.locator).toBeVisible();
        await expect(page).not.toHaveURL(/.*\/cars/);
    });

    test('OWN-LIST-016: Accessibility - important controls and table headers @smoke', async ({ ownersPage }) => {
        await expect(ownersPage.pageSizeDropdown.locator).toBeVisible();
        const headers = [
            'owners-table-header-name',
            'owners-table-header-birthdate',
            'owners-table-header-year_of_driver_license',
            'owners-table-header-driver_license_cat',
            'owners-table-header-email',
            'owners-table-header-actions'
        ];
        for (const headerTestId of headers) {
            const headerEl = ownersPage.page.getByTestId(headerTestId);
            await expect(headerEl).toBeVisible();
            const text = await headerEl.innerText();
            expect(text.trim().length).toBeGreaterThan(0);
        }
        await expect(ownersPage.addOwnerBtn.locator).toBeVisible();
    await expect(ownersPage.addOwnerBtn.locator).toBeEnabled();
    });

});

test.describe('Owner Table Pagination @regression', () => {
    
    test.beforeAll(async ({ request }) => {
        for (let i = 0; i < 26; i++) {
            const ownerPayload = generateOwnerData();
            await request.post('/api/owners', {
                data: ownerPayload
            });
        }
    });

    test.beforeEach(async ({ ownersPage }) => {
        await ownersPage.navigate();
    });

    test('OWN-LIST-013: Changing rows-per-page updates visible rows @smoke', async ({ ownersPage }) => {
        // Deoarece am generat 26 de owneri, acum putem verifica exact numărul maxim afișat
        await ownersPage.setPageSize('10');
        let count = await ownersPage.getVisibleRowsCount();
        expect(count).toBe(10); 

        await ownersPage.setPageSize('25');
        count = await ownersPage.getVisibleRowsCount();
        expect(count).toBe(25); 
    });

    test('OWN-LIST-011 & 012: Pagination next and previous @regression', async ({ ownersPage }) => {
        await ownersPage.setPageSize('10');
        
        // Folosim toContain în caz că textul returnat este formatat (ex: "1 of 3")
        const initialPage = await ownersPage.getCurrentPageNumber();
        expect(initialPage).toContain('1');

        await ownersPage.goToNextPage();
        const nextPage = await ownersPage.getCurrentPageNumber();
        expect(nextPage).toContain('2');

        await ownersPage.goToPreviousPage();
        const prevPage = await ownersPage.getCurrentPageNumber();
        expect(prevPage).toContain('1');
    });
});