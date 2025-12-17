import { loadProductsByCategory } from './loader';

export async function getJuniorProducts() {
  return await loadProductsByCategory('junior');
}
