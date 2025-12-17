# Getting Started with Testing

## Quick Start

Your Pixelverk project now has a complete E2E testing setup with Playwright!

## Installation Complete ✅

- ✅ Playwright installed (`@playwright/test`)
- ✅ Test configuration created (`playwright.config.ts`)
- ✅ Test suite created (4 test files, 20+ tests)
- ✅ NPM scripts configured
- ✅ Documentation organized in `docs/` folder

## Run Your First Tests

### 1. Install browser binaries (first time only)
```bash
npx playwright install
```

### 2. Run all tests
```bash
npm test
```

### 3. Run tests with UI (recommended)
```bash
npm run test:ui
```

The UI mode is great for:
- Seeing tests run in real-time
- Debugging failures
- Understanding what tests are checking
- Writing new tests

## What Tests Are Included?

### Homepage Tests
- Page loads successfully
- All category cards visible (Pixelpärlor, Resin, Junior)
- Navigation works

### Shop Tests
- Product listing
- Category filtering
- Sorting by price
- Product detail pages

### Cart Tests
- Add/remove products
- Update quantities
- **Stock limits validation** ⭐
- Price calculations
- Cart badge updates

### Checkout Tests
- Navigation to checkout
- Form display
- Empty cart handling

## Test Coverage Map

```
Homepage (/)
    ↓
Shop (/shop)
    ↓
Category (/shop/pixelparla)
    ↓
Product (/shop/pixelparla/geometric-rainbow)
    ↓ [Add to Cart]
Cart (/cart)
    ↓
Checkout (/checkout)
```

All these paths are tested! ✅

## Next Actions

1. **Run the test suite**:
   ```bash
   npx playwright install  # First time only
   npm run test:ui         # Run with UI
   ```

2. **Review test results** - All tests should pass!

3. **Explore the tests** - Look at files in `tests/` folder

4. **Read the guide** - See [docs/TESTING.md](TESTING.md) for details

## Documentation Structure

All documentation is now organized in the `docs/` folder:

```
docs/
├── README.md                      # Documentation index
├── TESTING.md                     # Complete testing guide
├── TESTING_SETUP_SUMMARY.md       # This setup summary
├── PRODUCT_SYSTEM_GUIDE.md        # How the product system works
├── DYNAMIC_PRODUCTS_SUMMARY.md    # Architecture overview
├── QUICK_START.md                 # Project quick start
└── ... (8 more documentation files)
```

## Key Features of Test Setup

### 1. Automatic Dev Server
Tests automatically start your Next.js dev server - no manual setup needed!

### 2. Multi-Browser Testing
Tests run on:
- Chromium (Chrome/Edge)
- Firefox
- WebKit (Safari)

### 3. Parallel Execution
Tests run in parallel for speed ⚡

### 4. Smart Waiting
Playwright automatically waits for elements - no flaky tests!

### 5. Detailed Reports
HTML reports show exactly what happened in each test

## Troubleshooting

### Tests won't run?
```bash
# Install browser binaries
npx playwright install

# Check dev server isn't already running
# Stop any existing dev server, Playwright will start it
```

### Want to see the browser?
```bash
npm run test:headed
```

### Need to debug a test?
```bash
npm run test:debug
```

## What's Been Fixed Recently

### Cart Badge (Header)
- ✅ Better visibility with white border
- ✅ Shadow for depth
- ✅ Improved positioning

### Sort Options
- ✅ Removed "newest" (no date tracking)
- ✅ Default to alphabetical sorting
- ✅ Three options: Name, Price (Low), Price (High)

## Ready for CI/CD

The test configuration is optimized for continuous integration:
- Automatic retries on failure
- Sequential execution on CI
- Fail on `.only` tests
- HTML reports for artifacts

See [docs/TESTING.md](TESTING.md) for GitHub Actions example.

## Resources

- **Main docs**: [docs/README.md](README.md)
- **Testing guide**: [docs/TESTING.md](TESTING.md)
- **Playwright docs**: https://playwright.dev/

## Questions?

Check the documentation in the `docs/` folder, especially:
- `TESTING.md` - Complete testing guide
- `PRODUCT_SYSTEM_GUIDE.md` - How products work
- `QUICK_START.md` - General project setup

---

**Status**: ✅ Ready to test!
**Next step**: Run `npm run test:ui` and explore! 🚀
