import { test, expect } from '../fixtures';
import { testIds } from '../tests';
import { texts, paths } from '../../src/app/content/texts';
import {
  goToCategory,
  viewProductDetails,
  getProductCount,
  addProductToCart,
  getCartCount,
} from '../helpers';

/**
 * FULL CHAIN USE CASE 2: Category Browsing & Product Discovery
 * 
 * This test simulates a user exploring different categories and comparing products.
 * 
 * Configurable Options:
 * - categories: Which categories to browse (array of category names)
 * - compareProducts: Whether to compare multiple products
 * - addToWishlist: Simulate adding products to cart as "wishlist"
 */

type BrowsingConfig = {
  categories: Array<'pixelparla' | 'resin' | 'junior'>;
  compareProducts: boolean;
  minProductsPerCategory: number;
};

const defaultConfig: BrowsingConfig = {
  categories: ['pixelparla', 'resin', 'junior'],
  compareProducts: true,
  minProductsPerCategory: 1,
};

test.describe('Use Case: Category Browsing & Product Discovery', () => {
  test('should browse all categories from homepage', async ({ page }) => {
    const config = defaultConfig;

    // STEP 1: Start from homepage and verify category cards
    await expect(page.getByTestId(testIds.heroTitle)).toBeVisible();
    await expect(page.getByTestId(testIds.categoryCardPixelparla)).toBeVisible();
    await expect(page.getByTestId(testIds.categoryCardResin)).toBeVisible();
    await expect(page.getByTestId(testIds.categoryCardJunior)).toBeVisible();

    // STEP 2: Browse each category
    for (const category of config.categories) {
      // Navigate to category
      await goToCategory(page, category);

      // Verify products are displayed
      const productCount = await getProductCount(page);
      expect(productCount).toBeGreaterThanOrEqual(config.minProductsPerCategory);

      // Verify category name is displayed
      const categoryName = texts.shop.categories[category];
      await expect(page.getByText(categoryName)).toBeVisible();
    }

    // STEP 3: Return to homepage
    await page.goto(paths.home);
    await expect(page.getByTestId(testIds.heroTitle)).toBeVisible();
  });

  test('should compare products across different categories', async ({ page }) => {
    const productDetails: Array<{ name: string; category: string; price: string }> = [];

    // STEP 1: Browse pixelparla and collect product info
    await goToCategory(page, 'pixelparla');
    await viewProductDetails(page, 0);
    
    const pixelProduct = {
      name: await page.locator('h1').textContent() || '',
      category: 'pixelparla',
      price: await page.locator('text=/\\d+ kr/').first().textContent() || '',
    };
    productDetails.push(pixelProduct);

    // STEP 2: Browse resin and collect product info
    await goToCategory(page, 'resin');
    await viewProductDetails(page, 0);
    
    const resinProduct = {
      name: await page.locator('h1').textContent() || '',
      category: 'resin',
      price: await page.locator('text=/\\d+ kr/').first().textContent() || '',
    };
    productDetails.push(resinProduct);

    // STEP 3: Verify we collected different products
    expect(productDetails[0].name).not.toBe(productDetails[1].name);
    expect(productDetails.length).toBe(2);

    // STEP 4: Navigate to main shop page to see all categories
    await page.goto(paths.shop);
    
    // Should show all category headers
    await expect(page.getByText(texts.shop.categories.pixelparla)).toBeVisible();
    await expect(page.getByText(texts.shop.categories.resin)).toBeVisible();
    await expect(page.getByText(texts.shop.categories.junior)).toBeVisible();
  });

  test('should use navigation to explore different categories', async ({ page }) => {
    // STEP 1: Use header navigation to browse categories
    await page.getByRole('link', { name: texts.nav.shop }).first().click();
    
    // Should be on shop page
    await expect(page).toHaveURL(paths.shop);

    // STEP 2: Navigate via category links in header dropdown (if exists)
    // Click on pixelparla category
    await page.goto(paths.pixelParla);
    await expect(page).toHaveURL(paths.pixelParla);
    await expect(page.getByTestId(testIds.productCard).first()).toBeVisible();

    // STEP 3: Navigate to resin category
    await page.goto(paths.resin);
    await expect(page).toHaveURL(paths.resin);
    await expect(page.getByTestId(testIds.productCard).first()).toBeVisible();

    // STEP 4: Navigate to junior category
    await page.goto(paths.junior);
    await expect(page).toHaveURL(paths.junior);
    await expect(page.getByTestId(testIds.productCard).first()).toBeVisible();
  });

  test('should add products from multiple categories to cart while browsing', async ({ page }) => {
    const config = {
      productsToAdd: [
        { category: 'pixelparla' as const, index: 0 },
        { category: 'resin' as const, index: 0 },
        { category: 'junior' as const, index: 0 },
      ],
    };

    let expectedCartCount = 0;

    // STEP 1: Browse and add products from each category
    for (const product of config.productsToAdd) {
      await goToCategory(page, product.category);
      
      // Verify we're in the right category
      await expect(page.getByTestId(testIds.productCard).first()).toBeVisible();
      
      // Add product to cart
      await addProductToCart(page, product.category, product.index);
      expectedCartCount++;
      
      // Verify cart count increased
      const currentCount = await getCartCount(page);
      expect(currentCount).toBe(expectedCartCount);
    }

    // STEP 2: Verify final cart state
    const finalCartCount = await getCartCount(page);
    expect(finalCartCount).toBe(config.productsToAdd.length);

    // STEP 3: Navigate to cart to see all added items
    await page.goto(paths.cart);
    const cartItems = await page.getByTestId(testIds.cartItem).count();
    expect(cartItems).toBe(config.productsToAdd.length);
  });

  test('should view product details and return to category', async ({ page }) => {
    // STEP 1: Navigate to a category
    await goToCategory(page, 'pixelparla');

    // STEP 2: View first product
    await viewProductDetails(page, 0);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // STEP 3: Go back to category using back link
    await page.getByTestId(testIds.backToShopLink).click();
    await expect(page).toHaveURL(paths.shop);

    // STEP 4: Navigate to category again
    await goToCategory(page, 'pixelparla');
    
    // STEP 5: View second product
    await viewProductDetails(page, 1);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('should browse products using sort functionality', async ({ page }) => {
    // STEP 1: Navigate to shop page
    await page.goto(paths.shop);

    // STEP 2: Change sort order (if sort dropdown exists)
    const sortSelect = page.getByTestId(testIds.sortSelect);
    if (await sortSelect.isVisible()) {
      await sortSelect.selectOption('priceLow');
      await page.waitForTimeout(300);
      
      // Verify products are still visible
      await expect(page.getByTestId(testIds.productCard).first()).toBeVisible();
    }

    // STEP 4: Browse different categories with different sort orders
    await goToCategory(page, 'resin');
    const resinProducts = await getProductCount(page);
    expect(resinProducts).toBeGreaterThan(0);
  });

  test('should explore all products in a specific category', async ({ page }) => {
    const config = {
      category: 'pixelparla' as const,
      exploreCount: 3, // How many products to view
    };

    // STEP 1: Navigate to category
    await goToCategory(page, config.category);
    const totalProducts = await getProductCount(page);
    
    const productsToExplore = Math.min(config.exploreCount, totalProducts);
    const viewedProducts: string[] = [];

    // STEP 2: View multiple products
    for (let i = 0; i < productsToExplore; i++) {
      await goToCategory(page, config.category);
      await viewProductDetails(page, i);
      
      // Collect product name
      const productName = await page.locator('h1').textContent();
      if (productName) {
        viewedProducts.push(productName);
      }
    }

    // STEP 3: Verify we viewed different products
    const uniqueProducts = new Set(viewedProducts);
    expect(uniqueProducts.size).toBe(productsToExplore);
  });
});
