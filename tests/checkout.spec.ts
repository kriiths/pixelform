import { test, expect } from '@playwright/test';
import { testIds } from './tests';

test.describe('Checkout', () => {
  test.beforeEach(async ({ page }) => {
    // Clear cart and add a product
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    
    // Add product to cart
    await page.goto('/shop/pixelparla');
    await page.locator(`[data-testid="${testIds.productCard}"]`).first().locator(`[data-testid="${testIds.addToCartButton}"]`).click();
  });

  test('should navigate to checkout from cart', async ({ page }) => {
    await page.goto('/cart');
    
    // Click checkout button
    await page.getByRole('link', { name: /checkout|till kassan/i }).click();
    
    // Should be on checkout page
    await expect(page).toHaveURL('/checkout');
  });

  test('should display checkout page content', async ({ page }) => {
    await page.goto('/checkout');
    
    // Should show checkout heading or form
    await expect(page.locator('h1, h2')).toBeVisible();
  });

  test('should not allow checkout with empty cart', async ({ page }) => {
    // Clear cart
    await page.evaluate(() => localStorage.clear());
    
    await page.goto('/cart');
    
    // Checkout button should not be available or cart should show empty state
    const isEmpty = await page.locator('text=/empty/i').isVisible();
    
    if (!isEmpty) {
      // If button exists, it should navigate back or show error
      const checkoutButton = page.getByRole('link', { name: /checkout|till kassan/i });
      await expect(checkoutButton).not.toBeVisible();
    }
  });
});
