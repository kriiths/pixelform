'use server';

import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import type { Category } from '@/lib/types';
import { isAdminAuthorized } from './auth';

type ActionResult = {
  success: boolean;
  message: string;
};

const PRODUCTS_DIR = path.join(process.cwd(), 'public', 'products');
const ALLOWED_CATEGORIES: Category[] = ['pixelparla', 'resin', 'junior'];
const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

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

async function saveImages(files: File[], imagesDir: string) {
  if (!files.length) return 0;

  const existingImages = (await fs.promises.readdir(imagesDir, { withFileTypes: true }))
    .filter((file) => file.isFile() && ALLOWED_IMAGE_EXTENSIONS.includes(path.extname(file.name).toLowerCase()));

  let nextIndex = existingImages.length + 1;
  let savedCount = 0;

  for (const file of files) {
    const fileExt = path.extname(file.name).toLowerCase();
    const safeExt = ALLOWED_IMAGE_EXTENSIONS.includes(fileExt) ? fileExt : '.jpg';
    const paddedIndex = String(nextIndex).padStart(2, '0');
    const fileName = `${paddedIndex}${safeExt}`;
    const filePath = path.join(imagesDir, fileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.promises.writeFile(filePath, buffer);

    nextIndex += 1;
    savedCount += 1;
  }

  return savedCount;
}

function validateCategory(category: string): category is Category {
  return ALLOWED_CATEGORIES.includes(category as Category);
}

export async function createProductAction(formData: FormData): Promise<ActionResult> {
  const { authorized } = isAdminAuthorized();
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
  const productDir = path.join(PRODUCTS_DIR, category, productId);
  const imagesDir = path.join(productDir, 'images');

  if (fs.existsSync(productDir)) {
    return { success: false, message: 'En produkt med samma ID finns redan i kategorin.' };
  }

  await fs.promises.mkdir(imagesDir, { recursive: true });

  const productInfo = {
    id: productId,
    name,
    description,
    price: formatPrice(price),
    stock,
    category,
  };

  await fs.promises.writeFile(path.join(productDir, 'info.json'), JSON.stringify(productInfo, null, 2), 'utf-8');

  const imageFiles = formData
    .getAll('images')
    .filter((file): file is File => file instanceof File && file.size > 0);

  await saveImages(imageFiles, imagesDir);

  revalidatePath('/shop');
  revalidatePath(`/shop/${category}`);
  revalidatePath(`/shop/${category}/${productId}`);

  return { success: true, message: `Produkten "${name}" lades till i ${categoryLabels[category]}.` };
}

export async function addProductImagesAction(formData: FormData): Promise<ActionResult> {
  const { authorized } = isAdminAuthorized();
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

  const productDir = path.join(PRODUCTS_DIR, category, productId);
  const imagesDir = path.join(productDir, 'images');

  if (!fs.existsSync(productDir)) {
    return { success: false, message: 'Produkten hittades inte. Kontrollera kategori och mappnamn.' };
  }

  await fs.promises.mkdir(imagesDir, { recursive: true });

  const imageFiles = formData
    .getAll('extraImages')
    .filter((file): file is File => file instanceof File && file.size > 0);

  if (!imageFiles.length) {
    return { success: false, message: 'Välj minst en bild att ladda upp.' };
  }

  const savedCount = await saveImages(imageFiles, imagesDir);

  revalidatePath('/shop');
  revalidatePath(`/shop/${category}`);
  revalidatePath(`/shop/${category}/${productId}`);

  return { success: true, message: `${savedCount} bild(er) lades till för ${categoryLabels[category]}.` };
}
