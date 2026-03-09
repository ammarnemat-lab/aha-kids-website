import { readFileSync, writeFileSync } from 'fs';

let src = readFileSync('index.html', 'utf-8').replace(/\r\n/g, '\n');

function replace(label, oldStr, newStr) {
  if (!src.includes(oldStr)) { console.error('NOT FOUND:', label); process.exit(1); }
  src = src.replace(oldStr, newStr);
  console.log('Patched:', label);
}

// ─── 1. submitFeedback → Formspree ────────────────────────────────────────
replace('submitFeedback',
`    window.submitFeedback = function() {
      if (!_selectedReaction) {
        const wrap = document.querySelector('.emoji-reactions');
        wrap.style.animation = 'none';
        void wrap.offsetWidth;
        wrap.style.animation = 'shake 0.4s ease';
        return;
      }
      const text = (document.getElementById('feedbackText') || {}).value || '';
      const email = (document.getElementById('feedbackEmail') || {}).value || '';
      const reactionLabels = { love: 'Ich liebe es! 😍', good: 'Gut! 🙂', meh: 'Geht so. 😐' };
      const bodyParts = ['Reaktion: ' + (reactionLabels[_selectedReaction] || _selectedReaction)];
      if (email) bodyParts.push('E-Mail: ' + email);
      if (text) bodyParts.push('Kommentar: ' + text);
      bodyParts.push('Datum: ' + new Date().toLocaleString('de-DE'));
      window.location.href = 'mailto:hello@aha-kids.de?subject=aha+Kids+Feedback&body=' + encodeURIComponent(bodyParts.join('\\n'));
      document.querySelector('.emoji-reactions').style.display = 'none';
      document.querySelector('.feedback-textarea-wrap').style.display = 'none';
      document.querySelector('.feedback-submit').style.display = 'none';
      const thanks = document.getElementById('feedbackThanks');
      if (thanks) thanks.style.display = 'block';
    };`,
`    window.submitFeedback = async function() {
      if (!_selectedReaction) {
        const wrap = document.querySelector('.emoji-reactions');
        wrap.style.animation = 'none';
        void wrap.offsetWidth;
        wrap.style.animation = 'shake 0.4s ease';
        return;
      }
      const text  = (document.getElementById('feedbackText')  || {}).value || '';
      const email = (document.getElementById('feedbackEmail') || {}).value || '';
      const reactionLabels = { love: 'Ich liebe es! 😍', good: 'Gut! 🙂', meh: 'Geht so. 😐' };
      const fbBtn = document.querySelector('.feedback-submit');
      if (fbBtn) { fbBtn.disabled = true; fbBtn.textContent = 'Wird gesendet...'; }
      try {
        await fetch('https://formspree.io/f/xreyzdbb', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            _subject: 'Feedback – aha Kids',
            reaction: reactionLabels[_selectedReaction] || _selectedReaction,
            email:    email || '(nicht angegeben)',
            comment:  text  || '(kein Kommentar)'
          })
        });
      } catch(e) { /* show thanks regardless */ }
      document.querySelector('.emoji-reactions').style.display = 'none';
      document.querySelector('.feedback-textarea-wrap').style.display = 'none';
      document.querySelector('.feedback-submit').style.display = 'none';
      const thanks = document.getElementById('feedbackThanks');
      if (thanks) thanks.style.display = 'block';
    };`
);

// ─── 2. submitNewsletter → Formspree ──────────────────────────────────────
replace('submitNewsletter',
`    window.submitNewsletter = function() {
      const name = document.getElementById('nlName').value.trim();
      const email = document.getElementById('nlEmail').value.trim();
      if (!name || !email) { alert('Bitte fülle alle Felder aus.'); return; }
      const body = 'Newsletter-Anmeldung:\\nName: ' + name + '\\nE-Mail: ' + email + '\\nDatum: ' + new Date().toLocaleString('de-DE');
      window.location.href = 'mailto:hello@aha-kids.de?subject=Newsletter+Anmeldung&body=' + encodeURIComponent(body);
      document.getElementById('newsletterForm').style.display = 'none';
      document.getElementById('newsletterSuccess').style.display = 'block';
    };`,
`    window.submitNewsletter = async function() {
      const name  = document.getElementById('nlName').value.trim();
      const email = document.getElementById('nlEmail').value.trim();
      if (!name || !email) { alert('Bitte fülle alle Felder aus.'); return; }
      const btn = document.getElementById('nlSubmitBtn');
      const prevText = btn ? btn.innerHTML : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Wird gesendet...'; }
      try {
        const res = await fetch('https://formspree.io/f/mbdzrbld', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ _subject: 'Newsletter Anmeldung – aha Kids', name: name, email: email })
        });
        if (!res.ok) throw new Error();
        document.getElementById('newsletterForm').style.display = 'none';
        document.getElementById('newsletterSuccess').style.display = 'block';
      } catch(e) {
        alert('Beim Senden ist etwas schiefgelaufen. Bitte versuche es erneut.');
        if (btn) { btn.disabled = false; btn.innerHTML = prevText; }
      }
    };`
);

// ─── 3. submitContact → Formspree ─────────────────────────────────────────
replace('submitContact',
`    window.submitContact = async function() {
      const name = document.getElementById('ctName').value.trim();
      const email = document.getElementById('ctEmail').value.trim();
      const msg = document.getElementById('ctMessage').value.trim();
      const website = document.getElementById('ctWebsite').value.trim();
      const sendButton = document.querySelector('#contactForm .modal-btn');
      const previousButtonText = sendButton.textContent;

      if (!name || !email || !msg) { alert('Bitte fülle alle Felder aus.'); return; }
      if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) { alert('Bitte gib eine gültige E-Mail-Adresse ein.'); return; }

      sendButton.disabled = true;
      sendButton.textContent = 'Wird gesendet...';

      try {
        const response = await fetch('contact.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            email: email,
            message: msg,
            website: website
          })
        });

        let result = null;
        try {
          result = await response.json();
        } catch (jsonError) {
          result = null;
        }

        if (!response.ok || !result || !result.success) {
          throw new Error('Kontaktformular konnte nicht gesendet werden.');
        }

        document.getElementById('contactForm').style.display = 'none';
        document.getElementById('contactSuccess').style.display = 'block';
      } catch (error) {
        alert('Beim Senden ist etwas schiefgelaufen. Bitte versuche es in ein paar Minuten erneut.');
      } finally {
        sendButton.disabled = false;
        sendButton.textContent = previousButtonText;
      }
    };`,
`    window.submitContact = async function() {
      const name    = document.getElementById('ctName').value.trim();
      const email   = document.getElementById('ctEmail').value.trim();
      const msg     = document.getElementById('ctMessage').value.trim();
      const website = document.getElementById('ctWebsite').value.trim();
      if (!name || !email || !msg) { alert('Bitte fülle alle Felder aus.'); return; }
      if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) { alert('Bitte gib eine gültige E-Mail-Adresse ein.'); return; }
      if (website) return; // honeypot
      const btn = document.getElementById('ctSubmitBtn');
      const prevText = btn ? btn.innerHTML : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Wird gesendet...'; }
      try {
        const res = await fetch('https://formspree.io/f/xreyzdbb', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ _subject: 'Kontaktanfrage – aha Kids', name: name, email: email, message: msg })
        });
        if (!res.ok) throw new Error();
        document.getElementById('contactForm').style.display = 'none';
        document.getElementById('contactSuccess').style.display = 'block';
      } catch(e) {
        alert('Beim Senden ist etwas schiefgelaufen. Bitte versuche es in ein paar Minuten erneut.');
        if (btn) { btn.disabled = false; btn.innerHTML = prevText; }
      }
    };`
);

writeFileSync('index.html', src, 'utf-8');
console.log('index.html saved.');
