# Vercel Blob Storage - Snabbguide

## Problemet är löst! ✅

Felet du fick när du försökte ladda upp produkter på Vercel är nu fixat.

## Vad har ändrats?

1. **Installerat `@vercel/blob`** - Vercels lagringslösning
2. **Skapat storage-lager** (`src/lib/storage.ts`) - Hanterar automatiskt skillnaden mellan lokal utveckling och produktion
3. **Uppdaterat admin actions** - Använder nu Blob storage i produktion
4. **Uppdaterat product loader** - Läser från både lokal lagring och Blob
5. **Använder `process.env.VERCEL`** - Mer pålitlig detektion än `NODE_ENV` för att avgöra om vi kör på Vercel

## Hur fungerar det?

### Lokalt (utveckling)
- `process.env.VERCEL` är inte satt
- Produkter sparas i `public/products/` som vanligt
- Allt fungerar precis som tidigare

### På Vercel (produktion)
- `process.env.VERCEL` är automatiskt satt av Vercel
- Produkter sparas till Vercel Blob Storage
- Inga försök att skriva till read-only filsystem
- Bilder får publika URLs från Blob

## Vad behöver du göra?

### 1. Koppla Vercel Blob till projektet

1. Gå till [Vercel Dashboard](https://vercel.com/dashboard)
2. Välj ditt projekt
3. Gå till **Storage** tab
4. Klicka **Create Database** → välj **Blob**
5. Ge den ett namn (t.ex. `pixelverk-products`)
6. Välj region (välj närmaste för bästa prestanda)
7. Klicka **Create**
8. Vercel kopplar automatiskt Blob till projektet och sätter miljövariabler

### 2. Deploya om

```bash
git add .
git commit -m "Add Vercel Blob storage for product uploads"
git push
```

Vercel bygger och deployar automatiskt med Blob storage aktiverad.

### 3. Testa

1. Gå till din site på Vercel (t.ex. `https://pixelverk.vercel.app/admin`)
2. Logga in i admin-panelen
3. Försök skapa en ny produkt
4. Det ska nu fungera utan fel! 🎉

## Befintliga produkter

Alla befintliga produkter i `public/products/` fungerar fortfarande perfekt. De är checkade in i git och deployas med siten.

Nya produkter som laddas upp via admin går till Blob storage istället.

## Kostnader

Vercel Blob är gratis upp till:
- 500 MB lagring
- 100 GB bandwidth/månad

Mer än tillräckligt för ett hobby-projekt!

## Hur vet jag att det fungerar?

Efter att du kopplar Blob och deploar om:

1. Försök skapa en produkt via admin
2. Om den skapas utan fel → ✅ Det fungerar!
3. Du kan också kolla **Storage** tab i Vercel Dashboard för att se uppladdade filer

## Frågor?

Läs [VERCEL_BLOB_SETUP.md](./VERCEL_BLOB_SETUP.md) för mer detaljerad information.
