import { expect, type Page } from '@playwright/test';

export class ProfilePage {
  constructor(private readonly page: Page) {}

  async openFromHeader() {
    await this.page.getByTestId('header-profile-link').click();
    await expect(this.page).toHaveURL(/\/profile/);
  }

  async getFullName() {
    return this.page.getByTestId('profile-name').inputValue();
  }

  async updateFullName(name: string) {
    await this.page.getByTestId('profile-name').fill(name);
    await this.page.getByTestId('profile-save').click();
  }

  async expectFullName(name: string) {
    await expect(this.page.getByTestId('profile-name')).toHaveValue(name);
  }
}
