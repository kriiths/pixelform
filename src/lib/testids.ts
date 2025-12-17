// Centralized data-testid constants for components (camelCase)
// Using 'as const' for type safety - keys and values are identical by convention
export const testIds = {
  // Product components
  productCard: 'productCard',
  addToCartButton: 'addToCartButton',

  // Cart components
  cartItem: 'cartItem',
  decreaseQuantityButton: 'decreaseQuantityButton',
  increaseQuantityButton: 'increaseQuantityButton',
  removeFromCartButton: 'removeFromCartButton',
  cartBadge: 'cartBadge',

  // Navigation
  headerNav: 'headerNav',
  shopDropdown: 'shopDropdown',
  mobileMenuButton: 'mobileMenuButton',
  mobileMenu: 'mobileMenu',

  // Product detail page
  productDetailContainer: 'productDetailContainer',
  prevImageButton: 'prevImageButton',
  nextImageButton: 'nextImageButton',
  backToShopLink: 'backToShopLink',

  // Shop page
  sortSelect: 'sortSelect',

  // Footer
  footer: 'footer',
} as const;

// Type helper for testId values
export type TestId = typeof testIds[keyof typeof testIds];
