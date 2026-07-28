// Almere Pickleball — helper om verjaardagstaart.html in een bestaande
// pagina in te sluiten (i.p.v. er los naartoe te navigeren). De taart zelf
// is een volledig zelfstandig bestand met eigen <style>/<script> en een
// globale window.PickleballBirthday-API — dit script haalt dat bestand op,
// injecteert de stijl/overlay/script in het huidige document, en verbergt
// 'm meteen weer (embedden mag niet automatisch flitsen; de aanroeper
// beslist zelf wanneer .show() nodig is).

async function laadVerjaardagsoverlay() {
  if (document.getElementById('cake-overlay')) return;
  const resp = await fetch('/assets/verjaardag/verjaardagstaart.html');
  const html = await resp.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');

  const stijl = doc.querySelector('style');
  if (stijl) document.head.appendChild(document.importNode(stijl, true));

  const overlay = doc.getElementById('cake-overlay');
  if (!overlay) return;
  document.body.appendChild(document.importNode(overlay, true));
  document.getElementById('cake-overlay').classList.add('hidden');

  const script = doc.querySelector('body script');
  if (script) {
    const s = document.createElement('script');
    s.textContent = script.textContent;
    document.body.appendChild(s);
  }
}

/// Toont de taart alleen als geboortedatum vandaag jarig is (maand+dag,
/// jaartal doet er niet toe). Laadt de overlay lui in — geen extra
/// netwerk-call op dagen die toch geen verjaardag zijn.
///
/// Thema volgt automatisch het licht/donker-thema van de site (crème/bruin
/// bij licht, navy/goud bij donker) via de al bestaande huidigThema() uit
/// theme.js — geef zelf een thema mee om dat te overschrijven.
async function toonVerjaardagAlsJarig(geboortedatum, naam, thema) {
  if (!geboortedatum) return false;
  const nu = new Date();
  const gd = new Date(geboortedatum + 'T00:00:00');
  if (gd.getMonth() !== nu.getMonth() || gd.getDate() !== nu.getDate()) return false;
  await laadVerjaardagsoverlay();
  if (!window.PickleballBirthday) return false;
  window.PickleballBirthday.setName(naam);
  const gekozenThema = thema || (typeof huidigThema === 'function' && huidigThema() === 'dark' ? 'club' : 'original');
  window.PickleballBirthday.setTheme(gekozenThema);
  window.PickleballBirthday.show();
  return true;
}
