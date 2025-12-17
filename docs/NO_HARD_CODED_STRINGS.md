# Kodningsprincip: Inga hårdkodade strängar

All text som visas för användaren (t.ex. knappar, rubriker, etiketter, meddelanden) ska alltid hämtas från en central textresurs (t.ex. `texts.ts`) och aldrig vara hårdkodad direkt i komponenter eller sidor.

Om du hittar hårdkodade strängar i koden ska de flyttas till `texts.ts` (eller motsvarande fil) och refereras därifrån. Detta gäller även små texter, felmeddelanden och knappetiketter. Kontrollera alltid att nya eller ändrade komponenter följer denna princip.

Syftet är att förenkla översättning, underhåll och enhetlighet i gränssnittet.

**Exempel:**

- ❌ `button>Shoppa nu</button>`
- ✅ `button>{texts.buttons.shopNow}</button>`

> Lägg till denna princip i kodgranskning och onboarding av nya utvecklare.
