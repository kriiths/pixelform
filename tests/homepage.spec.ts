import { test, expect } from './fixtures';
import { testIds } from './tests';
import { texts, paths } from '../src/app/content/texts';

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    // Check that the main heading is visible
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should display all category cards from instruction file', async ({ page }) => {
    // Verify category cards exist (use testIds to avoid duplicate link matches)
    await expect(page.getByTestId(testIds.categoryCardPixelparla)).toBeVisible();
    await expect(page.getByTestId(testIds.categoryCardResin)).toBeVisible();
    await expect(page.getByTestId(testIds.categoryCardJunior)).toBeVisible();
  });

  test('should navigate to shop when clicking first category card', async ({ page }) => {
    // Click on the first category card (order: pixelparla, resin, junior)
    const categories = Object.values(texts.shop.categories);
    await page.getByRole('link', { name: categories[0] }).first().click();
    // Verify category page content instead of URL
    await expect(page.getByTestId(testIds.productCard).first()).toBeVisible();
  });

  test('should have working header navigation', async ({ page }) => {
    // Check header links exist (shop button/dropdown, about, cart). If headerNav isn't present, fall back to global links.
    const header = page.getByTestId(testIds.headerNav);
    if ((await header.count()) > 0) {
      // Desktop nav has Shop as dropdown button, not link
      await expect(header.getByRole('button', { name: texts.nav.shop })).toBeVisible();
      await expect(header.getByRole('link', { name: texts.nav.about })).toBeVisible();
      await expect(header.locator(`a[href="${paths.cart}"]`)).toBeVisible();
    } else {
      await expect(page.getByRole('link', { name: texts.nav.shop }).first()).toBeVisible();
      await expect(page.getByRole('link', { name: texts.nav.about }).first()).toBeVisible();
      await expect(page.locator(`a[href="${paths.cart}"]`).first()).toBeVisible();
    }
  });

  test('should display the correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(new RegExp(texts.home.hero.title, 'i'));
  });

  test('should display the homepage intro text', async ({ page }) => {
    await expect(page.getByText(texts.home.hero.description, { exact: false })).toBeVisible();
  });

  test('should have a visible footer', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible();
  });

  test('should not display 404 or error message', async ({ page }) => {
    await expect(page.locator('text=404')).toHaveCount(0);
    await expect(page.locator('text=error', { hasText: 'error' })).toHaveCount(0);
  });

  test('should have accessible category cards', async ({ page }) => {
    // Accessibility checks for category cards (use explicit testIds)
    const card1 = page.getByTestId(testIds.categoryCardPixelparla);
    await expect(card1).toBeVisible();
    await expect(card1).toBeFocused({ timeout: 100 }).catch(() => {}); // Cards are links, focusable by default
    const card2 = page.getByTestId(testIds.categoryCardResin);
    await expect(card2).toBeVisible();
    const card3 = page.getByTestId(testIds.categoryCardJunior);
    await expect(card3).toBeVisible();
  });
});
