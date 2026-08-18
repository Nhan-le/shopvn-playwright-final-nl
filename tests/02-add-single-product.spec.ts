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

test('2. Add a single product to cart - verify quantity and Cart page', async ({
  loginPage,
  productsPage,
  cartPage,
}) => {
  const data = testData.scenario2;

  await loginPage.loginSuccessfully(
    testData.login.username,
    testData.login.password,
  );

  await productsPage.addToCart(data.productName);
  await productsPage.expectCartBadge(data.quantity);
  await productsPage.openCart();

  await cartPage.expectItemQuantity(data.productName, data.quantity);
});
