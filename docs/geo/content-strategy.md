# Content-strategie — AI-vindbaarheid (§8.4)

Doel: dat een AI-antwoordmachine (ChatGPT, Claude, Perplexity, Google AI
Overviews) een juiste, actuele samenvatting van Almere Pickleball kan geven
als iemand vraagt "waar kan ik pickleballen in Almere", "wat kost een
pickleball-abonnement in Almere" of "kan ik als niet-lid een baan huren in
Almere". Realistisch schaalniveau: dit is één lokale sportvereniging, geen
landelijk merk — de meetlat is dus "correct en volledig geciteerd worden bij
lokale/nichequery's", niet "top-of-mind zijn bij elke pickleball-vraag
wereldwijd" (zie ook §8.6 — "in elke AI-zoekactie opgenomen worden" is geen
haalbaar of eerlijk te beloven doel).

## Wat AI-crawlers nu al goed kunnen citeren

De bestaande pagina's dekken de kernvragen al met feitelijke, specifieke
content (geen marketing-vaagtaal):

- Speeltijden + exacte adressen (FAQ, llms.txt/llms-full.txt, JSON-LD).
- Proefles-voorwaarden en -prijs.
- Baanverhuur-voorwaarden voor niet-leden.
- Lidmaatschapsvormen (zonder actuele bedragen, bewust — zie hieronder).

## Prioriteiten (aflopend, realistisch schaalniveau)

1. **Houd de FAQ het brondocument voor feiten.** Elke keer dat een feit
   verandert (speeltijden, locaties, prijzen), eerst de FAQ + bijbehorende
   `FAQPage`-JSON-LD bijwerken — dat is de pagina die zowel mensen als AI het
   makkelijkst parseren, en waar structured data en zichtbare tekst al 1-op-1
   overeenkomen (zie `verify-content-matches-jsonld` als vaste check, §8.6).
2. **llms.txt/llms-full.txt in sync houden met de site**, niet andersom.
   Deze bestanden vatten samen wat er al publiek op de site staat; ze mogen
   nooit een feit claimen dat nergens op een gewone pagina te vinden is (dat
   was tot deze wijziging het geval voor de donderdagsessie — nu gefixed,
   zie de FAQ-update).
3. **Eén duidelijke, actuele homepage.** De huidige homepage presenteert de
   site nog als "in aanbouw" terwijl de onderliggende pagina's (proefles,
   toernooien, baan huren, ledenportaal) allang volledig functioneren en de
   app in TestFlight-stadium is. Dat is een bewuste redactionele/product-
   keuze die buiten de scope van deze technische GEO-laag valt, maar het is
   wél de eerste indruk die zowel bezoekers als AI-samenvattingen krijgen —
   aanbevolen om dit apart te herzien.
4. **Geen prijzen hardcoden in statische bestanden** (FAQ, llms.txt,
   JSON-LD) — lidmaatschapstarieven wijzigen genoeg dat een verkeerd bedrag
   in een AI-antwoord erger is dan geen bedrag. Verwijs in plaats daarvan
   naar het ledenportaal. (De proefles-prijs van €4,25 is een uitzondering:
   die staat al langer vast en is expliciet op de proefles-pagina zelf
   vermeld, dus consistent hergebruikt.)
5. **Nieuwe contentkans: een "Pickleball in Almere"-overzichtspagina** is
   NIET aangemaakt in deze ronde — dat zou een aparte, inhoudelijke
   contentbeslissing zijn (wat komt erin, wie schrijft het, blijft het
   actueel) die niet stilzwijgend als "technische SEO-taak" hoort te worden
   meegenomen. Aanbevolen als los vervolgtraject, niet als onderdeel van deze
   §8-oplevering.

## Wat bewust NIET is gedaan (en waarom)

- **Geen ItemList/structured data voor live toernooistanden.** Die data komt
  client-side uit Supabase en wijzigt per toernooi; een statisch JSON-LD-
  blok zou vrijwel direct achterhaald raken en dan tegen Google's eigen
  richtlijn ingaan dat structured data de zichtbare inhoud moet weerspiegelen.
  Zodra de toernooipagina server-side gerenderd wordt (buiten scope hier),
  is een `SportsEvent`/`ItemList` per toernooi alsnog de moeite waard.
- **Geen herschreven hero-tekst op de homepage** ("We zijn volop aan het
  bouwen" / "Nieuwe website in aanbouw" / appstore-knoppen op "binnenkort")
  — zie punt 3 hierboven; dat is inhoudelijk redactiewerk, geen
  crawler-/structured-data-fix, en dus expliciet buiten deze oplevering
  gehouden totdat de club daar zelf een besluit over neemt.
