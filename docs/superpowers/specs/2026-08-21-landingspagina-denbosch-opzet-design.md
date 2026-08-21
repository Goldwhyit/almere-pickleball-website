# Landingspagina herbouw naar Den Bosch-opzet

## Doel

`landingspagina/index.html` bevat nu een lange "fitness-coaching"-achtige
opbouw (team-carrousel, transformatie-carrousel, prijzen, FAQ, testimonials,
contactformulier, nieuwsbrief) die niet aansluit bij hoe de club dit wil
presenteren. We herbouwen de pagina met de sectie-opbouw van
[pickleballdenbosch.nl](https://pickleballdenbosch.nl) als voorbeeld, maar
volledig in de bestaande Almere Pickleball-huisstijl (navy/goud,
Unbounded/Manrope, bestaande knop-/kaart-componenten).

De pagina op `/` (root `index.html`) is een tijdelijke "onder
constructie"-pagina en blijft ongewijzigd — dit is geen onderdeel van deze
wijziging.

## Scope

- **Bestand:** `landingspagina/index.html` (volledige herbouw van de
  `<body>`-inhoud; design tokens/CSS-basis in de `<style>` blijven zoals ze
  zijn, secties die niet meer gebruikt worden vervallen)
- **Buiten scope:** root `index.html`, `/proefles/`, `/veelgestelde-vragen/`,
  ledenapp-pagina's — geen van deze wordt aangepast.

## Wat vervalt

Team-carrousel (placeholder-namen), transformatie voor/na-carrousel,
prijzen-sectie, "Hoe het werkt"-stappen, drie-pijlers-tekst, FAQ-sectie
(bestaat al apart op `/veelgestelde-vragen/`), testimonials, contactformulier,
nieuwsbrief-sectie. De bijbehorende CSS-regels voor deze secties worden
verwijderd uit de `<style>`.

## Nieuwe sectie-opbouw

1. **Hero**
   - Kop + subtekst (hergebruik bestaande speelse toon: "Voel je die kriebel
     al?")
   - Trust-badge: "2 vaste speelavonden per week — 10 banen in Almere"
     (bestaande copy, blijft)
   - Primaire CTA-knop "Doe mee" → `/proefles/`
   - Video i.p.v. losse illustratieve "portret"-orb: hergebruik de bestaande
     `embed-gate`-component met `assets/video/intro.mp4`

2. **Intro / waardepropositie**
   - Korte alinea in de stijl van Den Bosch's "Sportief en gezellig":
     nadruk op laagdrempeligheid, twee vaste speelavonden, welkom voor elk
     niveau. Geen losse actiefoto's (die zijn er niet) — visuele afwisseling
     via bestaande decoratieve stijlmiddelen (bg-tekst, gradients).

3. **Wat is pickleball?**
   - Uitleg: mix van tennis/badminton/tafeltennis
   - Voordelenlijst met de bestaande `icoon-vinkje`-component (toegankelijk,
     voor alle leeftijden, sportief maar ontspannen)

4. **Statistieken**
   - Hergebruik van bestaande, al elders op de site gebruikte cijfers:
     10 banen (8 dinsdag + 2 donderdag), 2 speelavonden per week,
     11 maanden per jaar (alles behalve juli)
   - Zelfde `stats-balk`-component als nu al in de pagina staat

5. **Over ons**
   - 3 uitklapbare blokken (accordion, zelfde interactiepatroon als de
     bestaande FAQ-accordion): "Hoe zijn we ontstaan?", "Hoe zijn de
     mensen?", "Hoe kan jij meedoen?"
   - Copy: conceptteksten in de bestaande speelse/vlotte toon van de site.
     Dit is startcopy, geen definitieve clubgeschiedenis — makkelijk navenant
     aan te passen zodra er een definitieve versie is.

6. **Speelschema** ("Waar en wanneer")
   - Canonieke data uit `veelgestelde-vragen/index.html`:
     - Dinsdag 19:30–21:30 — Sporthal Almere Haven, Parkwerf 138, 1354 EB
       Almere
     - Donderdag 18:30–20:30 — Gymlokaal Kraaiennest (Noorderplassen, Almere
       Stad)
   - Elke regel: dag, locatie, tijd (visuele stijl vergelijkbaar met Den
     Bosch's dag-kaarten, maar in onze `kaart`-component)
   - CTA-knop "Meld je aan" → `/proefles/`

7. **Sponsors**
   - Generieke "Ook sponsor worden van onze club?"-sectie met CTA-knop, geen
     sponsorlogo's (nog geen sponsors)

8. **Footer**
   - Hergebruik bestaande footer-structuur/component (contactinfo, social,
     copyright) zoals al aanwezig in de pagina

## Navigatie

Menu-items worden: "Wat is pickleball?" · "Over ons" · "Waar & wanneer" ·
"Contact" · **"Doe mee →"** (in-page anchors naar de bijbehorende secties,
zelfde patroon als het huidige menu-paneel).

## Niet-doelen

- Geen live/dynamisch ledenaantal ophalen uit de ledenapp/Supabase op deze
  statische pagina — buiten scope, zou backend-integratie vereisen die niet
  gevraagd is.
- Geen echte foto's/teamportretten — die zijn er niet; illustratieve
  SVG/gradient-stijl blijft zoals elders op de site (bestaande TODO-conventie
  voor "vervang zodra beeldmateriaal beschikbaar is" blijft van toepassing).
