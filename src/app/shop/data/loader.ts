'use server';

import fs from 'fs';
import path from 'path';
import type { Product } from './types';

const PRODUCTS_DIR = path.join(process.cwd(), 'public', 'products');

/**
 * Dynamically loads products from the file system
 * Reads from public/products/{category}/{productId}/info.json
 * Images are automatically detected from public/products/{category}/{productId}/images/
 */
export async function loadProductsByCategory(category: string): Promise<Product[]> {
  const categoryPath = path.join(PRODUCTS_DIR, category);
  
  // Check if category directory exists
  if (!fs.existsSync(categoryPath)) {
    console.warn(`Category directory not found: ${categoryPath}`);
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
      console.warn(`info.json not found for product: ${productDir}`);
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

      // Construct the Product object
      const product: Product = {
        id: products.length + 1, // Auto-increment based on order
        name: productInfo.name,
        description: productInfo.description,
        price: productInfo.price,
        image: images[0] || '/placeholder.jpg', // First image as main
        images: images.length > 0 ? images : undefined,
        stock: productInfo.stock ?? 0,
      };

      products.push(product);
    } catch (error) {
      console.error(`Error loading product ${productDir}:`, error);
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
 */
export async function getProductById(category: string, productId: string): Promise<Product | null> {
  const products = await loadProductsByCategory(category);
  
  // Match by folder name stored in the id field of info.json
  const categoryPath = path.join(PRODUCTS_DIR, category);
  const productDirs = fs.readdirSync(categoryPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .sort();
  
  const productIndex = productDirs.indexOf(productId);
  
  if (productIndex === -1) {
    return null;
  }
  
  return products[productIndex] || null;
}
