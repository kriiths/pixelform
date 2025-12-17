'use server';

import fs from 'fs';
import path from 'path';
import type { Product } from '@/lib/types';
import { texts } from '@/app/content/texts';

const PRODUCTS_DIR = path.join(process.cwd(), 'public', 'products');

// Error message constants
const ERROR_MESSAGES = {
  categoryNotFound: (category: string) => `${texts.shop.categories[category as keyof typeof texts.shop.categories] || category}`,
  productInfoMissing: (category: string, product: string) => `info.json ${texts.product.notFound.toLowerCase()}: ${category}/${product}`,
  productLoadError: (category: string, product: string) => `${texts.errors?.loadError || 'Error loading product'}: ${category}/${product}`,
};

/**
 * Dynamically loads products from the file system
 * Reads from public/products/{category}/{productId}/info.json
 * Images are automatically detected from public/products/{category}/{productId}/images/
 */
export async function loadProductsByCategory(category: string): Promise<Product[]> {
  const categoryPath = path.join(PRODUCTS_DIR, category);
  
  // Check if category directory exists
  if (!fs.existsSync(categoryPath)) {
    console.warn(`${ERROR_MESSAGES.categoryNotFound(category)} - ${texts.shop.noProducts}`);
    return [];
  }

  const products: Product[] = [];
  const productDirs = fs.readdirSync(categoryPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .sort(); // Alphabetical order

  for (const productDir of productDirs) {
    const infoPath = path.join(categoryPath, productDir, 'info.json');
    
    if (!fs.existsSync(infoPath)) {
      console.warn(ERROR_MESSAGES.productInfoMissing(category, productDir));
      continue;
    }

    try {
      const infoContent = fs.readFileSync(infoPath, 'utf-8');
      const productInfo = JSON.parse(infoContent);
      
      // Get images from the images directory
      const imagesDir = path.join(categoryPath, productDir, 'images');
      let images: string[] = [];
      
      if (fs.existsSync(imagesDir)) {
        const imageFiles = fs.readdirSync(imagesDir)
          .filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file))
          .sort(); // Alphabetical order (01.jpg, 02.jpg, etc.)
        
        images = imageFiles.map(img => 
          `/products/${category}/${productDir}/images/${img}`
        );
      }

      // Construct the Product object - use folder name as ID for stability
      const product: Product = {
        id: productDir, // Use folder name as stable ID
        name: productInfo.name,
        description: productInfo.description,
        price: productInfo.price,
        image: images[0] || '/placeholder.svg', // First image as main
        images: images.length > 0 ? images : undefined,
        stock: productInfo.stock ?? 0,
      };

      products.push(product);
    } catch (error) {
      console.error(ERROR_MESSAGES.productLoadError(category, productDir), error);
    }
  }

  return products;
}

/**
 * Load all products across all categories
 */
export async function loadAllProducts() {
  const categories = ['pixelparla', 'resin', 'junior'];
  const allProducts: Record<string, Product[]> = {};

  for (const category of categories) {
    allProducts[category] = await loadProductsByCategory(category);
  }

  return allProducts;
}

/**
 * Get a specific product by category and product ID (folder name)
 * Optimized to load only the specific product instead of all products
 */
export async function getProductById(category: string, productId: string): Promise<Product | null> {
  const categoryPath = path.join(PRODUCTS_DIR, category);
  const productPath = path.join(categoryPath, productId);
  const infoPath = path.join(productPath, 'info.json');
  
  // Check if product directory and info.json exist
  if (!fs.existsSync(productPath) || !fs.existsSync(infoPath)) {
    return null;
  }

  try {
    const infoContent = fs.readFileSync(infoPath, 'utf-8');
    const productInfo = JSON.parse(infoContent);
    
    // Get images from the images directory
    const imagesDir = path.join(productPath, 'images');
    let images: string[] = [];
    
    if (fs.existsSync(imagesDir)) {
      const imageFiles = fs.readdirSync(imagesDir)
        .filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file))
        .sort();
      
      images = imageFiles.map(img => 
        `/products/${category}/${productId}/images/${img}`
      );
    }

    // Construct the Product object
    const product: Product = {
      id: productId, // Use folder name as stable ID
      name: productInfo.name,
      description: productInfo.description,
      price: productInfo.price,
      image: images[0] || '/placeholder.svg',
      images: images.length > 0 ? images : undefined,
      stock: productInfo.stock ?? 0,
    };

    return product;
  } catch (error) {
    console.error(ERROR_MESSAGES.productLoadError(category, productId), error);
    return null;
  }
}
