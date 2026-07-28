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
  wachtwoordVergeten: { nl: 'Wachtwoord vergeten?', de: 'Passwort vergessen?', en: 'Forgot password?', fr: 'Mot de passe oublié ?', zh: '忘记密码？' },
  wachtwoordMailVerstuurd: {
    nl: 'Herstel-e-mail verstuurd. Check je inbox.', de: 'Wiederherstellungs-E-Mail gesendet. Prüfe deinen Posteingang.',
    en: 'Recovery email sent. Check your inbox.', fr: 'E-mail de récupération envoyé. Vérifiez votre boîte de réception.',
    zh: '恢复邮件已发送，请查看收件箱。',
  },
  vulEerstEmailIn: {
    nl: 'Vul eerst je e-mailadres in.', de: 'Gib zuerst deine E-Mail-Adresse ein.', en: 'Fill in your email address first.',
    fr: 'Indiquez d’abord votre adresse e-mail.', zh: '请先填写您的电子邮箱。',
  },
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
  heroPrefix: { nl: 'We zijn', de: 'Wir sind', en: 'We’re', fr: 'Nous sommes', zh: '我们正在' },
  heroAccent: {
    nl: 'volop aan het bouwen', de: 'mitten im Aufbau', en: 'hard at work building',
    fr: 'en plein chantier', zh: '全力建设中',
  },
  badgeTekst: {
    nl: 'Nieuwe website in aanbouw', de: 'Neue Website im Aufbau', en: 'New website under construction',
    fr: 'Nouveau site en construction', zh: '新网站建设中',
  },
  heroUitleg: {
    nl: 'Onze nieuwe website komt er binnenkort aan — met alles over de club, speelavonden, toernooien en lidmaatschap. Tot die tijd: bedankt voor je geduld, en tot snel op de baan.',
    de: 'Unsere neue Website kommt bald — mit allem über den Verein, Spielabende, Turniere und Mitgliedschaft. Bis dahin: danke für deine Geduld, und bis bald auf dem Platz.',
    en: 'Our new website is coming soon — with everything about the club, play nights, tournaments and membership. Until then: thanks for your patience, and see you on the court soon.',
    fr: 'Notre nouveau site arrive bientôt — avec tout sur le club, les soirées de jeu, les tournois et l’adhésion. D’ici là, merci de votre patience, et à bientôt sur le terrain.',
    zh: '我们的新网站即将上线——包含俱乐部、比赛之夜、比赛和会员的所有信息。在此之前，感谢您的耐心，球场上见。',
  },
  speelTitel: {
    nl: 'Waar en wanneer we spelen', de: 'Wo und wann wir spielen', en: 'Where and when we play',
    fr: 'Où et quand nous jouons', zh: '我们在哪里、何时打球',
  },
  letOpDeel1: {
    nl: 'Let op: we trainen op dit moment tijdelijk buiten. Vanaf', de: 'Achtung: wir trainieren derzeit vorübergehend draußen. Ab',
    en: 'Note: we currently train outside temporarily. From', fr: 'Attention : nous nous entraînons actuellement temporairement dehors. À partir du',
    zh: '注意：我们目前暂时在户外训练。从',
  },
  letOpDatum: {
    nl: 'dinsdag 18 augustus, 19:30 uur', de: 'Dienstag, 18. August, 19:30 Uhr', en: 'Tuesday 18 August, 7:30 pm',
    fr: 'mardi 18 août, 19h30', zh: '8月18日星期二 19:30',
  },
  letOpDeel2: {
    nl: 'spelen we weer binnen in de sporthal.', de: 'spielen wir wieder drinnen in der Sporthalle.',
    en: 'we’ll play indoors in the sports hall again.', fr: 'nous rejouerons à l’intérieur du gymnase.',
    zh: '我们将重新回到体育馆室内打球。',
  },
  dagDinsdag: { nl: 'Dinsdag', de: 'Dienstag', en: 'Tuesday', fr: 'Mardi', zh: '周二' },
  clubappTitel: { nl: 'De clubapp', de: 'Die Vereins-App', en: 'The club app', fr: 'L’appli du club', zh: '俱乐部应用' },
  clubappSub: {
    nl: 'Binnenkort beschikbaar voor iPhone en Android.', de: 'Bald verfügbar für iPhone und Android.',
    en: 'Coming soon for iPhone and Android.', fr: 'Bientôt disponible sur iPhone et Android.', zh: '即将支持 iPhone 和 Android。',
  },
  binnenkortInDe: { nl: 'Binnenkort in de', de: 'Bald im', en: 'Coming soon to the', fr: 'Bientôt sur l’', zh: '即将登陆' },
  binnenkortOp: { nl: 'Binnenkort op', de: 'Bald bei', en: 'Coming soon on', fr: 'Bientôt sur', zh: '即将上线' },
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

// Eén enkele knop (geen apart zwevend menu-paneel): elke tik schuift naar
// de volgende van de 5 talen, exact zoals de thema-knop tussen 2 standen
// wisselt — hier gewoon een langere cyclus.
function initTaalKnop(containerId) {
  const houder = document.getElementById(containerId);
  if (!houder) return;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'taal-knop';
  btn.setAttribute('aria-label', 'Taal wisselen');
  btn.innerHTML = '<span data-taal-label></span>';
  btn.addEventListener('click', () => {
    const idx = TALEN.findIndex(t => t.code === huidigeTaal());
    const volgende = TALEN[(idx + 1) % TALEN.length];
    zetTaal(volgende.code);
  });
  houder.appendChild(btn);
  pasTaalToe();
}
