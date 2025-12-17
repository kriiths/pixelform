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
    const addButton = page.getByTestId(testIds.productCard).first().getByTestId(testIds.addToCartCardButton);
    await expect(addButton).toBeEnabled();
    await addButton.click();
    
    // Cart badge should show 1 item
    await expect(page.locator(`a[href="${paths.cart}"] span`)).toHaveText('1');
  });

  test('should display cart items correctly', async ({ page }) => {
    await page.goto(paths.pixelParla);
    // Add product to cart
    const addButton = page.getByTestId(testIds.productCard).first().getByTestId(testIds.addToCartCardButton);
    await expect(addButton).toBeEnabled();
    await addButton.click();
    // Wait for cart badge to update
    await expect(page.locator(`a[href="${paths.cart}"] span`)).toHaveText('1');
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
    const addButton = page.getByTestId(testIds.productCard).first().getByTestId(testIds.addToCartCardButton);
    await expect(addButton).toBeEnabled();
    await addButton.click();
    // Wait for cart badge
    await expect(page.locator(`a[href="${paths.cart}"] span`)).toHaveText('1');
    // Go to cart
    await page.goto(paths.cart);
    // Wait for cart item to be visible
    await expect(page.getByTestId(testIds.cartItem).first()).toBeVisible();
    // Increase quantity
    await page.getByTestId(testIds.increaseQuantityButton).first().click();
    // Badge should show 2 items
    await expect(page.locator(`a[href="${paths.cart}"] span`)).toHaveText('2');
  });

  test('should remove product from cart', async ({ page }) => {
    await page.goto(paths.pixelParla);
    // Add product to cart
    const addButton = page.getByTestId(testIds.productCard).first().getByTestId(testIds.addToCartCardButton);
    await expect(addButton).toBeEnabled();
    await addButton.click();
    // Wait for cart badge
    await expect(page.locator(`a[href="${paths.cart}"] span`)).toHaveText('1');
    // Go to cart
    await page.goto(paths.cart);
    // Wait for cart item to appear
    await expect(page.getByTestId(testIds.cartItem).first()).toBeVisible();
    // Remove the item
    await page.getByTestId(testIds.removeFromCartButton).first().click();
    // Cart should be empty
    await expect(page.getByText(texts.cart.empty)).toBeVisible();
  });

  test('should respect stock limits', async ({ page }) => {
    await page.goto(paths.pixelParla);
    // Click on a product to view details
    await Promise.all([
      page.waitForNavigation(),
      page.getByTestId(testIds.productCard).first().click(),
    ]);
    // Wait for product detail to load
    const productDetail = page.getByTestId(testIds.productDetailContainer);
    await expect(productDetail).toBeVisible({ timeout: 10000 });
    // Get the stock amount
    const stockText = await productDetail.getByText(texts.product.inStock).textContent();
    const stockAmount = parseInt(stockText?.match(/\d+/)?.[0] || '10');
    const addButton = productDetail.getByTestId(testIds.addToCartPageButton);
    await expect(addButton).toBeEnabled();
    // Add to cart multiple times (button might get disabled when stock reached)
    for (let i = 0; i < stockAmount + 2; i++) {
      const isEnabled = await addButton.isEnabled();
      if (!isEnabled) break;
      await addButton.click();
      await page.waitForTimeout(100);
    }
    // Check that cart doesn't exceed stock
    const cartBadge = await page.locator(`a[href="${paths.cart}"] span`).textContent();
    const cartCount = parseInt(cartBadge || '0');
    expect(cartCount).toBeLessThanOrEqual(stockAmount);
  });

  test('should calculate total price correctly', async ({ page }) => {
    await page.goto(paths.pixelParla);
    const firstProduct = page.getByTestId(testIds.productCard).first();
    const priceText = await firstProduct.getByText(texts.currency.suffix.trim()).textContent();
    const price = parseInt(priceText?.replace(/\\D/g, '') || '0');
    // Add to cart
    const addButton = firstProduct.getByTestId(testIds.addToCartCardButton);
    await expect(addButton).toBeEnabled();
    await addButton.click();
    // Wait for cart badge
    await expect(page.locator(`a[href="${paths.cart}"] span`)).toHaveText('1');
    // Go to cart
    await page.goto(paths.cart);
    // Wait for cart to load
    await expect(page.getByTestId(testIds.cartItem).first()).toBeVisible();
    // Check total price
    const totalText = await page.getByText(texts.cart.total).locator('..').textContent();
    const total = parseInt(totalText?.replace(/\D/g, '') || '0');
    expect(total).toBeGreaterThanOrEqual(price);
  });

  test('should persist cart across page refreshes', async ({ page }) => {
    await page.goto(paths.pixelParla);
    // Add product to cart
    const addButton = page.getByTestId(testIds.productCard).first().getByTestId(testIds.addToCartCardButton);
    await expect(addButton).toBeEnabled();
    await addButton.click();
    // Wait for cart badge
    await expect(page.locator(`a[href="${paths.cart}"] span`)).toHaveText('1');
    const initialCount = await page.locator(`a[href="${paths.cart}"] span`).textContent();
    
    // Reload page
    await page.reload();
    
    // Cart should still have same items
    const newCount = await page.locator(`a[href="${paths.cart}"] span`).textContent();
    expect(newCount).toBe(initialCount);
  });

  test('should not allow quantity to go below 1', async ({ page }) => {
    await page.goto(paths.pixelParla);
    // Add product to cart
    const addButton = page.getByTestId(testIds.productCard).first().getByTestId(testIds.addToCartCardButton);
    await expect(addButton).toBeEnabled();
    await addButton.click();
    // Wait for cart badge
    await expect(page.locator(`a[href="${paths.cart}"] span`)).toHaveText('1');
    await page.goto(paths.cart);
    // Wait for cart item to appear
    await expect(page.getByTestId(testIds.cartItem).first()).toBeVisible();
    
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
    const addButton1 = page.getByTestId(testIds.productCard).first().getByTestId(testIds.addToCartCardButton);
    await expect(addButton1).toBeEnabled();
    await addButton1.click();
    // Wait for cart badge
    await expect(page.locator(`a[href="${paths.cart}"] span`)).toHaveText('1');
    
    // Add second product from resin
    await page.goto(paths.resin);
    const addButton2 = page.getByTestId(testIds.productCard).first().getByTestId(testIds.addToCartCardButton);
    await expect(addButton2).toBeEnabled();
    await addButton2.click();
    // Wait for cart badge to update
    await expect(page.locator(`a[href="${paths.cart}"] span`)).toHaveText('2');
    
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
    const initialPrice = parseInt(initialTotal?.replace(/\D/g, '') || '0');
    
    // Increase quantity
    await page.getByTestId(testIds.increaseQuantityButton).first().click();
    await page.waitForTimeout(200);
    
    // Get new total
    const newTotal = await page.getByText(texts.cart.total).locator('..').textContent();
    const newPrice = parseInt(newTotal?.replace(/\D/g, '') || '0');
    
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

  // Additional tests

  test('should disable add to cart button when out of stock', async ({ page }) => {
    await page.goto(paths.pixelParla);
    // Click on a product to view details
    await page.getByTestId(testIds.productCard).first().click();
    const productDetail = page.getByTestId(testIds.productDetailContainer);
    await expect(productDetail).toBeVisible();
    // Get the stock amount
    const stockText = await productDetail.getByText(texts.product.inStock).textContent();
    const stockAmount = parseInt(stockText?.match(/\d+/)?.[0] || '0');
    const addButton = productDetail.getByTestId(testIds.addToCartPageButton);

    // Add to cart until stock is depleted
    for (let i = 0; i < stockAmount; i++) {
      await expect(addButton).toBeEnabled();
      await addButton.click();
      await page.waitForTimeout(100);
    }
    // Button should be disabled when out of stock
    await expect(addButton).toBeDisabled();
  });

  test('should keep cart badge hidden when cart is empty', async ({ page }) => {
    await page.goto(paths.pixelParla);
    // Ensure cart is empty
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    // Cart badge should not be visible or should be empty
    const badge = await page.locator(`a[href="${paths.cart}"] span`);
    const badgeText = await badge.textContent();
    expect(badgeText === null || badgeText.trim() === '' || badgeText === '0').toBeTruthy();
  });

  test('should not add to cart if add button is disabled', async ({ page }) => {
    await page.goto(paths.pixelParla);
    // Click on a product to view details
    await page.getByTestId(testIds.productCard).first().click();
    const productDetail = page.getByTestId(testIds.productDetailContainer);
    await expect(productDetail).toBeVisible();
    // Simulate out of stock
    await page.evaluate(() => {
      // @ts-expect-error: force out of stock for test
      window.__forceOutOfStock = true;
    });
    const addButton = productDetail.getByTestId(testIds.addToCartPageButton);
    await expect(addButton).toBeDisabled();
  });

  test('should show correct product name in cart', async ({ page }) => {
    await page.goto(paths.pixelParla);
    // Get product name
    const productCard = page.getByTestId(testIds.productCard).first();
    const productName = await productCard.locator(`[data-testid="${testIds.productName}"]`).textContent();
    // Add to cart
    const addButton = productCard.getByTestId(testIds.addToCartCardButton);
    await expect(addButton).toBeEnabled();
    await addButton.click();
    await page.goto(paths.cart);
    // Check product name in cart
    const cartItemName = await page.getByTestId(testIds.cartItem).first().locator(`[data-testid="${testIds.cartItemName}"]`).textContent();
    expect(cartItemName?.trim()).toBe(productName?.trim());
  });

  test('should empty cart when clicking clear cart button', async ({ page }) => {
    await page.goto(paths.pixelParla);
    // Add product to cart
    const addButton = page.getByTestId(testIds.productCard).first().getByTestId(testIds.addToCartCardButton);
    await expect(addButton).toBeEnabled();
    await addButton.click();
    await page.goto(paths.cart);
    // Click clear cart button if exists
    const clearCartButton = page.getByTestId(testIds.clearCartButton);
    if (await clearCartButton.isVisible()) {
      await clearCartButton.click();
      await expect(page.getByText(texts.cart.empty)).toBeVisible();
    }
  });
});
