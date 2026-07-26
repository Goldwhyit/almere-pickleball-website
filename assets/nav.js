// Almere Pickleball — gedeelde onderbalk-navigatie voor het ledenportaal.
//
// Wordt op elke ingelogde pagina aangeroepen als `initNav('paginaNaam')` —
// rendert een vaste onderbalk (zelfde 5 tabs/iconen als de bottom-nav in de
// app, zie lib/screens/home_shell.dart) in <div id="nav-plek"></div>, en een
// profiel/uitlog-knop in <div id="account-plek"></div>. Eén los bestand
// i.p.v. de markup op 6 pagina's te kopiëren — geen build-stap nodig.

const NAV_ITEMS = [
  {
    pagina: 'home', href: '/leden/home.html', label: 'Home',
    icoon: '<svg viewBox="0 0 24 24"><polygon points="12,3 21,10 19,10 19,20 5,20 5,10 3,10" fill="currentColor"/></svg>',
  },
  {
    pagina: 'reserveren', href: '/leden/reserveren.html', label: 'Reserveren',
    icoon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="16" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="16" y1="2" x2="16" y2="6"/></svg>',
  },
  {
    pagina: 'toernooien', href: '/leden/toernooien.html', label: 'Toernooien',
    icoon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="9" r="6"/><path d="M9 14L7 21l5-3 5 3-2-7" stroke-linejoin="round"/></svg>',
  },
  {
    pagina: 'nieuws', href: '/leden/nieuws.html', label: 'Nieuws',
    icoon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="3" width="16" height="18" rx="1"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="13" y2="16"/></svg>',
  },
  {
    pagina: 'leden', href: '/leden/leden.html', label: 'Leden',
    icoon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5"/><path d="M15 15.5c2.2.3 4 2 4 4.5"/></svg>',
  },
];

function initNav(actievePagina) {
  const stijl = document.createElement('style');
  stijl.textContent = `
    body { padding-bottom: 76px; }
    .onderbalk {
      position: fixed; bottom: 0; left: 0; right: 0; z-index: 50;
      display: flex; background: var(--card, #fff);
      border-top: 1px solid var(--line, rgba(4,27,51,0.1));
      padding: 6px 4px calc(6px + env(safe-area-inset-bottom, 0px));
      box-shadow: 0 -2px 12px rgba(0,0,0,0.04);
    }
    .onderbalk a {
      flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2px;
      text-decoration: none; color: var(--ink-muted, #5b6b7d); font-size: 10.5px; font-weight: 600;
      padding: 5px 0 3px; border-radius: 10px;
    }
    .onderbalk a.actief { color: var(--navy, #005bbf); background: rgba(0,91,191,0.08); }
    .onderbalk a svg { width: 22px; height: 22px; }
    .account-knoppen { display: flex; gap: 8px; align-items: center; }
    .account-knoppen a, .account-knoppen button {
      background: rgba(255,255,255,0.15); color: inherit; border: none; border-radius: 8px;
      padding: 7px 11px; font-size: 12.5px; font-weight: 600; cursor: pointer; text-decoration: none;
    }
  `;
  document.head.appendChild(stijl);

  const nav = document.createElement('nav');
  nav.className = 'onderbalk';
  nav.innerHTML = NAV_ITEMS.map(item =>
    '<a href="' + item.href + '"' + (item.pagina === actievePagina ? ' class="actief"' : '') + '>' +
    item.icoon + '<span>' + item.label + '</span></a>'
  ).join('');
  const navPlek = document.getElementById('nav-plek');
  (navPlek || document.body).appendChild(nav);

  const accountPlek = document.getElementById('account-plek');
  if (accountPlek) {
    accountPlek.innerHTML = '<div class="account-knoppen">' +
      (actievePagina === 'profiel' ? '' : '<a href="/leden/profiel.html">Profiel</a>') +
      '<button id="nav-uitlog-knop">Uitloggen</button></div>';
    document.getElementById('nav-uitlog-knop').addEventListener('click', uitloggen);
  }
}
