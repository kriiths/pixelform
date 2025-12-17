export type Product = {
  id: string | number; // Support both string (folder name) and number for compatibility
  name: string;
  description: string;
  price: string;
  image: string; // main image (for backward compatibility)
  images?: string[]; // optional array of images
  stock: number;
};