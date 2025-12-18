'use server';

import fs from 'fs';
import path from 'path';

/**
 * Storage abstraction layer that writes to the local file system
 */

const PRODUCTS_DIR = path.join(process.cwd(), 'public', 'products');

export type ProductMetadata = {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  category: string;
  images?: string[]; // URLs to images (relative paths for local files)
};

/**
 * Save product metadata to storage
 */
export async function saveProductMetadata(
  category: string,
  productId: string,
  metadata: ProductMetadata
): Promise<void> {
  const productDir = path.join(PRODUCTS_DIR, category, productId);
  await fs.promises.mkdir(productDir, { recursive: true });
  await fs.promises.writeFile(
    path.join(productDir, 'info.json'),
    JSON.stringify(metadata, null, 2),
    'utf-8'
  );
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

  return savedImages;
}

/**
 * Get product metadata from storage
 */
export async function getProductMetadata(
  category: string,
  productId: string
): Promise<ProductMetadata | null> {
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
  const imagesDir = path.join(PRODUCTS_DIR, category, productId, 'images');
  
  if (!fs.existsSync(imagesDir)) {
    return 1;
  }

  const existingImages = fs.readdirSync(imagesDir)
    .filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file));
  
  return existingImages.length + 1;
}
