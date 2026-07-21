import { expect } from '@playwright/test';

import { InputControl } from './InputControl';

export class SelectControl extends InputControl {
  async selectOption(value: string) {
    await this.locator.selectOption(value);
  }

  async expectOptions(values: string[]) {
    await expect(this.locator.locator('option')).toHaveText(values);
  }
}