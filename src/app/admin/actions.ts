'use server';

import { revalidatePath } from 'next/cache';
import type { Category } from '@/lib/types';
import { isAdminAuthorized } from './auth';
import {
  saveProductMetadata,
  saveProductImages,
  productExists,
  getNextImageIndex,
  getProductMetadata,
} from '@/lib/storage';

type ActionResult = {
  success: boolean;
  message: string;
};

const ALLOWED_CATEGORIES: Category[] = ['pixelparla', 'resin', 'junior'];

const categoryLabels: Record<Category, string> = {
  pixelparla: 'Pixel & Pärla',
  resin: 'Resin & Natur',
  junior: 'Pixelverk Junior',
};

function formatPrice(price: string) {
  const trimmed = price.trim();
  if (trimmed.toLowerCase().endsWith('kr')) return `${trimmed.replace(/kr$/i, '').trim()} kr`;

  return `${trimmed} kr`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function validateCategory(category: string): category is Category {
  return ALLOWED_CATEGORIES.includes(category as Category);
}

export async function createProductAction(formData: FormData): Promise<ActionResult> {
  const { authorized } = await isAdminAuthorized();
  if (!authorized) {
    return { success: false, message: 'Obehörig begäran.' };
  }

  const category = String(formData.get('category') || '').trim();
  const rawProductId = String(formData.get('productId') || '').trim();
  const name = String(formData.get('name') || '').trim();
  const description = String(formData.get('description') || '').trim();
  const price = String(formData.get('price') || '').trim();
  const stockValue = Number(formData.get('stock') || 0);

  if (!validateCategory(category)) {
    return { success: false, message: 'Ogiltig kategori. Välj Pixel & Pärla, Resin & Natur eller Pixelverk Junior.' };
  }

  const productId = slugify(rawProductId || name);
  if (!productId) {
    return { success: false, message: 'Ange ett produkt-ID (små bokstäver, siffror och bindestreck).' };
  }

  if (!name || !description || !price) {
    return { success: false, message: 'Namn, beskrivning och pris måste fyllas i.' };
  }

  const stock = Number.isFinite(stockValue) ? Math.max(0, Math.floor(stockValue)) : 0;

  // Check if product already exists
  if (await productExists(category, productId)) {
    return { success: false, message: 'En produkt med samma ID finns redan i kategorin.' };
  }

  // Prepare image files
  const imageFiles = formData
    .getAll('images')
    .filter((file): file is File => file instanceof File && file.size > 0);

  // Save images to storage (Blob in production, local in dev)
  const imageUrls = await saveProductImages(category, productId, imageFiles, 1);

  // Prepare product metadata
  const productInfo = {
    id: productId,
    name,
    description,
    price: formatPrice(price),
    stock,
    category,
    images: imageUrls.length > 0 ? imageUrls : undefined,
  };

  // Save product metadata to storage
  await saveProductMetadata(category, productId, productInfo);

  revalidatePath('/shop');
  revalidatePath(`/shop/${category}`);
  revalidatePath(`/shop/${category}/${productId}`);

  return { success: true, message: `Produkten "${name}" lades till i ${categoryLabels[category]}.` };
}

export async function addProductImagesAction(formData: FormData): Promise<ActionResult> {
  const { authorized } = await isAdminAuthorized();
  if (!authorized) {
    return { success: false, message: 'Obehörig begäran.' };
  }

  const category = String(formData.get('existingCategory') || '').trim();
  const rawProductId = String(formData.get('existingProductId') || '').trim();

  if (!validateCategory(category)) {
    return { success: false, message: 'Ogiltig kategori för bilduppladdning.' };
  }

  const productId = slugify(rawProductId);
  if (!productId) {
    return { success: false, message: 'Ange produktens mappnamn (t.ex. pixel-heart-earring).' };
  }

  // Check if product exists
  if (!(await productExists(category, productId))) {
    return { success: false, message: 'Produkten hittades inte. Kontrollera kategori och mappnamn.' };
  }

  // Prepare image files
  const imageFiles = formData
    .getAll('extraImages')
    .filter((file): file is File => file instanceof File && file.size > 0);

  if (!imageFiles.length) {
    return { success: false, message: 'Välj minst en bild att ladda upp.' };
  }

  // Get the next image index
  const nextIndex = await getNextImageIndex(category, productId);

  // Save images to storage
  const imageUrls = await saveProductImages(category, productId, imageFiles, nextIndex);

  // Update product metadata with new images (important for production/Blob)
  const metadata = await getProductMetadata(category, productId);
  if (metadata) {
    const allImages = [...(metadata.images || []), ...imageUrls];
    await saveProductMetadata(category, productId, {
      ...metadata,
      images: allImages,
    });
  }

  revalidatePath('/shop');
  revalidatePath(`/shop/${category}`);
  revalidatePath(`/shop/${category}/${productId}`);

  return { success: true, message: `${imageUrls.length} bild(er) lades till för ${categoryLabels[category]}.` };
}
