import { test as baseTest, expect, APIRequestContext } from '@playwright/test';
import { OwnersPage } from '../pages/OwnersPage';
import { generateOwnerData, OwnerPayload } from '../../shared/data/test-data';

type MyFixtures = {
    ownersPage: OwnersPage;
    uniqueOwner: OwnerPayload;
};

export const test = baseTest.extend<MyFixtures>({

    ownersPage: async ({ page }, use) => {
        const ownersPage = new OwnersPage(page);
        await use(ownersPage);
    },

    uniqueOwner: async ({ request }, use) => {
        const ownerData = generateOwnerData();

        const response = await request.post('/api/owners', {
            data: ownerData
        });

        expect(response.ok()).toBeTruthy();
        const createdOwner = await response.json();
        await use(createdOwner);
    }
});

export { expect };