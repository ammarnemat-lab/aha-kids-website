import { readFileSync, writeFileSync } from 'fs';

// ── Helper ────────────────────────────────────────────────────────────────────
function patch(filePath, replacements) {
  let src = readFileSync(filePath, 'utf-8');
  for (const [old, neu] of replacements) {
    if (!src.includes(old)) { console.error('NOT FOUND in', filePath, ':', old.slice(0, 60)); process.exit(1); }
    src = src.replace(old, neu);
  }
  writeFileSync(filePath, src, 'utf-8');
  console.log('Patched:', filePath);
}

// ─────────────────────────────────────────────────────────────────────────────
// CHANGES FOR navbar/navbar.js  (also applied to root navbar.js below)
// ─────────────────────────────────────────────────────────────────────────────

const gdprCheckboxNL =
  '<label class="modal-gdpr">' +
  '<input type="checkbox" id="nlGdpr" onchange="var b=document.getElementById(\'nlSubmitBtn\');if(b)b.disabled=!this.checked;">' +
  '<span>Ich stimme der Verarbeitung meiner Daten gem\u00e4\u00df der ' +
  '<a href="datenschutz.html" target="_blank" rel="noopener">Datenschutzerkl\u00e4rung</a> zu.</span>' +
  '</label>';

const gdprCheckboxCT =
  '<label class="modal-gdpr">' +
  '<input type="checkbox" id="ctGdpr" onchange="var b=document.getElementById(\'ctSubmitBtn\');if(b)b.disabled=!this.checked;">' +
  '<span>Ich stimme der Verarbeitung meiner Daten gem\u00e4\u00df der ' +
  '<a href="datenschutz.html" target="_blank" rel="noopener">Datenschutzerkl\u00e4rung</a> zu.</span>' +
  '</label>';

const replacements = [

  // ── Newsletter form: add checkbox + disable submit button ──────────────────
  [
    `'<button class="modal-btn" onclick="submitNewsletter()">🌱 Jetzt anmelden</button>'`,
    `'${gdprCheckboxNL}' +\n            '<button class="modal-btn" id="nlSubmitBtn" onclick="submitNewsletter()" disabled>🌱 Jetzt anmelden</button>'`,
  ],

  // ── Contact form: add checkbox + disable submit button ─────────────────────
  [
    `'<button class="modal-btn" onclick="submitContact()">🚀 Nachricht senden</button>'`,
    `'${gdprCheckboxCT}' +\n            '<button class="modal-btn" id="ctSubmitBtn" onclick="submitContact()" disabled>🚀 Nachricht senden</button>'`,
  ],

  // ── openNewsletterModal: reset checkbox on open ────────────────────────────
  [
    `window.openNewsletterModal = function () {
      var form = document.getElementById('newsletterForm');
      var succ = document.getElementById('newsletterSuccess');
      if (form) form.style.display = '';
      if (succ) succ.style.display = 'none';
      var m = document.getElementById('newsletterModal');
      if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
    };`,
    `window.openNewsletterModal = function () {
      var form = document.getElementById('newsletterForm');
      var succ = document.getElementById('newsletterSuccess');
      if (form) form.style.display = '';
      if (succ) succ.style.display = 'none';
      var cb = document.getElementById('nlGdpr');
      var btn = document.getElementById('nlSubmitBtn');
      if (cb) cb.checked = false;
      if (btn) btn.disabled = true;
      var m = document.getElementById('newsletterModal');
      if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
    };`,
  ],

  // ── openContactModal: reset checkbox on open ───────────────────────────────
  [
    `window.openContactModal = function () {
      var form = document.getElementById('contactForm');
      var succ = document.getElementById('contactSuccess');
      if (form) form.style.display = '';
      if (succ) succ.style.display = 'none';
      var m = document.getElementById('contactModal');
      if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
    };`,
    `window.openContactModal = function () {
      var form = document.getElementById('contactForm');
      var succ = document.getElementById('contactSuccess');
      if (form) form.style.display = '';
      if (succ) succ.style.display = 'none';
      var cb = document.getElementById('ctGdpr');
      var btn = document.getElementById('ctSubmitBtn');
      if (cb) cb.checked = false;
      if (btn) btn.disabled = true;
      var m = document.getElementById('contactModal');
      if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
    };`,
  ],
];

patch('C:/Users/a58022/aha-kids-website/navbar/navbar.js', replacements);
patch('C:/Users/a58022/aha-kids-website/navbar.js',        replacements);

// ─────────────────────────────────────────────────────────────────────────────
// ADD CSS to navbar.css
// ─────────────────────────────────────────────────────────────────────────────
const cssInsertAfter = '.modal-btn:hover { background: #2f6a38; transform: translateY(-2px); box-shadow: 0 10px 28px rgba(58,125,68,0.3); }';

const newCSS = `
/* GDPR consent checkbox */
.modal-gdpr {
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  font-size: 0.82rem;
  color: #6b7c6c;
  margin: 0.1rem 0 0.85rem;
  cursor: pointer;
  line-height: 1.5;
}
.modal-gdpr input[type="checkbox"] {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  margin-top: 2px;
  accent-color: #3a7d44;
  cursor: pointer;
  border-radius: 3px;
}
.modal-gdpr a {
  color: #3a7d44;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.modal-gdpr a:hover { color: #2f6a38; }
.modal-btn:disabled {
  opacity: 0.42;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
  background: #3a7d44;
}`;

patch('C:/Users/a58022/aha-kids-website/navbar.css', [
  [cssInsertAfter, cssInsertAfter + newCSS],
]);
