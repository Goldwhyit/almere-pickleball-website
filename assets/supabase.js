// Almere Pickleball — kleine Supabase-client-wrapper voor de statische
// website (geen npm/bundler, gewoon een los script-bestand).
//
// Praat rechtstreeks met de Supabase Auth REST API en PostgREST, exact
// hetzelfde patroon als supabase/functions/toernooi-dashboard/index.ts in
// de hoofdrepo (die aanpak is al bewezen deze sessie). De hier ingebouwde
// sleutel is de publieke/publishable Supabase-sleutel — dezelfde die ook in
// de Flutter-app zit en op de toernooien-pagina hiernaast. RLS-beleid in de
// database bepaalt de echte toegang, dus dit is geen secret.

const SUPABASE_URL = 'https://yvjilitusziafdopvxnx.supabase.co';
const ANON_KEY = 'sb_publishable_28_i6yHyP_Q8ExokzXvonA_KBhYk4or';
const REST_BASE = SUPABASE_URL + '/rest/v1';
const AUTH_BASE = SUPABASE_URL + '/auth/v1';
const FUNCTIES_BASE = SUPABASE_URL + '/functions/v1';
const SESSIE_SLEUTEL = 'pb_almere_sessie';

// Alle pagina's bouwen kaarten/lijsten via string-concatenatie in
// .innerHTML — elke waarde die uiteindelijk van een gebruiker komt (naam,
// e-mail, telefoon, omschrijving, ...) moet hier eerst doorheen, anders kan
// bijvoorbeeld een lid zijn eigen "naam" op <script>-inhoud zetten en
// daarmee de browser van andere leden/de admin laten uitvoeren (stored XSS).
// Gebruik ook in attribuutcontext (src="...", value="...") — quotes worden
// hier ook geëscaped.
function escapeHtml(waarde) {
  if (waarde === null || waarde === undefined) return '';
  return String(waarde)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function huidigeSessie() {
  try {
    return JSON.parse(localStorage.getItem(SESSIE_SLEUTEL) || 'null');
  } catch (_) {
    return null;
  }
}

function bewaarSessie(sessie) {
  localStorage.setItem(SESSIE_SLEUTEL, JSON.stringify(sessie));
}

function verwijderSessie() {
  localStorage.removeItem(SESSIE_SLEUTEL);
}

function isIngelogd() {
  return huidigeSessie() !== null;
}

/// Stuurt naar de inlogpagina als er geen sessie is — voor gebruik bovenaan
/// een pagina die alleen voor ingelogde leden bedoeld is.
function vereisSessie() {
  if (!isIngelogd()) {
    window.location.href = '/leden/';
    return null;
  }
  startActiefControle();
  return huidigeSessie();
}

/// Website-equivalent van de realtime kill-switch in de app: er is hier
/// geen websocket-/Realtime-infrastructuur (bewust vanilla REST), dus in
/// plaats daarvan een periodieke poll die een lopende sessie alsnog binnen
/// 60s beëindigt zodra een admin het lid deactiveert.
let _actiefControleTimer = null;
function startActiefControle() {
  if (_actiefControleTimer) return;
  _actiefControleTimer = setInterval(async () => {
    const sessie = huidigeSessie();
    if (!sessie) return;
    const reden = await inlogBlokkade(sessie.access_token, sessie.user_id);
    if (reden) {
      verwijderSessie();
      window.location.href = '/leden/?geblokkeerd=' + reden;
    }
  }, 60000);
}

/// Checkt leden.actief + ouderlijke-toestemmingsstatus via een los token
/// (nog niet in localStorage bewaard) — voor gebruik vlak vóór
/// bewaarSessie() in inloggen(). Retourneert null (mag inloggen),
/// 'gedeactiveerd' of 'ouderlijketoestemming'.
async function inlogBlokkade(accessToken, uid) {
  const resp = await fetch(
    REST_BASE + '/leden?select=actief,ouder_toestemming_vereist,ouder_toestemming_gegeven_op&id=eq.' + uid,
    { headers: { apikey: ANON_KEY, Authorization: 'Bearer ' + accessToken } },
  );
  if (!resp.ok) return null;
  const rijen = await resp.json().catch(() => []);
  if (!rijen.length) return null;
  const lid = rijen[0];
  if (lid.actief === false) return 'gedeactiveerd';
  if (lid.ouder_toestemming_vereist && !lid.ouder_toestemming_gegeven_op) return 'ouderlijketoestemming';
  return null;
}

async function inloggen(email, wachtwoord) {
  const resp = await fetch(AUTH_BASE + '/token?grant_type=password', {
    method: 'POST',
    headers: { apikey: ANON_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: wachtwoord }),
  });
  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(data.error_description || data.msg || 'Inloggen mislukt. Controleer je e-mailadres en wachtwoord.');
  }
  const reden = await inlogBlokkade(data.access_token, data.user.id);
  if (reden === 'gedeactiveerd') {
    throw new Error('Dit account is gedeactiveerd. Neem contact op met de club.');
  }
  if (reden === 'ouderlijketoestemming') {
    throw new Error('We wachten nog op de bevestiging van je ouder/voogd via e-mail voordat je kunt inloggen.');
  }
  bewaarSessie({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    user_id: data.user.id,
  });
  return data;
}

/// Stuurt een wachtwoord-herstel-mail (zelfde flow als login_screen.dart's
/// resetPasswordForEmail in de app).
async function stuurWachtwoordHerstel(email) {
  const resp = await fetch(AUTH_BASE + '/recover', {
    method: 'POST',
    headers: { apikey: ANON_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!resp.ok) {
    const data = await resp.json().catch(() => ({}));
    throw new Error(data.error_description || data.msg || 'Versturen is mislukt.');
  }
}

/// Maakt een nieuw account aan (data = metadata voor de handle_new_user-
/// trigger: naam, telefoon, taal, geboortedatum, ... — zie de app se
/// login_screen.dart voor de volledige lijst). Bewaart meteen een sessie
/// als het project e-mailbevestiging niet afdwingt (hier het geval).
async function registreren(email, wachtwoord, metadata) {
  const resp = await fetch(AUTH_BASE + '/signup', {
    method: 'POST',
    headers: { apikey: ANON_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: wachtwoord, data: metadata || {} }),
  });
  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(data.error_description || data.msg || data.error || data.message || 'Registreren is mislukt.');
  }
  if (!data.access_token) {
    throw new Error('Account aangemaakt — check je e-mail om te bevestigen en log daarna in.');
  }
  bewaarSessie({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    user_id: data.user.id,
  });
  return data;
}

function uitloggen() {
  verwijderSessie();
  window.location.href = '/leden/';
}

/// Ververst het access-token met het refresh-token — Supabase-access-tokens
/// zijn maar kort geldig (standaard 1 uur), dit voorkomt dat een lid steeds
/// opnieuw moet inloggen tijdens hetzelfde bezoek.
async function verversSessie() {
  const sessie = huidigeSessie();
  if (!sessie) return null;
  const resp = await fetch(AUTH_BASE + '/token?grant_type=refresh_token', {
    method: 'POST',
    headers: { apikey: ANON_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: sessie.refresh_token }),
  });
  if (!resp.ok) {
    verwijderSessie();
    return null;
  }
  const data = await resp.json();
  const nieuweSessie = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    user_id: data.user.id,
  };
  bewaarSessie(nieuweSessie);
  return nieuweSessie;
}

function authHeaders() {
  const sessie = huidigeSessie();
  return {
    apikey: ANON_KEY,
    Authorization: 'Bearer ' + (sessie ? sessie.access_token : ANON_KEY),
    'Content-Type': 'application/json',
  };
}

/// select bijv. "id,naam,niveau"; params bijv. { lid_id: 'eq.' + uid, order: 'created_at.desc' }
async function haalOp(tabel, params) {
  const zoek = new URLSearchParams(params || {});
  let resp = await fetch(REST_BASE + '/' + tabel + '?' + zoek.toString(), { headers: authHeaders() });
  if (resp.status === 401 && (await verversSessie())) {
    resp = await fetch(REST_BASE + '/' + tabel + '?' + zoek.toString(), { headers: authHeaders() });
  }
  if (!resp.ok) throw new Error('Kon gegevens niet laden (' + tabel + ').');
  return resp.json();
}

/// Voegt een rij toe; geeft de nieuwe rij terug (incl. gegenereerde id).
async function voegToe(tabel, rij) {
  const headers = { ...authHeaders(), Prefer: 'return=representation' };
  let resp = await fetch(REST_BASE + '/' + tabel, { method: 'POST', headers, body: JSON.stringify(rij) });
  if (resp.status === 401 && (await verversSessie())) {
    resp = await fetch(REST_BASE + '/' + tabel, { method: 'POST', headers: { ...authHeaders(), Prefer: 'return=representation' }, body: JSON.stringify(rij) });
  }
  const data = await resp.json().catch(() => null);
  if (!resp.ok) throw new Error((data && (data.message || data.error_description)) || 'Opslaan is mislukt.');
  return Array.isArray(data) ? data[0] : data;
}

/// filter bijv. { id: 'eq.' + reserveringId }
async function verwijder(tabel, filter) {
  const zoek = new URLSearchParams(filter);
  let resp = await fetch(REST_BASE + '/' + tabel + '?' + zoek.toString(), { method: 'DELETE', headers: authHeaders() });
  if (resp.status === 401 && (await verversSessie())) {
    resp = await fetch(REST_BASE + '/' + tabel + '?' + zoek.toString(), { method: 'DELETE', headers: authHeaders() });
  }
  if (!resp.ok) {
    const data = await resp.json().catch(() => null);
    throw new Error((data && data.message) || 'Verwijderen is mislukt.');
  }
}

/// filter bijv. { id: 'eq.' + id }; wijzigingen bijv. { betaald: true }
async function werkBij(tabel, filter, wijzigingen) {
  const zoek = new URLSearchParams(filter);
  let resp = await fetch(REST_BASE + '/' + tabel + '?' + zoek.toString(), { method: 'PATCH', headers: authHeaders(), body: JSON.stringify(wijzigingen) });
  if (resp.status === 401 && (await verversSessie())) {
    resp = await fetch(REST_BASE + '/' + tabel + '?' + zoek.toString(), { method: 'PATCH', headers: authHeaders(), body: JSON.stringify(wijzigingen) });
  }
  if (!resp.ok) {
    const data = await resp.json().catch(() => null);
    throw new Error((data && data.message) || 'Bijwerken is mislukt.');
  }
}

async function rpc(naam, body) {
  let resp = await fetch(REST_BASE + '/rpc/' + naam, {
    method: 'POST', headers: authHeaders(), body: JSON.stringify(body || {}),
  });
  if (resp.status === 401 && (await verversSessie())) {
    resp = await fetch(REST_BASE + '/rpc/' + naam, {
      method: 'POST', headers: authHeaders(), body: JSON.stringify(body || {}),
    });
  }
  const data = await resp.json().catch(() => null);
  if (!resp.ok) throw new Error((data && data.message) || 'Actie mislukt.');
  return data;
}

async function functieAanroepen(naam, body) {
  const resp = await fetch(FUNCTIES_BASE + '/' + naam, {
    method: 'POST', headers: authHeaders(), body: JSON.stringify(body || {}),
  });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error(data.error || 'Actie mislukt.');
  return data;
}
