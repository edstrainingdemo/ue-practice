import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'testimonial-card';
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);

    const [quoteDiv, authorDiv, ratingDiv, featuredDiv] = [...li.children];

    if (quoteDiv) quoteDiv.className = 'testimonial-quote';
    if (authorDiv) authorDiv.className = 'testimonial-author';

    if (ratingDiv) {
      const rating = ratingDiv.textContent.trim();
      ratingDiv.className = 'testimonial-rating';
      ratingDiv.textContent = '\u2605'.repeat(Number(rating) || 0);
    }

    if (featuredDiv) {
      const isFeatured = featuredDiv.textContent.trim().toLowerCase() === 'true';
      if (isFeatured) li.classList.add('featured');
      featuredDiv.remove();
    }

    ul.append(li);
  });
  block.replaceChildren(ul);
}