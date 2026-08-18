export default function decorate(block) {
  // Row 0 = the "header" model fields (logo, logoAlt, logoLink)
  // Rows 1..n = the repeatable "header-nav-item" children (text, link)
  const rows = [...block.children];
  const [logoRow, ...navRows] = rows;

  // --- Brand / logo ---------------------------------------------------
  // Keep the original row element (preserves its aue attributes) and just
  // tag it with a class for styling + wrap the picture in a home link.
  if (logoRow) {
    logoRow.classList.add('header-brand');

    const picture = logoRow.querySelector('picture');
    const existingLink = logoRow.querySelector('a');
    const homeHref = existingLink ? existingLink.getAttribute('href') : '/';

    if (picture && !logoRow.querySelector('.header-brand-link')) {
      const brandLink = document.createElement('a');
      brandLink.className = 'header-brand-link';
      brandLink.href = homeHref || '/';
      brandLink.setAttribute('aria-label', 'Home');
      picture.replaceWith(brandLink);
      brandLink.append(picture);
    }
  }

  // --- Navigation -------------------------------------------------------
  // Wrap the ORIGINAL nav-item rows in <li> elements rather than
  // extracting their text/href into new nodes. This keeps each row's
  // aue-resource / aue-prop attributes intact for authoring.
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Main');
  const ul = document.createElement('ul');

  navRows.forEach((row) => {
    row.classList.add('header-nav-item');
    const li = document.createElement('li');
    li.append(row); // moves the original row (and its aue attrs) into the li
    ul.append(li);
  });

  nav.append(ul);
  block.append(nav);

  // --- Mobile toggle ------------------------------------------------------
  const navToggle = document.createElement('button');
  navToggle.className = 'header-nav-toggle';
  navToggle.setAttribute('aria-label', 'Open navigation');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.innerHTML = '<span></span><span></span><span></span>';

  navToggle.addEventListener('click', () => {
    const isOpen = block.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });

  block.append(navToggle);
}