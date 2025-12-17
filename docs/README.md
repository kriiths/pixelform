# Documentation

This folder contains all project documentation organized by category.

## Contents

### System Documentation
- **PRODUCT_SYSTEM_GUIDE.md** - Complete guide to the dynamic product system
- **DYNAMIC_PRODUCTS_SUMMARY.md** - Overview of the filesystem-based product architecture
- **PRODUCT_FOLDER_TREE.md** - Visual representation of the product folder structure

### Development Guidelines
- **NO_HARD_CODED_STRINGS.md** - Localization and string management guidelines
- **IMPLEMENTATION_COMPLETE.md** - Implementation status and features
- **RESTRUCTURING_SUMMARY.md** - Summary of major code restructuring

### Change History
- **CHANGELOG.md** - Version history and changes
- **UPDATES_DEC_17_2025.md** - Specific updates from December 17, 2025

### Quick Start
- **QUICK_START.md** - Getting started guide for developers

## Project Structure

```
pixelverk/
├── docs/               # This folder
├── public/
│   └── products/       # Dynamic product data folders
│       ├── pixelparla/
│       ├── resin/
│       └── junior/
├── src/
│   ├── app/            # Next.js App Router pages
│   ├── components/     # React components
│   └── lib/            # Utilities and types
└── tests/              # E2E tests (coming soon)
```

## Key Technologies

- Next.js 16.0.10 (App Router with Turbopack)
- React 19.2.1
- TypeScript 5
- Tailwind CSS 4
- Playwright (for E2E testing)

## Testing and TestID Convention

- **No hardcoded `data-testid` values**: All test IDs are defined in `src/lib/testids.ts` (for source code) and re-exported in `tests/tests.ts` (for Playwright tests).
- **How to use**: Import `TEST_IDS` and use as `data-testid={TEST_IDS.PRODUCT_CARD}` etc. in components and as selectors in tests.
- **Why**: This ensures consistency, prevents typos, and makes it easy to update test IDs project-wide.

See also: `NO_HARD_CODED_STRINGS.md` for more on string management.

### TestID Convention (Camel Case, Single Source)

- All `data-testid` values use camelCase (e.g., `productCard`, `addToCartButton`).
- The single source of truth is `src/lib/testids.ts` (exported as `testIds`).
- Tests import from `tests/tests.ts`, which re-exports from `src/lib/testids.ts`.
- Add new test IDs to `testIds` and use them in both source and tests.
- Example usage:
  - In components: `<div data-testid={testIds.productCard}>`
  - In tests: `page.locator(`[data-testid="${testIds.productCard}"]`)`

This ensures consistency, prevents typos, and makes updating test IDs easy.
