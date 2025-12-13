export type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string; // main image (for backward compatibility)
  images?: string[]; // optional array of images
};