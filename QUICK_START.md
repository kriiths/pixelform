# Quick Start Guide - Dynamic Products

## 📁 Add a New Product in 3 Steps

### Step 1: Create Folder
```
public/products/{category}/{product-name}/images/
```

**Example:**
```
public/products/pixelparla/rainbow-star/images/
```

### Step 2: Add Images
Put your images in the `images/` folder:
```
01.jpg  ← Main image (thumbnail)
02.jpg  ← Gallery image
03.jpg  ← Gallery image
```

### Step 3: Create info.json
```json
{
  "id": "rainbow-star",
  "name": "Regnbågs Stjärna",
  "description": "Färgglad stjärna i pärlplattor",
  "price": "480 kr",
  "stock": 5,
  "category": "pixelparla"
}
```

**Done!** Your product will appear automatically on:
- `/shop` (main page)
- `/shop/pixelparla` (category page)
- `/shop/pixelparla/rainbow-star` (product page)

---

## 🗑️ Remove a Product

Just delete the product folder:
```bash
Delete: public/products/pixelparla/rainbow-star/
```

Product disappears from all pages automatically!

---

## ✏️ Update a Product

### Change Price/Stock/Description:
Edit `info.json`:
```json
{
  "stock": 10,
  "price": "550 kr"
}
```

### Update Images:
- Add new images to `images/` folder
- Delete old images
- Keep sequential naming (01.jpg, 02.jpg, etc.)

---

## 📋 info.json Fields

```json
{
  "id": "folder-name",           // Unique ID (match folder name)
  "name": "Display Name",        // Shows to customers
  "description": "Details...",   // Product description
  "price": "450 kr",             // Price with currency
  "stock": 5,                    // Number available (0 = sold out)
  "category": "pixelparla"       // Category name
}
```

---

## 🎨 Categories Available

### pixelparla
Pixel & beaded jewelry
```
public/products/pixelparla/
```

### resin
Resin jewelry with natural elements
```
public/products/resin/
```

### junior
Fun items for kids and beginners
```
public/products/junior/
```

---

## 🖼️ Image Guidelines

### Naming
- **Must** be sequential: `01.jpg`, `02.jpg`, `03.jpg`
- **First image** (`01.jpg`) = main product image
- **Other images** = gallery

### Formats Supported
- .jpg
- .jpeg
- .png
- .webp
- .gif

### Recommended
- Size: 800x800px or larger
- Aspect ratio: 1:1 (square)
- Optimized for web (compressed)

---

## ⚡ Example: Complete Product

```
public/products/pixelparla/sunset-heart/
├── images/
│   ├── 01.jpg  (main - front view)
│   ├── 02.jpg  (detail - close up)
│   └── 03.jpg  (wearing - on ear)
└── info.json
```

**info.json:**
```json
{
  "id": "sunset-heart",
  "name": "Solnedgångs Hjärta",
  "description": "Romantiskt hjärtformat örhänge i varma solnedgångsfärger. Handgjort i pärlplatta med orange, rosa och röda pärlor.",
  "price": "490 kr",
  "stock": 6,
  "category": "pixelparla"
}
```

**Result:**
- Automatically appears in shop
- URL: `/shop/pixelparla/sunset-heart`
- Main image: 01.jpg
- Gallery: 01.jpg, 02.jpg, 03.jpg

---

## 🔧 Troubleshooting

### Product not showing?
- ✅ Check folder name (lowercase, hyphens only)
- ✅ Verify `info.json` exists
- ✅ Check JSON is valid (no syntax errors)
- ✅ Restart dev server

### Images not loading?
- ✅ Images in `images/` subfolder?
- ✅ Named correctly? (01.jpg, 02.jpg)
- ✅ Correct file format?

### JSON errors?
- ✅ All strings in quotes?
- ✅ Commas between fields?
- ✅ No trailing comma on last field?

**Test JSON validity:**
https://jsonlint.com/

---

## 💡 Tips

### Folder Names
✅ Good: `rainbow-star`, `ocean-wave`, `pixel-heart`
❌ Bad: `Rainbow Star`, `ocean_wave`, `Pixel/Heart`

### Product IDs
Match your folder name:
- Folder: `rainbow-star`
- ID: `"rainbow-star"`

### Stock Management
```json
"stock": 0  // Shows "Slut i lager" (Out of stock)
"stock": 5  // Shows "I lager: 5"
```

### Pricing
Keep format consistent:
```json
"price": "450 kr"  // ✅ Good
"price": "450kr"   // ❌ Missing space
"price": "450"     // ❌ No currency
```

---

## 📚 More Help

- **Full Guide**: `PRODUCT_SYSTEM_GUIDE.md`
- **All Products**: `PRODUCT_FOLDER_TREE.md`
- **Template**: `public/products/_TEMPLATE_README.md`

---

## 🚀 Current Status

✅ **11 example products** created
✅ **System fully functional**
✅ **Dev server running**: http://localhost:3000

### Ready to Test:
1. Visit http://localhost:3000/shop
2. Browse categories
3. View product details
4. Test cart functionality

### Next Steps:
1. Replace `.gitkeep` files with real images
2. Update `info.json` files with actual data
3. Test everything
4. Deploy! 🎉

---

*Last updated: December 17, 2025*
