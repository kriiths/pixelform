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
