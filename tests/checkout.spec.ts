import { test, expect } from './fixtures';
import { testIds } from './tests';
import { texts, paths } from '../src/app/content/texts';

test.describe('Checkout', () => {
  test.beforeEach(async ({ page }) => {
    // Clear cart and add a product
    await page.evaluate(() => localStorage.clear());
    // Add product to cart
    await page.goto(paths.pixelParla);
    await page.getByTestId(testIds.productCard).first().getByTestId(testIds.addToCartCardButton).click();
  });

  test('should navigate to checkout from cart', async ({ page }) => {
    await page.goto(paths.cart);
    // Click checkout button
    // Try both possible button names
    let checkoutButton = page.getByRole('link', { name: texts.cart.goToCheckout });
    if (!(await checkoutButton.isVisible())) {
      checkoutButton = page.getByRole('link', { name: texts.nav.checkout });
    }
    await checkoutButton.click();
    // Should be on checkout page
    await expect(page).toHaveURL(paths.checkout);
  });

  test('should display checkout page content', async ({ page }) => {
    await page.goto(paths.checkout);
    // Should show checkout heading or form
    await expect(page.getByText(texts.checkout.title)).toBeVisible();
  });

  test('should not allow checkout with empty cart', async ({ page }) => {
    // Clear cart
    await page.evaluate(() => localStorage.clear());
    
    await page.goto(paths.cart);
    
    // Checkout button should not be available or cart should show empty state
    const isEmpty = await page.getByText(texts.cart.empty).isVisible();
    
    if (!isEmpty) {
      // If button exists, it should navigate back or show error
      let checkoutButton = page.getByRole('link', { name: texts.cart.goToCheckout });
      if (!(await checkoutButton.isVisible())) {
        checkoutButton = page.getByRole('link', { name: texts.nav.checkout });
      }
      await expect(checkoutButton).not.toBeVisible();
    }
  });
});
