import { expect, type Page } from '@playwright/test';

export class CartPage {
  constructor(private readonly page: Page) {}

  async open() {
    await this.page.goto('/cart');
    await expect(this.page).toHaveURL(/\/cart/);
  }

  item(productName: string) {
    return this.page.locator('.cart-item').filter({
      hasText: productName,
    });
  }

  async expectItemQuantity(productName: string, quantity: number) {
    const cartItem = this.item(productName);

    await expect(cartItem).toBeVisible();
    await expect(cartItem.locator('.qty-value')).toHaveText(
      quantity.toString(),
    );
  }

  async removeItem(productName: string) {
    const cartItem = this.item(productName);

    await expect(cartItem).toBeVisible();
    await cartItem.locator('button.remove-btn[title="Xóa"]').click();
  }

  async expectItemRemoved(productName: string) {
    await expect(this.item(productName)).toHaveCount(0);
  }

  async expectItemVisible(productName: string) {
    await expect(this.item(productName)).toBeVisible();
  }

  async proceedToCheckout() {
    const checkoutControl = this.page
      .getByRole('button', { name: /thanh toán|checkout/i })
      .or(
        this.page.getByRole('link', {
          name: /thanh toán|checkout/i,
        }),
      )
      .first();

    await expect(checkoutControl).toBeVisible();
    await checkoutControl.click();

    await expect(this.page).toHaveURL(/\/checkout/);
  }
}