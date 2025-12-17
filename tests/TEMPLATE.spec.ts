# Test File Template - REQUIRED STRUCTURE

/**
 * ⚠️ CRITICAL: This test file MUST follow centralized content guidelines
 * 
 * ALL paths MUST come from: import { paths } from '../src/app/content/texts'
 * ALL text strings MUST come from: import { texts } from '../src/app/content/texts'
 * ALL test IDs MUST come from: import { testIds } from './tests'
 * 
 * ❌ NO HARDCODED PATHS: Never use '/shop', '/cart', etc.
 * ❌ NO HARDCODED STRINGS: Never use 'Add to Cart', 'Shop', etc.
 * 
 * ✅ USE: paths.shop, paths.cart, texts.product.addToCart, etc.
 * 
 * See docs/CENTRALIZED_CONTENT_GUIDE.md for complete guidelines.
 */

import { test, expect } from './fixtures';
import { testIds } from './tests';
import { texts, paths } from '../src/app/content/texts';

test.describe('Your Test Suite Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup code here
  });

  test('should do something', async ({ page }) => {
    // ✅ CORRECT: Use paths.*
    await page.goto(paths.shop);
    
    // ✅ CORRECT: Use texts.*
    await expect(page.getByText(texts.shop.title)).toBeVisible();
    
    // ✅ CORRECT: Use testIds.*
    await page.getByTestId(testIds.productCard).click();
    
    // ✅ CORRECT: Assert URLs with paths.*
    await expect(page).toHaveURL(paths.cart);
  });
});
