# E2E Testing with Playwright

This project uses [Playwright](https://playwright.dev/) for end-to-end testing across multiple browsers.

## Setup

Playwright is already installed. Browser binaries should be installed with:

```bash
npx playwright install
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests with UI mode (recommended for development)
```bash
npm run test:ui
```

### Run tests in headed mode (see the browser)
```bash
npm run test:headed
```

### Debug tests
```bash
npm run test:debug
```

### View test report
```bash
npm run test:report
```

## Test Structure

```
tests/
├── homepage.spec.ts    # Homepage functionality and navigation
├── shop.spec.ts        # Product browsing, filtering, and sorting
├── cart.spec.ts        # Cart operations and stock validation
└── checkout.spec.ts    # Checkout flow
```

## Test Coverage

### Homepage Tests (`homepage.spec.ts`)
- ✅ Page loads successfully
- ✅ All three category cards displayed (Pixelpärlor, Resin, Junior)
- ✅ Category navigation works
- ✅ Header navigation links present

### Shop Tests (`shop.spec.ts`)
- ✅ All products displayed on main shop page
- ✅ Category filtering works
- ✅ Product sorting (by price)
- ✅ Navigation to product detail pages

### Cart Tests (`cart.spec.ts`)
- ✅ Add product to cart
- ✅ Cart displays items correctly
- ✅ Update product quantity
- ✅ Remove product from cart
- ✅ Stock limits respected
- ✅ Total price calculation

### Checkout Tests (`checkout.spec.ts`)
- ✅ Navigate to checkout from cart
- ✅ Checkout page displays
- ✅ Empty cart validation

## Configuration

Test configuration is in [playwright.config.ts](../playwright.config.ts).

Key settings:
- **Base URL**: `http://localhost:3000`
- **Browsers**: Chromium, Firefox, WebKit
- **Dev server**: Automatically started before tests
- **Parallel execution**: Enabled for faster test runs
- **Retries**: 2 retries on CI, 0 locally

## Writing Tests

### Example Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup before each test
    await page.goto('/');
  });

  test('should do something', async ({ page }) => {
    // Test implementation
    await expect(page.locator('selector')).toBeVisible();
  });
});
```

### Common Patterns

#### Finding elements with data-testid
```typescript
await page.locator('[data-testid="product-card"]')
```

#### Waiting for navigation
```typescript
await expect(page).toHaveURL(/\/shop\/pixelparla/);
```

#### Checking visibility
```typescript
await expect(page.getByRole('button', { name: /add to cart/i })).toBeVisible();
```

#### Clearing localStorage
```typescript
await page.evaluate(() => localStorage.clear());
```

## Test Data

Tests use the existing product data in `public/products/`:
- Pixelpärlor products
- Resin products
- Junior products

Each product folder contains `info.json` with product details that tests can verify.

## CI/CD Integration

The test configuration is optimized for CI environments:
- Tests fail on `test.only` in source code
- Automatic retries on failure (2 retries)
- Sequential execution on CI
- HTML reporter for results

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Troubleshooting

### Tests fail with "page.goto: net::ERR_CONNECTION_REFUSED"
Make sure the dev server is running. Playwright should auto-start it, but you can manually run:
```bash
npm run dev
```

### Browser binaries not found
Install them with:
```bash
npx playwright install
```

### Tests are flaky
- Increase timeout in specific tests: `test.setTimeout(60000)`
- Add explicit waits: `await page.waitForLoadState('networkidle')`
- Use `page.waitForSelector()` for dynamic content

### Debugging failing tests
1. Run with `--headed` flag to see the browser
2. Use `--debug` flag to step through tests
3. Add `await page.pause()` in test to inspect state
4. Check screenshots in test reports

## Best Practices

1. **Use data-testid for test-specific selectors** - More stable than CSS classes
2. **Test user behavior, not implementation** - Focus on what users see and do
3. **Keep tests independent** - Each test should work in isolation
4. **Use beforeEach for setup** - Reset state between tests
5. **Write descriptive test names** - "should add product to cart when clicking button"
6. **Avoid hard-coded waits** - Use Playwright's auto-waiting features
7. **Test critical paths first** - Homepage → Shop → Cart → Checkout

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [VS Code Extension](https://playwright.dev/docs/getting-started-vscode)
