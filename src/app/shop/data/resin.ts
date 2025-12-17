import { loadProductsByCategory } from './loader';

export async function getResinProducts() {
  return await loadProductsByCategory('resin');
}
