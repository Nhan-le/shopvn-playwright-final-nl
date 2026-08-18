import { test } from '../core/fixtures/all.fixture';
import type {
  CartItem,
  Order,
  Product,
} from '../core/api/ApiClient';
import testData from '../data/test-data.json';

let token: string | undefined;
let createdOrder: Order | undefined;

function toOrderItem(product: Product, quantity: number): CartItem {
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
  createdOrder = undefined;

  const login = await apiClient.login(
    testData.login.username,
    testData.login.password,
  );
  token = login.token;

  const products = await apiClient.getProducts(token);
  const items = testData.scenario7.products.map((dataItem) => {
    const product = products.find((item) => item.name === dataItem.name);

    if (!product) {
      throw new Error(`Product not found: ${dataItem.name}`);
    }

    return toOrderItem(product, dataItem.quantity);
  });

  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  createdOrder = await apiClient.createOrder(token, {
    items,
    recipientName: testData.scenario7.recipientName,
    recipientPhone: testData.scenario7.recipientPhone,
    address: testData.scenario7.address,
    paymentMethod: testData.scenario7.paymentMethod as 'cash',
    paymentIntentId: null,
    totalPrice,
  });
});

test.afterEach(async ({ apiClient }) => {
  if (!token || !createdOrder) return;
  await apiClient.deleteOrder(token, createdOrder.id);
});

test('7. Advanced - Verify Orders page with an order seeded via API', async ({
  loginPage,
  ordersPage,
}) => {
  if (!createdOrder) {
    throw new Error('Order setup failed');
  }

  await loginPage.loginSuccessfully(
    testData.login.username,
    testData.login.password,
  );
  await ordersPage.open();

  await ordersPage.expectOrderVisible(createdOrder.id);
  await ordersPage.expectOrderDetails(
    createdOrder.id,
    createdOrder.recipientName,
    createdOrder.address,
    createdOrder.items,
    createdOrder.totalPrice,
  );
});
