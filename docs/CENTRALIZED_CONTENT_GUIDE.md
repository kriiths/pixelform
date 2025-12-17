# Centralized Strings & Paths - Developer Guide

## 🎯 **MANDATORY RULE: NO HARDCODED STRINGS OR PATHS**

**All test files, components, and pages MUST use centralized strings and paths from the instruction file.**

This is a CRITICAL requirement for maintainability, consistency, and internationalization readiness.

---

## 📍 **Location of Centralized Values**

All centralized values are located in:
```
src/app/content/texts.ts
```

This file exports two main objects:
1. **`paths`** - All URL routes and navigation paths
2. **`texts`** - All user-facing text strings

---

## 🚫 **What NOT to Do (Examples of Bad Code)**

### ❌ **WRONG - Hardcoded Paths:**
```typescript
await page.goto('/shop');
await page.goto('/shop/pixelparla');
await expect(page).toHaveURL('/checkout');
```

### ❌ **WRONG - Hardcoded Strings:**
```typescript
await expect(page.getByText('Lägg i kundvagn')).toBeVisible();
await expect(page.getByRole('link', { name: 'Shop' })).toBeVisible();
```

---

## ✅ **What TO Do (Examples of Correct Code)**

### ✅ **CORRECT - Use Centralized Paths:**
```typescript
import { paths } from '../src/app/content/texts';

await page.goto(paths.shop);
await page.goto(paths.pixelParla);
await expect(page).toHaveURL(paths.checkout);

// For dynamic paths, use helper functions:
await page.goto(paths.productDetail('pixelparla', 'product-id'));
await page.goto(paths.category('resin'));
```

### ✅ **CORRECT - Use Centralized Texts:**
```typescript
import { texts } from '../src/app/content/texts';

await expect(page.getByText(texts.product.addToCart)).toBeVisible();
await expect(page.getByRole('link', { name: texts.nav.shop })).toBeVisible();
await expect(page.getByText(texts.cart.empty)).toBeVisible();
```

---

## 📚 **Available Paths**

```typescript
// Static paths
paths.home          // '/'
paths.shop          // '/shop'
paths.pixelParla    // '/shop/pixelparla'
paths.resin         // '/shop/resin'
paths.junior        // '/shop/junior'
paths.cart          // '/cart'
paths.checkout      // '/checkout'
paths.about         // '/about'

// Dynamic path helpers
paths.productDetail(category, productId)  // '/shop/{category}/{productId}'
paths.category(category)                  // '/shop/{category}'
```

---

## 📖 **Available Text Categories**

```typescript
texts.site        // Site name, tagline, description
texts.currency    // Currency formatting
texts.forms       // Form labels and placeholders
texts.nav         // Navigation labels
texts.shop        // Shop page texts and categories
texts.product     // Product page texts
texts.cart        // Cart page texts
texts.checkout    // Checkout page texts
texts.buttons     // Button labels
texts.home        // Homepage texts
texts.about       // About page texts
texts.junior      // Junior category texts
texts.errors      // Error messages
texts.footer      // Footer texts
```

---

## 🔧 **How to Use in Different Contexts**

### **In Test Files:**
```typescript
import { test, expect } from './fixtures';
import { texts, paths } from '../src/app/content/texts';
import { testIds } from './tests';

test('example test', async ({ page }) => {
  // Navigate using paths
  await page.goto(paths.shop);
  
  // Find elements using texts
  await expect(page.getByText(texts.shop.title)).toBeVisible();
  
  // Click links using texts
  await page.getByRole('link', { name: texts.nav.cart }).click();
  
  // Assert URLs using paths
  await expect(page).toHaveURL(paths.cart);
});
```

### **In Components (React/Next.js):**
```typescript
import Link from 'next/link';
import { texts } from '@/app/content/texts';

export default function MyComponent() {
  return (
    <div>
      <h1>{texts.shop.title}</h1>
      <Link href="/shop">{texts.nav.shop}</Link>
      <button>{texts.buttons.addToCart}</button>
    </div>
  );
}
```

### **In Helper Functions:**
```typescript
import { Page } from '@playwright/test';
import { paths } from '../src/app/content/texts';

export async function goToCart(page: Page) {
  await page.goto(paths.cart);
}

export async function goToCategory(
  page: Page, 
  category: 'pixelparla' | 'resin' | 'junior'
) {
  const categoryPaths = {
    pixelparla: paths.pixelParla,
    resin: paths.resin,
    junior: paths.junior,
  };
  await page.goto(categoryPaths[category]);
}
```

---

## 🎓 **Adding New Strings or Paths**

When you need to add new content:

### **Step 1: Add to texts.ts**
```typescript
// src/app/content/texts.ts
export const paths = {
  // ... existing paths ...
  newPage: '/new-page',
};

export const texts = {
  // ... existing texts ...
  newSection: {
    title: "New Title",
    description: "New Description",
  },
};
```

### **Step 2: Use in Tests/Components**
```typescript
import { texts, paths } from '../src/app/content/texts';

await page.goto(paths.newPage);
await expect(page.getByText(texts.newSection.title)).toBeVisible();
```

---

## 🤖 **Instructions for AI Agents**

When writing or modifying test files:

1. ✅ **ALWAYS** import `texts` and `paths` from `../src/app/content/texts`
2. ✅ **ALWAYS** use `paths.*` for any URL navigation or assertions
3. ✅ **ALWAYS** use `texts.*` for any user-facing text
4. ✅ **NEVER** hardcode URLs like `'/shop'`, `'/cart'`, etc.
5. ✅ **NEVER** hardcode text strings like `'Add to Cart'`, `'Shop'`, etc.
6. ✅ **CHECK** if needed path/text exists in texts.ts before use
7. ✅ **ADD** missing paths/texts to texts.ts if they don't exist

### **Quick Checklist Before Committing Code:**
```bash
# Search for hardcoded paths in tests
grep -r "goto('/" tests/
grep -r 'goto("/' tests/
grep -r "toHaveURL('/" tests/
grep -r 'toHaveURL("/' tests/

# If any results found, replace with paths.* usage
```

---

## 🌍 **Benefits of This Approach**

1. **Single Source of Truth** - All content in one place
2. **Easy Updates** - Change once, updates everywhere
3. **Internationalization Ready** - Easy to add translations
4. **Type Safety** - TypeScript ensures correct usage
5. **Maintainability** - No scattered strings to hunt down
6. **Consistency** - Same text/paths used everywhere
7. **Testing** - Easy to verify correct content is displayed

---

## 🔍 **Common Patterns**

### **Pattern 1: Dynamic Navigation**
```typescript
// Navigate to specific product
const category = 'pixelparla';
const productId = 'pixel-heart-earring';
await page.goto(paths.productDetail(category, productId));
```

### **Pattern 2: Text with Partial Match**
```typescript
// When exact match isn't needed
await expect(page.getByText(texts.home.hero.description, { exact: false })).toBeVisible();
```

### **Pattern 3: Combining with Test IDs**
```typescript
// Use testIds for structure, texts for content
await page.getByTestId(testIds.productCard).getByText(texts.product.price).isVisible();
```

### **Pattern 4: Form Placeholders**
```typescript
await page.getByPlaceholder(texts.forms.emailPlaceholder).fill('test@example.com');
```

---

## ⚠️ **Common Mistakes to Avoid**

1. **Don't** create string constants in test files:
   ```typescript
   // ❌ WRONG
   const SHOP_URL = '/shop';
   ```

2. **Don't** use string interpolation for paths:
   ```typescript
   // ❌ WRONG
   await page.goto(`/shop/${category}`);
   
   // ✅ CORRECT
   await page.goto(paths.category(category));
   ```

3. **Don't** hardcode text even in comments:
   ```typescript
   // ❌ WRONG
   // Click on "Add to Cart" button
   
   // ✅ CORRECT
   // Click on add to cart button (uses texts.product.addToCart)
   ```

---

## 📝 **Summary**

**Remember:** If you see a string or path in your code, ask yourself:
- "Should this come from texts.ts?" → Probably YES
- "Should this use paths.*?" → Probably YES
- "Am I hardcoding this?" → Then DON'T

**When in doubt, check texts.ts first. If it's not there, add it!**

---

_This document should be reviewed by all developers and AI agents working on this project._
