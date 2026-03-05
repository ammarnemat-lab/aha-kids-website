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

  // Navigation items: [label, href, pageFile (for active detection), special]
  const navItems = [
    ['Home',       isIndex ? '#' : 'index.html',  'index.html'],
    ['Bücher',     idx + '#buecher',               null],
    ['Über uns',   'ueber-uns.html',               'ueber-uns.html'],
    ['Die App',    'app.html',                     'app.html'],
    ['Newsletter', '#',                            null, 'newsletter'],
    ['Kontakt',    '#',                            null, 'kontakt'],
  ];

  // Build nav-links list
  const listItems = navItems.map(function (item) {
    const label   = item[0];
    const href    = item[1];
    const pageFile = item[2];
    const special  = item[3];

    // Active styling
    const isActive   = pageFile && (currentPage === pageFile || (pageFile === 'index.html' && isIndex));
    const activeHome = label === 'Home' && isActive;
    const activeStyle = (isActive && !activeHome) ? ' style="color:var(--green);"' : '';

    // Newsletter item
    if (special === 'newsletter') {
      return '<li><a href="#" class="nav-cta" onclick="openNewsletterModal();return false;">' + label + '</a></li>';
    }

    // Kontakt item — always opens modal
    if (special === 'kontakt') {
      return '<li><a href="#" onclick="openContactModal();return false;">' + label + '</a></li>';
    }

    // Home on index.html gets smooth scroll
    const onclickAttr = (label === 'Home' && isIndex)
      ? ' onclick="window.scrollTo({top:0,behavior:\'smooth\'});return false;"'
      : '';

    return '<li><a href="' + href + '"' + activeStyle + onclickAttr + '>' + label + '</a></li>';
  }).join('\n      ');

  // Build the full nav-logo link
  const logoHref    = isIndex ? '#' : 'index.html';
  const logoOnclick = isIndex
    ? ' onclick="window.scrollTo({top:0,behavior:\'smooth\'});return false;"'
    : '';

  // Insert the logo element
  var logoContainer = document.getElementById('navbar-logo');
  if (logoContainer) {
    logoContainer.innerHTML =
      '<a href="' + logoHref + '"' + logoOnclick + ' class="nav-logo">' +
      '<img src="logo.png" alt="aha Kids Logo">' +
      '</a>';
  }

  // Insert the nav element
  var navContainer = document.getElementById('navbar');
  if (navContainer) {
    navContainer.innerHTML =
      '<ul class="nav-links">\n      ' + listItems + '\n    </ul>\n' +
      '    <button class="mobile-menu" onclick="document.querySelector(\'.nav-links\').classList.toggle(\'show\')" aria-label="Menu">\n' +
      '      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3a7d44" stroke-width="2.5" stroke-linecap="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>\n' +
      '    </button>';
  }

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
            '<p class="modal-sub">Bleib auf dem Laufenden – keine Werbung, nur echte News von aha Kids.</p>' +
            '<input class="modal-field" id="nlName" type="text" placeholder="Dein Name">' +
            '<input class="modal-field" id="nlEmail" type="email" placeholder="Deine E-Mail-Adresse">' +
            '<label class="modal-gdpr">' +
            '<input type="checkbox" id="nlGdpr" onchange="var b=document.getElementById(\'nlSubmitBtn\');if(b)b.disabled=!this.checked;">' +
            '<span>Ich stimme der Verarbeitung meiner Daten gem\u00e4\u00df der ' +
            '<a href="datenschutz.html" target="_blank" rel="noopener">Datenschutzerkl\u00e4rung</a> zu.</span>' +
            '</label>' +
            '<button class="modal-btn" id="nlSubmitBtn" onclick="submitNewsletter()" disabled>🌱 Jetzt anmelden</button>' +
          '</div>' +
          '<div class="modal-success" id="newsletterSuccess" style="display:none">' +
            '<div class="success-icon">🎉</div>' +
            '<h3 style="font-family:\'Baloo 2\',cursive;margin-bottom:0.4rem;">Fast geschafft!</h3>' +
            '<p>Deine Anmeldung wurde abgeschickt. Schau kurz in dein Postfach.</p>' +
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
            '<h2 class="modal-title">📧 Kontakt aufnehmen</h2>' +
            '<p class="modal-sub">Schreib uns – wir freuen uns über jede Nachricht.</p>' +
            '<input class="modal-field" id="ctName" type="text" placeholder="Dein Name">' +
            '<input class="modal-field" id="ctEmail" type="email" placeholder="Deine E-Mail-Adresse">' +
            '<textarea class="modal-field" id="ctMessage" placeholder="Deine Nachricht an uns" rows="4"></textarea>' +
            '<label class="modal-gdpr">' +
            '<input type="checkbox" id="ctGdpr" onchange="var b=document.getElementById(\'ctSubmitBtn\');if(b)b.disabled=!this.checked;">' +
            '<span>Ich stimme der Verarbeitung meiner Daten gem\u00e4\u00df der ' +
            '<a href="datenschutz.html" target="_blank" rel="noopener">Datenschutzerkl\u00e4rung</a> zu.</span>' +
            '</label>' +
            '<button class="modal-btn" id="ctSubmitBtn" onclick="submitContact()" disabled>🚀 Nachricht senden</button>' +
          '</div>' +
          '<div class="modal-success" id="contactSuccess" style="display:none">' +
            '<div class="success-icon">✅</div>' +
            '<h3 style="font-family:\'Baloo 2\',cursive;margin-bottom:0.4rem;">Danke!</h3>' +
            '<p>Deine Nachricht ist auf dem Weg. Wir melden uns bald!</p>' +
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
})();
