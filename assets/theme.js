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

function zetThema(thema) {
  document.documentElement.setAttribute('data-theme', thema);
  localStorage.setItem('pb_thema', thema);
  document.querySelectorAll('[data-thema-icoon]').forEach(el => {
    el.textContent = thema === 'dark' ? '☀️' : '🌙';
  });
}

function initThemeKnop(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'thema-knop';
  btn.setAttribute('aria-label', 'Licht/donker thema wisselen');
  btn.innerHTML = '<span data-thema-icoon>' + (huidigThema() === 'dark' ? '☀️' : '🌙') + '</span>';
  btn.addEventListener('click', () => zetThema(huidigThema() === 'dark' ? 'light' : 'dark'));
  container.appendChild(btn);
}
