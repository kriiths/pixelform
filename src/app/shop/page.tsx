import { loadAllProducts } from './data/loader';
import ShopClient from './ShopClient';

export default async function Shop() {
  const allProducts = await loadAllProducts();

  return (
    <ShopClient 
      pixelparla={allProducts.pixelparla} 
      resin={allProducts.resin} 
      junior={allProducts.junior} 
    />
  );
}