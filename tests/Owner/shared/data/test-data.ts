export const KNOWN_OWNER_IDS = {
  john: '11111111-1111-1111-1111-111111111111',
  alex: '12121212-1212-1212-1212-121212121212',
  noLicense: '56565656-5656-5656-5656-565656565656',
} as const;

export const KNOWN_CAR_IDS = {
  electricRenault: '57575757-5757-5757-5757-575757575757',
  alexBmw: '1432e54a-9469-4366-937d-1dd56d73ee90',
  alexJiguli: '639db1a8-6359-47d8-bd29-4016eee94949',
} as const;

export function uniqueOwnerData() {
  const id = Date.now();
  return {
    name: `Docs Owner ${id}`,
    birthdate: '1992-06-29',
    licenseYear: '2012',
    email: `docs.owner.${id}@example.com`,
  };
}

export function uniqueCarData() {
  const suffix = String(Date.now()).slice(-7);
  return {
    vin: `JTDBR32E72${suffix}`.slice(0, 17),
    make: 'Toyota',
    model: 'Corolla',
    year: '2024',
    power: '123',
    cc: '2000',
  };
}

export function uniqueClaimData() {
  const id = Date.now();
  return {
    description: `docs-claim-${id}`,
    amount: '123',
  };
}

export function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function isBlankOrNone(value: string) {
  const normalized = value.trim().toUpperCase();
  return normalized === '' || normalized === 'NONE';
}