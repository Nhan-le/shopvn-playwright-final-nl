import { test, expect } from '../core/fixtures/all.fixture';
import testData from '../data/test-data.json';

let token: string | undefined;
let originalName: string | undefined;

test.beforeEach(async ({ apiClient }) => {
  token = undefined;
  originalName = undefined;

  const login = await apiClient.login(
    testData.login.username,
    testData.login.password,
  );
  token = login.token;

  const profile = await apiClient.getProfile(token);
  originalName = profile.name;
});

test.afterEach(async ({ apiClient }) => {
  if (!token || originalName === undefined) return;
  await apiClient.updateProfileName(token, originalName);
});

test('6. Advanced - Update Full Name, then clean up via the API', async ({
  page,
  loginPage,
  profilePage,
}) => {
  if (originalName === undefined) {
    throw new Error('Profile setup failed');
  }

  const newName = testData.scenario6.newName;

  await loginPage.loginSuccessfully(
    testData.login.username,
    testData.login.password,
  );
  await profilePage.openFromHeader();

  const nameFromUi = await profilePage.getFullName();
  expect(nameFromUi).toBe(originalName);

  const updateResponsePromise = page.waitForResponse(
    (response) =>
      response.url().endsWith('/api/profile') &&
      response.request().method() === 'PATCH',
  );

  await profilePage.updateFullName(newName);

  const updateResponse = await updateResponsePromise;
  expect(updateResponse.status()).toBe(200);

  await profilePage.expectFullName(newName);

  await page.reload();
  await profilePage.expectFullName(newName);
});
