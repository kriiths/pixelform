
import { test, expect } from './fixtures';
import { testIds } from './tests';
import { texts, paths } from '../src/app/content/texts';


test.describe('Cart', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.evaluate(() => localStorage.clear());
  });

  test('should add product to cart', async ({ page }) => {
    await page.goto(paths.pixelParla);
    
    // Add first product to cart
    await page.getByTestId(testIds.productCard).first().getByTestId(testIds.addToCartCardButton).click();
    
    // Cart badge should show 1 item
    await expect(page.locator('a[href="' + paths.cart + '"]').locator('span')).toHaveText('1');
  });

  test('should display cart items correctly', async ({ page }) => {
    await page.goto(paths.pixelParla);
    // Add product to cart
    await page.getByTestId(testIds.productCard).first().getByTestId(testIds.addToCartCardButton).click();
    // Navigate to cart page
    await page.goto(paths.cart);
    // Should display the added product
    await expect(page.getByTestId(testIds.cartItem).first()).toBeVisible();
    // Should show total price
    await expect(page.getByText(texts.cart.total)).toBeVisible();
  });

  test('should update product quantity in cart', async ({ page }) => {
    await page.goto(paths.pixelParla);
    // Add product to cart
    await page.getByTestId(testIds.productCard).first().getByTestId(testIds.addToCartCardButton).click();
    // Go to cart
    await page.goto(paths.cart);
    // Increase quantity
    await page.getByTestId(testIds.increaseQuantityButton).first().click();
    // Badge should show 2 items
    await expect(page.locator('a[href="' + paths.cart + '"]').locator('span')).toHaveText('2');
  });

  test('should remove product from cart', async ({ page }) => {
    await page.goto(paths.pixelParla);
    // Add product to cart
    await page.getByTestId(testIds.productCard).first().getByTestId(testIds.addToCartCardButton).click();
    // Go to cart
    await page.goto(paths.cart);
    // Remove the item
    await page.getByTestId(testIds.removeFromCartButton).first().click();
    // Cart should be empty
    await expect(page.getByText(texts.cart.empty)).toBeVisible();
  });

  test('should respect stock limits', async ({ page }) => {
    await page.goto(paths.pixelParla);
    // Click on a product to view details
    await page.getByTestId(testIds.productCard).first().click();
    // Get the stock amount (assuming it's displayed)
    const stockText = await page.getByText(texts.product.inStock).textContent();
    const stockAmount = parseInt(stockText?.match(/\d+/)?.[0] || '10');
    const addButton = page.getByTestId(testIds.addToCartCardButton);
    // Add to cart multiple times
    for (let i = 0; i < stockAmount + 2; i++) {
      await addButton.click();
      await page.waitForTimeout(100);
    }
    // Check that cart doesn't exceed stock
    const cartBadge = await page.locator('a[href="' + paths.cart + '"]').locator('span').textContent();
    const cartCount = parseInt(cartBadge || '0');
    expect(cartCount).toBeLessThanOrEqual(stockAmount);
  });

  test('should calculate total price correctly', async ({ page }) => {
    await page.goto(paths.pixelParla);
    const firstProduct = page.getByTestId(testIds.productCard).first();
    const priceText = await firstProduct.getByText(texts.currency.suffix.trim()).textContent();
    const price = parseInt(priceText?.replace(/\\D/g, '') || '0');
    // Add to cart
    await firstProduct.getByTestId(testIds.addToCartCardButton).click();
    // Go to cart
    await page.goto(paths.cart);
    // Check total price
    const totalText = await page.getByText(texts.cart.total).locator('..').textContent();
    const total = parseInt(totalText?.replace(/\\D/g, '') || '0');
    expect(total).toBeGreaterThanOrEqual(price);
  });

  test('should persist cart across page refreshes', async ({ page }) => {
    await page.goto(paths.pixelParla);
    // Add product to cart
    await page.getByTestId(testIds.productCard).first().getByTestId(testIds.addToCartCardButton).click();
    const initialCount = await page.locator('a[href="' + paths.cart + '"]').locator('span').textContent();
    
    // Reload page
    await page.reload();
    
    // Cart should still have same items
    const newCount = await page.locator('a[href="' + paths.cart + '"]').locator('span').textContent();
    expect(newCount).toBe(initialCount);
  });

  test('should not allow quantity to go below 1', async ({ page }) => {
    await page.goto(paths.pixelParla);
    // Add product to cart
    await page.getByTestId(testIds.productCard).first().getByTestId(testIds.addToCartCardButton).click();
    await page.goto(paths.cart);
    
    // Try to decrease quantity below 1
    const decreaseButton = page.getByTestId(testIds.decreaseQuantityButton).first();
    await decreaseButton.click();
    
    // Item should be removed or cart should be empty
    const cartItems = await page.getByTestId(testIds.cartItem).count();
    expect(cartItems).toBe(0);
  });

  test('should handle adding multiple different products', async ({ page }) => {
    // Add first product from pixelparla
    await page.goto(paths.pixelParla);
    await page.getByTestId(testIds.productCard).first().getByTestId(testIds.addToCartCardButton).click();
    
    // Add second product from resin
    await page.goto(paths.resin);
    await page.getByTestId(testIds.productCard).first().getByTestId(testIds.addToCartCardButton).click();
    
    // Go to cart and verify both items
    await page.goto(paths.cart);
    const cartItems = await page.getByTestId(testIds.cartItem).count();
    expect(cartItems).toBeGreaterThanOrEqual(2);
  });

  test('should update total when quantity changes', async ({ page }) => {
    await page.goto(paths.pixelParla);
    // Add product to cart
    await page.getByTestId(testIds.productCard).first().getByTestId(testIds.addToCartCardButton).click();
    await page.goto(paths.cart);
    
    // Get initial total
    const initialTotal = await page.getByText(texts.cart.total).locator('..').textContent();
    const initialPrice = parseInt(initialTotal?.replace(/\\D/g, '') || '0');
    
    // Increase quantity
    await page.getByTestId(testIds.increaseQuantityButton).first().click();
    await page.waitForTimeout(200);
    
    // Get new total
    const newTotal = await page.getByText(texts.cart.total).locator('..').textContent();
    const newPrice = parseInt(newTotal?.replace(/\\D/g, '') || '0');
    
    // New total should be approximately double (accounting for potential rounding)
    expect(newPrice).toBeGreaterThan(initialPrice);
  });

  test('should clear all items when starting fresh', async ({ page }) => {
    // Add multiple items
    await page.goto(paths.pixelParla);
    await page.getByTestId(testIds.productCard).first().getByTestId(testIds.addToCartCardButton).click();
    await page.goto(paths.resin);
    await page.getByTestId(testIds.productCard).first().getByTestId(testIds.addToCartCardButton).click();
    
    // Clear cart via localStorage
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    
    // Navigate to cart
    await page.goto(paths.cart);
    
    // Should show empty cart
    await expect(page.getByText(texts.cart.empty)).toBeVisible();
  });
});
