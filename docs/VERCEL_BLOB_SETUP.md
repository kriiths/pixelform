# Vercel Blob Storage Setup

## Problem

På Vercel är filsystemet read-only (`/var/task`), vilket innebär att admin-funktionen för att ladda upp nya produkter inte fungerar eftersom den försöker skapa kataloger och filer i `public/products/`.

## Lösning

Projektet använder nu **Vercel Blob Storage** för att hantera uppladdningar i produktion, medan det fortsatt använder lokalt filsystem i utvecklingsmiljö.

## Hur det fungerar

### Storage-lager (`src/lib/storage.ts`)

Ett abstraheringslager som automatiskt väljer rätt lagringsmetod baserat på miljö:

- **Utveckling (`NODE_ENV !== 'production'`)**: Använder lokalt filsystem (`public/products/`)
- **Produktion (Vercel)**: Använder Vercel Blob Storage

### Funktioner

- `saveProductMetadata()` - Sparar produkt info.json
- `saveProductImages()` - Sparar produktbilder och returnerar URLs
- `getProductMetadata()` - Hämtar produktmetadata
- `productExists()` - Kontrollerar om en produkt finns
- `getNextImageIndex()` - Får nästa bildindex för en produkt

### Product Loader (`src/app/shop/data/loader.ts`)

Uppdaterad för att läsa från både lokal lagring och Blob:

- **I produktion**: Listar Blob storage för produkter och bilder
- **I utveckling**: Läser från lokalt filsystem

Stöder också hybridläge där metadata innehåller bild-URLs (från Blob) även när filen läses lokalt.

## Konfiguration för Vercel

### 1. Skapa Vercel Blob Store

1. Gå till ditt projekt på Vercel Dashboard
2. Navigera till **Storage** tab
3. Klicka **Create Database**
4. Välj **Blob**
5. Ge den ett namn (t.ex. `pixelverk-products`)
6. Välj region (välj närmaste)

### 2. Koppla till projekt

Vercel kommer automatiskt att lägga till miljövariabler:
- `BLOB_READ_WRITE_TOKEN`

Dessa variabler behövs för att `@vercel/blob` ska fungera.

### 3. Deploya

```bash
git push
```

Vercel kommer automatiskt att bygga och deploya med Blob storage aktiverad.

## Utvecklingsflöde

### Lokalt (Utveckling)

Produkter läggs fortfarande i `public/products/` som vanligt:

```
public/products/
  pixelparla/
    pixel-heart-earring/
      info.json
      images/
        01.jpg
        02.jpg
```

### På Vercel (Produktion)

När du laddar upp en produkt via admin-panelen:

1. Metadata (`info.json`) sparas till Blob med path: `products/{category}/{productId}/info.json`
2. Bilder sparas till Blob med path: `products/{category}/{productId}/images/01.jpg`, etc.
3. Metadata innehåller fullständiga Blob URLs för bilderna

## Testning

### Lokalt

```bash
npm run dev
```

Besök `/admin`, logga in och testa att skapa en produkt. Den kommer sparas i `public/products/`.

### På Vercel

Efter deploy, besök `https://din-site.vercel.app/admin`, logga in och skapa en produkt. Den kommer sparas i Blob storage.

## Viktiga noteringar

### Befintliga produkter

Befintliga produkter i `public/products/` fungerar fortfarande. Loadern läser först från metadata (om `images` finns där), annars från filsystemet.

### Hybrid-stöd

Du kan ha produkter i både lokalt filsystem OCH Blob. Systemet hanterar båda automatiskt.

### Migration från lokal till Blob

Om du vill migrera befintliga produkter till Blob:

1. Kopiera befintliga produkters info.json och lägg till `images` array med fullständiga paths
2. Ladda upp dessa via admin-panelen (eller skriv ett migreringsskript)

Alternativt: låt befintliga produkter ligga kvar lokalt (de är redan checkade in i git) och använd endast Blob för nya uppladdningar.

## Kostnader

Vercel Blob har en gratis tier:
- 500 MB lagring
- 100 GB bandwidth/månad

För hobby-projekt är detta mer än tillräckligt. Se [Vercel Pricing](https://vercel.com/pricing/storage) för detaljer.

## Felsökning

### "BLOB_READ_WRITE_TOKEN is not set"

Kontrollera att Blob storage är kopplad till projektet i Vercel Dashboard → Storage.

### Uppladdning fungerar inte lokalt

Kontrollera att `NODE_ENV` inte är satt till `production` lokalt.

### Produkter syns inte efter uppladdning

1. Kontrollera att revalidatePath() körs i admin actions
2. Kontrollera Blob storage i Vercel Dashboard → Storage → Browse
3. Kolla logs för eventuella fel

## Framtida förbättringar

- [ ] Lägg till möjlighet att radera produkter/bilder från Blob
- [ ] Lägg till möjlighet att uppdatera produktinformation
- [ ] Implementera image optimization för Blob-bilder
- [ ] Lägg till progress indicators för uppladdningar
- [ ] Implementera batch-migration för befintliga produkter
