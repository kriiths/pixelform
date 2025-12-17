import { Page, expect } from '@playwright/test';
import { testIds } from './tests';
import { paths, texts } from '../src/app/content/texts';

/**
 * Add a product to cart from a category page
 * @param page - Playwright page object
 * @param category - Category to navigate to ('pixelparla' | 'resin' | 'junior')
 * @param productIndex - Index of product to add (default: 0)
 */
export async function addProductToCart(
  page: Page,
  category: 'pixelparla' | 'resin' | 'junior' = 'pixelparla',
  productIndex = 0
) {
  await goToCategory(page, category);
  const products = page.getByTestId(testIds.productCard);
  const product = products.nth(productIndex);

  // Ensure product and its add button are visible and enabled
  await expect(product).toBeVisible();
  const addButton = product.getByTestId(testIds.addToCartCardButton);
  await expect(addButton).toBeVisible();
  await expect(addButton).toBeEnabled({ timeout: 3000 });

  // Capture initial cart count, click and wait for badge to increase
  const initialCount = await getCartCount(page);
  await addButton.click();
  const badge = page.locator(`a[href="${paths.cart}"] span`);
  await expect(badge).toHaveText(String(initialCount + 1), { timeout: 5000 });
}

/**
 * Clear cart by clearing localStorage
 * @param page - Playwright page object
 */
export async function clearCart(page: Page) {
  await page.evaluate(() => localStorage.clear());
}

/**
 * Get current cart count from badge
 * @param page - Playwright page object
 * @returns Cart item count
 */
export async function getCartCount(page: Page): Promise<number> {
  const badge = page.locator(`a[href="${paths.cart}"] span`);
  const isVisible = await badge.isVisible();
  if (!isVisible) return 0;
  const text = await badge.textContent();
  return parseInt(text || '0');
}

/**
 * Navigate to a specific category page
 * @param page - Playwright page object
 * @param category - Category to navigate to
 */
export async function goToCategory(page: Page, category: 'pixelparla' | 'resin' | 'junior') {
  const categoryPaths = {
    pixelparla: paths.pixelParla,
    resin: paths.resin,
    junior: paths.junior,
  };
  await page.goto(categoryPaths[category]);
}

/**
 * Navigate to cart page
 * @param page - Playwright page object
 */
export async function goToCart(page: Page) {
  await page.goto(paths.cart);
}

/**
 * Navigate to checkout page
 * @param page - Playwright page object
 */
export async function goToCheckout(page: Page) {
  await page.goto(paths.checkout);
}

/**
 * Get product price from card
 * @param page - Playwright page object
 * @param productIndex - Index of product (default: 0)
 * @returns Price as number
 */
export async function getProductPrice(page: Page, productIndex = 0): Promise<number> {
  const productCard = page.getByTestId(testIds.productCard).nth(productIndex);
  const priceText = await productCard.locator('text=/\\d+ kr/').textContent();
  return parseInt(priceText?.replace(/\D/g, '') || '0');
}

/**
 * Get total price from cart
 * @param page - Playwright page object
 * @returns Total price as number
 */
export async function getCartTotal(page: Page): Promise<number> {
  const totalElement = page.getByText(texts.cart.total);
  const totalText = await totalElement.locator('..').textContent();
  return parseInt(totalText?.replace(/\D/g, '') || '0');
}

/**
 * Verify cart is empty
 * @param page - Playwright page object
 */
export async function verifyCartIsEmpty(page: Page) {
  await expect(page.getByText(texts.cart.empty)).toBeVisible();
}

/**
 * Increase product quantity in cart
 * @param page - Playwright page object
 * @param itemIndex - Index of cart item (default: 0)
 */
export async function increaseQuantity(page: Page, itemIndex = 0) {
  const button = page.getByTestId(testIds.increaseQuantityButton).nth(itemIndex);
  await expect(button).toBeVisible();
  await expect(button).toBeEnabled();
  await button.click();
}

/**
 * Decrease product quantity in cart
 * @param page - Playwright page object
 * @param itemIndex - Index of cart item (default: 0)
 */
export async function decreaseQuantity(page: Page, itemIndex = 0) {
  const button = page.getByTestId(testIds.decreaseQuantityButton).nth(itemIndex);
  await expect(button).toBeVisible();
  await expect(button).toBeEnabled();
  await button.click();
}

/**
 * Remove item from cart
 * @param page - Playwright page object
 * @param itemIndex - Index of cart item (default: 0)
 */
export async function removeFromCart(page: Page, itemIndex = 0) {
  await page.getByTestId(testIds.removeFromCartButton).nth(itemIndex).click();
}

/**
 * Click on a product card to view details
 * @param page - Playwright page object
 * @param productIndex - Index of product (default: 0)
 */
export async function viewProductDetails(page: Page, productIndex = 0) {
  await Promise.all([
    page.waitForURL(/\/shop\/.*\/.*/),
    page.getByTestId(testIds.productCard).nth(productIndex).click(),
  ]);
  await expect(page.getByTestId(testIds.productDetailContainer)).toBeVisible();
}

/**
 * Get number of products displayed on current page
 * @param page - Playwright page object
 * @returns Number of products
 */
export async function getProductCount(page: Page): Promise<number> {
  return await page.getByTestId(testIds.productCard).count();
}

/**
 * Fill checkout form with test data
 * @param page - Playwright page object
 * @param data - Form data (optional, uses defaults if not provided)
 */
export async function fillCheckoutForm(
  page: Page,
  data?: { name?: string; email?: string; address?: string }
) {
  const formData = {
    name: data?.name || 'Test Testsson',
    email: data?.email || 'test@example.com',
    address: data?.address || 'Testgatan 123',
  };

  await page.getByPlaceholder(texts.forms.namePlaceholder).fill(formData.name);
  await page.getByPlaceholder(texts.forms.emailPlaceholder).fill(formData.email);
  await page.getByPlaceholder(texts.forms.addressPlaceholder).fill(formData.address);
}

/**
 * Wait for a short period (for animations, etc.)
 * @param page - Playwright page object
 * @param ms - Milliseconds to wait (default: 300)
 */
export async function waitForAnimation(page: Page, ms = 300) {
  await page.waitForTimeout(ms);
}
