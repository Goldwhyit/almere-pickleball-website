// Almere Pickleball — taalkeuze voor de website.
//
// Dezelfde 5 talen als de app (lib/l10n/vertalingen.dart): nl/de/en/fr/zh.
// Dekt de gedeelde chrome (onderbalk, headers, veelgebruikte knoppen) —
// niet elk stukje tekst op elke pagina, en geen door leden/beheer
// ingevoerde inhoud (nieuws, toernooinamen e.d.), net zoals de app zelf
// ook alleen UI-strings vertaalt en geen databank-inhoud.

const TALEN = [
  { code: 'nl', label: 'NL' },
  { code: 'de', label: 'DE' },
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
  { code: 'zh', label: '中文' },
];

const I18N = {
  navHome: { nl: 'Home', de: 'Home', en: 'Home', fr: 'Accueil', zh: '首页' },
  navReserveren: { nl: 'Reserveren', de: 'Reservieren', en: 'Book', fr: 'Réserver', zh: '预订' },
  navToernooien: { nl: 'Toernooien', de: 'Turniere', en: 'Tournaments', fr: 'Tournois', zh: '比赛' },
  navNieuws: { nl: 'Nieuws', de: 'News', en: 'News', fr: 'Actus', zh: '新闻' },
  navLeden: { nl: 'Leden', de: 'Mitglieder', en: 'Members', fr: 'Membres', zh: '会员' },
  navProfiel: { nl: 'Profiel', de: 'Profil', en: 'Profile', fr: 'Profil', zh: '我的' },
  navBeheer: { nl: 'Beheer', de: 'Verwaltung', en: 'Admin', fr: 'Gestion', zh: '管理' },
  uitloggen: { nl: 'Uitloggen', de: 'Abmelden', en: 'Log out', fr: 'Déconnexion', zh: '退出登录' },
  aanmelden: { nl: 'Aanmelden', de: 'Anmelden', en: 'Sign up', fr: 'S’inscrire', zh: '报名' },
  afmelden: { nl: 'Afmelden', de: 'Abmelden', en: 'Cancel', fr: 'Se désinscrire', zh: '取消报名' },
  registreren: { nl: 'Registreren', de: 'Registrieren', en: 'Register', fr: 'S’inscrire', zh: '注册' },
  inloggen: { nl: 'Inloggen', de: 'Anmelden', en: 'Sign in', fr: 'Se connecter', zh: '登录' },
  opslaan: { nl: 'Opslaan', de: 'Speichern', en: 'Save', fr: 'Enregistrer', zh: '保存' },
  annuleren: { nl: 'Annuleren', de: 'Abbrechen', en: 'Cancel', fr: 'Annuler', zh: '取消' },
  wijzigen: { nl: 'Wijzigen', de: 'Bearbeiten', en: 'Edit', fr: 'Modifier', zh: '编辑' },
  emailLabel: { nl: 'E-mailadres', de: 'E-Mail-Adresse', en: 'Email address', fr: 'Adresse e-mail', zh: '电子邮箱' },
  wachtwoordLabel: { nl: 'Wachtwoord', de: 'Passwort', en: 'Password', fr: 'Mot de passe', zh: '密码' },
  terugNaarSite: { nl: '← Terug naar de website', de: '← Zurück zur Website', en: '← Back to the website', fr: '← Retour au site', zh: '← 返回网站' },
  alLid: { nl: 'Al lid? ', de: 'Schon Mitglied? ', en: 'Already a member? ', fr: 'Déjà membre ? ', zh: '已是会员？' },
  logHierIn: { nl: 'Log hier in', de: 'Hier einloggen', en: 'Log in here', fr: 'Connectez-vous ici', zh: '在此登录' },
  veelgesteldeVragen: { nl: 'Veelgestelde vragen', de: 'Häufige Fragen', en: 'FAQ', fr: 'FAQ', zh: '常见问题' },

  homeMerk: { nl: 'Almere Pickleball', de: 'Almere Pickleball', en: 'Almere Pickleball', fr: 'Almere Pickleball', zh: 'Almere Pickleball' },
  homeTitelProefles: { nl: 'Proefles aanvragen', de: 'Probestunde anfragen', en: 'Request a trial lesson', fr: 'Demander un cours d’essai', zh: '申请试打' },
  homeSubProefles: {
    nl: 'Kom vrijblijvend meespelen — wij nemen daarna contact op voor een datum.',
    de: 'Spiel unverbindlich mit — wir melden uns danach für einen Termin.',
    en: 'Come try it out, no obligation — we’ll contact you afterwards to set a date.',
    fr: 'Venez essayer sans engagement — nous vous recontacterons pour une date.',
    zh: '无需承诺，先来试打——之后我们会联系您安排日期。',
  },
  titelBaanHuren: { nl: 'Baan huren', de: 'Platz mieten', en: 'Rent a court', fr: 'Louer un terrain', zh: '租用球场' },
  titelToernooien: { nl: 'Toernooien', de: 'Turniere', en: 'Tournaments', fr: 'Tournois', zh: '比赛' },
  titelPrivacy: { nl: 'Privacybeleid', de: 'Datenschutz', en: 'Privacy policy', fr: 'Confidentialité', zh: '隐私政策' },
  titelFaq: { nl: 'Veelgestelde vragen', de: 'Häufige Fragen', en: 'Frequently asked questions', fr: 'Questions fréquentes', zh: '常见问题' },
  titelInloggen: { nl: 'Ledenportaal', de: 'Mitgliederportal', en: 'Member portal', fr: 'Portail des membres', zh: '会员门户' },
  subToernooien: {
    nl: 'Poule-standen en wedstrijdschema, live bijgewerkt.',
    de: 'Gruppentabellen und Spielplan, live aktualisiert.',
    en: 'Group standings and match schedule, updated live.',
    fr: 'Classements de poule et calendrier, mis à jour en direct.',
    zh: '小组积分与赛程，实时更新。',
  },
  subFaq: {
    nl: 'Alles wat je wilt weten over spelen, lidmaatschap en toernooien.',
    de: 'Alles, was du über Spielen, Mitgliedschaft und Turniere wissen willst.',
    en: 'Everything you want to know about playing, membership and tournaments.',
    fr: 'Tout ce que vous voulez savoir sur le jeu, l’adhésion et les tournois.',
    zh: '关于打球、会员和比赛，您想知道的一切。',
  },
  subPrivacy: {
    nl: 'Hoe wij omgaan met jouw persoonsgegevens.',
    de: 'Wie wir mit deinen persönlichen Daten umgehen.',
    en: 'How we handle your personal data.',
    fr: 'Comment nous traitons vos données personnelles.',
    zh: '我们如何处理您的个人数据。',
  },
  subBaanHuren: {
    nl: 'Baan 6, 7 of 8 bij Sporthal Almere Haven, dinsdagavond — per uur.',
    de: 'Platz 6, 7 oder 8 bei Sporthal Almere Haven, dienstagabends — pro Stunde.',
    en: 'Court 6, 7 or 8 at Sporthal Almere Haven, Tuesday evenings — per hour.',
    fr: 'Terrain 6, 7 ou 8 au Sporthal Almere Haven, le mardi soir — à l’heure.',
    zh: '阿尔梅勒海文体育馆 6、7 或 8 号球场，周二晚间——按小时计。',
  },
  titelJeTicket: { nl: 'Je ticket', de: 'Dein Ticket', en: 'Your ticket', fr: 'Votre billet', zh: '您的凭证' },
  linkProefles: {
    nl: 'Gratis proefles aanvragen →', de: 'Kostenlose Probestunde anfragen →', en: 'Request a free trial lesson →',
    fr: 'Demander un cours d’essai gratuit →', zh: '申请免费试打 →',
  },
  linkToernooistanden: {
    nl: 'Bekijk de actuele toernooistanden →', de: 'Aktuelle Turnierstände ansehen →', en: 'View current tournament standings →',
    fr: 'Voir les classements actuels des tournois →', zh: '查看当前比赛排名 →',
  },
  linkLedenportaal: {
    nl: 'Ledenportaal (inloggen) →', de: 'Mitgliederportal (einloggen) →', en: 'Member portal (sign in) →',
    fr: 'Portail des membres (connexion) →', zh: '会员门户（登录）→',
  },
  linkBaanHuren: {
    nl: 'Baan huren (extern) →', de: 'Platz mieten (extern) →', en: 'Rent a court (external) →',
    fr: 'Louer un terrain (externe) →', zh: '租用球场（外部）→',
  },
  veelgesteldeVragenPijl: {
    nl: 'Veelgestelde vragen →', de: 'Häufige Fragen →', en: 'Frequently asked questions →',
    fr: 'Questions fréquentes →', zh: '常见问题 →',
  },
};

const TAAL_SLEUTEL = 'pb_taal';

function huidigeTaal() {
  try {
    const opgeslagen = localStorage.getItem(TAAL_SLEUTEL);
    if (opgeslagen && TALEN.some(t => t.code === opgeslagen)) return opgeslagen;
  } catch (_) { /* localStorage niet beschikbaar */ }
  return 'nl';
}

function vertaal(sleutel) {
  const taal = huidigeTaal();
  const rij = I18N[sleutel];
  if (!rij) return sleutel;
  return rij[taal] || rij.nl || sleutel;
}

function pasTaalToe() {
  document.documentElement.setAttribute('lang', huidigeTaal());
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = vertaal(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.setAttribute('placeholder', vertaal(el.getAttribute('data-i18n-placeholder')));
  });
  document.querySelectorAll('[data-taal-label]').forEach(el => {
    el.textContent = TALEN.find(t => t.code === huidigeTaal()).label;
  });
}

function zetTaal(taal) {
  try { localStorage.setItem(TAAL_SLEUTEL, taal); } catch (_) { /* negeren */ }
  pasTaalToe();
}

function initTaalKnop(containerId) {
  const houder = document.getElementById(containerId);
  if (!houder) return;
  const wrap = document.createElement('div');
  wrap.className = 'taal-wrap';
  wrap.innerHTML =
    '<button type="button" class="taal-knop" aria-haspopup="true" aria-expanded="false">' +
    '<span data-taal-label></span></button>' +
    '<div class="taal-menu" hidden>' +
    TALEN.map(t => '<button type="button" class="taal-item" data-taal="' + t.code + '">' + t.label + '</button>').join('') +
    '</div>';
  houder.appendChild(wrap);

  const knop = wrap.querySelector('.taal-knop');
  const menu = wrap.querySelector('.taal-menu');
  knop.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = !menu.hidden;
    menu.hidden = open;
    knop.setAttribute('aria-expanded', String(!open));
  });
  wrap.querySelectorAll('.taal-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      zetTaal(item.dataset.taal);
      menu.hidden = true;
      knop.setAttribute('aria-expanded', 'false');
    });
  });
  document.addEventListener('click', () => { menu.hidden = true; knop.setAttribute('aria-expanded', 'false'); });

  pasTaalToe();
}
