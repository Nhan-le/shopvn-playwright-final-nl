import { expect, type Page } from '@playwright/test';

export class ProductsPage {
  constructor(private readonly page: Page) {}

  private productCard(productName: string) {
    return this.page.locator('.product-card').filter({
      hasText: productName,
    });
  }

  async addToCart(productName: string) {
    const card = this.productCard(productName);
    await expect(card).toBeVisible();
    await card.getByRole('button', { name: /Thêm vào giỏ/ }).click();
  }

  async expectCartBadge(quantity: number) {
    await expect(this.page.locator('.cart-badge')).toHaveText(quantity.toString());
  }

  async openCart() {
    await this.page.locator('button.cart-btn').click();
    await expect(this.page).toHaveURL(/\/cart/);
  }
}
