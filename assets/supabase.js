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
  return huidigeSessie();
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
  bewaarSessie({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    user_id: data.user.id,
  });
  return data;
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
