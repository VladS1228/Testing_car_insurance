import { expect, type Locator } from '@playwright/test';

export class UiControl {
  constructor(public readonly locator: Locator) {}

  async click() {
    await this.locator.click();
  }

  async expectVisible() {
    await expect(this.locator).toBeVisible();
  }

  async expectHidden() {
    await expect(this.locator).toBeHidden();
  }

  async expectText(text: string | RegExp) {
    await expect(this.locator).toHaveText(text);
  }

  async expectContainsText(text: string | RegExp) {
    await expect(this.locator).toContainText(text);
  }

  async expectDisabled() {
    await expect(this.locator).toBeDisabled();
  }

  async expectEnabled() {
    await expect(this.locator).toBeEnabled();
  }

  async expectAttribute(name: string, value: string | RegExp) {
    await expect(this.locator).toHaveAttribute(name, value);
  }

  async isDisabled() {
    return this.locator.isDisabled();
  }

  async isEnabled() {
    return this.locator.isEnabled();
  }

  async count() {
    return this.locator.count();
  }
}