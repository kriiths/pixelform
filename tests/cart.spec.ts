
import { test, expect } from '@playwright/test';
import { testIds } from './tests';
import { texts } from '../src/app/content/texts';

// Centralized test paths (camelCase)
const paths = {
  cart: '/cart',
  pixelParla: '/shop/pixelparla',
  cartLink: 'a[href="/cart"]',
};

test.describe('Cart', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should add product to cart', async ({ page }) => {
    await page.goto(paths.pixelParla);
    
    // Add first product to cart
    await page.getByTestId(testIds.productCard).first().getByTestId(testIds.addToCartButton).click();
    
    // Cart badge should show 1 item
    await expect(page.locator(paths.cartLink).locator('span')).toHaveText('1');
  });

  test('should display cart items correctly', async ({ page }) => {
    await page.goto(paths.pixelParla);
    // Add product to cart
    await page.getByTestId(testIds.productCard).first().getByTestId(testIds.addToCartButton).click();
    // Navigate to cart page
    await page.goto(paths.cart);
    // Should display the added product
    await expect(page.getByTestId(testIds.cartItem).first()).toBeVisible();
    // Should show total price
    await expect(page.getByText(new RegExp(texts.cart.total, 'i'))).toBeVisible();
  });

  test('should update product quantity in cart', async ({ page }) => {
    await page.goto(paths.pixelParla);
    // Add product to cart
    await page.getByTestId(testIds.productCard).first().getByTestId(testIds.addToCartButton).click();
    // Go to cart
    await page.goto(paths.cart);
    // Increase quantity
    await page.getByTestId(testIds.increaseQuantityButton).first().click();
    // Badge should show 2 items
    await expect(page.locator(paths.cartLink).locator('span')).toHaveText('2');
  });

  test('should remove product from cart', async ({ page }) => {
    await page.goto(paths.pixelParla);
    // Add product to cart
    await page.getByTestId(testIds.productCard).first().getByTestId(testIds.addToCartButton).click();
    // Go to cart
    await page.goto(paths.cart);
    // Remove the item
    await page.getByTestId(testIds.removeFromCartButton).first().click();
    // Cart should be empty
    await expect(page.getByText(new RegExp(texts.cart.empty, 'i'))).toBeVisible();
  });

  test('should respect stock limits', async ({ page }) => {
    await page.goto(paths.pixelParla);
    // Click on a product to view details
    await page.getByTestId(testIds.productCard).first().click();
    // Get the stock amount (assuming it's displayed)
    const stockText = await page.getByText(new RegExp(texts.product.inStock, 'i')).textContent();
    const stockAmount = parseInt(stockText?.match(/\d+/)?.[0] || '10');
    const addButton = page.getByTestId(testIds.addToCartButton);
    // Add to cart multiple times
    for (let i = 0; i < stockAmount + 2; i++) {
      await addButton.click();
      await page.waitForTimeout(100);
    }
    // Check that cart doesn't exceed stock
    const cartBadge = await page.locator(paths.cartLink).locator('span').textContent();
    const cartCount = parseInt(cartBadge || '0');
    expect(cartCount).toBeLessThanOrEqual(stockAmount);
  });

  test('should calculate total price correctly', async ({ page }) => {
    await page.goto(paths.pixelParla);
    const firstProduct = page.getByTestId(testIds.productCard).first();
    const priceText = await firstProduct.getByText(new RegExp('\\d+\\s*' + texts.currency.suffix.trim(), 'i')).textContent();
    const price = parseInt(priceText?.replace(/\\D/g, '') || '0');
    // Add to cart
    await firstProduct.getByTestId(testIds.addToCartButton).click();
    // Go to cart
    await page.goto(paths.cart);
    // Check total price
    const totalText = await page.getByText(new RegExp(texts.cart.total, 'i')).locator('..').textContent();
    const total = parseInt(totalText?.replace(/\\D/g, '') || '0');
    expect(total).toBeGreaterThanOrEqual(price);
  });
});
