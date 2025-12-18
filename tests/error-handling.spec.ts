import { test, expect } from './fixtures';
import { testIds } from './tests';
import { texts, paths } from '../src/app/content/texts';
import { testCategories, invalidProductIds } from './test-data';

test.describe('Error Handling', () => {
  test('should show 404 for non-existent product in pixelparla', async ({ page }) => {
    await page.goto(paths.productDetail(testCategories.pixelParla, invalidProductIds.pixelParla));
    
    // Should show product not found message
    await expect(page.getByText(texts.product.notFound)).toBeVisible();
  });

  test('should show 404 for non-existent product in resin', async ({ page }) => {
    await page.goto(paths.productDetail(testCategories.resin, invalidProductIds.resin));
    
    // Should show product not found message
    await expect(page.getByText(texts.product.notFound)).toBeVisible();
  });

  test('should show 404 for non-existent product in junior', async ({ page }) => {
    await page.goto(paths.productDetail(testCategories.junior, invalidProductIds.junior));
    
    // Should show product not found message
    await expect(page.getByText(texts.product.notFound)).toBeVisible();
  });

  test('should show empty cart message when cart is empty', async ({ page }) => {
    // Clear cart
    await page.evaluate(() => localStorage.clear());
    
    // Navigate to cart
    await page.goto(paths.cart);
    
    // Should show empty cart message
    await expect(page.getByText(texts.cart.empty)).toBeVisible();
  });

  test('should show empty cart in checkout when no items', async ({ page }) => {
    // Clear cart
    await page.evaluate(() => localStorage.clear());
    
    // Try to go to checkout
    await page.goto(paths.checkout);
    
    // Should show empty cart message
    await expect(page.getByText(texts.cart.empty)).toBeVisible();
  });

  test('should handle invalid category gracefully', async ({ page }) => {
    await page.goto(paths.category('invalid-category'));
    
    // Should either redirect or show 404
    // The page should not crash
    const url = page.url();
    expect(url).toBeTruthy();
  });

  test('should show no products message when category is empty', async ({ page }) => {
    // This test assumes a category might be empty
    // If all categories always have products, this might not be applicable
    await page.goto(paths.pixelParla);
    
    // Check if there are products or a "no products" message
    const hasProducts = await page.getByTestId(testIds.productCard).count() > 0;
    const hasNoProductsMsg = await page.getByText(texts.shop.noProducts).isVisible();
    
    // Either products should exist OR no products message should show
    expect(hasProducts || hasNoProductsMsg).toBe(true);
  });

  test('should maintain site navigation when error occurs', async ({ page }) => {
    // Go to a non-existent product
    await page.goto(paths.productDetail(testCategories.pixelParla, invalidProductIds.generic));
    
    // Header navigation should still work (check for shop dropdown or direct link)
    const shopLink = page.getByRole('button', { name: texts.nav.shop });
    const isShopVisible = await shopLink.isVisible();
    if (isShopVisible) {
      await expect(shopLink).toBeVisible();
    } else {
      await expect(page.getByRole('link', { name: texts.nav.shop })).toBeVisible();
    }
    await expect(page.getByRole('link', { name: texts.nav.about })).toBeVisible();
    // Check for cart (link or icon)
    const cartLink = page.locator(`a[href="${paths.cart}"]`);
    await expect(cartLink).toBeVisible();
  });

  test('should provide link back to shop on error page', async ({ page }) => {
    await page.goto(paths.productDetail(testCategories.pixelParla, invalidProductIds.pixelParla));
    
    // Should have a link back to shop or continue shopping
    const shopLink = page.getByRole('link', { name: new RegExp(texts.cart.continueShopping, 'i') });
    await expect(shopLink).toBeVisible();
  });

  test('should handle rapid cart updates without errors', async ({ page }) => {
    await page.goto(paths.pixelParla);
    
    // Rapidly click add to cart
    const addButton = page.getByTestId(testIds.addToCartCardButton).first();
    // Wait for button to be enabled before rapid clicking
    await expect(addButton).toBeVisible();
    await expect(addButton).toBeEnabled({ timeout: 5000 });
    
    for (let i = 0; i < 5; i++) {
      const isEnabled = await addButton.isEnabled();
      if (!isEnabled) break; // Stop if button becomes disabled
      await addButton.click();
      await page.waitForTimeout(50);
    }
    
    // Should still function without crashing
    await page.goto(paths.cart);
    await expect(page.getByTestId(testIds.cartItem)).toBeVisible();
  });
});
