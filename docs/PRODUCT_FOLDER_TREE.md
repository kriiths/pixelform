# Product Folder Tree

This document shows the complete folder structure with all example products.

```
public/
└── products/
    ├── _TEMPLATE_info.json           # Template for creating new products
    ├── _TEMPLATE_README.md            # Template documentation
    │
    ├── pixelparla/                    # Pixel & Pärla Category
    │   ├── geometric-rainbow/         # Product 1
    │   │   ├── images/
    │   │   │   ├── 01.jpg            # Main image (geometric rainbow pattern)
    │   │   │   ├── 02.jpg            # Side view
    │   │   │   └── 03.jpg            # On ear view
    │   │   └── info.json              # "Geometrisk Regnbåge" - 430 kr
    │   │
    │   ├── pixel-heart-earring/       # Product 2
    │   │   ├── images/
    │   │   │   ├── 01.jpg            # Main image (heart shape)
    │   │   │   └── 02.jpg            # Close-up detail
    │   │   └── info.json              # "Pixel Hjärt-örhänge" - 470 kr
    │   │
    │   └── retro-earring-sunset/      # Product 3
    │       ├── images/
    │       │   ├── 01.jpg            # Main image (sunset colors)
    │       │   ├── 02.jpg            # Detail view
    │       │   └── 03.jpg            # Alternative angle
    │       └── info.json              # "Retro-örhänge Sunset" - 450 kr
    │
    ├── resin/                         # Resin & Nature Category
    │   ├── flower-pink-earring/       # Product 1
    │   │   ├── images/
    │   │   │   ├── 01.jpg            # Main image (pink flower)
    │   │   │   └── 02.jpg            # On model
    │   │   └── info.json              # "Blom-örhänge Rosa" - 480 kr
    │   │
    │   ├── leaf-green-earring/        # Product 2
    │   │   ├── images/
    │   │   │   ├── 01.jpg            # Main image (green leaf)
    │   │   │   ├── 02.jpg            # Close-up texture
    │   │   │   └── 03.jpg            # Backside view
    │   │   └── info.json              # "Blad-örhänge Smaragd" - 500 kr
    │   │
    │   ├── ocean-wave-earring/        # Product 3
    │   │   ├── images/
    │   │   │   ├── 01.jpg            # Main image (blue waves)
    │   │   │   └── 02.jpg            # Detail of wave pattern
    │   │   └── info.json              # "Hav-örhänge Vågor" - 520 kr
    │   │
    │   └── sunset-marble-earring/     # Product 4
    │       ├── images/
    │       │   ├── 01.jpg            # Main image (orange marble)
    │       │   ├── 02.jpg            # Detail close-up
    │       │   └── 03.jpg            # Comparison view
    │       └── info.json              # "Solnedgångs Marmor" - 540 kr
    │
    └── junior/                        # Junior Category
        ├── pixel-star/                # Product 1
        │   ├── images/
        │   │   ├── 01.jpg            # Main image (glittery star)
        │   │   ├── 02.jpg            # Glitter detail
        │   │   └── 03.jpg            # Size comparison
        │   └── info.json              # "Pixel-Stjärna" - 140 kr
        │
        ├── tetris-i-block/            # Product 2
        │   ├── images/
        │   │   ├── 01.jpg            # Main image (I-block)
        │   │   └── 02.jpg            # Side view
        │   └── info.json              # "Tetris I-Block" - 100 kr
        │
        ├── tetris-l-block/            # Product 3
        │   ├── images/
        │   │   ├── 01.jpg            # Main image (L-block)
        │   │   └── 02.jpg            # Scale reference
        │   └── info.json              # "Tetris L-Block" - 120 kr
        │
        └── tetris-t-block/            # Product 4
            ├── images/
            │   ├── 01.jpg            # Main image (T-block)
            │   ├── 02.jpg            # Detail
            │   └── 03.jpg            # In hand
            └── info.json              # "Tetris T-Block" - 130 kr
```

## Summary

### Total Products: 11
- **Pixelparla**: 3 products (430-470 kr range)
- **Resin**: 4 products (480-540 kr range)
- **Junior**: 4 products (100-140 kr range)

### Total Images: 28 placeholder references
- Products have 2-3 images each
- First image always used as main product image
- Additional images in product gallery

## URL Structure

Each product is accessible at:
```
/shop/{category}/{product-folder-name}
```

Examples:
- `/shop/pixelparla/retro-earring-sunset`
- `/shop/resin/ocean-wave-earring`
- `/shop/junior/pixel-star`

## Adding New Products

To add a new product, create this structure:
```
public/products/{category}/your-new-product/
  ├── images/
  │   ├── 01.jpg
  │   ├── 02.jpg
  │   └── 03.jpg (optional, add more as needed)
  └── info.json
```

The product will automatically appear on:
1. Main shop page (`/shop`)
2. Category page (`/shop/{category}`)
3. Product detail page (`/shop/{category}/your-new-product`)

## Notes

- `.gitkeep` files are placeholders - replace with actual JPG images
- Product folders are sorted alphabetically
- First image (01.jpg) is always the main/thumbnail image
- All categories work identically with the dynamic loader
- No code changes needed to add/remove products
