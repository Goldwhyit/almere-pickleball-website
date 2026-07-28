// Almere Pickleball — handmatige licht/donker-wisselknop.
//
// Standaard volgt de site prefers-color-scheme (systeeminstelling). Zodra
// iemand op de knop tikt, wint die keuze via een data-theme-attribuut op
// <html> (opgeslagen in localStorage) — dit werkt samen met de bestaande
// @media (prefers-color-scheme: dark)-regels: :root[data-theme="dark"] en
// :root[data-theme="light"] overschrijven die per pagina.
//
// Het vroege applyOpgeslagenThema()-scriptje in elke <head> (vóór de
// stylesheet) voorkomt een flits van het verkeerde thema bij het laden.

function huidigThema() {
  const opgeslagen = localStorage.getItem('pb_thema');
  if (opgeslagen === 'dark' || opgeslagen === 'light') return opgeslagen;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const THEMA_ICOON_ZON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
  '<circle cx="12" cy="12" r="4.2"/><line x1="12" y1="2.5" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="21.5"/>' +
  '<line x1="2.5" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="21.5" y2="12"/>' +
  '<line x1="4.9" y1="4.9" x2="6.6" y2="6.6"/><line x1="17.4" y1="17.4" x2="19.1" y2="19.1"/>' +
  '<line x1="4.9" y1="19.1" x2="6.6" y2="17.4"/><line x1="17.4" y1="6.6" x2="19.1" y2="4.9"/></svg>';
const THEMA_ICOON_MAAN =
  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.7 14.4A8.7 8.7 0 1 1 9.6 3.3a7 7 0 0 0 11.1 11.1z"/></svg>';

function zetThema(thema) {
  document.documentElement.setAttribute('data-theme', thema);
  localStorage.setItem('pb_thema', thema);
  document.querySelectorAll('[data-thema-icoon]').forEach(el => {
    el.innerHTML = thema === 'dark' ? THEMA_ICOON_ZON : THEMA_ICOON_MAAN;
  });
}

function initThemeKnop(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'thema-knop';
  btn.setAttribute('aria-label', 'Licht/donker thema wisselen');
  btn.innerHTML = '<span data-thema-icoon>' + (huidigThema() === 'dark' ? THEMA_ICOON_ZON : THEMA_ICOON_MAAN) + '</span>';
  btn.addEventListener('click', () => zetThema(huidigThema() === 'dark' ? 'light' : 'dark'));
  container.appendChild(btn);
}
