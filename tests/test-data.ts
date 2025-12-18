import type { Category } from '@/lib/types';

/**
 * Centralized test data configuration
 * All test data should be defined here to avoid hardcoded values throughout tests
 */

// Category constants

export const testCategories = {
  pixelParla: 'pixelparla' as Category,
  resin: 'resin' as Category,
  junior: 'junior' as Category,
} as const;

export const allCategories: Category[] = [
  testCategories.pixelParla,
  testCategories.resin,
  testCategories.junior,
];

// Product indices for reliable testing
export const testProducts = {
  pixelParla: {
    beerings: { index: 0, stock: 3 }, // Ölhängen
    marioMushrooms: { index: 1, stock: 8 }, // Mario Svampar - Röd
    pixelHeart: { index: 2, stock: 5 }, // Pixel Hjärt-örhänge
  },
  resin: {
    blackFish: { index: 0, stock: 2 }, // Svart fisk i resin
    musicNotes: { index: 1, stock: 4 }, // Musik noter
  },
  junior: {
    pixelStar: { index: 0, stock: 6 }, // Pixel-Stjärna
  },
} as const;

// Customer test data
export const testCustomers = {
  default: {
    name: 'Test Testsson',
    email: 'test@example.com',
    address: 'Testgatan 1, 12345 Stockholm',
  },
  anna: {
    name: 'Anna Andersson',
    email: 'anna@example.com',
    address: 'Storgatan 10, 11122 Stockholm',
  },
  cecilia: {
    name: 'Cecilia Carlsson',
    email: 'cecilia@example.com',
    address: 'Drottninggatan 5, 11151 Stockholm',
  },
} as const;

// Test scenarios for use cases
export const testScenarios = {
  cartManagement: {
    multiProduct: {
      products: [
        { category: testCategories.pixelParla, index: 0, quantity: 2 },
        { category: testCategories.resin, index: 0, quantity: 1 },
      ],
      actions: [
        { type: 'increase' as 'increase' | 'decrease' | 'remove', itemIndex: 0, repeat: 1 },
        { type: 'decrease' as 'increase' | 'decrease' | 'remove', itemIndex: 1, repeat: 1 },
      ],
    },
    complex: {
      products: [
        { category: testCategories.pixelParla, index: 0, quantity: 3 },
        { category: testCategories.resin, index: 0, quantity: 2 },
        { category: testCategories.junior, index: 0, quantity: 1 },
      ],
      actions: [
        { type: 'increase' as 'increase' | 'decrease' | 'remove', itemIndex: 0, repeat: 2 },
        { type: 'increase' as 'increase' | 'decrease' | 'remove', itemIndex: 1, repeat: 1 },
        { type: 'decrease' as 'increase' | 'decrease' | 'remove', itemIndex: 2, repeat: 1 },
      ],
    },
  },
  browsing: {
    allCategories: {
      categories: allCategories,
      minProductsPerCategory: 1,
      compareProducts: true,
    },
  },
  purchase: {
    singleProduct: {
      category: testCategories.pixelParla,
      productIndex: 0,
      customer: testCustomers.default,
    },
    multiCategory: {
      products: [
        { category: testCategories.pixelParla, index: 0 },
        { category: testCategories.resin, index: 0 },
        { category: testCategories.junior, index: 0 },
      ],
      customer: testCustomers.cecilia,
    },
  },
} as const;

// Non-existent product IDs for error handling tests
export const invalidProductIds = {
  pixelParla: 'non-existent-product-12345',
  resin: 'fake-product-xyz',
  junior: 'missing-item-abc',
  generic: 'non-existent-999',
} as const;
