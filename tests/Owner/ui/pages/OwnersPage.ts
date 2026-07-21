import {Page,Locator ,expect} from '@playwright/test';
import { ButtonControl } from '../controls/ButtonControl';
import { InputControl } from '../controls/InputControl';
import {SelectControl } from '../controls/SelectControl'
import {UiControl} from '../controls/UiControl'

export class OwnersPage {
    readonly page: Page;
    readonly headerContainer: UiControl;
    readonly tableWrapper: UiControl;
    
    readonly addOwnerBtn: ButtonControl;
    readonly pageSizeDropdown: SelectControl;
    readonly nextPageBtn: ButtonControl;
    readonly prevPageBtn: ButtonControl;
    readonly pageIndicator: Locator;
    
    readonly categoryFilterBtn: ButtonControl;
    readonly categoryFilterPopover: Locator;
    readonly filterCloseBtn: ButtonControl;
    readonly selectAllFilterOpt: UiControl;

    constructor(page: Page) {
        this.page = page;
        this.headerContainer = new UiControl(page.getByTestId('header-container'));
        this.tableWrapper = new UiControl(page.getByTestId('owners-table-wrapper'));
        
        this.addOwnerBtn = new ButtonControl(page.getByTestId('add-owner-button'));
        
        this.pageSizeDropdown = new SelectControl(page.getByTestId('owners-table-page-size'));
        this.nextPageBtn = new ButtonControl(page.getByTestId('owners-table-next-page'));
        this.prevPageBtn = new ButtonControl(page.getByTestId('owners-table-previous-page'));
        this.pageIndicator = page.getByTestId('owners-table-pagination').locator('span');

        this.categoryFilterBtn = new ButtonControl(page.getByTestId('owners-table-filter-driver_license_cat'));
        this.categoryFilterPopover = page.getByTestId('owners-table-filter-driver_license_cat-popover');
        this.selectAllFilterOpt = new ButtonControl(page.getByTestId('owners-table-filter-driver_license_cat-multiselect-select-all'))
        this.filterCloseBtn = new ButtonControl(page.getByTestId('owners-table-filter-driver_license_cat-close'));
    }

    async navigate() {
        await this.page.goto('/');
        await expect(this.tableWrapper.locator || this.page.getByTestId('owners-table-wrapper')).toBeVisible(); 
    }

    async clickAddOwner() {
        await this.addOwnerBtn.click();
    }
//Table manipulation
    async getRowByIndex(index: number): Promise<Locator> {
        return this.page.getByTestId(`owners-table-row-${index}`);
    }

    async clickRow(index: number) {
        const row = await this.getRowByIndex(index);
        await row.click();
    }

    async clickViewCarsForOwner(ownerId: string) {
        const viewBtn = new ButtonControl(this.page.getByTestId(`view-owner-cars-${ownerId}`));
        await viewBtn.click();
    }

    async getCellText(rowIndex: number, columnName: string): Promise<string> {
        return this.page.getByTestId(`owners-table-cell-${rowIndex}-${columnName}`).innerText();
    }

    async openCategoryFilter() {
        await this.categoryFilterBtn.click();
        await expect(this.categoryFilterPopover).toBeVisible();
    }

    async closeCategoryFilter() {
        await this.filterCloseBtn.click();
        await expect(this.categoryFilterPopover).not.toBeVisible();
    }
    
    async selectAllCategories() {
    await this.selectAllFilterOpt.click();
    }

    async selectCategoryFilter(category: string) {
        const option = new UiControl(this.page.getByTestId(`owners-table-filter-driver_license_cat-multiselect-option-${category}`));
        await option.click();
    }
//Pagination
    async setPageSize(size: string) {
        await this.pageSizeDropdown.selectOption(size);
        await this.page.waitForLoadState('networkidle'); 
    }

    async goToNextPage() {
        await this.nextPageBtn.click();
    }

    async goToPreviousPage() {
       await this.prevPageBtn.click();
    }

    async getCurrentPageNumber(): Promise<string> {
        return this.pageIndicator.innerText();
    }

    async getVisibleRowsCount(): Promise<number> {
        return this.page.locator('tbody tr[data-testid^="owners-table-row-"]').count();
    }
}