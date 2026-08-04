// Almere Pickleball — gedeelde onderbalk-navigatie voor het ledenportaal.
//
// Wordt op elke ingelogde pagina aangeroepen als `initNav('paginaNaam')` —
// rendert een vaste onderbalk (zelfde 5 tabs/iconen als de bottom-nav in de
// app, zie lib/screens/home_shell.dart) in <div id="nav-plek"></div>, en een
// profiel/uitlog-knop in <div id="account-plek"></div>. Eén los bestand
// i.p.v. de markup op 6 pagina's te kopiëren — geen build-stap nodig.

const NAV_ITEMS = [
  {
    pagina: 'home', href: '/leden/home.html', taalSleutel: 'navHome',
    icoon: '<svg viewBox="0 0 24 24"><polygon points="12,3 21,10 19,10 19,20 5,20 5,10 3,10" fill="currentColor"/></svg>',
  },
  {
    pagina: 'reserveren', href: '/leden/reserveren.html', taalSleutel: 'navReserveren',
    icoon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="16" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="16" y1="2" x2="16" y2="6"/></svg>',
  },
  {
    pagina: 'toernooien', href: '/leden/toernooien.html', taalSleutel: 'navToernooien',
    icoon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="9" r="6"/><path d="M9 14L7 21l5-3 5 3-2-7" stroke-linejoin="round"/></svg>',
  },
  {
    pagina: 'nieuws', href: '/leden/nieuws.html', taalSleutel: 'navNieuws',
    icoon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="3" width="16" height="18" rx="1"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="13" y2="16"/></svg>',
  },
  {
    pagina: 'leden', href: '/leden/leden.html', taalSleutel: 'navLeden',
    icoon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5"/><path d="M15 15.5c2.2.3 4 2 4 4.5"/></svg>',
  },
];

// Eenmalige SVG-filter voor het "gooey" blob-effect — de klassieke
// blur-dan-scherp-afkappen-truc (feGaussianBlur + een steile feColorMatrix-
// alfadrempel) die twee dichtbij elkaar liggende vormen laat "samensmelten".
// Zelfde recept als _GooeyBlobLayer in liquid_tabs_nav_bar.dart (die met
// ImageFiltered+ColorFiltered werkt); CSS/SVG-feColorMatrix werkt in het
// bereik 0-1 i.p.v. Dart se 0-255, vandaar de herschaalde drempelconstante.
function _zorgVoorGooeyFilter() {
  if (document.getElementById('pb-gooey-svg')) return;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'pb-gooey-svg';
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.position = 'absolute';
  svg.innerHTML = '<filter id="pb-gooey">' +
    '<feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur"/>' +
    '<feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"/>' +
    '</filter>';
  document.body.appendChild(svg);
}

function initNav(actievePagina) {
  _zorgVoorGooeyFilter();
  const stijl = document.createElement('style');
  stijl.textContent = `
    body { padding-bottom: 100px; }
    .onderbalk {
      position: fixed; bottom: calc(14px + env(safe-area-inset-bottom, 0px)); left: 14px; right: 14px; z-index: 50;
      display: flex; background: var(--glas-oppervlak, rgba(255,255,255,0.55));
      -webkit-backdrop-filter: blur(24px) saturate(160%);
      backdrop-filter: blur(24px) saturate(160%);
      border: 1px solid var(--glas-rand, rgba(255,255,255,0.6));
      border-radius: 999px;
      padding: 7px 8px;
      box-shadow: 0 8px 24px rgba(4,27,51,0.16), inset 0 1px 0 var(--glas-hooglicht-boven, rgba(255,255,255,0.55)), inset 0 -1px 0 var(--glas-hooglicht-onder, rgba(0,0,0,0.1));
      max-width: 480px; margin: 0 auto;
    }
    .onderbalk-tabs { position: relative; flex: 1; display: flex; }
    /* "Vloeibare" blob-laag achter de tabs — vervangt de vroegere statische
       kleur-pil op .actief. De feColorMatrix-gooey-filter zorgt dat het
       hoofd- en spoor-blobje samensmelten zolang ze dicht bij elkaar zijn,
       zelfde effect als de app se liquid_tabs_nav_bar.dart. */
    .onderbalk-blob-laag { position: absolute; inset: 0; filter: url(#pb-gooey); pointer-events: none; }
    .blob-hoofd, .blob-trail {
      position: absolute; top: 2px; bottom: 2px; border-radius: 999px; background: var(--navy, #2457ff);
      opacity: 0; left: 0; width: 0;
    }
    .blob-gloed {
      position: absolute; top: 0; bottom: 0; border-radius: 999px;
      box-shadow: 0 0 14px 2px rgba(0,91,191,0.4); opacity: 0; pointer-events: none;
      transition: left 0.35s cubic-bezier(0.65,0,0.35,1), width 0.35s cubic-bezier(0.65,0,0.35,1);
    }
    .onderbalk a {
      position: relative; z-index: 1; flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2px;
      text-decoration: none; color: var(--ink-muted, #5b6b7d); font-size: 10.5px; font-weight: 600;
      padding: 6px 2px 5px; margin: 0 2px;
      transition: color 0.22s ease;
    }
    .onderbalk a.actief { color: #fff; }
    .onderbalk a svg { width: 21px; height: 21px; }
    .onderbalk-extra { display: flex; gap: 4px; align-items: center; flex-shrink: 0; margin-left: 2px; padding-left: 6px; border-left: 1px solid var(--line, rgba(4,27,51,0.1)); }
    .onderbalk-extra .thema-knop, .onderbalk-extra .taal-knop {
      height: 30px; background: transparent; border: none; color: var(--ink-muted, #5b6b7d);
    }
    .onderbalk-extra .thema-knop { width: 30px; }
    .onderbalk-extra .thema-knop svg { width: 15px; height: 15px; }
    .onderbalk-extra .taal-knop { min-width: 30px; padding: 0 7px; font-size: 10.5px; }
    #account-plek { flex-shrink: 0; }
    .account-knoppen { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; justify-content: flex-end; max-width: 100%; }
    .account-knoppen a, .account-knoppen button {
      background: rgba(255,255,255,0.15); color: inherit; border: none; border-radius: 8px;
      padding: 6px 9px; font-size: 11.5px; font-weight: 600; cursor: pointer; text-decoration: none;
      white-space: nowrap;
    }
  `;
  document.head.appendChild(stijl);

  const nav = document.createElement('nav');
  nav.className = 'onderbalk';
  const actieveIndex = NAV_ITEMS.findIndex(item => item.pagina === actievePagina);
  nav.innerHTML =
    '<div class="onderbalk-tabs">' +
    '<div class="onderbalk-blob-laag"><div class="blob-trail"></div><div class="blob-hoofd"></div></div>' +
    '<div class="blob-gloed"></div>' +
    NAV_ITEMS.map(item =>
      '<a href="' + item.href + '"' + (item.pagina === actievePagina ? ' class="actief"' : '') + '>' +
      item.icoon + '<span data-i18n="' + item.taalSleutel + '"></span></a>'
    ).join('') +
    '</div>' +
    '<div class="onderbalk-extra" id="onderbalk-extra"></div>';
  const navPlek = document.getElementById('nav-plek');
  (navPlek || document.body).appendChild(nav);
  if (typeof initThemeKnop === 'function') initThemeKnop('onderbalk-extra');
  if (typeof initTaalKnop === 'function') initTaalKnop('onderbalk-extra');

  // Blob meteen op de actieve tab zetten (geen "vanaf"-positie: dit is een
  // verse paginalading, geen tab-wissel binnen dezelfde SPA-context zoals in
  // de app). Bij een klik op een ANDERE tab wordt de blob wél kort naar de
  // nieuwe positie ge-animeerd vóórdat de daadwerkelijke paginanavigatie
  // plaatsvindt — zo krijgt de gebruiker toch een glimp van de vloeiende
  // "liquid"-overgang, ook al herlaadt de website (i.t.t. de app) de hele
  // pagina per tab.
  const tabsWrap = nav.querySelector('.onderbalk-tabs');
  const blobHoofd = nav.querySelector('.blob-hoofd');
  const blobTrail = nav.querySelector('.blob-trail');
  const blobGloed = nav.querySelector('.blob-gloed');

  function tabGeometrie(index) {
    const breedte = tabsWrap.clientWidth / NAV_ITEMS.length;
    const blobBreedte = breedte * 0.72;
    return { left: (index + 0.5) * breedte - blobBreedte / 2, width: blobBreedte };
  }

  function zetBlob(index) {
    if (index < 0) return;
    const { left, width } = tabGeometrie(index);
    [blobHoofd, blobGloed].forEach(el => {
      el.style.transition = 'none';
      el.style.left = left + 'px';
      el.style.width = width + 'px';
      el.style.opacity = '1';
    });
    // Forceer een reflow zodat de volgende stijlwijziging (bij een klik)
    // weer een overgang animeert i.p.v. de 'transition: none' hierboven
    // te blijven gebruiken.
    void blobHoofd.offsetWidth;
    blobHoofd.style.transition = '';
    blobGloed.style.transition = '';
  }

  zetBlob(actieveIndex);

  nav.querySelectorAll('.onderbalk-tabs a').forEach((link, index) => {
    link.addEventListener('click', (e) => {
      if (index === actieveIndex) return; // al op deze tab, gewoon normaal gedrag
      e.preventDefault();
      const { left: vanLeft, width: vanBreedte } = tabGeometrie(actieveIndex < 0 ? index : actieveIndex);
      const { left: naarLeft, width: naarBreedte } = tabGeometrie(index);
      blobTrail.style.transition = 'none';
      blobTrail.style.left = vanLeft + 'px';
      blobTrail.style.width = vanBreedte + 'px';
      blobTrail.style.opacity = '1';
      void blobTrail.offsetWidth;
      blobHoofd.style.transition = 'left 0.32s cubic-bezier(0.65,0,0.35,1), width 0.32s cubic-bezier(0.65,0,0.35,1)';
      blobGloed.style.transition = 'left 0.32s cubic-bezier(0.65,0,0.35,1), width 0.32s cubic-bezier(0.65,0,0.35,1)';
      blobHoofd.style.left = naarLeft + 'px';
      blobHoofd.style.width = naarBreedte + 'px';
      blobHoofd.style.opacity = '1';
      blobGloed.style.left = naarLeft + 'px';
      blobGloed.style.width = naarBreedte + 'px';
      blobTrail.style.transition = 'width 0.32s cubic-bezier(0.65,0,0.35,1), left 0.32s cubic-bezier(0.65,0,0.35,1), opacity 0.15s ease 0.17s';
      blobTrail.style.left = (vanLeft + vanBreedte / 2) + 'px';
      blobTrail.style.width = '0px';
      blobTrail.style.opacity = '0';
      setTimeout(() => { window.location.href = link.href; }, 260);
    });
  });
  window.addEventListener('resize', () => zetBlob(actieveIndex));

  const accountPlek = document.getElementById('account-plek');
  if (accountPlek) {
    accountPlek.innerHTML = '<div class="account-knoppen" id="account-knoppen-rij">' +
      (actievePagina === 'profiel' ? '' : '<a href="/leden/profiel.html" data-i18n="navProfiel"></a>') +
      '<button id="nav-uitlog-knop" data-i18n="uitloggen"></button></div>';
    document.getElementById('nav-uitlog-knop').addEventListener('click', uitloggen);
    if (typeof pasTaalToe === 'function') pasTaalToe();

    if (actievePagina !== 'beheer') {
      haalOp('leden', { select: 'naam,is_admin', id: 'eq.' + huidigeSessie().user_id }).then(rows => {
        if (!rows[0]) return;
        const merkEl = document.querySelector('header .merk');
        if (merkEl) merkEl.textContent = rows[0].naam;
        if (rows[0].is_admin) {
          const link = document.createElement('a');
          link.href = '/leden/beheer.html';
          link.setAttribute('data-i18n', 'navBeheer');
          accountPlek.querySelector('.account-knoppen').prepend(link);
          if (typeof pasTaalToe === 'function') pasTaalToe();
        }
      }).catch(() => {});
    } else {
      // Op beheer.html is de admin-check niet nodig (de hele pagina is al
      // admin-only), maar de header-naam moet hier ook getoond worden.
      haalOp('leden', { select: 'naam', id: 'eq.' + huidigeSessie().user_id }).then(rows => {
        const merkEl = document.querySelector('header .merk');
        if (merkEl && rows[0]) merkEl.textContent = rows[0].naam;
      }).catch(() => {});
    }
  }
}
