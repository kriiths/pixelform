# Product Template

This template helps you create new products quickly.

## Quick Start

1. **Copy this template folder structure:**
   ```
   public/products/{category}/{your-product-name}/
     images/
       01.jpg
       02.jpg
       03.jpg
     info.json
   ```

2. **Choose a category:**
   - `pixelparla` - Beaded/pixel art jewelry
   - `resin` - Resin jewelry with natural elements
   - `junior` - Kids/beginner products

3. **Fill in info.json:**
   ```json
   {
     "id": "your-product-name",
     "name": "Display Name",
     "description": "Product description",
     "price": "450 kr",
     "stock": 5,
     "category": "pixelparla"
   }
   ```

4. **Add images:**
   - Name them: 01.jpg, 02.jpg, 03.jpg, etc.
   - First image (01.jpg) becomes the main product image
   - All images appear in the gallery

## Field Descriptions

### id
- Unique identifier (usually matches folder name)
- Use lowercase letters, numbers, and hyphens only
- Example: "rainbow-star-earring"

### name
- Display name shown to customers
- Can contain any characters, spaces, Swedish characters
- Example: "Regnbågs Stjärna Örhänge"

### description
- Detailed product description
- Explain materials, technique, size, colors
- Example: "Handgjort örhänge i pärlplatta med regnbågsfärger. Mäter ca 3x3 cm."

### price
- Product price as a string
- Include currency
- Example: "450 kr" or "120 kr"

### stock
- Number of items available
- Set to 0 if out of stock
- Example: 5

### category
- Must match the folder category
- Options: "pixelparla", "resin", "junior"

## Image Guidelines

### Naming
- Use sequential numbers: 01.jpg, 02.jpg, 03.jpg, etc.
- First image is the main product image
- Supported formats: .jpg, .jpeg, .png, .webp, .gif

### Quality
- Recommended size: 800x800px or larger
- Use square aspect ratio (1:1) for best results
- Optimize images for web (compress to reduce file size)

### Content
- 01.jpg - Main product photo (clear, well-lit)
- 02.jpg - Detail view (close-up of texture/details)
- 03.jpg - Alternative angle or wearing view
- Add more images as needed

## Example: Complete Product

```
public/products/pixelparla/sunset-earring/
  images/
    01.jpg  (main product photo)
    02.jpg  (detail of beads)
    03.jpg  (showing size on ear)
  info.json
```

**info.json content:**
```json
{
  "id": "sunset-earring",
  "name": "Solnedgångs Örhänge",
  "description": "Vackert örhänge inspirerat av solnedgångens varma färger. Handgjort i pärlplatta med orange, rosa och gula pärlor. Lätt att bära och perfekt för både vardag och fest. Mäter ca 3x4 cm.",
  "price": "480 kr",
  "stock": 4,
  "category": "pixelparla"
}
```

## Tips

1. **Product ID = Folder Name**
   - Keep them the same for clarity
   - Example: folder `sunset-earring` → id: "sunset-earring"

2. **Swedish Characters**
   - OK in name and description
   - Avoid in folder names and ID

3. **Stock Management**
   - Update stock in info.json when items sell
   - Set to 0 when out of stock
   - Product shows "Slut i lager" automatically

4. **Pricing**
   - Keep format consistent: "XXX kr"
   - Include space before "kr"

5. **Descriptions**
   - Be descriptive and helpful
   - Mention size, materials, colors
   - Explain what makes it special

## Category-Specific Tips

### Pixelparla Products
- Mention bead colors and patterns
- Include size measurements
- Describe the pixel/retro theme

### Resin Products
- Describe resin colors and transparency
- Mention any inclusions (glitter, flowers, etc.)
- Note that each piece is unique

### Junior Products
- Emphasize fun and playful aspects
- Mention if suitable for children
- Include safety information if relevant
