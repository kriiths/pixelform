
// Centralized data-testid constants for components (camelCase)
// Using 'as const' for type safety - keys and values are identical by convention
export const testIds = {
  // Product components
  productCard: 'productCard',
  addToCartCardButton: 'addToCartCardButton',
  addToCartPageButton: 'addToCartPageButton',
  productName: 'product-name',
  cartItemName: 'cart-item-name',
  productPrice: 'product-price',
  productDescription: 'product-description',
  productStockBadge: 'product-stock-badge',
  
  // Cart components
  cartItem: 'cartItem',
  decreaseQuantityButton: 'decreaseQuantityButton',
  increaseQuantityButton: 'increaseQuantityButton',
  removeFromCartButton: 'removeFromCartButton',
  cartBadge: 'cartBadge',
  clearCartButton: 'clearCartButton',

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

  // Homepage
  heroTitle: 'heroTitle',
  heroDescription: 'heroDescription',
  categoryCard: 'categoryCard',
  categoryCardPixelparla: 'categoryCardPixelparla',
  categoryCardResin: 'categoryCardResin',
  categoryCardJunior: 'categoryCardJunior',

  // Checkout
  checkoutForm: 'checkoutForm',
  orderSummary: 'orderSummary',
  submitOrderButton: 'submitOrderButton',
  checkoutNameInput: 'checkoutNameInput',
  checkoutEmailInput: 'checkoutEmailInput',
  checkoutAddressInput: 'checkoutAddressInput',

  // Footer
  footer: 'footer',
} as const;

// Type helper for testId values
export type TestId = typeof testIds[keyof typeof testIds];
