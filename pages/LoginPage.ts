import { expect, type Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async open() {
    await this.page.goto('/login');
  }

  async login(username: string, password: string) {
    await this.page.getByTestId('login-username').fill(username);
    await this.page.getByTestId('login-password').fill(password);
    await this.page.getByTestId('login-submit').click();
  }

  async loginSuccessfully(username: string, password: string) {
    await this.open();

    await this.login(username, password);

    await expect(this.page).toHaveURL(/\/home/, {
      timeout: 10_000,
    });

    await expect(
      this.page.locator('.product-card').first(),
    ).toBeVisible({
      timeout: 10_000,
    });
  }
}