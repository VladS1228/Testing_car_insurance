import { test, expect, type APIRequestContext, type APIResponse } from '@playwright/test';

const API_TEST_TIMEOUT_MS = 30_000;
const API_REQUEST_TIMEOUT_MS = 15_000;

type OwnerPayload = {
  name: string;
  birthdate: string;
  year_of_driver_license: number;
  driver_license_cat: string;
  email: string;
};

function logData(label: string, data: unknown) {
  console.log(`\n[${label}]`);
  console.log(JSON.stringify(data, null, 2));
}

async function logResponse(label: string, response: APIResponse) {
  const text = await response.text();

  console.log(`\n[${label}]`);
  console.log(`status=${response.status()}`);
  console.log(`ok=${response.ok()}`);
  console.log(`url=${response.url()}`);
  console.log('body=');
  console.log(text || '<empty>');
}

async function readJson<T>(response: APIResponse): Promise<T> {
  return (await response.json()) as T;
}

async function createOwner(request: APIRequestContext, overrides: Partial<OwnerPayload> = {}) {
  const uniqueId = Date.now();
  const payload: OwnerPayload = {
    name: 'Api Owner',
    birthdate: '1992-06-29',
    year_of_driver_license: 2012,
    driver_license_cat: 'B',
    email: `api.owner.${uniqueId}@example.com`,
    ...overrides,
  };

  logData('POST /api/owners request payload', payload);
  const response = await request.post('/api/owners', {
    data: payload,
    timeout: API_REQUEST_TIMEOUT_MS,
  });
  await logResponse('POST /api/owners response', response);
  expect(response.status()).toBe(201);

  const body = await readJson<{ id: string }>(response);
  return { id: body.id, payload };
}

test.describe('API examples', () => {
  test.describe.configure({ timeout: API_TEST_TIMEOUT_MS });
  test.skip(({ browserName }) => browserName !== 'chromium', 'API examples run once in the chromium project.');

  test('GET example: health endpoint returns ok', async ({ request }) => {
    const response = await request.get('/health', { timeout: API_REQUEST_TIMEOUT_MS });
    await logResponse('GET /health response', response);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const body = await readJson<{ status?: string }>(response);
    expect(body.status).toBe('ok');
  });

  test('POST example: create owner', async ({ request }) => {
    const { id, payload } = await createOwner(request);

    const getResponse = await request.get(`/api/owners/${id}`, { timeout: API_REQUEST_TIMEOUT_MS });
    await logResponse(`GET /api/owners/${id} response`, getResponse);
    expect(getResponse.status()).toBe(200);

    const owner = await readJson<{ id: string; email?: string; name?: string }>(getResponse);
    expect(owner.id).toBe(id);
    expect(owner.email).toBe(payload.email);
    expect(owner.name).toBe(payload.name);

    const deleteResponse = await request.delete(`/api/owners/${id}`, { timeout: API_REQUEST_TIMEOUT_MS });
    await logResponse(`DELETE /api/owners/${id} cleanup response`, deleteResponse);
  });

  test('PATCH example: update owner email', async ({ request }) => {
    const { id } = await createOwner(request);
    const updatedEmail = `api.updated.${Date.now()}@example.com`;

    logData(`PATCH /api/owners/${id} request payload`, { email: updatedEmail });
    const patchResponse = await request.patch(`/api/owners/${id}`, {
      data: { email: updatedEmail },
      timeout: API_REQUEST_TIMEOUT_MS,
    });
    await logResponse(`PATCH /api/owners/${id} response`, patchResponse);
    expect(patchResponse.status()).toBe(200);

    const getResponse = await request.get(`/api/owners/${id}`, { timeout: API_REQUEST_TIMEOUT_MS });
    await logResponse(`GET /api/owners/${id} response`, getResponse);
    expect(getResponse.status()).toBe(200);

    const owner = await readJson<{ email?: string }>(getResponse);
    expect(owner.email).toBe(updatedEmail);

    const deleteResponse = await request.delete(`/api/owners/${id}`, { timeout: API_REQUEST_TIMEOUT_MS });
    await logResponse(`DELETE /api/owners/${id} cleanup response`, deleteResponse);
  });

  test('DELETE example: remove owner', async ({ request }) => {
    const { id } = await createOwner(request);

    const deleteResponse = await request.delete(`/api/owners/${id}`, { timeout: API_REQUEST_TIMEOUT_MS });
    await logResponse(`DELETE /api/owners/${id} response`, deleteResponse);
    expect(deleteResponse.status()).toBe(204);

    const getResponse = await request.get(`/api/owners/${id}`, { timeout: API_REQUEST_TIMEOUT_MS });
    await logResponse(`GET /api/owners/${id} after delete response`, getResponse);
    expect(getResponse.status()).toBe(404);
  });
});