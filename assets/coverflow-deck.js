// Almere Pickleball — gedeelde 3D-coverflow kaartenrij.
//
// initCoverflowDeck(container, kaarten, opties) repliceert de app se
// NewsCoverflowSlider (lib/widgets/news_coverflow_slider/): kaarten liggen
// naast elkaar, de actieve kaart staat gecentreerd en vlak, de zijkaarten
// kantelen/verkleinen/vervagen continu mee met de sleep-positie (geen
// discrete stap-voor-stap-swipe zoals assets/swipe-deck.js, maar een
// vloeiende coverflow-scroll). Slepen (muis/touch), de pijlknoppen, de
// stip-indicatoren en pijltjestoetsen wisselen allemaal de "pagina" —
// een float, niet afgerond, zodat de kanteling vloeiend meeloopt tijdens
// het slepen zelf i.p.v. pas na loslaten.
//
// kaarten = array van HTML-strings (net als swipe-deck.js) — elke string is
// de INHOUD van één kaart (dus geen buitenste .coverflow-kaart-div, die
// wordt door deze functie zelf toegevoegd). Tikken op de actieve (middelste)
// kaart roept opties.onKaartTik(index) aan; tikken op een zijkaart schuift
// er naartoe i.p.v. een tik te melden.

function initCoverflowDeck(container, kaarten, opties) {
  opties = opties || {};
  const viewportFractie = opties.viewportFractie || 0.75;

  container.classList.add('coverflow-deck');
  container.innerHTML =
    '<div class="coverflow-rij">' +
    '<button type="button" class="coverflow-chevron" data-cf="vorige" aria-label="Vorige">‹</button>' +
    '<div class="coverflow-viewport" tabindex="0"></div>' +
    '<button type="button" class="coverflow-chevron" data-cf="volgende" aria-label="Volgende">›</button>' +
    '</div>' +
    '<div class="coverflow-dots"></div>';

  const viewport = container.querySelector('.coverflow-viewport');
  const dotsEl = container.querySelector('.coverflow-dots');
  const knopVorige = container.querySelector('[data-cf="vorige"]');
  const knopVolgende = container.querySelector('[data-cf="volgende"]');

  let pagina = 0; // huidige positie, float — niet per se een heel getal
  let animatieId = null;
  let slepend = false;
  let startX = 0;
  let startPagina = 0;
  let totaleBeweging = 0;

  function actieveIndex() {
    return Math.max(0, Math.min(kaarten.length - 1, Math.round(pagina)));
  }

  function kaartBreedte() {
    return (viewport.clientWidth || 1) * viewportFractie;
  }

  function positioneer() {
    const breedte = kaartBreedte();
    viewport.querySelectorAll('.coverflow-kaart').forEach(el => {
      const i = Number(el.dataset.index);
      let delta = i - pagina;
      delta = Math.max(-1.5, Math.min(1.5, delta));
      const decay = Math.max(0, Math.min(1, Math.abs(delta)));
      const rotatie = delta * (180 / 7);
      const schaal = 1 - decay * 0.22;
      const opaciteit = 1 - decay * 0.55;
      el.style.transform =
        'translateX(-50%) translateX(' + (delta * breedte) + 'px) scale(' + schaal + ') rotateY(' + rotatie + 'deg)';
      el.style.opacity = opaciteit;
      el.style.zIndex = String(100 - Math.round(Math.abs(delta) * 10));
      el.style.pointerEvents = Math.abs(delta) > 1.4 ? 'none' : 'auto';
    });
    updateKnoppenEnDots();
  }

  function updateKnoppenEnDots() {
    const actief = actieveIndex();
    knopVorige.disabled = actief === 0;
    knopVolgende.disabled = actief === kaarten.length - 1;
    dotsEl.querySelectorAll('.coverflow-dot').forEach((dot, i) => {
      dot.classList.toggle('actief', i === actief);
    });
  }

  function animeerNaar(doel, klaar) {
    if (animatieId) cancelAnimationFrame(animatieId);
    doel = Math.max(0, Math.min(kaarten.length - 1, doel));
    const animatiesUit = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (animatiesUit) {
      pagina = doel;
      positioneer();
      if (klaar) klaar();
      return;
    }
    const van = pagina;
    const duur = 350;
    const begin = performance.now();
    function stap(nu) {
      const t = Math.min(1, (nu - begin) / duur);
      // easeInOutCubic — zelfde curve als de app se Curves.easeInOutCubic.
      const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      pagina = van + (doel - van) * e;
      positioneer();
      if (t < 1) {
        animatieId = requestAnimationFrame(stap);
      } else {
        animatieId = null;
        if (klaar) klaar();
      }
    }
    animatieId = requestAnimationFrame(stap);
  }

  function ga(index) {
    animeerNaar(Math.max(0, Math.min(kaarten.length - 1, index)));
  }
  function volgende() { if (actieveIndex() < kaarten.length - 1) ga(actieveIndex() + 1); }
  function vorige() { if (actieveIndex() > 0) ga(actieveIndex() - 1); }

  knopVolgende.addEventListener('click', volgende);
  knopVorige.addEventListener('click', vorige);

  viewport.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { volgende(); e.preventDefault(); }
    else if (e.key === 'ArrowLeft') { vorige(); e.preventDefault(); }
    else if (e.key === 'Home') { ga(0); e.preventDefault(); }
    else if (e.key === 'End') { ga(kaarten.length - 1); e.preventDefault(); }
  });

  function puntX(e) { return e.touches ? e.touches[0].clientX : e.clientX; }

  function onStart(e) {
    if (e.target.closest('button, a, input, select, textarea')) return;
    if (animatieId) { cancelAnimationFrame(animatieId); animatieId = null; }
    slepend = true;
    startX = puntX(e);
    startPagina = pagina;
    totaleBeweging = 0;
  }
  function onMove(e) {
    if (!slepend) return;
    const deltaPx = puntX(e) - startX;
    totaleBeweging = Math.max(totaleBeweging, Math.abs(deltaPx));
    pagina = startPagina - deltaPx / kaartBreedte();
    pagina = Math.max(-0.5, Math.min(kaarten.length - 0.5, pagina));
    positioneer();
  }
  function onEnd() {
    if (!slepend) return;
    slepend = false;
    if (totaleBeweging < 6) {
      // Een tik (geen sleep) — af laten handelen door de eigen click-
      // listener op de kaart (zie bindKaartEvents), niets snappen hier.
      return;
    }
    ga(Math.round(pagina));
  }

  viewport.addEventListener('mousedown', onStart);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onEnd);
  viewport.addEventListener('touchstart', onStart, { passive: true });
  viewport.addEventListener('touchmove', onMove, { passive: true });
  viewport.addEventListener('touchend', onEnd);

  function bindKaartEvents() {
    viewport.querySelectorAll('.coverflow-kaart').forEach(el => {
      el.addEventListener('click', (e) => {
        if (totaleBeweging >= 6) return; // was een sleep, geen tik
        if (e.target.closest('button, a')) return;
        const i = Number(el.dataset.index);
        if (i === actieveIndex()) {
          if (opties.onKaartTik) opties.onKaartTik(i);
        } else {
          ga(i);
        }
      });
    });
  }

  function render() {
    if (!kaarten.length) {
      viewport.innerHTML = '<div class="coverflow-leeg">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="3" width="16" height="18" rx="1"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="13" y2="16"/></svg>' +
        '<span>' + (opties.leegTekst || 'Niets te tonen.') + '</span></div>';
      dotsEl.innerHTML = '';
      knopVorige.disabled = true;
      knopVolgende.disabled = true;
      return;
    }
    const breedtePct = (viewportFractie * 100) + '%';
    viewport.innerHTML = kaarten
      .map((html, i) => '<div class="coverflow-kaart" data-index="' + i + '" style="width:' + breedtePct + '">' + html + '</div>')
      .join('');
    dotsEl.innerHTML = kaarten.length > 1
      ? kaarten.map((_, i) => '<button type="button" class="coverflow-dot" data-dot="' + i + '" aria-label="Bericht ' + (i + 1) + ' van ' + kaarten.length + '"></button>').join('')
      : '';
    dotsEl.querySelectorAll('.coverflow-dot').forEach(dot => {
      dot.addEventListener('click', () => ga(Number(dot.dataset.dot)));
    });
    bindKaartEvents();
    positioneer();
  }

  window.addEventListener('resize', () => positioneer());

  pagina = 0;
  render();

  return {
    volgende, vorige, ga,
    herlaad(nieuweKaarten) {
      kaarten = nieuweKaarten;
      pagina = Math.min(pagina, Math.max(0, kaarten.length - 1));
      render();
    },
    huidigeIndex: actieveIndex,
  };
}
