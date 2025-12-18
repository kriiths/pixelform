'use server';

import { put, list } from '@vercel/blob';
import fs from 'fs';
import path from 'path';

/**
 * Storage abstraction layer that handles both local and Vercel Blob storage
 * - In production (Vercel): uses Vercel Blob for uploads
 * - In development: uses local file system
 */

const isProduction = process.env.NODE_ENV === 'production';
const PRODUCTS_DIR = path.join(process.cwd(), 'public', 'products');

export type ProductMetadata = {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  category: string;
  images?: string[]; // URLs to images (Blob URLs in production, relative paths in dev)
};

/**
 * Save product metadata to storage
 */
export async function saveProductMetadata(
  category: string,
  productId: string,
  metadata: ProductMetadata
): Promise<void> {
  if (isProduction) {
    // In production, save to Vercel Blob
    const metadataKey = `products/${category}/${productId}/info.json`;
    await put(metadataKey, JSON.stringify(metadata, null, 2), {
      access: 'public',
      contentType: 'application/json',
    });
  } else {
    // In development, save to local file system
    const productDir = path.join(PRODUCTS_DIR, category, productId);
    await fs.promises.mkdir(productDir, { recursive: true });
    await fs.promises.writeFile(
      path.join(productDir, 'info.json'),
      JSON.stringify(metadata, null, 2),
      'utf-8'
    );
  }
}

/**
 * Save product images to storage
 * Returns array of image URLs/paths
 */
export async function saveProductImages(
  category: string,
  productId: string,
  images: File[],
  startIndex: number = 1
): Promise<string[]> {
  const savedImages: string[] = [];
  let currentIndex = startIndex;

  if (isProduction) {
    // In production, upload to Vercel Blob
    for (const image of images) {
      const ext = path.extname(image.name).toLowerCase() || '.jpg';
      const paddedIndex = String(currentIndex).padStart(2, '0');
      const blobKey = `products/${category}/${productId}/images/${paddedIndex}${ext}`;
      
      const buffer = await image.arrayBuffer();
      const blob = await put(blobKey, buffer, {
        access: 'public',
        contentType: image.type || 'image/jpeg',
      });
      
      savedImages.push(blob.url);
      currentIndex++;
    }
  } else {
    // In development, save to local file system
    const imagesDir = path.join(PRODUCTS_DIR, category, productId, 'images');
    await fs.promises.mkdir(imagesDir, { recursive: true });

    for (const image of images) {
      const ext = path.extname(image.name).toLowerCase() || '.jpg';
      const paddedIndex = String(currentIndex).padStart(2, '0');
      const fileName = `${paddedIndex}${ext}`;
      const filePath = path.join(imagesDir, fileName);
      
      const buffer = Buffer.from(await image.arrayBuffer());
      await fs.promises.writeFile(filePath, buffer);
      
      savedImages.push(`/products/${category}/${productId}/images/${fileName}`);
      currentIndex++;
    }
  }

  return savedImages;
}

/**
 * Get product metadata from storage
 */
export async function getProductMetadata(
  category: string,
  productId: string
): Promise<ProductMetadata | null> {
  if (isProduction) {
    // In production, fetch from Vercel Blob
    try {
      const { blobs } = await list({
        prefix: `products/${category}/${productId}/`,
      });

      const infoBlob = blobs.find(blob => blob.pathname.endsWith('info.json'));
      if (!infoBlob) return null;

      const response = await fetch(infoBlob.url);
      return await response.json();
    } catch (error) {
      console.error('Error fetching metadata from Blob:', error);
      return null;
    }
  } else {
    // In development, read from local file system
    const productDir = path.join(PRODUCTS_DIR, category, productId);
    const infoPath = path.join(productDir, 'info.json');
    
    if (!fs.existsSync(infoPath)) {
      return null;
    }

    try {
      const content = fs.readFileSync(infoPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error('Error reading metadata:', error);
      return null;
    }
  }
}

/**
 * Check if a product exists
 */
export async function productExists(category: string, productId: string): Promise<boolean> {
  const metadata = await getProductMetadata(category, productId);
  return metadata !== null;
}

/**
 * Get the next image index for a product
 */
export async function getNextImageIndex(category: string, productId: string): Promise<number> {
  if (isProduction) {
    // In production, query Blob storage for existing images
    try {
      const { blobs } = await list({
        prefix: `products/${category}/${productId}/images/`,
      });
      
      return blobs.length + 1;
    } catch (error) {
      console.error('Error getting next image index from Blob:', error);
      return 1;
    }
  } else {
    // In development, check local images directory
    const imagesDir = path.join(PRODUCTS_DIR, category, productId, 'images');
    
    if (!fs.existsSync(imagesDir)) {
      return 1;
    }

    const existingImages = fs.readdirSync(imagesDir)
      .filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file));
    
    return existingImages.length + 1;
  }
}
