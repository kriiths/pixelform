'use server';

import fs from 'fs';
import path from 'path';
import { list } from '@vercel/blob';
import type { Product } from '@/lib/types';
import { texts } from '@/app/content/texts';

const PRODUCTS_DIR = path.join(process.cwd(), 'public', 'products');
// Check if we're running on Vercel (more reliable than NODE_ENV)
const isVercel = !!process.env.VERCEL;

// Error message constants
const ERROR_MESSAGES = {
  categoryNotFound: (category: string) => `${texts.shop.categories[category as keyof typeof texts.shop.categories] || category}`,
  productInfoMissing: (category: string, product: string) => `info.json ${texts.product.notFound.toLowerCase()}: ${category}/${product}`,
  productLoadError: (category: string, product: string) => `${texts.errors?.loadError || 'Error loading product'}: ${category}/${product}`,
};

/**
 * Dynamically loads products from the file system or Blob storage
 * - In production (Vercel): reads from Vercel Blob
 * - In development: reads from public/products/{category}/{productId}/info.json
 * Images are automatically detected from their respective storage
 */
export async function loadProductsByCategory(category: string): Promise<Product[]> {
  if (isVercel) {
    return await loadProductsFromBlob(category);
  } else {
    return await loadProductsFromFileSystem(category);
  }
}

/**
 * Load products from Vercel Blob storage (production)
 */
async function loadProductsFromBlob(category: string): Promise<Product[]> {
  try {
    const { blobs } = await list({
      prefix: `products/${category}/`,
    });

    // Group blobs by product ID
    const productMap = new Map<string, { info?: string; images: string[] }>();

    for (const blob of blobs) {
      const pathParts = blob.pathname.split('/');
      if (pathParts.length < 3) continue;

      const productId = pathParts[2];
      
      if (!productMap.has(productId)) {
        productMap.set(productId, { images: [] });
      }

      const productData = productMap.get(productId)!;

      if (blob.pathname.endsWith('info.json')) {
        productData.info = blob.url;
      } else if (blob.pathname.includes('/images/')) {
        productData.images.push(blob.url);
      }
    }

    // Fetch product info and construct Product objects
    const products: Product[] = [];

    for (const [productId, data] of productMap.entries()) {
      if (!data.info) {
        console.warn(`No info.json found for ${category}/${productId} in Blob storage`);
        continue;
      }

      try {
        const response = await fetch(data.info);
        const productInfo = await response.json();

        // Sort images by filename
        const sortedImages = data.images.sort();

        const product: Product = {
          id: productId,
          name: productInfo.name,
          description: productInfo.description,
          price: productInfo.price,
          image: sortedImages[0] || '/placeholder.svg',
          images: sortedImages.length > 0 ? sortedImages : undefined,
          stock: productInfo.stock ?? 0,
        };

        products.push(product);
      } catch (error) {
        console.error(`Error loading product ${category}/${productId} from Blob:`, error);
      }
    }

    return products.sort((a, b) => String(a.id).localeCompare(String(b.id)));
  } catch (error) {
    console.error(`Error listing products from Blob for category ${category}:`, error);
    return [];
  }
}

/**
 * Load products from local file system (development)
 */
async function loadProductsFromFileSystem(category: string): Promise<Product[]> {
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
      
      // Check if images are stored in metadata (for Blob-uploaded products)
      let images: string[] = [];
      
      if (productInfo.images && Array.isArray(productInfo.images)) {
        // Use images from metadata (Blob URLs or paths)
        images = productInfo.images;
      } else {
        // Fallback: Get images from the images directory (old method)
        const imagesDir = path.join(categoryPath, productDir, 'images');
        
        if (fs.existsSync(imagesDir)) {
          const imageFiles = fs.readdirSync(imagesDir)
            .filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file))
            .sort(); // Alphabetical order (01.jpg, 02.jpg, etc.)
          
          images = imageFiles.map(img => 
            `/products/${category}/${productDir}/images/${img}`
          );
        }
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
  if (isVercel) {
    return await getProductByIdFromBlob(category, productId);
  } else {
    return await getProductByIdFromFileSystem(category, productId);
  }
}

/**
 * Get product from Vercel Blob storage (production)
 */
async function getProductByIdFromBlob(category: string, productId: string): Promise<Product | null> {
  try {
    const { blobs } = await list({
      prefix: `products/${category}/${productId}/`,
    });

    let infoUrl: string | undefined;
    const images: string[] = [];

    for (const blob of blobs) {
      if (blob.pathname.endsWith('info.json')) {
        infoUrl = blob.url;
      } else if (blob.pathname.includes('/images/')) {
        images.push(blob.url);
      }
    }

    if (!infoUrl) {
      return null;
    }

    const response = await fetch(infoUrl);
    const productInfo = await response.json();

    const sortedImages = images.sort();

    const product: Product = {
      id: productId,
      name: productInfo.name,
      description: productInfo.description,
      price: productInfo.price,
      image: sortedImages[0] || '/placeholder.svg',
      images: sortedImages.length > 0 ? sortedImages : undefined,
      stock: productInfo.stock ?? 0,
    };

    return product;
  } catch (error) {
    console.error(`Error loading product ${category}/${productId} from Blob:`, error);
    return null;
  }
}

/**
 * Get product from local file system (development)
 */
async function getProductByIdFromFileSystem(category: string, productId: string): Promise<Product | null> {
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
    
    // Check if images are stored in metadata (for Blob-uploaded products)
    let images: string[] = [];
    
    if (productInfo.images && Array.isArray(productInfo.images)) {
      // Use images from metadata (Blob URLs or paths)
      images = productInfo.images;
    } else {
      // Fallback: Get images from the images directory (old method)
      const imagesDir = path.join(productPath, 'images');
      
      if (fs.existsSync(imagesDir)) {
        const imageFiles = fs.readdirSync(imagesDir)
          .filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file))
          .sort();
        
        images = imageFiles.map(img => 
          `/products/${category}/${productId}/images/${img}`
        );
      }
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
