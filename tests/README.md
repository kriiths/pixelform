# Test Suite - Pixelverk

## 🎯 Quick Start

```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/homepage.spec.ts

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run tests in debug mode
npx playwright test --debug
```

---

## 📁 Test Structure

```
tests/
├── fixtures.ts              # Shared test fixtures (page, cartWithItems, emptyCart)
├── helpers.ts               # Reusable test utility functions
├── tests.ts                 # Re-exports testIds from src/lib/testids.ts
├── TEMPLATE.spec.ts         # Template for new test files
│
├── homepage.spec.ts         # Homepage tests (9 tests)
├── shop.spec.ts             # Shop page tests (4 tests)
├── cart.spec.ts             # Cart functionality tests (12 tests)
├── checkout.spec.ts         # Checkout process tests (3 tests)
├── product-detail.spec.ts   # Product page tests (10 tests)
├── error-handling.spec.ts   # Error scenarios tests (10 tests)
│
└── use-cases/               # Full chain integration tests
    ├── complete-purchase.spec.ts      # E2E purchase flow (4 tests)
    ├── category-browsing.spec.ts      # Category exploration (7 tests)
    └── cart-management.spec.ts        # Cart management (8 tests)
```

**Total Tests:** 67 comprehensive tests

---

## ⚠️ CRITICAL: Content Centralization Rules

### **ALL test files MUST:**
1. ✅ Import from centralized content file
2. ✅ Use `paths.*` for ALL URLs
3. ✅ Use `texts.*` for ALL user-facing strings
4. ✅ Use `testIds.*` for ALL test selectors

### **Required Imports:**
```typescript
import { test, expect } from './fixtures';
import { testIds } from './tests';
import { texts, paths } from '../src/app/content/texts';
```

### **Examples:**
```typescript
// ✅ CORRECT
await page.goto(paths.shop);
await expect(page.getByText(texts.shop.title)).toBeVisible();
await page.getByTestId(testIds.productCard).click();

// ❌ WRONG - Hardcoded values
await page.goto('/shop');
await expect(page.getByText('Shop')).toBeVisible();
await page.locator('[data-testid="productCard"]').click();
```

**📖 Full Guidelines:** See [docs/CENTRALIZED_CONTENT_GUIDE.md](../docs/CENTRALIZED_CONTENT_GUIDE.md)

---

## 🔧 Available Helpers

Located in `tests/helpers.ts`:

### Navigation
- `goToCategory(page, category)` - Navigate to specific category
- `goToCart(page)` - Navigate to cart
- `goToCheckout(page)` - Navigate to checkout

### Cart Operations
- `addProductToCart(page, category, index)` - Add product to cart
- `clearCart(page)` - Clear cart via localStorage
- `getCartCount(page)` - Get current cart item count
- `increaseQuantity(page, itemIndex)` - Increase item quantity
- `decreaseQuantity(page, itemIndex)` - Decrease item quantity
- `removeFromCart(page, itemIndex)` - Remove item from cart

### Product Operations
- `viewProductDetails(page, index)` - Click product to view details
- `getProductCount(page)` - Count products on current page
- `getProductPrice(page, index)` - Get product price

### Form & Utility
- `fillCheckoutForm(page, data)` - Fill checkout form
- `waitForAnimation(page, ms)` - Wait for animations
- `verifyCartIsEmpty(page)` - Assert empty cart state

---

## 🧪 Fixtures

Located in `tests/fixtures.ts`:

### Available Fixtures
1. **`page`** - Standard page starting on homepage
2. **`cartWithItems`** - Page with 3 pre-populated cart items
3. **`emptyCart`** - Page with explicitly empty cart

### Usage
```typescript
test('using default page fixture', async ({ page }) => {
  // Starts on homepage automatically
});

test('using cart with items', async ({ cartWithItems }) => {
  // Cart already has 3 items
  await cartWithItems.goto(paths.cart);
});

test('using empty cart', async ({ emptyCart }) => {
  // Cart is guaranteed empty
  await emptyCart.goto(paths.cart);
});
```

---

## 📋 Test Categories

### Unit Tests (Single Feature)
- **homepage.spec.ts** - Hero section, category cards, navigation
- **shop.spec.ts** - Product listing, sorting, filtering
- **cart.spec.ts** - Add/remove items, quantity, persistence
- **checkout.spec.ts** - Checkout flow, form validation
- **product-detail.spec.ts** - Product info, images, stock

### Error Handling Tests
- **error-handling.spec.ts** - 404 pages, empty states, invalid data

### Integration Tests (Full Chain)
- **use-cases/complete-purchase.spec.ts** - Homepage → Shop → Cart → Checkout
- **use-cases/category-browsing.spec.ts** - Multi-category exploration
- **use-cases/cart-management.spec.ts** - Complex cart scenarios

---

## 🎨 Test Patterns

### Pattern 1: Basic Navigation Test
```typescript
test('should navigate to shop', async ({ page }) => {
  await page.getByRole('link', { name: texts.nav.shop }).click();
  await expect(page).toHaveURL(paths.shop);
});
```

### Pattern 2: Form Interaction
```typescript
test('should fill form', async ({ page }) => {
  await page.getByPlaceholder(texts.forms.emailPlaceholder).fill('test@example.com');
  await page.getByTestId(testIds.submitButton).click();
});
```

### Pattern 3: Using Helpers
```typescript
test('should add to cart', async ({ page }) => {
  await addProductToCart(page, 'pixelparla', 0);
  const count = await getCartCount(page);
  expect(count).toBe(1);
});
```

### Pattern 4: Using Fixtures
```typescript
test('should show items', async ({ cartWithItems }) => {
  await goToCart(cartWithItems);
  await expect(cartWithItems.getByTestId(testIds.cartItem)).toHaveCount(3);
});
```

---

## 🚀 Creating New Tests

### Step 1: Copy Template
```bash
cp tests/TEMPLATE.spec.ts tests/my-new-feature.spec.ts
```

### Step 2: Update Test Content
- Keep the header comment with guidelines
- Use centralized imports (paths, texts, testIds)
- Follow existing patterns
- Add to appropriate test category

### Step 3: Check for Hardcoded Values
```bash
# Search for common violations
grep "goto('/" tests/my-new-feature.spec.ts
grep 'goto("/' tests/my-new-feature.spec.ts
```

### Step 4: Run Your Test
```bash
npx playwright test tests/my-new-feature.spec.ts
```

---

## 📊 Test Coverage Goals

| Area | Current | Target |
|------|---------|--------|
| Homepage | 9 tests | ✅ Complete |
| Shop | 4 tests | ✅ Complete |
| Cart | 12 tests | ✅ Complete |
| Checkout | 3 tests | ⚠️ Basic |
| Product Detail | 10 tests | ✅ Complete |
| Error Handling | 10 tests | ✅ Complete |
| Use Cases | 19 tests | ✅ Complete |

---

## 🐛 Debugging Tips

### Test Failing?
1. Run in headed mode: `npx playwright test --headed`
2. Run in debug mode: `npx playwright test --debug`
3. Check if content/paths changed in `texts.ts`
4. Verify test IDs exist in components

### Timeout Errors?
- Increase timeout in test: `test.setTimeout(60000)`
- Add wait helpers: `await waitForAnimation(page)`
- Check if selector is correct

### Flaky Tests?
- Use proper waits: `await expect(...).toBeVisible()`
- Avoid `page.waitForTimeout()` when possible
- Add explicit state checks

---

## 📚 Additional Resources

- **Playwright Docs:** https://playwright.dev/
- **Project Content Guide:** [../docs/CENTRALIZED_CONTENT_GUIDE.md](../docs/CENTRALIZED_CONTENT_GUIDE.md)
- **Test IDs Reference:** [../src/lib/testids.ts](../src/lib/testids.ts)
- **Centralized Content:** [../src/app/content/texts.ts](../src/app/content/texts.ts)

---

## ✅ Pre-Commit Checklist

Before committing test changes:

- [ ] All imports use centralized content (`paths`, `texts`, `testIds`)
- [ ] No hardcoded URLs (search for `goto('/` and `goto("/"`)
- [ ] No hardcoded strings (search for user-facing text)
- [ ] Tests pass locally (`npx playwright test`)
- [ ] Followed existing patterns and structure
- [ ] Added/updated documentation if needed

---

**Remember:** Consistency is key. Follow the patterns, use centralized content, and write tests that are maintainable and readable.
