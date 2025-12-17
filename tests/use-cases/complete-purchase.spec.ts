import { test, expect } from '../fixtures';
import { testIds } from '../tests';
import { texts, paths } from '../../src/app/content/texts';
import {
  addProductToCart,
  goToCart,
  getCartCount,
  increaseQuantity,
  fillCheckoutForm,
  waitForAnimation,
} from '../helpers';

/**
 * FULL CHAIN USE CASE 1: Complete Purchase Flow
 * 
 * This test simulates a complete user journey from browsing to checkout.
 * 
 * Configurable Options:
 * - category: Which category to shop from ('pixelparla' | 'resin' | 'junior')
 * - productIndex: Which product to select (0-based index)
 * - quantity: How many items to purchase
 * - customerInfo: Customer details for checkout
 */

type PurchaseConfig = {
  category: 'pixelparla' | 'resin' | 'junior';
  productIndex: number;
  quantity: number;
  customerInfo: {
    name: string;
    email: string;
    address: string;
  };
};

const defaultConfig: PurchaseConfig = {
  category: 'pixelparla',
  productIndex: 0,
  quantity: 2,
  customerInfo: {
    name: 'Anna Andersson',
    email: 'anna@example.com',
    address: 'Storgatan 1, 12345 Stockholm',
  },
};

test.describe('Use Case: Complete Purchase Flow', () => {
  test('should complete full purchase from homepage to checkout confirmation', async ({ page }) => {
    const config = defaultConfig;

    // STEP 1: Start from homepage
    await expect(page.getByTestId(testIds.heroTitle)).toBeVisible();

    // STEP 2: Navigate to category from homepage
    const categoryCardMap = {
      pixelparla: testIds.categoryCardPixelparla,
      resin: testIds.categoryCardResin,
      junior: testIds.categoryCardJunior,
    };
    await page.getByTestId(categoryCardMap[config.category]).click();

    // STEP 3: View category products
    await expect(page.getByTestId(testIds.productCard).first()).toBeVisible();

    // STEP 4: View product details
    await page.getByTestId(testIds.productCard).nth(config.productIndex).click();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // STEP 5: Add product to cart (multiple times if quantity > 1)
    for (let i = 0; i < config.quantity; i++) {
      await page.getByTestId(testIds.addToCartPageButton).click();
      await waitForAnimation(page, 200);
    }

    // STEP 6: Verify cart count in header
    const cartCount = await getCartCount(page);
    expect(cartCount).toBe(config.quantity);

    // STEP 7: Navigate to cart
    await goToCart(page);
    await expect(page.getByTestId(testIds.cartItem).first()).toBeVisible();

    // STEP 8: Verify cart total is displayed
    await expect(page.getByText(texts.cart.total)).toBeVisible();

    // STEP 9: Proceed to checkout
    await page.getByRole('link', { name: new RegExp(texts.cart.goToCheckout, 'i') }).click();
    await expect(page).toHaveURL(paths.checkout);

    // STEP 10: Verify order summary
    await expect(page.getByTestId(testIds.orderSummary)).toBeVisible();

    // STEP 11: Fill checkout form
    await page.getByTestId(testIds.checkoutNameInput).fill(config.customerInfo.name);
    await page.getByTestId(testIds.checkoutEmailInput).fill(config.customerInfo.email);
    await page.getByTestId(testIds.checkoutAddressInput).fill(config.customerInfo.address);

    // STEP 12: Complete order
    await page.getByTestId(testIds.submitOrderButton).click();

    // STEP 13: Verify order confirmation
    await expect(page.getByText(texts.checkout.thankYou)).toBeVisible();
    await expect(page.getByText(new RegExp(texts.checkout.orderNumber))).toBeVisible();

    // STEP 14: Verify cart is cleared
    const finalCartCount = await getCartCount(page);
    expect(finalCartCount).toBe(0);
  });

  test('should handle purchase with quantity adjustment in cart', async ({ page }) => {
    const config: PurchaseConfig = {
      category: 'resin',
      productIndex: 0,
      quantity: 1,
      customerInfo: {
        name: 'Bengt Bengtsson',
        email: 'bengt@example.com',
        address: 'Vasagatan 10, 11120 Stockholm',
      },
    };

    // Add product to cart
    await addProductToCart(page, config.category, config.productIndex);

    // Go to cart
    await goToCart(page);

    // Increase quantity in cart
    await increaseQuantity(page, 0);
    await waitForAnimation(page, 200);
    await increaseQuantity(page, 0);
    await waitForAnimation(page, 200);

    // Verify cart count updated
    const cartCount = await getCartCount(page);
    expect(cartCount).toBe(3);

    // Proceed to checkout
    await page.getByRole('link', { name: new RegExp(texts.cart.goToCheckout, 'i') }).click();

    // Fill form and complete
    await fillCheckoutForm(page, config.customerInfo);
    await page.getByTestId(testIds.submitOrderButton).click();

    // Verify success
    await expect(page.getByText(texts.checkout.thankYou)).toBeVisible();
  });

  test('should handle multi-product purchase from different categories', async ({ page }) => {
    const config = {
      customerInfo: {
        name: 'Cecilia Carlsson',
        email: 'cecilia@example.com',
        address: 'Drottninggatan 5, 11151 Stockholm',
      },
    };

    // Add product from pixelparla
    await addProductToCart(page, 'pixelparla', 0);

    // Add product from resin
    await addProductToCart(page, 'resin', 0);

    // Add product from junior
    await addProductToCart(page, 'junior', 0);

    // Verify cart count
    const cartCount = await getCartCount(page);
    expect(cartCount).toBeGreaterThanOrEqual(3);

    // Go to cart and verify multiple items
    await goToCart(page);
    const cartItems = await page.getByTestId(testIds.cartItem).count();
    expect(cartItems).toBeGreaterThanOrEqual(3);

    // Proceed to checkout
    await page.getByRole('link', { name: new RegExp(texts.cart.goToCheckout, 'i') }).click();

    // Complete purchase
    await fillCheckoutForm(page, config.customerInfo);
    await page.getByTestId(testIds.submitOrderButton).click();

    // Verify success
    await expect(page.getByText(texts.checkout.thankYou)).toBeVisible();
  });

  test('should allow returning to shop after successful purchase', async ({ page }) => {
    // Quick purchase
    await addProductToCart(page, 'pixelparla', 0);
    await goToCart(page);
    await page.getByRole('link', { name: new RegExp(texts.cart.goToCheckout, 'i') }).click();
    await fillCheckoutForm(page);
    await page.getByTestId(testIds.submitOrderButton).click();

    // Verify success page
    await expect(page.getByText(texts.checkout.thankYou)).toBeVisible();

    // Click back to shop
    await page.getByRole('link', { name: new RegExp(texts.checkout.backToShop, 'i') }).click();

    // Should be back on shop page
    await expect(page).toHaveURL(paths.shop);
  });
});
