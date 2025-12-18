import { test, expect } from '../fixtures';
import { testIds } from '../tests';
import { texts, paths } from '../../src/app/content/texts';
import { testCategories, testScenarios } from '../test-data';
import {
  addProductToCart,
  goToCart,
  clearCart,
  getCartCount,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  waitForAnimation,
  verifyCartIsEmpty,
} from '../helpers';

/**
 * FULL CHAIN USE CASE 3: Cart Management & Session Persistence
 * 
 * This test simulates complex cart management scenarios including:
 * - Adding/removing items
 * - Updating quantities
 * - Cart persistence across page refreshes
 * - Managing multiple items
 */

// Test configuration at top of file
const testConfig = {
  multiProduct: testScenarios.cartManagement.multiProduct,
  complex: testScenarios.cartManagement.complex,
};

test.describe('Use Case: Cart Management & Session Persistence', () => {
  test('should manage cart with multiple products and quantity changes', async ({ page }) => {
    const config = testConfig.multiProduct;

    // STEP 1: Start with empty cart
    await clearCart(page);
    await page.reload();
    
    // STEP 2: Add multiple products to cart
    for (const product of config.products) {
      await addProductToCart(page, product.category, product.index);
      
      // Add multiple quantities if specified
      for (let i = 1; i < product.quantity; i++) {
        await addProductToCart(page, product.category, product.index);
        await waitForAnimation(page, 200);
      }
    }

    // STEP 3: Verify cart count
    const totalItems = config.products.reduce((sum, p) => sum + p.quantity, 0);
    const cartCount = await getCartCount(page);
    expect(cartCount).toBe(totalItems);

    // STEP 4: Navigate to cart
    await goToCart(page);
    const cartItems = await page.getByTestId(testIds.cartItem).count();
    expect(cartItems).toBeGreaterThanOrEqual(config.products.length);

    // STEP 5: Perform cart actions
    if (config.actions) {
      for (const action of config.actions) {
        const repeatCount = action.repeat || 1;
        
        for (let i = 0; i < repeatCount; i++) {
          switch (action.type) {
            case 'increase':
              await increaseQuantity(page, action.itemIndex);
              break;
            case 'decrease':
              await decreaseQuantity(page, action.itemIndex);
              break;
            case 'remove':
              await removeFromCart(page, action.itemIndex);
              break;
          }
          await waitForAnimation(page, 200);
        }
      }
    }

    // STEP 6: Verify total is still displayed
    await expect(page.getByText(texts.cart.total)).toBeVisible();
  });

  test('should persist cart across page refresh and navigation', async ({ page }) => {
    // STEP 1: Add products to cart
    await addProductToCart(page, testCategories.pixelParla, 0);
    await addProductToCart(page, testCategories.resin, 0);
    
    const initialCount = await getCartCount(page);
    expect(initialCount).toBe(2);

    // STEP 2: Refresh page
    await page.reload();
    await waitForAnimation(page, 300);
    
    // STEP 3: Verify cart persisted
    const countAfterRefresh = await getCartCount(page);
    expect(countAfterRefresh).toBe(initialCount);

    // STEP 4: Navigate to different pages
    await page.goto(paths.shop);
    await page.goto(paths.about);
    await page.goto(paths.home);

    // STEP 5: Verify cart still persisted
    const countAfterNavigation = await getCartCount(page);
    expect(countAfterNavigation).toBe(initialCount);

    // STEP 6: Go to cart and verify items are there
    await goToCart(page);
    const cartItems = await page.getByTestId(testIds.cartItem).count();
    expect(cartItems).toBe(2);
  });

  test('should handle complex cart operations and maintain consistency', async ({ page }) => {
    const config = testConfig.complex;

    // STEP 1: Start with empty cart
    await clearCart(page);
    await page.reload();

    // STEP 2: Add all products
    for (const product of config.products) {
      for (let i = 0; i < product.quantity; i++) {
        await addProductToCart(page, product.category, product.index);
        await waitForAnimation(page, 150);
      }
    }

    // STEP 3: Verify total cart count
    const totalItems = config.products.reduce((sum, p) => sum + p.quantity, 0);
    const cartCount = await getCartCount(page);
    expect(cartCount).toBe(totalItems);

    // STEP 4: Go to cart
    await goToCart(page);
    
    // STEP 5: Increase quantity of first item
    await increaseQuantity(page, 0);
    await waitForAnimation(page, 200);
    
    // STEP 6: Decrease quantity of second item
    await decreaseQuantity(page, 1);
    await waitForAnimation(page, 200);
    
    // STEP 7: Remove third item
    const initialItemCount = await page.getByTestId(testIds.cartItem).count();
    await removeFromCart(page, 2);
    await waitForAnimation(page, 300);
    
    // STEP 8: Verify item was removed
    const finalItemCount = await page.getByTestId(testIds.cartItem).count();
    expect(finalItemCount).toBeLessThan(initialItemCount);

    // STEP 9: Verify total is updated
    await expect(page.getByText(texts.cart.total)).toBeVisible();
  });

  test('should clear entire cart and verify empty state', async ({ page }) => {
    // STEP 1: Add multiple products
    await addProductToCart(page, testCategories.pixelParla, 0);
    await addProductToCart(page, testCategories.resin, 0);
    await addProductToCart(page, testCategories.junior, 0);

    // STEP 2: Verify cart has items
    const initialCount = await getCartCount(page);
    expect(initialCount).toBeGreaterThan(0);

    // STEP 3: Go to cart
    await goToCart(page);
    
    // STEP 4: Remove all items one by one
    let cartItems = await page.getByTestId(testIds.cartItem).count();
    
    while (cartItems > 0) {
      await removeFromCart(page, 0);
      await waitForAnimation(page, 300);
      cartItems = await page.getByTestId(testIds.cartItem).count();
    }

    // STEP 5: Verify empty cart message
    await verifyCartIsEmpty(page);

    // STEP 6: Verify cart badge shows 0 or is not visible
    const finalCount = await getCartCount(page);
    expect(finalCount).toBe(0);
  });

  test('should handle rapid cart updates without errors', async ({ page }) => {
    // STEP 0: Clear cart first to ensure clean state
    await clearCart(page);
    await page.reload();
    
    // STEP 1: Rapidly add products (use product with higher stock)
    for (let i = 0; i < 5; i++) {
      await addProductToCart(page, testCategories.pixelParla, 1); // Index 1 = mario-mushrooms-red (stock: 8)
    }

    // STEP 2: Go to cart
    await goToCart(page);
    await expect(page.getByTestId(testIds.cartItem).first()).toBeVisible();

    // STEP 3: Rapidly increase quantity
    for (let i = 0; i < 3; i++) {
      await increaseQuantity(page, 0);
      await page.waitForTimeout(50); // Very short wait
    }

    // STEP 4: Verify cart is still functional
    await expect(page.getByText(texts.cart.total)).toBeVisible();
    
    // STEP 5: Verify cart count is accurate
    const finalCount = await getCartCount(page);
    expect(finalCount).toBeGreaterThan(0);
  });

  test('should maintain cart state during shopping journey', async ({ page }) => {
    // STEP 1: Add first product
    await addProductToCart(page, testCategories.pixelParla, 0);
    
    // STEP 2: Browse other categories (simulate window shopping)
    await page.goto(paths.resin);
    await expect(page.getByTestId(testIds.productCard).first()).toBeVisible();
    
    await page.goto(paths.junior);
    await expect(page.getByTestId(testIds.productCard).first()).toBeVisible();

    // STEP 3: Add another product
    await addProductToCart(page, testCategories.resin, 0);

    // STEP 4: View product details without adding
    await page.goto(paths.junior);
    await page.getByTestId(testIds.productCard).first().click();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // STEP 5: Go back and add third product
    await addProductToCart(page, testCategories.junior, 0);

    // STEP 6: Verify all products are in cart
    const finalCount = await getCartCount(page);
    expect(finalCount).toBe(3);

    // STEP 7: Go to cart and verify all items
    await goToCart(page);
    const cartItems = await page.getByTestId(testIds.cartItem).count();
    expect(cartItems).toBe(3);
  });

  test('should update cart totals correctly after quantity changes', async ({ page }) => {
    // STEP 1: Add product to cart
    await addProductToCart(page, testCategories.pixelParla, 0);
    await goToCart(page);

    // STEP 2: Get initial total
    const initialTotalText = await page.getByText(texts.cart.total).locator('..').textContent();
    const initialTotal = parseInt(initialTotalText?.replace(/\D/g, '') || '0');

    // STEP 3: Increase quantity
    await increaseQuantity(page, 0);
    await waitForAnimation(page, 300);

    // STEP 4: Get new total
    const newTotalText = await page.getByText(texts.cart.total).locator('..').textContent();
    const newTotal = parseInt(newTotalText?.replace(/\D/g, '') || '0');

    // STEP 5: Verify total increased
    expect(newTotal).toBeGreaterThan(initialTotal);

    // STEP 6: Decrease quantity
    await decreaseQuantity(page, 0);
    await waitForAnimation(page, 300);

    // STEP 7: Verify total decreased
    const finalTotalText = await page.getByText(texts.cart.total).locator('..').textContent();
    const finalTotal = parseInt(finalTotalText?.replace(/\D/g, '') || '0');
    expect(finalTotal).toBeLessThan(newTotal);
  });
});
