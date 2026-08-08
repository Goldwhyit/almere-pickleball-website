// Almere Pickleball — help-knop (?) naar de handleiding.
//
// Zelfde bouwpatroon als initThemeKnop (assets/theme.js): één knop die
// zichzelf in een bestaande container zet, hergebruikt de .thema-knop-
// CSS-klasse zodat er geen nieuwe stijlregels nodig zijn op de pagina's die
// hun eigen lokale thema/taal-knop-CSS hebben (leden/index.html,
// leden/registreren.html) én op de pagina's die assets/leden.css gebruiken.

const HULP_ICOON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
  '<circle cx="12" cy="12" r="9.25"/><path d="M9.1 9.3a2.9 2.9 0 0 1 5.6 1c0 1.9-2.7 2.1-2.7 4.1"/>' +
  '<line x1="12" y1="17.3" x2="12" y2="17.4"/></svg>';

function initHelpKnop(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'thema-knop';
  btn.setAttribute('aria-label', 'Hulp / handleiding');
  btn.innerHTML = HULP_ICOON;
  btn.addEventListener('click', () => { window.location.href = '/hulp.html'; });
  container.appendChild(btn);
}
