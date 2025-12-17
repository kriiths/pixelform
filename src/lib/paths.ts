// Centralized route paths for use in app and tests
// Use these instead of hardcoded URLs
export const paths = {
  home: '/',
  shop: '/shop',
  pixelParla: '/shop/pixelparla',
  resin: '/shop/resin',
  junior: '/shop/junior',
  cart: '/cart',
  checkout: '/checkout',
  about: '/about',
  // Helper for constructing product detail paths
  productDetail: (category: string, productId: string) => `/shop/${category}/${productId}`,
  // Helper for constructing category paths
  category: (category: string) => `/shop/${category}`,
} as const;

export type PathKey = keyof typeof paths;
