import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check that the main heading is visible
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should display all three category cards', async ({ page }) => {
    await page.goto('/');
    
    // Check for Pixelpärlor category
    await expect(page.getByRole('link', { name: /pixelpärlor/i })).toBeVisible();
    
    // Check for Resin category
    await expect(page.getByRole('link', { name: /resin/i })).toBeVisible();
    
    // Check for Junior category
    await expect(page.getByRole('link', { name: /junior/i })).toBeVisible();
  });

  test('should navigate to shop when clicking category card', async ({ page }) => {
    await page.goto('/');
    
    // Click on Pixelpärlor category
    await page.getByRole('link', { name: /pixelpärlor/i }).first().click();
    
    // Should navigate to pixelparla shop page
    await expect(page).toHaveURL(/\/shop\/pixelparla/);
  });

  test('should have working header navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check header links exist
    await expect(page.getByRole('link', { name: /shop/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /about/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /cart/i })).toBeVisible();
  });
});
