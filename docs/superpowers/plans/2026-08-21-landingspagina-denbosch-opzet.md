# Landingspagina herbouw naar Den Bosch-opzet — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Herbouw `landingspagina/index.html` van de huidige "fitness-coaching"-opbouw naar de compactere sectie-opbouw van pickleballdenbosch.nl, in de bestaande Almere Pickleball-huisstijl.

**Architecture:** Eén statisch HTML-bestand (geen build-stap, geen framework) met inline `<style>` en `<script>` — zelfde patroon als de rest van de site. We werken in-place: eerst dode CSS/JS verwijderen, dan sectie voor sectie de `<main>`-inhoud vervangen in de nieuwe volgorde, en tot slot navigatie/footer/meta bijwerken.

**Tech Stack:** Vanilla HTML/CSS/JS, geen dependencies, geen build-tools.

## Global Constraints

- Bestand: alleen `landingspagina/index.html` wordt aangepast (zie spec `docs/superpowers/specs/2026-08-21-landingspagina-denbosch-opzet-design.md`).
- Design tokens (navy/goud, Unbounded/Manrope, `--radius-*`, `--schaduw-*`) blijven ongewijzigd — nieuwe CSS gebruikt bestaande custom properties, geen nieuwe kleuren.
- Bestaande componenten (`.kaart`, `.hover-kaart`, `.knop`/`.knop-primair`, `.icoon-vinkje`, `.sectie-kop`, `.reveal`, `.faq-item`-accordion, `.stats-balk`-teller) worden hergebruikt, niet opnieuw gebouwd.
- Primaire CTA's linken naar `/proefles/`.
- Geen automatische testsuite in deze repo (statische site, geen package.json) — verificatie per taak gebeurt met `grep` op verwachte/verdwenen ids/classes, plus een handmatige browsercheck in de laatste taak.
- Alle nieuwe klantgerichte tekst blijft Nederlands, in de bestaande speelse/vlotte toon (zie hero: "Voel je die kriebel al?").

---

### Task 1: Dode CSS verwijderen (secties die vervallen)

**Files:**
- Modify: `landingspagina/index.html` (binnen de `<style>`-blok, tussen `<style>` en `</style>`)

**Interfaces:**
- Consumes: niets
- Produces: een `<style>`-blok zonder regels voor `.team-*`, `.carousel-pijlen`, `.pijl-knop`, `.transform-*`, `.programma-*`, `.nieuws-kaart`, `.prijzen-*`, `.toggle-switch`, `.bespaar-badge`, `.prijs-*`, `.stappen-grid`, `.stap-kaart*`, `.pijlers-tekst`, `.testi-*`, `.contact-grid`, `.veld*`, `.label-verplicht`, `.form-status*`, `.contact-info-rij*`, `.nieuwsbrief-*`, `.embed-gate*`, `.video-intro`. Blijft behouden: `.kaart`, `.hover-kaart`, `.grid-3`, `.knop*`, `.icoon-vinkje`, `.sectie-*`, `.reveal*`, `.stats-balk`/`.stat-*`, `.faq-*`, header/menu/hero(-tekst)/footer-CSS.

- [ ] **Step 1: Verwijder de CSS-blokken voor de te vervallen secties**

  Zoek en verwijder in de `<style>` de volgende, met hun commentaarkoppen, complete regelblokken (herkenbaar aan de `/* ==== */`-koppen erboven):
  - `/* Over ons — intro + video + teamcarrousel */` → verwijder alleen de regels `.video-intro`, `.embed-gate*`, `.team-*`, `.carousel-pijlen`, `.pijl-knop*` (laat de kop-commentaar zelf ook weg, hij is straks niet meer van toepassing)
  - `/* Transformatie / voortgang-carrousel */` blok volledig
  - `/* Programma's */` blok volledig (`.programma-kaart`, `.programma-kop`, `.programma-illustratie*`) — **let op:** `.feature-lijst` en `.feature-lijst li` blijven staan, die worden hergebruikt.
  - `/* Nieuws (mini-strip...) */` blok volledig
  - `/* Prijzen */` blok volledig
  - `/* Hoe het werkt */` blok volledig
  - `/* Drie pijlers */` blok volledig
  - `/* Testimonials */` blok volledig
  - `/* Contact */` blok volledig
  - `/* Newsletter + footer */` blok: verwijder alleen `.nieuwsbrief-*`-regels, **laat** `footer.site-footer`, `.footer-grid`, `.footer-merk`, `.footer-tagline`, `.footer-social`, `.social-knop`, `.footer-onder` staan (die blijven bestaan).

- [ ] **Step 2: Verifieer dat de verwijderde classes nergens meer in de `<style>` voorkomen**

  Run: `grep -nE "\.(team-|transform-|programma-|nieuws-kaart|prijzen-|prijs-|toggle-switch|bespaar-badge|stappen-grid|stap-kaart|pijlers-tekst|testi-|contact-grid|veld |label-verplicht|form-status|contact-info-rij|nieuwsbrief-|embed-gate|video-intro)" landingspagina/index.html`

  Expected: geen output (exit code 1 / geen matches) binnen de `<style>`-sectie. (Er kunnen in latere taken nog verwijzingen in de `<body>`/`<script>` staan die je in Task 2 en verder opruimt — dat is oké op dit punt.)

- [ ] **Step 3: Commit**

  ```bash
  cd ~/almere-pickleball-website
  git add landingspagina/index.html
  git commit -m "Landingspagina: dode CSS opruimen voor te vervallen secties"
  ```

---

### Task 2: Hero herbouwen met video i.p.v. illustratieve portret-orb

**Files:**
- Modify: `landingspagina/index.html` (CSS: vervang `.hero-portret*`-regels; HTML: hero-sectie; JS: reduced-motion-check voor de video)

**Interfaces:**
- Consumes: bestaand `assets/video/intro.mp4`, bestaande `.knop-outline`/`knop-cirkel-cta`-stijl, bestaande `reduceMotion`-variabele in het `<script>`-blok.
- Produces: `<video id="hero-video">` in de hero, zichtbaar zonder consent-gate (lokaal videobestand, geen third-party cookies/IP-verwerking — dus geen `embed-gate` nodig).

- [ ] **Step 1: Vervang de hero-portret CSS door hero-video CSS**

  Zoek dit blok en vervang het volledig:

  ```css
  .hero-portret { position: relative; display: flex; align-items: center; justify-content: center; }
  @media (max-width: 860px) { .hero-portret { display: none; } }
  .hero-portret-orb {
    position: relative; width: 100%; aspect-ratio: 1/1; max-width: 440px; border-radius: 50%;
    background: radial-gradient(circle at 32% 28%, rgba(255,255,255,0.28), transparent 55%), linear-gradient(155deg, var(--gold) 0%, var(--navy) 100%);
    box-shadow: 0 40px 90px -20px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.3);
    display: flex; align-items: center; justify-content: center;
  }
  .hero-portret-orb svg { width: 46%; height: 46%; filter: drop-shadow(0 14px 20px rgba(0,0,0,0.3)); }
  /* TODO: vervang deze illustratieve "portret"-cirkel door een echte
     actiefoto van een speler zodra er goedgekeurd beeldmateriaal is —
     de tekstlaag/CTA's ernaast blijven dan ongewijzigd werken. */
  ```

  door:

  ```css
  .hero-video-wrap { position: relative; display: flex; align-items: center; justify-content: center; }
  @media (max-width: 860px) { .hero-video-wrap { display: none; } }
  .hero-video-wrap video {
    width: 100%; max-width: 440px; aspect-ratio: 4/5; object-fit: cover;
    border-radius: var(--radius-kaart-groot);
    box-shadow: 0 40px 90px -20px rgba(0,0,0,0.5);
  }
  ```

- [ ] **Step 2: Vervang de hero-portret HTML door de video**

  Zoek dit blok (binnen `<div class="hero-grid">`):

  ```html
        <div class="hero-portret" aria-hidden="true">
          <div class="hero-portret-orb">
            <svg viewBox="0 0 64 64" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="24" cy="16" r="7"/>
              <path d="M18 20c-6 3-9 9-9 17v10c0 2 2 4 4 4s4-2 4-4V37"/>
              <path d="M30 20c6 3 9 9 9 17v10c0 2-2 4-4 4s-4-2-4-4V37"/>
              <path d="M24 30l4 6 4-6" fill="#fff"/>
            </svg>
          </div>
        </div>
  ```

  en vervang door:

  ```html
        <div class="hero-video-wrap" aria-hidden="true">
          <video id="hero-video" src="/assets/video/intro.mp4" autoplay muted loop playsinline></video>
        </div>
  ```

- [ ] **Step 3: Voeg de reduced-motion-check toe in het `<script>`-blok**

  Zoek de regel `const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;` en voeg er direct na toe:

  ```js
  const heroVideo = document.getElementById('hero-video');
  if (heroVideo && reduceMotion) {
    heroVideo.removeAttribute('autoplay');
    heroVideo.pause();
  }
  ```

- [ ] **Step 4: Verifieer**

  Run: `grep -n "hero-portret\|hero-video" landingspagina/index.html`

  Expected: alleen regels met `hero-video` / `hero-video-wrap`, geen `hero-portret` meer.

- [ ] **Step 5: Commit**

  ```bash
  git add landingspagina/index.html
  git commit -m "Landingspagina: hero toont introvideo i.p.v. illustratieve portret-orb"
  ```

---

### Task 3: Over-ons-video/team-carrousel vervangen door Intro + "Wat is pickleball?"

**Files:**
- Modify: `landingspagina/index.html`

**Interfaces:**
- Consumes: `.sectie-kop`, `.accent`, `.reveal` (bestaand)
- Produces: nieuwe secties `#intro` (geen anchor nodig, geen nav-item) en `#wat-is-pickleball`; nieuwe kleine CSS-klasse `.usp-lijst`.

- [ ] **Step 1: Vervang de hele "Over ons"-sectie (met video + teamcarrousel) door Intro + Wat-is-pickleball**

  Zoek het volledige blok tussen (en inclusief) `<!-- ============ Over ons ============ -->` en de afsluitende `</section>` ervan (dat blok bevat de `id="over-ons"`-sectie met `.video-intro`, `.team-sectie` etc.) en vervang het door:

  ```html
  <!-- ============ Intro ============ -->
  <section id="intro" class="sectie-licht">
    <div class="sectie-kop reveal">
      <span class="eyebrow">Sportief en gezellig</span>
      <h2>Twee avonden, <span class="accent">iedereen welkom</span></h2>
      <p>
        Elke dinsdag en donderdag staan onze banen open voor wie zin heeft in
        een potje pickleball — van eerste bal tot gevorderde rally's. Geen
        ervaring nodig, wel goede zin.
      </p>
    </div>
  </section>

  <!-- ============ Wat is pickleball? ============ -->
  <section id="wat-is-pickleball" class="sectie-grijs">
    <div class="sectie-kop reveal">
      <span class="eyebrow">De sport</span>
      <h2>Wat is <span class="accent">pickleball</span>?</h2>
      <p>
        Pickleball is tennis, badminton en tafeltennis die een avondje stappen
        zijn gaan doen en verliefd op elkaar zijn geworden. Je speelt op een
        klein veld, met een lichte paddle en een plastic bal met gaatjes — en
        binnen vijf minuten snap je waarom iedereen verslingerd raakt.
      </p>
    </div>
    <ul class="usp-lijst reveal">
      <li><span class="icoon-vinkje">✓</span> Makkelijk te leren, moeilijk te stoppen</li>
      <li><span class="icoon-vinkje">✓</span> Van 8 tot 80 jaar, elk niveau welkom</li>
      <li><span class="icoon-vinkje">✓</span> Net zoveel sociaal als sportief</li>
    </ul>
  </section>
  ```

- [ ] **Step 2: Voeg de `.usp-lijst`-CSS toe**

  Voeg direct na de `.icoon-vinkje`-regel in de `<style>` toe:

  ```css
  .usp-lijst { list-style: none; padding: 0; margin: 0 auto; max-width: 460px; display: flex; flex-direction: column; gap: 14px; }
  .usp-lijst li { display: flex; align-items: center; gap: 12px; font-size: 15.5px; }
  ```

- [ ] **Step 3: Verifieer**

  Run: `grep -n 'id="over-ons"\|id="intro"\|id="wat-is-pickleball"\|video-intro\|team-sectie' landingspagina/index.html`

  Expected: `id="intro"` en `id="wat-is-pickleball"` komen voor, `id="over-ons"`/`video-intro`/`team-sectie` komen (nog) niet voor — die voegen we in Task 4 opnieuw toe, elders in de pagina.

- [ ] **Step 4: Commit**

  ```bash
  git add landingspagina/index.html
  git commit -m "Landingspagina: Intro en 'Wat is pickleball?' secties toevoegen"
  ```

---

### Task 4: Statistieken verplaatsen + "Over ons" herbouwen als accordion

**Files:**
- Modify: `landingspagina/index.html`

**Interfaces:**
- Consumes: bestaande `.stats-balk`/`.stat-item`/`.stat-getal`-CSS+JS (ongewijzigd), bestaande `.faq-item`/`.faq-vraag`/`.faq-chevron`/`.faq-antwoord`-CSS+JS (ongewijzigd, nu ook gebruikt buiten de FAQ-pagina-sectie).
- Produces: `id="over-ons"` opnieuw aanwezig, nu als accordion, direct na de statistieken-sectie.

- [ ] **Step 1: Verwijder de statistieken-sectie van zijn huidige plek**

  Zoek en verwijder (inclusief het commentaar erboven):

  ```html
  <!-- ============ Statistieken ============ -->
  <section class="sectie-grijs">
    <div class="stats-balk">
      <div class="stat-item reveal">
        <div class="stat-getal" data-count-to="10">0</div>
        <div class="stat-label">Banen in Almere<br />(8 op dinsdag, 2 op donderdag)</div>
      </div>
      <div class="stat-item reveal">
        <div class="stat-getal" data-count-to="44">0</div>
        <div class="stat-label">Speelplekken per week</div>
      </div>
      <div class="stat-item reveal">
        <div class="stat-getal" data-count-to="11">0</div>
        <div class="stat-label">Maanden per jaar spelen<br />(alles behalve juli)</div>
      </div>
    </div>
  </section>
  ```

- [ ] **Step 2: Plaats de statistieken-sectie (ongewijzigd) direct na de "Wat is pickleball?"-sectie, gevolgd door de nieuwe "Over ons"-accordion**

  Zoek de sluitende `</section>` van de `id="wat-is-pickleball"`-sectie uit Task 3, en voeg er direct na toe:

  ```html
  <!-- ============ Statistieken ============ -->
  <section class="sectie-grijs">
    <div class="stats-balk">
      <div class="stat-item reveal">
        <div class="stat-getal" data-count-to="10">0</div>
        <div class="stat-label">Banen in Almere<br />(8 op dinsdag, 2 op donderdag)</div>
      </div>
      <div class="stat-item reveal">
        <div class="stat-getal" data-count-to="44">0</div>
        <div class="stat-label">Speelplekken per week</div>
      </div>
      <div class="stat-item reveal">
        <div class="stat-getal" data-count-to="11">0</div>
        <div class="stat-label">Maanden per jaar spelen<br />(alles behalve juli)</div>
      </div>
    </div>
  </section>

  <!-- ============ Over ons ============ -->
  <section id="over-ons" class="sectie-licht">
    <div class="sectie-kop reveal">
      <span class="eyebrow">Wie wij zijn</span>
      <h2>Over <span class="accent">ons</span></h2>
    </div>
    <!-- TODO: conceptcopy — vervang door de definitieve clubgeschiedenis
         zodra het bestuur die heeft vastgesteld. -->
    <div class="faq-lijst reveal">
      <div class="faq-item" data-open="false">
        <button type="button" class="faq-vraag">Hoe zijn we ontstaan?<span class="faq-chevron" aria-hidden="true">⌄</span></button>
        <div class="faq-antwoord"><div class="faq-antwoord-inner">Almere Pickleball begon met een klein groepje spelers dat een balletje sloeg op een parkeerplaats — en groeide al snel uit tot een volwaardige club met vaste speelavonden in Almere.</div></div>
      </div>
      <div class="faq-item" data-open="false">
        <button type="button" class="faq-vraag">Hoe zijn de mensen?<span class="faq-chevron" aria-hidden="true">⌄</span></button>
        <div class="faq-antwoord"><div class="faq-antwoord-inner">Ontspannen, sportief en altijd in voor een grapje tussen de rally's door. Nieuwe gezichten worden hier net zo hard aangemoedigd als de vaste kern.</div></div>
      </div>
      <div class="faq-item" data-open="false">
        <button type="button" class="faq-vraag">Hoe kan jij meedoen?<span class="faq-chevron" aria-hidden="true">⌄</span></button>
        <div class="faq-antwoord"><div class="faq-antwoord-inner">Meld je aan voor een gratis proefles, kom een avond meespelen, en kies daarna vrijblijvend of en hoe je verder gaat.</div></div>
      </div>
    </div>
  </section>
  ```

- [ ] **Step 3: Verifieer**

  Run: `grep -n 'id="over-ons"\|class="stats-balk"' landingspagina/index.html`

  Expected: beide komen precies één keer voor, en `id="over-ons"` staat op de regel na de `stats-balk`-sectie (visueel te controleren in de editor: statistieken direct gevolgd door Over ons).

- [ ] **Step 4: Commit**

  ```bash
  git add landingspagina/index.html
  git commit -m "Landingspagina: statistieken verplaatsen, Over ons herbouwen als accordion"
  ```

---

### Task 5: Programma's/Nieuws/Prijzen/Hoe-het-werkt/Pijlers vervangen door Speelschema

**Files:**
- Modify: `landingspagina/index.html`

**Interfaces:**
- Consumes: `.kaart`, `.hover-kaart`, `.knop-primair` (bestaand)
- Produces: nieuwe sectie `#waar-wanneer`, nieuwe CSS-klassen `.schema-lijst`, `.schema-rij`, `.schema-dag`, `.schema-details`, `.schema-tijd`, `.schema-locatie`, `.niveau-badge`.

- [ ] **Step 1: Verwijder de secties Programma's, Nieuws, Prijzen, Hoe het werkt en Drie pijlers**

  Verwijder de vijf complete `<section>...</section>`-blokken (met hun commentaarkoppen) die beginnen bij `<!-- ============ Programma's ============ -->` en doorlopen tot en met het einde van `<!-- ============ Drie pijlers ============ -->` (dit is één doorlopend stuk in het bestand — alles ertussen mag weg).

- [ ] **Step 2: Voeg de Speelschema-sectie toe op die plek**

  ```html
  <!-- ============ Waar en wanneer ============ -->
  <section id="waar-wanneer" class="sectie-licht">
    <div class="sectie-kop reveal">
      <span class="eyebrow">Waar en wanneer</span>
      <h2>Kom een keer <span class="accent">meespelen</span></h2>
      <p>Twee vaste speelavonden in Almere — kies wat jou het beste past.</p>
    </div>
    <div class="schema-lijst reveal">
      <div class="kaart hover-kaart schema-rij">
        <div class="schema-dag">Dinsdag</div>
        <div class="schema-details">
          <span class="niveau-badge">Alle niveaus</span>
          <span class="schema-tijd">19:30 – 21:30 uur</span>
          <span class="schema-locatie">Sporthal Almere Haven, Parkwerf 138, Almere</span>
        </div>
      </div>
      <div class="kaart hover-kaart schema-rij">
        <div class="schema-dag">Donderdag</div>
        <div class="schema-details">
          <span class="niveau-badge">Alle niveaus</span>
          <span class="schema-tijd">18:30 – 20:30 uur</span>
          <span class="schema-locatie">Gymlokaal Kraaiennest, Noorderplassen, Almere</span>
        </div>
      </div>
    </div>
    <div class="reveal" style="text-align:center;margin-top:32px;">
      <a class="knop knop-primair" href="/proefles/">Meld je aan voor een proefles</a>
    </div>
  </section>
  ```

- [ ] **Step 3: Voeg de bijbehorende CSS toe**

  Voeg toe direct na de `.usp-lijst`-regels (uit Task 3):

  ```css
  .schema-lijst { display: flex; flex-direction: column; gap: 16px; max-width: 680px; margin: 0 auto; }
  .schema-rij { display: flex; flex-wrap: wrap; align-items: center; gap: 16px 24px; }
  .schema-dag { font-family: 'Unbounded', sans-serif; font-weight: 800; font-size: 1.2rem; min-width: 120px; }
  .schema-details { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 16px; flex: 1; }
  .schema-tijd { font-weight: 700; font-variant-numeric: tabular-nums; }
  .schema-locatie { color: var(--ink-muted); font-size: 14px; }
  .niveau-badge { display: inline-block; padding: 4px 12px; border-radius: var(--radius-pil); background: rgba(36,87,255,0.1); color: var(--navy); font-size: 12px; font-weight: 800; }
  @media (prefers-color-scheme: dark) { .niveau-badge { background: rgba(138,182,236,0.14); color: #8ab6ec; } }
  ```

- [ ] **Step 4: Verifieer**

  Run: `grep -n 'id="waar-wanneer"\|id="programmas"\|id="nieuws"\|id="prijzen"' landingspagina/index.html`

  Expected: alleen `id="waar-wanneer"` komt voor.

- [ ] **Step 5: Commit**

  ```bash
  git add landingspagina/index.html
  git commit -m "Landingspagina: Programma's/Nieuws/Prijzen/Hoe-het-werkt/Pijlers vervangen door Speelschema"
  ```

---

### Task 6: FAQ/Testimonials/Contact/Newsletter vervangen door Sponsors, footer bijwerken

**Files:**
- Modify: `landingspagina/index.html`

**Interfaces:**
- Consumes: `.sectie-kop`, `.knop-primair`, bestaande footer-structuur (`.footer-grid`, `.footer-merk`, `.footer-tagline`, `.footer-social`, `.social-knop`, `.footer-onder`)
- Produces: nieuwe Sponsors-sectie, footer met `id="contact"` en bijgewerkte linklijsten.

- [ ] **Step 1: Verwijder de secties FAQ, Testimonials, Contact en Newsletter**

  Verwijder de vier complete `<section>...</section>`-blokken die beginnen bij `<!-- ============ FAQ ============ -->` en doorlopen tot en met het einde van `<!-- ============ Newsletter ============ -->` (inclusief de `<!-- TODO: dit zijn voorbeeldreviews... -->`-commentaarregel die daar tussenin staat).

- [ ] **Step 2: Voeg de Sponsors-sectie toe op die plek**

  ```html
  <!-- ============ Sponsors ============ -->
  <section class="sectie-grijs">
    <div class="sectie-kop reveal">
      <span class="eyebrow">Steun de club</span>
      <h2>Ook <span class="accent">sponsor</span> worden?</h2>
      <p>We groeien hard en zoeken lokale partners die samen met ons Almere Pickleball verder willen brengen.</p>
    </div>
    <div class="reveal" style="text-align:center;">
      <a class="knop knop-primair" href="mailto:info@almerepickleball.nl?subject=Sponsoring">Word sponsor</a>
    </div>
  </section>
  ```

- [ ] **Step 3: Werk de footer bij — `id="contact"`, contactgegevens, bijgewerkte linklijsten**

  Zoek het volledige `<footer class="site-footer">...</footer>`-blok en vervang het door:

  ```html
  <footer class="site-footer" id="contact">
    <div class="footer-grid">
      <div>
        <div class="footer-merk">
          <img src="/assets/img/logo.png" alt="" />
          <span>Almere Pickleball</span>
        </div>
        <p class="footer-tagline">Lef, lenigheid en een vleugje verleiding — op de baan in Almere.</p>
        <p style="margin-top:14px;"><a href="mailto:info@almerepickleball.nl">info@almerepickleball.nl</a></p>
        <div class="footer-social">
          <!-- TODO: echte kanalen invullen zodra beschikbaar -->
          <a class="social-knop" href="#" aria-label="Instagram" rel="noopener">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2a1e02" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="#2a1e02" stroke="none"/></svg>
          </a>
          <a class="social-knop" href="#" aria-label="Facebook" rel="noopener">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2a1e02" stroke-width="2"><path d="M14 9h3V5h-3a4 4 0 0 0-4 4v2H7v4h3v7h4v-7h3l1-4h-4V9a1 1 0 0 1 1-1z"/></svg>
          </a>
        </div>
      </div>
      <div>
        <h4>Pagina</h4>
        <ul>
          <li><a href="#wat-is-pickleball">→ Wat is pickleball?</a></li>
          <li><a href="#over-ons">→ Over ons</a></li>
          <li><a href="#waar-wanneer">→ Waar &amp; wanneer</a></li>
          <li><a href="/proefles/">→ Doe mee</a></li>
        </ul>
      </div>
      <div>
        <h4>Meer</h4>
        <ul>
          <li><a href="/">→ Hoofdwebsite</a></li>
          <li><a href="/veelgestelde-vragen/">→ Veelgestelde vragen</a></li>
          <li><a href="/privacy/">→ Privacybeleid</a></li>
        </ul>
      </div>
    </div>
    <!-- TODO: KvK-nummer en bankgegevens toevoegen zodra beschikbaar -->
    <div class="footer-onder">
      <span>© <span id="jaar"></span> Almere Pickleball</span>
      <span>Almere, Nederland</span>
    </div>
  </footer>
  ```

- [ ] **Step 4: Verifieer**

  Run: `grep -n 'id="faq"\|id="contact"\|testi-sectie\|nieuwsbrief-sectie\|contact-form\|id="nieuwsbrief-form"' landingspagina/index.html`

  Expected: alleen `id="contact"` (op de `<footer>`) komt voor; de rest niet meer.

- [ ] **Step 5: Commit**

  ```bash
  git add landingspagina/index.html
  git commit -m "Landingspagina: FAQ/testimonials/contact/nieuwsbrief vervangen door sponsors, footer bijgewerkt"
  ```

---

### Task 7: JS opruimen, navigatiemenu en hero-CTA's bijwerken, meta-description

**Files:**
- Modify: `landingspagina/index.html`

**Interfaces:**
- Consumes: bestaande `data-scroll`-mechanisme, bestaande `reveal`/`stat-getal`/`faq-item`-logica (ongewijzigd, blijft werken)
- Produces: `<script>`-blok zonder verwijzingen naar verwijderde elementen; menu-paneel met de 5 nieuwe navigatie-items; hero-knoppen die naar bestaande doelen linken; bijgewerkte `<meta name="description">`.

- [ ] **Step 1: Verwijder de JS voor teamcarrousel, transformatie-carrousel, prijzentoggle, embed-gates, contactformulier en nieuwsbrief**

  Verwijder uit het `<script>`-blok, in volgorde van boven naar onder:
  - Het blok `// Teamcarrousel: pijlknoppen scrollen de rij met kaarten.` t/m de twee `addEventListener`-regels voor `team-links`/`team-rechts`.
  - Het blok `// Transformatie-carrousel: dots + track-verschuiving.` t/m de `transformDots.forEach(...)`-regel.
  - Het blok `// Prijzen: maandelijks/jaarlijks-toggle.` t/m de bijbehorende `addEventListener`.
  - Het blok `// Consent-gate voor embeds ...` t/m en inclusief de twee `zetEmbedGate(...)`-aanroepen (`video-gate` en `kaart-gate`) — dit hele blok inclusief de `zetEmbedGate`-functiedefinitie, `YOUTUBE_VIDEO_ID`, `ICOON_AFSPELEN`, `ICOON_KAART`.
  - Het blok `// Contactformulier: eenvoudige client-side validatie + bevestiging.` t/m de bijbehorende `addEventListener`.
  - Het blok `// Nieuwsbrief-formulier: zelfde eenvoudige patroon` t/m de bijbehorende `addEventListener`.

- [ ] **Step 2: Werk de knoppen in de hero bij**

  Zoek:

  ```html
            <button type="button" class="knop-cirkel-cta" data-scroll="prijzen">
              Doe mee
              <span class="cirkel" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2a1e02" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </span>
            </button>
            <button type="button" class="knop knop-outline" style="color:#fff;border-color:rgba(255,255,255,0.4);" data-scroll="programmas">Bekijk programma's</button>
  ```

  en vervang door:

  ```html
            <a class="knop-cirkel-cta" href="/proefles/">
              Doe mee
              <span class="cirkel" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2a1e02" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </span>
            </a>
            <button type="button" class="knop knop-outline" style="color:#fff;border-color:rgba(255,255,255,0.4);" data-scroll="waar-wanneer">Bekijk speelschema</button>
  ```

- [ ] **Step 3: Werk het menu-paneel bij**

  Zoek:

  ```html
  <nav aria-label="Hoofdnavigatie">
    <a href="#over-ons">Over ons</a>
    <a href="#programmas">Programma's</a>
    <a href="#prijzen">Prijzen</a>
    <a href="#nieuws">Blog</a>
    <a href="#contact">Contact</a>
    <a href="#contact" class="aan-de-slag">Aan de slag →</a>
  </nav>
  ```

  en vervang door:

  ```html
  <nav aria-label="Hoofdnavigatie">
    <a href="#wat-is-pickleball">Wat is pickleball?</a>
    <a href="#over-ons">Over ons</a>
    <a href="#waar-wanneer">Waar &amp; wanneer</a>
    <a href="#contact">Contact</a>
    <a href="/proefles/" class="aan-de-slag">Doe mee →</a>
  </nav>
  ```

- [ ] **Step 4: Werk de meta-description bij**

  Zoek:

  ```html
  <meta name="description" content="Almere Pickleball: speeldagen, lidmaatschappen, speelsterkte en aanmelden voor een proefles." />
  ```

  en vervang door:

  ```html
  <meta name="description" content="Almere Pickleball: wat pickleball is, waar en wanneer we spelen in Almere, en hoe je een gratis proefles aanvraagt." />
  ```

- [ ] **Step 5: Verifieer dat er geen verwijzingen naar verwijderde elementen overblijven**

  Run: `grep -nE "team-carousel|team-links|team-rechts|transform-track|transform-dots|prijzen-toggle|zetEmbedGate|video-gate|kaart-gate|contact-form|nieuwsbrief-form|data-scroll=\"prijzen\"|data-scroll=\"programmas\"|href=\"#programmas\"|href=\"#prijzen\"|href=\"#nieuws\"" landingspagina/index.html`

  Expected: geen output.

- [ ] **Step 6: Commit**

  ```bash
  git add landingspagina/index.html
  git commit -m "Landingspagina: dode JS opruimen, navigatie en hero-CTA's bijwerken"
  ```

---

### Task 8: Handmatige eindcontrole in de browser

**Files:** geen wijzigingen — alleen verificatie.

- [ ] **Step 1: Start een lokale server**

  ```bash
  cd ~/almere-pickleball-website
  python3 -m http.server 8000
  ```

- [ ] **Step 2: Open de pagina en doorloop de checklist**

  Open `http://localhost:8000/landingspagina/` in de browser (voer eerst de toegangscode `kriebel2026` in bij de gate) en controleer:
  - Geen fouten in de browser-console.
  - Hero-video speelt af (of staat stil zonder autoplay als "verminderde beweging" aan staat in het OS).
  - "Doe mee" (hero + footer + speelschema) linkt naar `/proefles/`.
  - "Bekijk speelschema" scrollt naar de speelschema-sectie.
  - Menu-paneel toont de 5 nieuwe items en elk anker scrollt naar de juiste sectie.
  - Statistieken tellen op zodra ze in beeld komen.
  - "Over ons"-accordion klapt open/dicht, één blok open per keer.
  - Speelschema toont dinsdag/donderdag met juiste tijden/locaties.
  - Sponsors-knop opent een mailto-link.
  - Footer-links werken, `#contact`-anker scrollt naar de footer.

- [ ] **Step 3: Stop de server**

  ```bash
  # Ctrl+C in de terminal waar de server draait
  ```

  Geen commit nodig — deze taak levert geen bestandswijzigingen op.
