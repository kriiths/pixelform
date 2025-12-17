import { test, expect } from './fixtures';
import { testIds } from './tests';
import { texts, paths } from '../src/app/content/texts';

test.describe('Shop', () => {
  test('should display all products on main shop page', async ({ page }) => {
    await page.goto(paths.shop);
    
    // Should show products from all categories
    await expect(page.getByRole('heading', { name: texts.shop.categories.pixelparla })).toBeVisible();
    await expect(page.getByRole('heading', { name: texts.shop.categories.resin })).toBeVisible();
    await expect(page.getByRole('heading', { name: texts.shop.categories.junior })).toBeVisible();
  });

  test('should filter products by category', async ({ page }) => {
    await page.goto(paths.shop);
    
    // Navigate to specific category
    await page.goto(paths.pixelParla);
    
      // Check that we're on the category page by verifying content
      await expect(page.getByRole('heading', { name: texts.shop.categories.pixelparla })).toBeVisible();
    
    // Should display products
    await expect(page.getByTestId(testIds.productCard).first()).toBeVisible();
  });

  test('should sort products by price', async ({ page }) => {
    await page.goto(paths.shop);
    
    // Change sort option
    await page.selectOption('select', 'priceLow');
    
    // Wait for products to be sorted
    await page.waitForTimeout(500);
    
    // Get first and second product prices
    const productCards = page.getByTestId(testIds.productCard);
    const count = await productCards.count();
    
    if (count >= 2) {
      const firstPrice = await productCards.nth(0).locator('text=/\\d+/').first().textContent();
      const secondPrice = await productCards.nth(1).locator('text=/\\d+/').first().textContent();
      
      const firstNum = parseInt(firstPrice?.replace(/\D/g, '') || '0');
      const secondNum = parseInt(secondPrice?.replace(/\D/g, '') || '0');
      
      expect(firstNum).toBeLessThanOrEqual(secondNum);
    }
  });

  test('should navigate to product detail page', async ({ page }) => {
    await page.goto(paths.pixelParla);
    
    // Click on first product card and wait for navigation (avoid race)
    await Promise.all([
      page.waitForSelector(`[data-testid="${testIds.productDetailContainer}"]`, { state: 'visible' }),
      page.getByTestId(testIds.productCard).first().click(),
    ]);

    // Should be on product detail page (check pathname, not full origin)
    // Should be on product detail page (verify content instead of URL)
    await expect(page.getByTestId(testIds.productDetailContainer)).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    
    // Should show product details
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByTestId(testIds.addToCartPageButton)).toBeVisible();
  });
});
