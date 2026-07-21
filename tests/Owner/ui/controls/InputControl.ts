import { expect } from '@playwright/test';

import { UiControl } from './UiControl';

export class InputControl extends UiControl {
  async fill(value: string) {
    await this.locator.fill(value);
  }

  async expectValue(value: string | RegExp) {
    await expect(this.locator).toHaveValue(value);
  }

  async expectInvalid() {
    await expect
      .poll(async () =>
        this.locator.evaluate(
          (element) => !(element as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).checkValidity(),
        ),
      )
      .toBe(true);
  }
}