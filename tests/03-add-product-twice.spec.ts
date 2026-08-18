import { test } from '../core/fixtures/all.fixture';
import testData from '../data/test-data.json';

let token: string | undefined;

test.beforeEach(async ({ apiClient }) => {
  token = undefined;
  const login = await apiClient.login(
    testData.login.username,
    testData.login.password,
  );

  token = login.token;
  await apiClient.clearCart(token);
});

test.afterEach(async ({ apiClient }) => {
  if (!token) return;
  await apiClient.clearCart(token);
});

test('3. Add the same product twice - quantity increments correctly', async ({
  loginPage,
  productsPage,
  cartPage,
}) => {
  const data = testData.scenario3;

  await loginPage.loginSuccessfully(
    testData.login.username,
    testData.login.password,
  );

  for (let i = 0; i < data.quantity; i += 1) {
    await productsPage.addToCart(data.productName);
  }

  await productsPage.expectCartBadge(data.quantity);
  await productsPage.openCart();
  await cartPage.expectItemQuantity(data.productName, data.quantity);
});
