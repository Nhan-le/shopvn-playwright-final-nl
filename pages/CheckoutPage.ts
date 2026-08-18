import { expect, type Page } from '@playwright/test';

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  async expectLoaded() {
    await expect(this.page).toHaveURL(/\/checkout/);
    await expect(this.page.getByTestId('checkout-name')).toBeVisible();
  }

  async fillReceiver(name: string, phone: string, address: string) {
    await this.page.getByTestId('checkout-name').fill(name);
    await this.page.getByTestId('checkout-phone').fill(phone);
    await this.page.getByTestId('checkout-address').fill(address);
  }

  async expectCashSelected() {
    await expect(
      this.page.locator('input[name="paymentMethod"][value="cash"]'),
    ).toBeChecked();
  }

  async submit() {
    await this.page.getByTestId('checkout-submit').click();
  }

  async expectSuccess(
    recipientName: string,
    address: string,
    totalPrice: number,
  ) {
    await expect(this.page.getByText('Đặt hàng thành công!')).toBeVisible();

    const body = this.page.locator('body');

    await expect(body).toContainText(recipientName);
    await expect(body).toContainText(address);
    await expect(body).toContainText('Tiền mặt khi nhận hàng');
    await expect(body).toContainText(
      totalPrice.toLocaleString('vi-VN'),
    );
  }
}