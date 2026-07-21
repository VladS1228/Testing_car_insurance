export interface OwnerPayload {
    id?: string;
    name: string;
    birthdate: string;
    year_of_driver_license: number;
    driver_license_cat: string;
    email: string;
}

export function generateOwnerData(overrides?: Partial<OwnerPayload>): OwnerPayload {
    const timestamp = Date.now();
    
    return {
        name: `Auto Owner ${timestamp}`,
        email: `auto_owner_${timestamp}@example.com`,
        birthdate: '1990-05-15',
        year_of_driver_license: 2015,
        driver_license_cat: 'B',
        ...overrides
    };
}