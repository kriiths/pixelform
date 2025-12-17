import { test, expect } from './fixtures';
import { testIds } from './tests';
import { texts, paths } from '../src/app/content/texts';
import { 
  addProductToCart, 
  viewProductDetails, 
  getCartCount
} from './helpers';

test.describe('Product Detail Page', () => {
  test('should display product information correctly', async ({ page }) => {
    await page.goto(paths.pixelParla);
    await viewProductDetails(page, 0);
    
    // Should show product details
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText(texts.product.description)).toBeVisible();
    await expect(page.getByText(texts.product.price)).toBeVisible();
  });

  test('should display product images', async ({ page }) => {
    await page.goto(paths.pixelParla);
    await viewProductDetails(page, 0);
    
    // Should show at least one product image
    const images = page.locator('img[alt]');
    await expect(images.first()).toBeVisible();
  });

  test('should add product to cart from detail page', async ({ page }) => {
    await page.goto(paths.pixelParla);
    await viewProductDetails(page, 0);
    
    // Click add to cart button
    await page.getByTestId(testIds.addToCartPageButton).click();
    
    // Cart count should increase
    const cartCount = await getCartCount(page);
    expect(cartCount).toBeGreaterThan(0);
  });

  test('should navigate back to shop from product page', async ({ page }) => {
    await page.goto(paths.pixelParla);
    await viewProductDetails(page, 0);
    
    // Click back to shop link
    await page.getByTestId(testIds.backToShopLink).click();
    
    // Should be back on shop page
    await expect(page).toHaveURL(paths.shop);
  });

  test('should show stock information', async ({ page }) => {
    await page.goto(paths.pixelParla);
    await viewProductDetails(page, 0);
    
    // Should display stock status
    const stockInfo = page.getByText(texts.product.inStock);
    await expect(stockInfo).toBeVisible();
  });

  test('should navigate between products in same category', async ({ page }) => {
    await page.goto(paths.pixelParla);
    
    // Click first product
    await viewProductDetails(page, 0);
    const firstProductTitle = await page.locator('h1').textContent();
    
    // Go back
    await page.goto(paths.pixelParla);
    
    // Click second product
    await viewProductDetails(page, 1);
    const secondProductTitle = await page.locator('h1').textContent();
    
    // Should be different products
    expect(firstProductTitle).not.toBe(secondProductTitle);
  });

  test('should maintain cart count when viewing products', async ({ page }) => {
    // Add product to cart
    await addProductToCart(page, 'pixelparla', 0);
    const initialCount = await getCartCount(page);
    
    // View another product
    await page.goto(paths.pixelParla);
    await viewProductDetails(page, 1);
    
    // Cart count should remain the same
    const newCount = await getCartCount(page);
    expect(newCount).toBe(initialCount);
  });

  test('should display correct category products', async ({ page }) => {
    // Test pixelparla category
    await page.goto(paths.pixelParla);
    await viewProductDetails(page, 0);
    await expect(page).toHaveURL(/\/shop\/pixelparla\/.+/);
    
    // Test resin category
    await page.goto(paths.resin);
    await viewProductDetails(page, 0);
    await expect(page).toHaveURL(/\/shop\/resin\/.+/);
    
    // Test junior category
    await page.goto(paths.junior);
    await viewProductDetails(page, 0);
    await expect(page).toHaveURL(/\/shop\/junior\/.+/);
  });

  test('should show product not found for invalid product', async ({ page }) => {
    await page.goto(paths.productDetail('pixelparla', 'non-existent-product-id'));
    
    // Should show not found message
    await expect(page.getByText(texts.product.notFound)).toBeVisible();
  });

  test('should add multiple quantities from product page', async ({ page }) => {
    await page.goto(paths.pixelParla);
    await viewProductDetails(page, 0);
    
    // Add to cart multiple times
    await page.getByTestId(testIds.addToCartPageButton).click();
    await page.waitForTimeout(200);
    await page.getByTestId(testIds.addToCartPageButton).click();
    await page.waitForTimeout(200);
    
    // Cart should have 2 items
    const cartCount = await getCartCount(page);
    expect(cartCount).toBe(2);
  });
});
