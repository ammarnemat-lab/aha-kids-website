/**
 * Shared Navbar Component for aha Kids Website
 * Generates the navbar dynamically to avoid duplication across pages.
 * Also injects Newsletter and Contact modals on every page.
 */
(function () {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  // Determine if we're on the index page
  const isIndex = currentPage === 'index.html' || currentPage === '' || currentPage === '/';

  // Helper: prefix for links — on index use anchors, on subpages prefix with index.html
  const idx = isIndex ? '' : 'index.html';

  // Navigation items: [label, href, pageFile (for active detection), special, data-de, data-en]
  const navItems = [
    ['Home',       isIndex ? '#' : 'index.html',  'index.html', null, 'Home', 'Home'],
    ['Bücher',     idx + '#buecher',               null, null, 'Bücher', 'Books'],
    ['Über uns',   'ueber-uns.html',               'ueber-uns.html', null, 'Über uns', 'About Us'],
    ['Die App',    'app.html',                     'app.html', null, 'Die App', 'Our App'],
    ['Newsletter', '#',                            null, 'newsletter', 'Newsletter', 'Newsletter'],
    ['Kontakt',    '#',                            null, 'kontakt', 'Kontakt', 'Contact'],
  ];

  // Build nav-links list
  const listItems = navItems.map(function (item) {
    const label    = item[0];
    const href     = item[1];
    const pageFile = item[2];
    const special  = item[3];
    const dataDe   = item[4];
    const dataEn   = item[5];

    const dataAttrs = ' data-de="' + dataDe + '" data-en="' + dataEn + '"';

    // Active styling
    const isActive   = pageFile && (currentPage === pageFile || (pageFile === 'index.html' && isIndex));
    const activeHome = label === 'Home' && isActive;
    const activeStyle = (isActive && !activeHome) ? ' style="color:var(--green);"' : '';

    // Newsletter item
    if (special === 'newsletter') {
      return '<li><a href="#" class="nav-cta" onclick="openNewsletterModal();return false;"' + dataAttrs + '>' + label + '</a></li>';
    }

    // Kontakt item — always opens modal
    if (special === 'kontakt') {
      return '<li><a href="#" onclick="openContactModal();return false;"' + dataAttrs + '>' + label + '</a></li>';
    }

    // Home on index.html gets smooth scroll
    const onclickAttr = (label === 'Home' && isIndex)
      ? ' onclick="window.scrollTo({top:0,behavior:\'smooth\'});return false;"'
      : '';

    return '<li><a href="' + href + '"' + activeStyle + onclickAttr + dataAttrs + '>' + label + '</a></li>';
  }).join('\n      ');

  // Build the full nav-logo link
  const logoHref    = isIndex ? '#' : 'index.html';
  const logoOnclick = isIndex
    ? ' onclick="window.scrollTo({top:0,behavior:\'smooth\'});return false;"'
    : '';

  // Inline SVG flags (emoji flags don't render on Windows)
  const flagDE =
    '<svg width="20" height="13" viewBox="0 0 20 13">' +
      '<rect width="20" height="13" rx="2" fill="#FFCC00"/>' +
      '<rect width="20" height="8.67" rx="2" fill="#DD0000"/>' +
      '<rect width="20" height="4.33" rx="2" fill="#000"/>' +
    '</svg>';
  const flagEN =
    '<svg width="20" height="13" viewBox="0 0 60 40">' +
      '<rect width="60" height="40" rx="4" fill="#012169"/>' +
      '<path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" stroke-width="8"/>' +
      '<path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" stroke-width="4"/>' +
      '<path d="M30,0 V40 M0,20 H60" stroke="#fff" stroke-width="12"/>' +
      '<path d="M30,0 V40 M0,20 H60" stroke="#C8102E" stroke-width="6"/>' +
    '</svg>';
  const chevron =
    '<svg class="lang-chevron" width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 1l4 4 4-4"/></svg>';

  // Language dropdown HTML
  const langDropdown =
    '<div class="lang-dropdown">' +
      '<button class="lang-trigger" onclick="toggleLangMenu(event)" aria-label="Language">' +
        '<span id="langCurrentFlag">' + flagDE + '</span>' + chevron +
      '</button>' +
      '<div class="lang-menu" id="langMenu">' +
        '<button class="lang-option" onclick="setLang(\'de\');closeLangMenu()">' +
          flagDE + '<span>Deutsch</span><span class="lang-check" id="langCheckDE">\u2713</span>' +
        '</button>' +
        '<button class="lang-option" onclick="setLang(\'en\');closeLangMenu()">' +
          flagEN + '<span>English</span><span class="lang-check" id="langCheckEN">\u2713</span>' +
        '</button>' +
      '</div>' +
    '</div>';

  // Insert the logo element
  var logoContainer = document.getElementById('navbar-logo');
  if (logoContainer) {
    logoContainer.innerHTML =
      '<a href="' + logoHref + '"' + logoOnclick + ' class="nav-logo">' +
      '<img src="images/logo.webp" alt="aha Kids Logo">' +
      '</a>';
  }

  // Insert the nav element (dropdown after nav-links, before mobile-menu)
  var navContainer = document.getElementById('navbar');
  if (navContainer) {
    navContainer.innerHTML =
      '<ul class="nav-links">\n      ' + listItems + '\n    </ul>\n' +
      langDropdown + '\n' +
      '    <button class="mobile-menu" onclick="document.querySelector(\'.nav-links\').classList.toggle(\'show\')" aria-label="Menu">\n' +
      '      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3a7d44" stroke-width="2.5" stroke-linecap="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>\n' +
      '    </button>';
  }

  // Toggle / close the language dropdown
  window.toggleLangMenu = function(e) {
    e.stopPropagation();
    var menu = document.getElementById('langMenu');
    if (menu) menu.classList.toggle('open');
  };
  window.closeLangMenu = function() {
    var menu = document.getElementById('langMenu');
    if (menu) menu.classList.remove('open');
  };
  document.addEventListener('click', function() { closeLangMenu(); });

  // ── Inject Newsletter & Contact modals if not already in the DOM ──────────
  function injectModals() {
    if (!document.getElementById('newsletterModal')) {
      var nl = document.createElement('div');
      nl.className = 'modal-overlay';
      nl.id = 'newsletterModal';
      nl.setAttribute('onclick', 'if(event.target===this)closeNewsletterModal()');
      nl.innerHTML =
        '<div class="modal-box">' +
          '<button class="modal-close" onclick="closeNewsletterModal()" aria-label="Schließen">✕</button>' +
          '<div id="newsletterForm">' +
            '<h2 class="modal-title">📬 Newsletter</h2>' +
            '<p class="modal-sub" data-de="Bleib auf dem Laufenden \u2013 keine Werbung, nur echte News von aha Kids." data-en="Stay up to date \u2013 no ads, just genuine news from aha Kids.">Bleib auf dem Laufenden \u2013 keine Werbung, nur echte News von aha Kids.</p>' +
            '<input class="modal-field" id="nlName" type="text" placeholder="Dein Name" data-placeholder-de="Dein Name" data-placeholder-en="Your Name">' +
            '<input class="modal-field" id="nlEmail" type="email" placeholder="Deine E-Mail-Adresse" data-placeholder-de="Deine E-Mail-Adresse" data-placeholder-en="Your Email Address">' +
            '<label class="modal-gdpr">' +
            '<input type="checkbox" id="nlGdpr" onchange="var b=document.getElementById(\'nlSubmitBtn\');if(b)b.disabled=!this.checked;">' +
            '<span>' +
            '<span data-de="Ich stimme der Verarbeitung meiner Daten gem\u00e4\u00df der" data-en="I consent to the processing of my data in accordance with the">Ich stimme der Verarbeitung meiner Daten gem\u00e4\u00df der</span> ' +
            '<a href="datenschutz.html" target="_blank" rel="noopener" data-de="Datenschutzerkl\u00e4rung" data-en="Privacy Policy">Datenschutzerkl\u00e4rung</a>' +
            '<span data-de=" zu." data-en="."> zu.</span>' +
            '</span>' +
            '</label>' +
            '<button class="modal-btn" id="nlSubmitBtn" onclick="submitNewsletter()" disabled data-de="\uD83C\uDF31 Jetzt anmelden" data-en="\uD83C\uDF31 Subscribe now">\uD83C\uDF31 Jetzt anmelden</button>' +
          '</div>' +
          '<div class="modal-success" id="newsletterSuccess" style="display:none">' +
            '<div class="success-icon">🎉</div>' +
            '<h3 style="font-family:\'Baloo 2\',cursive;margin-bottom:0.4rem;" data-de="Fast geschafft!" data-en="Almost done!">Fast geschafft!</h3>' +
            '<p data-de="Deine Anmeldung wurde abgeschickt. Schau kurz in dein Postfach." data-en="Your registration has been submitted. Please check your inbox.">Deine Anmeldung wurde abgeschickt. Schau kurz in dein Postfach.</p>' +
          '</div>' +
        '</div>';
      document.body.appendChild(nl);
    }

    if (!document.getElementById('contactModal')) {
      var ct = document.createElement('div');
      ct.className = 'modal-overlay';
      ct.id = 'contactModal';
      ct.setAttribute('onclick', 'if(event.target===this)closeContactModal()');
      ct.innerHTML =
        '<div class="modal-box">' +
          '<button class="modal-close" onclick="closeContactModal()" aria-label="Schließen">✕</button>' +
          '<div id="contactForm">' +
            '<h2 class="modal-title" data-de="\uD83D\uDCE7 Kontakt aufnehmen" data-en="\uD83D\uDCE7 Get in Touch">\uD83D\uDCE7 Kontakt aufnehmen</h2>' +
            '<p class="modal-sub" data-de="Schreib uns \u2013 wir freuen uns \u00fcber jede Nachricht." data-en="Write to us \u2013 we love hearing from you.">Schreib uns \u2013 wir freuen uns \u00fcber jede Nachricht.</p>' +
            '<input class="modal-field" id="ctName" type="text" placeholder="Dein Name" data-placeholder-de="Dein Name" data-placeholder-en="Your Name">' +
            '<input class="modal-field" id="ctEmail" type="email" placeholder="Deine E-Mail-Adresse" data-placeholder-de="Deine E-Mail-Adresse" data-placeholder-en="Your Email Address">' +
            '<textarea class="modal-field" id="ctMessage" placeholder="Deine Nachricht an uns" rows="4" data-placeholder-de="Deine Nachricht an uns" data-placeholder-en="Your message to us"></textarea>' +
            '<label class="modal-gdpr">' +
            '<input type="checkbox" id="ctGdpr" onchange="var b=document.getElementById(\'ctSubmitBtn\');if(b)b.disabled=!this.checked;">' +
            '<span>' +
            '<span data-de="Ich stimme der Verarbeitung meiner Daten gem\u00e4\u00df der" data-en="I consent to the processing of my data in accordance with the">Ich stimme der Verarbeitung meiner Daten gem\u00e4\u00df der</span> ' +
            '<a href="datenschutz.html" target="_blank" rel="noopener" data-de="Datenschutzerkl\u00e4rung" data-en="Privacy Policy">Datenschutzerkl\u00e4rung</a>' +
            '<span data-de=" zu." data-en="."> zu.</span>' +
            '</span>' +
            '</label>' +
            '<button class="modal-btn" id="ctSubmitBtn" onclick="submitContact()" disabled data-de="\uD83D\uDE80 Nachricht senden" data-en="\uD83D\uDE80 Send Message">\uD83D\uDE80 Nachricht senden</button>' +
          '</div>' +
          '<div class="modal-success" id="contactSuccess" style="display:none">' +
            '<div class="success-icon">✅</div>' +
            '<h3 style="font-family:\'Baloo 2\',cursive;margin-bottom:0.4rem;" data-de="Danke!" data-en="Thank you!">Danke!</h3>' +
            '<p data-de="Deine Nachricht ist auf dem Weg. Wir melden uns bald!" data-en="Your message is on its way. We\'ll be in touch soon!">Deine Nachricht ist auf dem Weg. Wir melden uns bald!</p>' +
          '</div>' +
        '</div>';
      document.body.appendChild(ct);
    }
  }

  // ── Modal open/close/submit (define only if not already defined) ──────────
  if (typeof window.openNewsletterModal !== 'function') {
    window.openNewsletterModal = function () {
      var form = document.getElementById('newsletterForm');
      var succ = document.getElementById('newsletterSuccess');
      if (form) form.style.display = '';
      if (succ) succ.style.display = 'none';
      var cb  = document.getElementById('nlGdpr');
      var btn = document.getElementById('nlSubmitBtn');
      if (cb)  cb.checked  = false;
      if (btn) btn.disabled = true;
      var m = document.getElementById('newsletterModal');
      if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
    };
    window.closeNewsletterModal = function () {
      var m = document.getElementById('newsletterModal');
      if (m) m.classList.remove('open');
      document.body.style.overflow = '';
    };
    window.submitNewsletter = async function () {
      var name  = (document.getElementById('nlName')  || {}).value || '';
      var email = (document.getElementById('nlEmail') || {}).value || '';
      name = name.trim(); email = email.trim();
      if (!name || !email) { alert('Bitte fülle alle Felder aus.'); return; }
      var btn = document.getElementById('nlSubmitBtn');
      var prevText = btn ? btn.innerHTML : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Wird gesendet...'; }
      try {
        var res = await fetch('https://formspree.io/f/mbdzrbld', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ _subject: 'Newsletter Anmeldung – aha Kids', name: name, email: email })
        });
        if (!res.ok) throw new Error();
        var form = document.getElementById('newsletterForm');
        var succ = document.getElementById('newsletterSuccess');
        if (form) form.style.display = 'none';
        if (succ) succ.style.display = 'block';
      } catch(e) {
        alert('Beim Senden ist etwas schiefgelaufen. Bitte versuche es erneut.');
        if (btn) { btn.disabled = false; btn.innerHTML = prevText; }
      }
    };
  }

  if (typeof window.openContactModal !== 'function') {
    window.openContactModal = function () {
      var form = document.getElementById('contactForm');
      var succ = document.getElementById('contactSuccess');
      if (form) form.style.display = '';
      if (succ) succ.style.display = 'none';
      var cb  = document.getElementById('ctGdpr');
      var btn = document.getElementById('ctSubmitBtn');
      if (cb)  cb.checked  = false;
      if (btn) btn.disabled = true;
      var m = document.getElementById('contactModal');
      if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
    };
    window.closeContactModal = function () {
      var m = document.getElementById('contactModal');
      if (m) m.classList.remove('open');
      document.body.style.overflow = '';
    };
    window.submitContact = async function () {
      var name  = (document.getElementById('ctName')    || {}).value || '';
      var email = (document.getElementById('ctEmail')   || {}).value || '';
      var msg   = (document.getElementById('ctMessage') || {}).value || '';
      name = name.trim(); email = email.trim(); msg = msg.trim();
      if (!name || !email || !msg) { alert('Bitte fülle alle Felder aus.'); return; }
      var btn = document.getElementById('ctSubmitBtn');
      var prevText = btn ? btn.innerHTML : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Wird gesendet...'; }
      try {
        var res = await fetch('https://formspree.io/f/xreyzdbb', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ _subject: 'Kontaktanfrage – aha Kids', name: name, email: email, message: msg })
        });
        if (!res.ok) throw new Error();
        var form = document.getElementById('contactForm');
        var succ = document.getElementById('contactSuccess');
        if (form) form.style.display = 'none';
        if (succ) succ.style.display = 'block';
      } catch(e) {
        alert('Beim Senden ist etwas schiefgelaufen. Bitte versuche es in ein paar Minuten erneut.');
        if (btn) { btn.disabled = false; btn.innerHTML = prevText; }
      }
    };
  }

  // Close modals on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (typeof closeNewsletterModal === 'function') closeNewsletterModal();
      if (typeof closeContactModal    === 'function') closeContactModal();
    }
  });

  // Run injection after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectModals);
  } else {
    injectModals();
  }

  // ── Scroll handler for nav shadow and logo visibility ─────────────────────
  function updateNavOnScroll() {
    var nav  = document.getElementById('navbar');
    var logo = document.querySelector('.nav-logo');
    if (nav)  nav.classList.toggle('scrolled', window.scrollY > 20);
    if (logo) logo.classList.toggle('hidden',  window.scrollY > 50);
  }

  window.addEventListener('scroll', updateNavOnScroll);
  updateNavOnScroll();

  // ── Language toggle ────────────────────────────────────────────────────────
  window.setLang = function(lang) {
    try { localStorage.setItem('aha-lang', lang); } catch(e) {}
    applyLang(lang);
  };

  window.applyLang = function(lang) {
    // Update text content for data-de / data-en elements
    document.querySelectorAll('[data-de]').forEach(function(el) {
      var val = lang === 'en' ? el.dataset.en : el.dataset.de;
      if (val === undefined) return;
      var hasChildElements = false;
      el.childNodes.forEach(function(n) { if (n.nodeType === 1) hasChildElements = true; });
      if (!hasChildElements) {
        el.textContent = val;
      } else {
        // Legal pages: preserve (N) number span, translate the rest
        var paraNum = el.querySelector('.legal-para-num');
        if (paraNum) {
          var numHtml = paraNum.outerHTML;
          var text = val.replace(/^\(\d+\)\s*/, '');
          el.innerHTML = numHtml + ' ' + text;
        }
      }
    });
    // Update placeholders
    document.querySelectorAll('[data-placeholder-de]').forEach(function(el) {
      el.placeholder = lang === 'en' ? el.dataset.placeholderEn : el.dataset.placeholderDe;
    });
    // Update language dropdown state
    var curFlag = document.getElementById('langCurrentFlag');
    if (curFlag) curFlag.innerHTML = lang === 'en' ? flagEN : flagDE;
    var chkDE = document.getElementById('langCheckDE');
    var chkEN = document.getElementById('langCheckEN');
    if (chkDE) chkDE.style.visibility = lang !== 'en' ? 'visible' : 'hidden';
    if (chkEN) chkEN.style.visibility = lang === 'en' ? 'visible' : 'hidden';
  };

  // Run on load — read language from localStorage (URL param as fallback)
  (function() {
    var lang;
    try { lang = localStorage.getItem('aha-lang'); } catch(e) {}
    if (!lang) lang = new URLSearchParams(window.location.search).get('lang') || 'de';
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() { applyLang(lang); });
    } else {
      applyLang(lang);
    }
  })();
})();
