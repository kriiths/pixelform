# Dynamic Product System Documentation

## Overview
This website now uses a **dynamic folder-based product system**. Products are automatically loaded from the file system, making it easy to add or remove products without modifying code.

## Folder Structure

```
public/
  products/
    pixelparla/
      retro-earring-sunset/
        images/
          01.jpg
          02.jpg
          03.jpg
        info.json
      pixel-heart-earring/
        images/
          01.jpg
          02.jpg
        info.json
      geometric-rainbow/
        images/
          01.jpg
          02.jpg
          03.jpg
        info.json
    resin/
      ocean-wave-earring/
        images/
          01.jpg
          02.jpg
        info.json
      leaf-green-earring/
        images/
          01.jpg
          02.jpg
          03.jpg
        info.json
      flower-pink-earring/
        images/
          01.jpg
          02.jpg
        info.json
      sunset-marble-earring/
        images/
          01.jpg
          02.jpg
          03.jpg
        info.json
    junior/
      tetris-l-block/
        images/
          01.jpg
          02.jpg
        info.json
      tetris-t-block/
        images/
          01.jpg
          02.jpg
          03.jpg
        info.json
      tetris-i-block/
        images/
          01.jpg
          02.jpg
        info.json
      pixel-star/
        images/
          01.jpg
          02.jpg
          03.jpg
        info.json
```

## Product Categories

The system supports three product categories:
- **pixelparla** - Pixel & Pärla products (beaded earrings, pixel art)
- **resin** - Resin & Nature products (resin jewelry with natural elements)
- **junior** - Junior products (fun items for kids and beginners)

All categories work identically with the dynamic loader.

## info.json Format

Each product folder must contain an `info.json` file with the following structure:

```json
{
  "id": "product-folder-name",
  "name": "Display Name of Product",
  "description": "Detailed description of the product",
  "price": "450 kr",
  "stock": 5,
  "category": "pixelparla"
}
```

### Field Descriptions:
- **id**: String identifier (typically matches the folder name)
- **name**: Display name shown to customers
- **description**: Product description (supports longer text)
- **price**: Price string (e.g., "450 kr")
- **stock**: Number of items in stock (0 = out of stock)
- **category**: Category name (pixelparla, resin, or junior)

## Images

### Requirements:
- Images must be placed in the `images/` folder within each product folder
- Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`
- Images should be named alphabetically (01.jpg, 02.jpg, 03.jpg, etc.)
- **The first image (01.jpg) is used as the main product image**
- Additional images appear in the product gallery

### Image Guidelines:
- Use consistent aspect ratios for best results
- Recommended resolution: 800x800px or larger
- Optimize images for web (compress to reduce file size)
- Name images sequentially: 01.jpg, 02.jpg, 03.jpg, etc.

## How to Add a New Product

### Step 1: Create Product Folder
```bash
public/products/{category}/{product-folder-name}/
```

Example:
```bash
public/products/pixelparla/rainbow-earring/
```

### Step 2: Create Images Folder
```bash
public/products/{category}/{product-folder-name}/images/
```

### Step 3: Add Images
Add your product images with sequential names:
- `01.jpg` (main image - will be used as thumbnail)
- `02.jpg` (gallery image)
- `03.jpg` (gallery image)
- etc.

### Step 4: Create info.json
Create `info.json` with product details:

```json
{
  "id": "rainbow-earring",
  "name": "Rainbow Pixel Earring",
  "description": "Beautiful rainbow-colored pixel art earring made with colorful beads.",
  "price": "480 kr",
  "stock": 8,
  "category": "pixelparla"
}
```

### Step 5: Restart Development Server (if running)
The system will automatically detect the new product on the next page load.

## How to Remove a Product

Simply delete the product's folder:
```bash
public/products/{category}/{product-folder-name}/
```

The system will automatically stop showing the product.

## How to Update a Product

### Update Product Details:
Edit the `info.json` file and save.

### Update Images:
- Add new images to the `images/` folder
- Remove old images
- Rename images to maintain sequential order (01.jpg, 02.jpg, etc.)

### Update Stock:
Edit `stock` field in `info.json`:
```json
{
  "stock": 3
}
```

## How It Works

### Dynamic Loading:
1. The system reads all folders in `public/products/{category}/`
2. For each folder, it reads the `info.json` file
3. It automatically detects all images in the `images/` folder
4. Products are sorted alphabetically by folder name
5. The first image becomes the main product image

### URL Structure:
- Category pages: `/shop/{category}` (e.g., `/shop/pixelparla`)
- Product pages: `/shop/{category}/{product-folder-name}` (e.g., `/shop/pixelparla/rainbow-earring`)

### Automatic Features:
- ✅ Products load automatically from folders
- ✅ Images are automatically detected and sorted
- ✅ First image is used as main product image
- ✅ All images appear in the product gallery
- ✅ Products are sorted alphabetically
- ✅ No code changes needed to add/remove products

## Example: Adding a Complete Product

Let's add a new product called "Crystal Star Earring" to the pixelparla category:

### 1. Create folder structure:
```
public/products/pixelparla/crystal-star-earring/
  images/
```

### 2. Add images:
- Copy `01.jpg` (main product photo)
- Copy `02.jpg` (detail view)
- Copy `03.jpg` (wearing view)

### 3. Create info.json:
```json
{
  "id": "crystal-star-earring",
  "name": "Kristall Stjärna Örhänge",
  "description": "Glittrande stjärnformade örhängen med kristallpärlor. Perfekt för festliga tillfällen!",
  "price": "490 kr",
  "stock": 4,
  "category": "pixelparla"
}
```

### 4. Done!
The product will now appear on:
- Main shop page (`/shop`)
- Pixelparla category page (`/shop/pixelparla`)
- Product detail page (`/shop/pixelparla/crystal-star-earring`)

## Technical Details

### Server-Side Rendering:
All product pages use Next.js server components for optimal performance:
- Products are loaded at build time or on-demand
- No client-side JavaScript needed for product data
- Fast page loads and good SEO

### File System Access:
The loader uses Node.js `fs` module to read the file system:
- Located in: `src/app/shop/data/loader.ts`
- Functions: `loadProductsByCategory()`, `loadAllProducts()`, `getProductById()`

### Caching:
Next.js automatically caches product data for production builds, ensuring fast performance.

## Troubleshooting

### Product not showing:
1. Check folder name (no spaces or special characters)
2. Verify `info.json` exists and is valid JSON
3. Ensure images are in the `images/` folder
4. Restart dev server if running

### Images not loading:
1. Check image file names (must be .jpg, .jpeg, .png, .webp, or .gif)
2. Verify images are in the `images/` subfolder
3. Check image file permissions

### Product order:
Products are sorted alphabetically by folder name. To control order:
- Prefix folder names with numbers: `01-first-product`, `02-second-product`
- Or use descriptive names that sort naturally

## Best Practices

1. **Use descriptive folder names** (e.g., `rainbow-star-earring` not `product1`)
2. **Keep folder names URL-friendly** (lowercase, hyphens, no spaces)
3. **Use sequential image naming** (01.jpg, 02.jpg, 03.jpg)
4. **Optimize images before uploading** (compress, resize)
5. **Update stock regularly** in info.json
6. **Write clear descriptions** to help customers understand the product
7. **Use consistent pricing format** (e.g., "450 kr")

## Adding a New Category

To add a new product category:

1. Update the loader to include the new category:
   - Edit `src/app/shop/data/loader.ts`
   - Add category to the `categories` array in `loadAllProducts()`

2. Create category folder:
   ```
   public/products/new-category/
   ```

3. Create category page:
   ```tsx
   // src/app/shop/new-category/page.tsx
   import ProductCard from '@/components/product/ProductCard';
   import { loadProductsByCategory } from '../data/loader';
   import { texts } from '../../content/texts';

   export default async function NewCategoryShop() {
     const products = await loadProductsByCategory('new-category');
     
     return (
       <main className="max-w-6xl mx-auto px-6 py-12">
         <h1 className="text-3xl font-semibold mb-8">New Category</h1>
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
           {products.map((p) => (
             <ProductCard key={p.id} {...p} category="new-category" />
           ))}
         </div>
       </main>
     );
   }
   ```

4. Update navigation and text content as needed.
