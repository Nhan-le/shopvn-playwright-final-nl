import { test, expect } from '../core/fixtures/all.fixture';
import testData from '../data/test-data.json';

test('1. Login fails when username and password are both blank', async ({
  page,
  loginPage,
}) => {
  await loginPage.open();
  await loginPage.login('', '');

  await expect(page.getByRole('alert')).toContainText(
    testData.scenario1.errorMessage,
  );
});
