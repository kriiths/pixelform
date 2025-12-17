import { loadProductsByCategory } from './loader';

export async function getPixelparlaProducts() {
  return await loadProductsByCategory('pixelparla');
}
