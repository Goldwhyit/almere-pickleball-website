// Almere Pickleball — gedeelde "tinder-stijl" kaartenstapel.
//
// initSwipeDeck(container, kaartenHtmlArray, opties) bouwt één zichtbare
// kaart tegelijk; slepen (of de pijlknoppen) toont de volgende/vorige kaart
// met een swipe-animatie. Standaard puur navigatie (geen like/reject-
// semantiek) — een compacte manier om items één voor één te doorbladeren.
//
// Optioneel, via opties.onSwipeLinks/onSwipeRechts, kan een sleep-richting
// ook een echte actie betekenen (bijv. reserveren: rechts = aanmelden,
// links = afmelden) i.p.v. gewoon bladeren — als die functie is opgegeven
// vervangt de actie de normale vorige/volgende-navigatie voor die richting,
// en toont een gekleurde badge tijdens het slepen als visuele hint
// (opties.badgeLinks/badgeRechts). Actieknoppen (aanmelden, inschrijven,
// ...) op de kaart zelf blijven altijd gewoon werken; alleen een sleep die
// op de kaart zelf begint (niet op een knop/link/invoerveld) telt als swipe.
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
    const heeftActieLinks = typeof opties.onSwipeLinks === 'function';
    const heeftActieRechts = typeof opties.onSwipeRechts === 'function';
    stapel.innerHTML = '<div class="swipe-kaart">' +
      (heeftActieLinks ? '<div class="swipe-badge swipe-badge-links">' + (opties.badgeLinks || '') + '</div>' : '') +
      (heeftActieRechts ? '<div class="swipe-badge swipe-badge-rechts">' + (opties.badgeRechts || '') + '</div>' : '') +
      kaarten[index] + '</div>';
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
    const sterkte = Math.min(1, Math.abs(huidigX) / 80);
    const badgeLinks = kaart.querySelector('.swipe-badge-links');
    const badgeRechts = kaart.querySelector('.swipe-badge-rechts');
    if (badgeLinks) badgeLinks.style.opacity = huidigX < 0 ? sterkte : 0;
    if (badgeRechts) badgeRechts.style.opacity = huidigX > 0 ? sterkte : 0;
  }
  function onEnd() {
    if (!slepend) return;
    slepend = false;
    const kaart = stapel.querySelector('.swipe-kaart');
    if (!kaart) return;
    kaart.style.transition = 'transform 0.22s ease';
    const heeftActieLinks = typeof opties.onSwipeLinks === 'function';
    const heeftActieRechts = typeof opties.onSwipeRechts === 'function';
    const kanActieLinks = heeftActieLinks && huidigX < 0;
    const kanActieRechts = heeftActieRechts && huidigX > 0;
    const kanVolgende = !heeftActieLinks && huidigX < 0 && index < kaarten.length - 1;
    const kanVorige = !heeftActieRechts && huidigX > 0 && index > 0;
    if (Math.abs(huidigX) > 80 && (kanActieLinks || kanActieRechts || kanVolgende || kanVorige)) {
      const richting = huidigX > 0 ? 1 : -1;
      const indexTenTijdeVanSwipe = index;
      kaart.style.transform = 'translateX(' + (richting * 500) + 'px) rotate(' + (richting * 25) + 'deg)';
      if (kanActieRechts || kanActieLinks) {
        // Meteen aanroepen (synchroon, nog binnen de gebruikersinteractie) i.p.v.
        // na de vlieg-animatie — anders ziet de browser het niet meer als een
        // directe gebruikersactie en blokkeert bijv. het openen van een nieuwe
        // tab/link (bevestigd: een setTimeout hier brak het openen van externe
        // toernooi-links op een echte swipe, terwijl een directe klik altijd werkte).
        if (kanActieRechts) opties.onSwipeRechts(indexTenTijdeVanSwipe, kaarten[indexTenTijdeVanSwipe]);
        else opties.onSwipeLinks(indexTenTijdeVanSwipe, kaarten[indexTenTijdeVanSwipe]);
      } else {
        setTimeout(() => { richting > 0 ? vorige() : volgende(); }, 160);
      }
    } else {
      kaart.style.transform = '';
      const badgeLinks = kaart.querySelector('.swipe-badge-links');
      const badgeRechts = kaart.querySelector('.swipe-badge-rechts');
      if (badgeLinks) badgeLinks.style.opacity = 0;
      if (badgeRechts) badgeRechts.style.opacity = 0;
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
