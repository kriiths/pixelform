import { test, expect } from './fixtures';
import { texts, paths } from '../src/app/content/texts';

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    // Check that the main heading is visible
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should display all category cards from instruction file', async ({ page }) => {
    const categories = Object.values(texts.shop.categories);
    for (const category of categories) {
      await expect(page.getByRole('link', { name: category })).toBeVisible();
    }
  });

  test('should navigate to shop when clicking first category card', async ({ page }) => {
    // Click on the first category card (order: pixelparla, resin, junior)
    const categories = Object.values(texts.shop.categories);
    const categoryLinks = [paths.pixelParla, paths.resin, paths.junior];
    await page.getByRole('link', { name: categories[0] }).first().click();
    await expect(page).toHaveURL(categoryLinks[0]);
  });

  test('should have working header navigation', async ({ page }) => {
    // Check header links exist (shop, about, cart)
    const navLinks = [texts.nav.shop, texts.nav.about, texts.nav.cart];
    for (const nav of navLinks) {
      await expect(page.getByRole('link', { name: nav })).toBeVisible();
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
    const categories = Object.values(texts.shop.categories);
    for (const category of categories) {
      const card = page.getByRole('link', { name: category });
      await expect(card).toHaveAttribute('tabindex');
      await expect(card).toBeVisible();
    }
  });
});
