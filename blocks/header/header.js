export default function decorate(block) {
  const rows = [...block.children];

  // Every row is now an equal-status child: either a "header-brand" item
  // (contains an image/picture field) or a "header-nav-item" (text + link).
  // Classify by content rather than position, since either order is valid.
  const brandRows = rows.filter((row) => row.querySelector('picture, img'));
  const brandRow = brandRows[0]; // guard: only render the first Brand, in
  // case an author adds more than one (component-filters.json can't cap
  // the count of a given child type, so this is enforced defensively here)
  brandRows.slice(1).forEach((extra) => extra.remove());
  const navRows = rows.filter((row) => row !== brandRow && !brandRows.includes(row));

  // --- Brand / logo ---------------------------------------------------
  if (brandRow) {
    brandRow.classList.add('header-brand');

    const picture = brandRow.querySelector('picture');
    const existingLink = brandRow.querySelector('a');
    const homeHref = existingLink ? existingLink.getAttribute('href') : '/';

    if (picture && !brandRow.querySelector('.header-brand-link')) {
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
  // extracting their text/href into new nodes, so aue attributes survive.
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Main');
  const ul = document.createElement('ul');

  navRows.forEach((row) => {
    row.classList.add('header-nav-item');

    const cells = [...row.children];
    const textCell = cells[0]; // "text" field
    const linkCell = cells[1]; // "aem-content" field (renders as <a href="...">url</a>)
    const anchor = linkCell?.querySelector('a');
    const label = textCell?.textContent?.trim();

    if (anchor && label) {
      // Use the authored text as the visible label instead of the raw URL.
      // The href (tracked by aue for the "link" field) is left untouched.
      anchor.textContent = label;
    }

    // Keep the original text-field div in the DOM (preserves its aue
    // attributes / inline-edit target) but hide it visually now that its
    // content has been merged into the anchor above.
    if (textCell) textCell.classList.add('header-nav-item-label');

    const li = document.createElement('li');
    li.append(row);
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