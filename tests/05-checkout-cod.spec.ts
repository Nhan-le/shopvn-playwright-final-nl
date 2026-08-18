import { test, expect } from '../core/fixtures/all.fixture';

import type {
  CartItem,
  Order,
  Product,
} from '../core/api/ApiClient';

import testData from '../data/test-data.json';

let token: string | undefined;
let product: Product | undefined;
let createdOrderId: string | undefined;

function toCartItem(productData: Product, quantity: number): CartItem {
  return {
    productId: productData._id,
    name: productData.name,
    price: productData.price,
    quantity,
    emoji: productData.emoji,
  };
}

test.beforeEach(async ({ apiClient }) => {
  token = undefined;
  product = undefined;
  createdOrderId = undefined;

  const login = await apiClient.login(
    testData.login.username,
    testData.login.password,
  );

  token = login.token;

  product = await apiClient.getProductByName(
    token,
    testData.scenario5.productName,
  );

  await apiClient.clearCart(token);

  await apiClient.setCart(token, [
    toCartItem(product, testData.scenario5.quantity),
  ]);
});

test.afterEach(async ({ apiClient }) => {
  if (!token) return;

  await apiClient.clearCart(token);

  if (createdOrderId) {
    await apiClient.deleteOrder(token, createdOrderId);
  }
});

test('5. Checkout succeeds with valid receiver info (COD)', async ({
  page,
  loginPage,
  cartPage,
  checkoutPage,
}) => {
  if (!product) {
    throw new Error('Product setup failed');
  }

  const data = testData.scenario5;
  const expectedTotal = product.price * data.quantity;

  await loginPage.loginSuccessfully(
    testData.login.username,
    testData.login.password,
  );

  // Open cart first so the UI loads the cart created by API setup.
  await cartPage.open();

  // Verify the API-created cart is visible in the UI.
  await cartPage.expectItemQuantity(
    product.name,
    data.quantity,
  );

  // Follow the real user flow: Cart -> Checkout.
  await cartPage.proceedToCheckout();

  await checkoutPage.expectLoaded();

  await checkoutPage.fillReceiver(
    data.recipientName,
    data.recipientPhone,
    data.address,
  );

  await checkoutPage.expectCashSelected();

  const orderResponsePromise = page.waitForResponse(
    (response) =>
      response.url().endsWith('/api/orders') &&
      response.request().method() === 'POST',
  );

  await checkoutPage.submit();

  const orderResponse = await orderResponsePromise;

  expect(orderResponse.status()).toBe(201);

  const createdOrder = (await orderResponse.json()) as Order;

  createdOrderId = createdOrder.id;

  expect(createdOrder.totalPrice).toBe(expectedTotal);
  expect(createdOrder.paymentMethod).toBe(data.paymentMethod);
  expect(createdOrder.recipientName).toBe(data.recipientName);
  expect(createdOrder.recipientPhone).toBe(data.recipientPhone);
  expect(createdOrder.address).toBe(data.address);

  await checkoutPage.expectSuccess(
    data.recipientName,
    data.address,
    expectedTotal,
  );
});