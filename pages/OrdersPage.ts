import { expect, type Page } from '@playwright/test';

export class OrdersPage {
  constructor(private readonly page: Page) {}

  async open() {
    await this.page.goto('/orders');
    await expect(this.page).toHaveURL(/\/orders/);
  }

  orderCard(orderId: string) {
    return this.page.getByTestId('order-card').filter({
      hasText: orderId,
    });
  }

  async expectOrderVisible(orderId: string) {
    await expect(this.orderCard(orderId)).toBeVisible();
  }

  async expectOrderDetails(
    orderId: string,
    recipientName: string,
    address: string,
    items: Array<{ name: string; quantity: number }>,
    totalPrice: number,
  ) {
    const card = this.orderCard(orderId);

    await expect(card).toContainText(recipientName);
    await expect(card).toContainText(address);
    await expect(card).toContainText(totalPrice.toLocaleString('vi-VN'));

    for (const item of items) {
      await expect(card).toContainText(item.name);
      await expect(card).toContainText(item.quantity.toString());
    }
  }
}
