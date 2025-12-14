export type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  images?: string[];
  stock: number;
};

export type CartItem = {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
  quantity: number;
};

export type Category = 'pixelparla' | 'resin' | 'junior';

export type AccentColor = 'pixel' | 'resin' | 'black';

export const ACCENT_COLORS: Record<AccentColor, string> = {
  pixel: '#E94F64',
  resin: '#4F7FE9',
  black: '#111',
};

export const CATEGORY_ACCENT: Record<Category, AccentColor> = {
  pixelparla: 'pixel',
  resin: 'resin',
  junior: 'black',
};
