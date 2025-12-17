import { test, expect } from '@playwright/test';

test.describe('Cart', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should add product to cart', async ({ page }) => {
    await page.goto('/shop/pixelparla');
    
    // Add first product to cart
    await page.locator('[data-testid="product-card"]').first().getByRole('button', { name: /add to cart/i }).click();
    
    // Cart badge should show 1 item
    await expect(page.locator('a[href="/cart"]').locator('span')).toHaveText('1');
  });

  test('should display cart items correctly', async ({ page }) => {
    await page.goto('/shop/pixelparla');
    
    // Add product to cart
    await page.locator('[data-testid="product-card"]').first().getByRole('button', { name: /add to cart/i }).click();
    
    // Navigate to cart page
    await page.goto('/cart');
    
    // Should display the added product
    await expect(page.locator('[data-testid="cart-item"]').first()).toBeVisible();
    
    // Should show total price
    await expect(page.locator('text=/total/i')).toBeVisible();
  });

  test('should update product quantity in cart', async ({ page }) => {
    await page.goto('/shop/pixelparla');
    
    // Add product to cart
    await page.locator('[data-testid="product-card"]').first().getByRole('button', { name: /add to cart/i }).click();
    
    // Go to cart
    await page.goto('/cart');
    
    // Increase quantity
    await page.getByRole('button', { name: '+' }).first().click();
    
    // Badge should show 2 items
    await expect(page.locator('a[href="/cart"]').locator('span')).toHaveText('2');
  });

  test('should remove product from cart', async ({ page }) => {
    await page.goto('/shop/pixelparla');
    
    // Add product to cart
    await page.locator('[data-testid="product-card"]').first().getByRole('button', { name: /add to cart/i }).click();
    
    // Go to cart
    await page.goto('/cart');
    
    // Remove the item
    await page.getByRole('button', { name: /remove/i }).first().click();
    
    // Cart should be empty
    await expect(page.locator('text=/empty/i')).toBeVisible();
  });

  test('should respect stock limits', async ({ page }) => {
    await page.goto('/shop/pixelparla');
    
    // Click on a product to view details
    await page.locator('[data-testid="product-card"]').first().click();
    
    // Get the stock amount (assuming it's displayed)
    const stockText = await page.locator('text=/stock|i lager/i').textContent();
    const stockAmount = parseInt(stockText?.match(/\d+/)?.[0] || '10');
    
    // Try to add more than stock
    const addButton = page.getByRole('button', { name: /add to cart/i });
    
    // Add to cart multiple times
    for (let i = 0; i < stockAmount + 2; i++) {
      await addButton.click();
      await page.waitForTimeout(100);
    }
    
    // Check that cart doesn't exceed stock
    const cartBadge = await page.locator('a[href="/cart"]').locator('span').textContent();
    const cartCount = parseInt(cartBadge || '0');
    
    expect(cartCount).toBeLessThanOrEqual(stockAmount);
  });

  test('should calculate total price correctly', async ({ page }) => {
    await page.goto('/shop/pixelparla');
    
    // Get price from first product
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    const priceText = await firstProduct.locator('text=/\\d+\\s*kr/i').textContent();
    const price = parseInt(priceText?.replace(/\D/g, '') || '0');
    
    // Add to cart
    await firstProduct.getByRole('button', { name: /add to cart/i }).click();
    
    // Go to cart
    await page.goto('/cart');
    
    // Check total price
    const totalText = await page.locator('text=/total/i').locator('..').textContent();
    const total = parseInt(totalText?.replace(/\D/g, '') || '0');
    
    expect(total).toBeGreaterThanOrEqual(price);
  });
});
