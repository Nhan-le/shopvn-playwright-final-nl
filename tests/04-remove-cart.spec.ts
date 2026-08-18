import { test } from '../core/fixtures/all.fixture';
import type { CartItem } from '../core/api/ApiClient';
import testData from '../data/test-data.json';

let token: string | undefined;

function toCartItem(
  product: { _id: string; name: string; price: number; emoji: string },
  quantity = 1,
): CartItem {
  return {
    productId: product._id,
    name: product.name,
    price: product.price,
    quantity,
    emoji: product.emoji,
  };
}

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

test('4A. Remove item from cart - one item', async ({
  apiClient,
  loginPage,
  cartPage,
}) => {
  if (!token) throw new Error('API setup failed');

  const productName = testData.scenario4.singleProduct;
  const product = await apiClient.getProductByName(token, productName);
  await apiClient.setCart(token, [toCartItem(product)]);

  await loginPage.loginSuccessfully(
    testData.login.username,
    testData.login.password,
  );
  await cartPage.open();
  await cartPage.removeItem(productName);
  await cartPage.expectItemRemoved(productName);
});

test('4B. Remove item from cart - multiple items', async ({
  apiClient,
  loginPage,
  cartPage,
}) => {
  if (!token) throw new Error('API setup failed');

  const [removeName, keepName] = testData.scenario4.multipleProducts;
  const removeProduct = await apiClient.getProductByName(token, removeName);
  const keepProduct = await apiClient.getProductByName(token, keepName);

  await apiClient.setCart(token, [
    toCartItem(removeProduct),
    toCartItem(keepProduct),
  ]);

  await loginPage.loginSuccessfully(
    testData.login.username,
    testData.login.password,
  );
  await cartPage.open();
  await cartPage.removeItem(removeName);

  await cartPage.expectItemRemoved(removeName);
  await cartPage.expectItemVisible(keepName);
});
