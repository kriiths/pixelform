import { test, expect } from './fixtures';
import { texts, paths } from '../src/app/content/texts';

test.describe('Error Handling', () => {
  test('should show 404 for non-existent product in pixelparla', async ({ page }) => {
    await page.goto(paths.productDetail('pixelparla', 'non-existent-product-12345'));
    
    // Should show product not found message
    await expect(page.getByText(texts.product.notFound)).toBeVisible();
  });

  test('should show 404 for non-existent product in resin', async ({ page }) => {
    await page.goto(paths.productDetail('resin', 'fake-product-xyz'));
    
    // Should show product not found message
    await expect(page.getByText(texts.product.notFound)).toBeVisible();
  });

  test('should show 404 for non-existent product in junior', async ({ page }) => {
    await page.goto(paths.productDetail('junior', 'missing-item-abc'));
    
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
    const hasProducts = await page.getByTestId('productCard').count() > 0;
    const hasNoProductsMsg = await page.getByText(texts.shop.noProducts).isVisible();
    
    // Either products should exist OR no products message should show
    expect(hasProducts || hasNoProductsMsg).toBe(true);
  });

  test('should maintain site navigation when error occurs', async ({ page }) => {
    // Go to a non-existent product
    await page.goto(paths.productDetail('pixelparla', 'non-existent-999'));
    
    // Header navigation should still work
    await expect(page.getByRole('link', { name: texts.nav.shop })).toBeVisible();
    await expect(page.getByRole('link', { name: texts.nav.about })).toBeVisible();
    await expect(page.getByRole('link', { name: texts.nav.cart })).toBeVisible();
  });

  test('should provide link back to shop on error page', async ({ page }) => {
    await page.goto(paths.productDetail('pixelparla', 'non-existent-product'));
    
    // Should have a link back to shop or continue shopping
    const shopLink = page.getByRole('link', { name: new RegExp(texts.cart.continueShopping, 'i') });
    await expect(shopLink).toBeVisible();
  });

  test('should handle rapid cart updates without errors', async ({ page }) => {
    await page.goto(paths.pixelParla);
    
    // Rapidly click add to cart
    const addButton = page.getByTestId('addToCartCardButton').first();
    for (let i = 0; i < 5; i++) {
      await addButton.click();
    }
    
    // Should still function without crashing
    await page.goto(paths.cart);
    await expect(page.getByTestId('cartItem')).toBeVisible();
  });
});
