# Vercel Cache Problem - Mobil visar gammal version

## Problemet

Mobilen visar en gammal version av sidan trots ny deployment, även i inkognito-läge. Desktop visar rätt version.

## Orsak

Vercel's CDN (Content Delivery Network) cachar sidor på edge-servrar runt om i världen. Mobilen kan ha fått en cachad version från en edge-server som inte uppdaterats än.

## Lösningar

### 🚀 Snabbfix 1: Rensa Vercel Cache via Dashboard

1. Gå till [Vercel Dashboard](https://vercel.com/dashboard)
2. Välj ditt projekt (pixelverk/pixelform)
3. Klicka på **Deployments** tab
4. Välj den senaste deploymentenen (längst upp)
5. Klicka på **⋮** (tre prickar) i övre högra hörnet
6. Välj **"Redeploy"**
7. **VIKTIGT:** Kryssa UR "Use existing Build Cache"
8. Klicka **"Redeploy"**

Detta tvingar Vercel att bygga om och invaldera all CDN cache.

### 🚀 Snabbfix 2: Purge via Vercel Settings

1. Gå till [Vercel Dashboard](https://vercel.com/dashboard)
2. Välj ditt projekt
3. Gå till **Settings** → **Data Cache**
4. Klicka **"Purge Everything"**

Detta rensar endast cachen utan att bygga om.

### 🚀 Snabbfix 3: Force Refresh på mobilen

Som temporär lösning medan cache rensas:

**iPhone Safari:**
1. Håll ned reload-knappen
2. Välj "Request Desktop Website"
3. Håll reload igen och välj "Reload Without Content Blockers"

**Android Chrome:**
1. Gå till Chrome Settings → Privacy → Clear browsing data
2. Välj "Cached images and files"
3. Välj "Last hour"
4. Klicka "Clear data"

### ✅ Långsiktig lösning: Cache Headers (REDAN FIXAT)

Jag har uppdaterat `next.config.ts` med bättre cache headers:

```typescript
headers: async () => [
  {
    source: '/:path*',
    headers: [
      {
        key: 'Cache-Control',
        value: 'public, max-age=0, must-revalidate',
      },
    ],
  },
  {
    source: '/products/:path*',
    headers: [
      {
        key: 'Cache-Control',
        value: 'public, max-age=31536000, immutable',
      },
    ],
  },
],
```

**Vad detta gör:**
- HTML-sidor (`:path*`): Cachar i 0 sekunder, måste alltid valideras = alltid färsk
- Produktbilder (`/products/:path*`): Cachar i 1 år eftersom de aldrig ändras (immutable)

## Nästa steg

1. **Merga PR för cache headers** - Gå till GitHub och merga PR från `fix/cache-headers`
2. **Vänta på deploy** - Vercel deploar automatiskt efter merge (~2 min)
3. **Testa på mobilen** - Force refresh eller vänta 5-10 minuter

## Verifiera vilken version som körs

Lägg till detta i din kod för att se deployment-info:

**Lägg till i `src/app/layout.tsx`:**
```typescript
{process.env.VERCEL_GIT_COMMIT_SHA && (
  <meta name="x-vercel-deployment" content={process.env.VERCEL_GIT_COMMIT_SHA} />
)}
```

Sedan kan du inspektera HTML-källkoden på mobilen för att se vilken commit som körs.

## Varför händer detta?

1. **CDN Edge Locations**: Vercel har edge-servrar i olika regioner
2. **Olika cache-tider**: Desktop och mobil kan träffa olika edge-servrar
3. **Cache propagation**: Det tar tid för cache att invalideratsifrån alla edge-servrar (5-15 min)
4. **Mobila nätverk**: 4G/5G kan ha extra caching-lager från operatören

## Förebyggande åtgärder

Med de nya cache headers kommer detta inte hända igen eftersom:
- HTML revalideras alltid vid varje request
- Vercel's CDN respekterar `must-revalidate` direktivet
- Endast statiska assets (bilder, JS, CSS) cachas långsiktigt

## Felsökning

### Cache rensar sig inte?

1. Kontrollera att deployment lyckades på Vercel Dashboard
2. Vänta 10-15 minuter för global cache invalidation
3. Testa från olika mobila nätverk (WiFi vs 4G)
4. Testa i helt ny inkognito session

### Fortfarande gammal version?

Kör detta i DevTools Console på mobilen:
```javascript
location.href = location.href + '?v=' + Date.now()
```

Detta lägger till en query parameter som garanterat inte finns cachad.
