export default function decorate(block) {
  // Row 0 = the "header" model fields (logo, logoAlt, logoLink)
  // Rows 1..n = the repeatable "header-nav-item" children (text, link)
  const rows = [...block.children];
  const [logoRow, ...navRows] = rows;

  // --- Brand / logo -------------------------------------------------
  const brand = document.createElement('div');
  brand.className = 'header-brand';

  if (logoRow) {
    const picture = logoRow.querySelector('picture');
    const img = logoRow.querySelector('img');
    const link = logoRow.querySelector('a');
    const homeHref = link ? link.getAttribute('href') : '/';

    const brandLink = document.createElement('a');
    brandLink.href = homeHref || '/';
    brandLink.setAttribute('aria-label', 'Home');

    if (picture) {
      brandLink.append(picture);
    } else if (img) {
      brandLink.append(img);
    }

    brand.append(brandLink);
  }

  // --- Navigation -----------------------------------------------------
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Main');

  const ul = document.createElement('ul');

  navRows.forEach((row) => {
    const cells = [...row.children];
    // Expected order per model: [text, link]
    const textCell = cells[0];
    const linkCell = cells[1];

    const existingLink = row.querySelector('a');
    const href = existingLink
      ? existingLink.getAttribute('href')
      : linkCell?.textContent?.trim();
    const label = existingLink
      ? existingLink.textContent.trim()
      : textCell?.textContent?.trim();

    if (!label) return;

    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = href || '#';
    a.textContent = label;
    li.append(a);
    ul.append(li);
  });

  nav.append(ul);

  // --- Mobile toggle ---------------------------------------------------
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

  // --- Assemble ---------------------------------------------------------
  block.textContent = '';
  block.append(brand, nav, navToggle);
}