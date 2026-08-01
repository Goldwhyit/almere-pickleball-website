# Meten & rapporteren — plan (§8.6)

## Belangrijke kanttekening vooraf

"Opgenomen worden in elke AI-zoekactie over pickleball" is geen doel dat
gegarandeerd — of zelfs betrouwbaar gemeten — kan worden: AI-antwoordmachines
tonen geen consistente, herhaalbare resultaten (twee identieke vragen op
verschillende momenten kunnen verschillend beantwoord worden), en er is geen
publieke, volledige log van welke bronnen een model gebruikt heeft. Het doel
hieronder is daarom bewust kleiner en wél meetbaar: *is onze content
correct, crawlbaar en aantoonbaar geciteerd wanneer het wél gebeurt*.

## Wat we WEL kunnen meten

1. **Crawler-toegang (technisch, direct meetbaar)**
   - Server-logs / hosting-analytics op user-agent-niveau controleren of
     GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended
     etc. daadwerkelijk langskomen en een 200 terugkrijgen (geen 403/404 op
     robots.txt, sitemap.xml, llms.txt, llms-full.txt).
   - Frequentie: 1x per kwartaal steekproefsgewijs controleren, of vaker als
     GitHub Pages-analytics dat toelaat.

2. **Structured-data-validiteit (technisch, direct meetbaar)**
   - Elke pagina met JSON-LD door Google's Rich Results Test / Schema.org
     validator halen na elke inhoudelijke wijziging. Vaste check: het
     zichtbare antwoord in de FAQ-tekst moet exact overeenkomen met het
     `acceptedAnswer.text` in de JSON-LD (nu voor het eerst gedaan bij de
     donderdag/Kraaiennest-toevoeging in deze sessie) — een mismatch hier is
     een garantie voor een verkeerd AI-antwoord, dus dit is de belangrijkste
     terugkerende check.

3. **Directe steekproeven bij AI-antwoordmachines (kwalitatief, handmatig)**
   - Elk kwartaal dezelfde 5–8 realistische vragen stellen aan ChatGPT,
     Claude en Perplexity (bv. "waar kan ik pickleballen in Almere",
     "wat kost een proefles pickleball in Almere", "kan ik in Almere een
     pickleballbaan huren zonder lid te zijn") en noteren: (a) wordt de club
     genoemd, (b) zijn de genoemde feiten correct, (c) welke bron citeert het
     model (indien getoond).
   - Dit is INSPECTIE, geen KPI met een target-percentage — de bedoeling is
     vooral snel een feitelijke fout te ontdekken (bv. een verouderd adres)
     voordat die zich verspreidt.

4. **Standaard-zoekverkeer als indirecte proxy**
   - Search Console (nadat de site daar geverifieerd is) voor
     impressies/klikken op naam-gerelateerde en lokale zoekwoorden — geen
     directe AI-metriek, maar een aanwijzing of de onderliggende SEO-basis
     (titels, descriptions, structured data) uberhaupt gezond is; een
     gezonde traditionele SEO-basis is een voorwaarde voor GEO, geen
     vervanging ervoor.

## Rapportage-ritme

- Per kwartaal: een kort overzicht (kan een paragraaf in een e-mail zijn)
  met de bevindingen van punt 1–3 hierboven en eventuele gevonden en
  gecorrigeerde feitelijke fouten.
- Direct (niet wachten op het kwartaalmoment): zodra een feit wijzigt
  (nieuwe speeltijd, nieuwe locatie, gewijzigde prijs) — dan eerst de FAQ +
  JSON-LD + llms(-full).txt bijwerken, dat is geen losse "SEO-taak" maar
  onderdeel van diezelfde contentwijziging.
