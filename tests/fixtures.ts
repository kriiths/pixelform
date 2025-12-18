import { test as base, Page } from '@playwright/test';
import { paths } from '../src/app/content/texts';
import { testIds } from './tests';

/* eslint-disable react-hooks/rules-of-hooks */

/**
 * Extended Playwright fixtures for common test scenarios
 * 
 * Available fixtures:
 * - page: Standard page that starts on homepage
 * - cartWithItems: Page with pre-populated cart (3 items from different categories)
 * - emptyCart: Page with explicitly cleared cart
 */

export const test = base.extend<{
  page: Page;
  cartWithItems: Page;
  emptyCart: Page;
}>({
  // Standard page fixture - navigates to homepage
  page: async ({ page }, use) => {
    await page.goto(paths.home);
    await use(page);
  },

  // Cart with items fixture - pre-populates cart with products
  cartWithItems: async ({ page }, use) => {
    await page.goto(paths.home);
    
    // Clear any existing cart data
    await page.evaluate(() => localStorage.clear());
    
    // Add products from different categories
    await page.goto(paths.pixelParla);
    await page.getByTestId(testIds.productCard).first()
      .getByTestId(testIds.addToCartCardButton).click();
    await page.waitForTimeout(200);
    
    await page.goto(paths.resin);
    await page.getByTestId(testIds.productCard).first()
      .getByTestId(testIds.addToCartCardButton).click();
    await page.waitForTimeout(200);
    
    await page.goto(paths.junior);
    await page.getByTestId(testIds.productCard).first()
      .getByTestId(testIds.addToCartCardButton).click();
    await page.waitForTimeout(200);
    
    // Navigate to homepage and yield
    await page.goto(paths.home);
    await use(page);
  },

  // Empty cart fixture - ensures cart is empty
  emptyCart: async ({ page }, use) => {
    await page.goto(paths.home);
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await use(page);
  },
});

export { expect } from '@playwright/test';
