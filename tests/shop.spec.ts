import { test, expect } from '@playwright/test';
import { testIds } from './tests';

test.describe('Shop', () => {
  test('should display all products on main shop page', async ({ page }) => {
    await page.goto('/shop');
    
    // Should show products from all categories
    await expect(page.locator('text=Pixelpärlor')).toBeVisible();
    await expect(page.locator('text=Resin')).toBeVisible();
    await expect(page.locator('text=Junior')).toBeVisible();
  });

  test('should filter products by category', async ({ page }) => {
    await page.goto('/shop');
    
    // Navigate to specific category
    await page.goto('/shop/pixelparla');
    
    // Check that we're on the category page
    await expect(page).toHaveURL(/\/shop\/pixelparla/);
    
    // Should display products
    await expect(page.locator(`[data-testid="${testIds.productCard}"]`).first()).toBeVisible();
  });

  test('should sort products by price', async ({ page }) => {
    await page.goto('/shop');
    
    // Change sort option
    await page.selectOption('select', 'priceLow');
    
    // Wait for products to be sorted
    await page.waitForTimeout(500);
    
    // Get first and second product prices
    const productCards = page.locator(`[data-testid="${testIds.productCard}"]`);
    const count = await productCards.count();
    
    if (count >= 2) {
      const firstPrice = await productCards.nth(0).locator('text=/\\d+/)').first().textContent();
      const secondPrice = await productCards.nth(1).locator('text=/\\d+/)').first().textContent();
      
      const firstNum = parseInt(firstPrice?.replace(/\D/g, '') || '0');
      const secondNum = parseInt(secondPrice?.replace(/\D/g, '') || '0');
      
      expect(firstNum).toBeLessThanOrEqual(secondNum);
    }
  });

  test('should navigate to product detail page', async ({ page }) => {
    await page.goto('/shop/pixelparla');
    
    // Click on first product card
    await page.locator(`[data-testid="${testIds.productCard}"]`).first().click();
    
    // Should be on product detail page
    await expect(page).toHaveURL(/\/shop\/pixelparla\/[a-z-]+/);
    
    // Should show product details
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator(`[data-testid="${testIds.addToCartButton}"]`)).toBeVisible();
  });
});
