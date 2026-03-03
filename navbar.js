/**
 * Shared Navbar Component for aha Kids Website
 * Generates the navbar dynamically to avoid duplication across pages.
 */
(function () {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  // Determine if we're on the index page
  const isIndex = currentPage === 'index.html' || currentPage === '' || currentPage === '/';

  // Helper: prefix for links — on index use anchors, on subpages prefix with index.html
  const idx = isIndex ? '' : 'index.html';

  // Navigation items: [label, href, pageFile (for active detection)]
  const navItems = [
    ['Home',      isIndex ? '#' : 'index.html',            'index.html'],
    ['Bücher',    idx + '#buecher',                         null],
    ['Mitmachen', idx + '#wunschliste',                     null],
    ['Über uns',  'ueber-uns.html',                         'ueber-uns.html'],
    ['Die App',   'app.html',                               'app.html'],
    ['Kontakt',   idx + '#kontakt',                         null],
  ];

  // Build nav-links list
  const listItems = navItems.map(function (item) {
    const label = item[0];
    const href = item[1];
    const pageFile = item[2];

    // Active styling
    const isActive = pageFile && (currentPage === pageFile || (pageFile === 'index.html' && isIndex));
    const activeHome = label === 'Home' && isActive;
    const activeStyle = (isActive && !activeHome) ? ' style="color:var(--green);"' : '';

    // Home on index.html gets smooth scroll
    const onclickAttr = (label === 'Home' && isIndex)
      ? ' onclick="window.scrollTo({top:0,behavior:\'smooth\'});return false;"'
      : '';

    return '<li><a href="' + href + '"' + activeStyle + onclickAttr + '>' + label + '</a></li>';
  }).join('\n      ');

  // Build the full nav-logo link
  const logoHref = isIndex ? '#' : 'index.html';
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

  // Scroll handler for nav shadow
  window.addEventListener('scroll', function () {
    var nav = document.getElementById('navbar');
    if (nav) {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }
  });
})();
