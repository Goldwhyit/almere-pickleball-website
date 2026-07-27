// Almere Pickleball — gedeelde "tinder-stijl" kaartenstapel.
//
// initSwipeDeck(container, kaartenHtmlArray, opties) bouwt één zichtbare
// kaart tegelijk; slepen (of de pijlknoppen) toont de volgende/vorige kaart
// met een swipe-animatie. Geen like/reject-semantiek — puur een compacte
// manier om items één voor één te doorbladeren. Actieknoppen (aanmelden,
// inschrijven, ...) leven op de kaart zelf en werken zoals altijd; alleen
// een sleep die op de kaart zelf begint (niet op een knop/link/invoerveld)
// wisselt van kaart.
//
// Bewust GEEN los-gestapelde kaarten achter de bovenste (elk met eigen
// hoogte/overflow-risico) — één kaart per keer in de normale document-flow
// houdt de layout robuust op elk schermformaat.

function initSwipeDeck(container, kaarten, opties) {
  opties = opties || {};
  let index = 0;
  let slepend = false, startX = 0, huidigX = 0;

  container.classList.add('swipe-deck');
  container.innerHTML =
    '<div class="swipe-stapel"></div>' +
    '<div class="swipe-nav">' +
    '<button type="button" class="swipe-knop" data-swipe="vorige" aria-label="Vorige">‹</button>' +
    '<span class="swipe-teller"></span>' +
    '<button type="button" class="swipe-knop" data-swipe="volgende" aria-label="Volgende">›</button>' +
    '</div>';
  const stapel = container.querySelector('.swipe-stapel');
  const teller = container.querySelector('.swipe-teller');
  const knopVorige = container.querySelector('[data-swipe="vorige"]');
  const knopVolgende = container.querySelector('[data-swipe="volgende"]');

  function render() {
    if (!kaarten.length) {
      stapel.innerHTML = '<div class="swipe-leeg">' + (opties.leegTekst || 'Niets te tonen.') + '</div>';
      teller.textContent = '';
      knopVorige.disabled = true; knopVolgende.disabled = true;
      return;
    }
    stapel.innerHTML = '<div class="swipe-kaart">' + kaarten[index] + '</div>';
    teller.textContent = (index + 1) + ' / ' + kaarten.length;
    knopVorige.disabled = index === 0;
    knopVolgende.disabled = index === kaarten.length - 1;
    if (opties.onRender) opties.onRender(stapel.querySelector('.swipe-kaart'), kaarten[index], index);
  }

  function volgende() { if (index < kaarten.length - 1) { index++; render(); } }
  function vorige() { if (index > 0) { index--; render(); } }

  knopVolgende.addEventListener('click', volgende);
  knopVorige.addEventListener('click', vorige);

  function puntX(e) { return e.touches ? e.touches[0].clientX : e.clientX; }

  function onStart(e) {
    const kaart = e.target.closest('.swipe-kaart');
    if (!kaart || e.target.closest('button, a, input, select, textarea')) return;
    slepend = true; startX = puntX(e); huidigX = 0;
    kaart.style.transition = 'none';
  }
  function onMove(e) {
    if (!slepend) return;
    const kaart = stapel.querySelector('.swipe-kaart');
    if (!kaart) return;
    huidigX = puntX(e) - startX;
    kaart.style.transform = 'translateX(' + huidigX + 'px) rotate(' + (huidigX / 20) + 'deg)';
  }
  function onEnd() {
    if (!slepend) return;
    slepend = false;
    const kaart = stapel.querySelector('.swipe-kaart');
    if (!kaart) return;
    kaart.style.transition = 'transform 0.22s ease';
    const kanVolgende = huidigX < 0 && index < kaarten.length - 1;
    const kanVorige = huidigX > 0 && index > 0;
    if (Math.abs(huidigX) > 80 && (kanVolgende || kanVorige)) {
      const richting = huidigX > 0 ? 1 : -1;
      kaart.style.transform = 'translateX(' + (richting * 500) + 'px) rotate(' + (richting * 25) + 'deg)';
      setTimeout(() => { richting > 0 ? vorige() : volgende(); }, 160);
    } else {
      kaart.style.transform = '';
    }
    huidigX = 0;
  }

  stapel.addEventListener('mousedown', onStart);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onEnd);
  stapel.addEventListener('touchstart', onStart, { passive: true });
  stapel.addEventListener('touchmove', onMove, { passive: true });
  stapel.addEventListener('touchend', onEnd);

  render();
  return {
    volgende, vorige,
    herlaad(nieuweKaarten) {
      kaarten = nieuweKaarten;
      index = Math.min(index, Math.max(0, kaarten.length - 1));
      render();
    },
    huidigeIndex: () => index,
  };
}
