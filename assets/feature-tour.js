/// Feature Tour (§59) — snelle rondleiding langs de belangrijkste knoppen,
/// getoond aan een nieuw (niet-proefles) lid vlak na de eerste keer op het
/// homescherm. Mirror van `lib/widgets/feature_tour.dart` in de app: zelfde
/// stappen/teksten, zelfde spotlight-idee (rest van het scherm gedimd, één
/// element uitgelicht), zelfde "Volgende"/"Overslaan"-knoppen.
///
/// De CSS-"spotlight"-truc: een element exact over het doel positioneren
/// met `box-shadow: 0 0 0 9999px rgba(0,0,0,.68)` — de schaduw dimt de rest
/// van het scherm, het element zelf blijft vanzelf onbedekt. Geen canvas/
/// SVG-uitsnede nodig.

const TOUR_STAPPEN = [
  { selector: '[data-pagina="reserveren"]', titel: 'Reserveren', uitleg: 'Hier meld je je aan voor een speelavond — kies een datum en je staat op de lijst.' },
  { selector: '[data-pagina="toernooien"]', titel: 'Toernooien', uitleg: 'Bekijk de clubtoernooien en schrijf je in, alleen of met een vaste partner.' },
  { selector: '[data-pagina="nieuws"]', titel: 'Nieuws', uitleg: 'Het laatste nieuws van de club en uit de pickleballwereld.' },
  { selector: '[data-pagina="leden"]', titel: 'Leden', uitleg: 'De ledenlijst en de ranglijst — zie wie er allemaal meespeelt.' },
  { selector: '#abonnement-link', titel: 'Je abonnement', uitleg: 'Hier zie je in één oogopslag je abonnement en lessen — tik door naar je volledige profiel.' },
  { selector: '#uitnodig-vriend-knop', titel: 'Nodig een vriend uit', uitleg: 'Speel je liever met vrienden erbij? Deel de club met één tik.' },
];

/// Checkt `leden.feature_tour_gezien` voor het ingelogde lid en start de
/// tour indien nog niet gezien. Een proeflid krijgt deze vlag al door de
/// database-trigger op waar gezet (zie 59_feature_tour.sql) — hier is dus
/// geen aparte proefles-check nodig.
async function initFeatureTour() {
  try {
    const rows = await haalOp('leden', { select: 'feature_tour_gezien', id: 'eq.' + huidigeSessie().user_id });
    if (!rows.length || rows[0].feature_tour_gezien) return;
    starFeatureTour(TOUR_STAPPEN, async () => {
      try { await werkBij('leden', { id: 'eq.' + huidigeSessie().user_id }, { feature_tour_gezien: true }); }
      catch (e) { /* best-effort — een mislukte markering mag de tour zelf niet laten haperen */ }
    });
  } catch (e) {
    // Best-effort: een mislukte tour mag het homescherm nooit blokkeren.
  }
}

function starFeatureTour(stappen, onVoltooid) {
  const stijl = document.createElement('style');
  stijl.textContent = `
    .tour-scrim { position: fixed; inset: 0; z-index: 9997; background: transparent; }
    .tour-highlight {
      position: fixed; z-index: 9998; border-radius: 16px;
      box-shadow: 0 0 0 9999px rgba(0,0,0,0.68);
      outline: 2.5px solid var(--navy, #2457ff);
      pointer-events: none;
      transition: top 0.25s ease, left 0.25s ease, width 0.25s ease, height 0.25s ease;
    }
    .tour-ballon {
      position: fixed; z-index: 9999; width: 300px; max-width: calc(100vw - 32px);
      background: var(--card, #fff); border: 1px solid var(--line, rgba(4,27,51,0.12));
      border-radius: 18px; padding: 18px; box-shadow: 0 12px 32px rgba(4,27,51,0.28);
      font-family: 'Manrope', -apple-system, sans-serif; color: var(--ink, #0b1420);
      animation: tour-pop-in 0.22s ease-out;
    }
    @keyframes tour-pop-in { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
    .tour-ballon .stippen { display: flex; gap: 5px; margin-bottom: 12px; }
    .tour-ballon .stip { width: 6px; height: 6px; border-radius: 999px; background: rgba(36,87,255,0.25); }
    .tour-ballon .stip.actief { width: 16px; background: var(--navy, #2457ff); }
    .tour-ballon h4 { margin: 0 0 6px; font-size: 15.5px; font-weight: 800; }
    .tour-ballon p { margin: 0 0 16px; font-size: 13.5px; color: var(--ink-muted, #5b6b7d); line-height: 1.4; }
    .tour-ballon .knoppen-rij { display: flex; justify-content: space-between; align-items: center; }
    .tour-ballon .tour-overslaan { background: none; border: none; color: var(--ink-muted, #5b6b7d); font-size: 13px; font-weight: 600; cursor: pointer; padding: 6px; }
    .tour-ballon .tour-volgende { background: var(--navy, #2457ff); color: #fff; border: none; border-radius: 999px; padding: 8px 18px; font-size: 13px; font-weight: 700; cursor: pointer; }
  `;
  document.head.appendChild(stijl);

  const scrim = document.createElement('div');
  scrim.className = 'tour-scrim';
  const highlight = document.createElement('div');
  highlight.className = 'tour-highlight';
  const ballon = document.createElement('div');
  ballon.className = 'tour-ballon';
  document.body.append(scrim, highlight, ballon);

  function opruimen() {
    scrim.remove(); highlight.remove(); ballon.remove(); stijl.remove();
  }

  function klaar() {
    opruimen();
    onVoltooid();
  }

  async function toonStap(index) {
    if (index >= stappen.length) { klaar(); return; }
    const stap = stappen[index];
    let el = null;
    for (let poging = 0; poging < 20 && !el; poging++) {
      el = document.querySelector(stap.selector);
      if (!el) await nieuweFrame(100);
    }
    if (!el) { toonStap(index + 1); return; }

    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    await nieuweFrame(300);

    const rect = el.getBoundingClientRect();
    const marge = 8;
    highlight.style.top = (rect.top - marge) + 'px';
    highlight.style.left = (rect.left - marge) + 'px';
    highlight.style.width = (rect.width + marge * 2) + 'px';
    highlight.style.height = (rect.height + marge * 2) + 'px';

    const laatsteStap = index === stappen.length - 1;
    ballon.innerHTML =
      '<div class="stippen">' +
      stappen.map((_, i) => '<div class="stip' + (i === index ? ' actief' : '') + '"></div>').join('') +
      '</div>' +
      '<h4>' + escapeHtml(stap.titel) + '</h4>' +
      '<p>' + escapeHtml(stap.uitleg) + '</p>' +
      '<div class="knoppen-rij">' +
      '<button type="button" class="tour-overslaan">Overslaan</button>' +
      '<button type="button" class="tour-volgende">' + (laatsteStap ? 'Klaar' : 'Volgende') + '</button>' +
      '</div>';
    ballon.querySelector('.tour-overslaan').addEventListener('click', klaar);
    ballon.querySelector('.tour-volgende').addEventListener('click', () => toonStap(index + 1));

    plaatsBallon(rect);
  }

  function plaatsBallon(doelRect) {
    const ballonBreedte = Math.min(300, window.innerWidth - 32);
    const marge = 16;
    const ruimteOnder = window.innerHeight - doelRect.bottom;
    const ruimteBoven = doelRect.top;
    const onderDoel = ruimteOnder >= ruimteBoven;
    const links = Math.min(
      Math.max(doelRect.left + doelRect.width / 2 - ballonBreedte / 2, marge),
      window.innerWidth - ballonBreedte - marge
    );
    ballon.style.left = links + 'px';
    if (onderDoel) {
      ballon.style.top = (doelRect.bottom + marge + 10) + 'px';
      ballon.style.bottom = '';
    } else {
      ballon.style.bottom = (window.innerHeight - doelRect.top + marge + 10) + 'px';
      ballon.style.top = '';
    }
  }

  toonStap(0);
}

function nieuweFrame(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
