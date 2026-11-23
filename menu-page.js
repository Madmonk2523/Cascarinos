'use strict';

(() => {
  const input = document.getElementById('menu-query');
  const reset = document.getElementById('menu-reset');
  const count = document.getElementById('menu-count');
  const empty = document.getElementById('menu-empty');
  const search = document.querySelector('.menu-search');
  const categories = Array.from(document.querySelectorAll('.menu-category'), section => {
    const group = section.querySelector('h2').textContent;
    return {
      section,
      items: Array.from(section.querySelectorAll('li'), item => ({
        item, text: (item.textContent + ' ' + group).toLocaleLowerCase()
      }))
    };
  });
  if (!input || !reset || !count || !empty || !search || !categories.length) return;

  function showResults() {
    const words = input.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    let total = 0;
    for (const { section, items } of categories) {
      let found = 0;
      for (const { item, text } of items) {
        const visible = words.every(word => text.includes(word));
        item.hidden = !visible;
        if (visible) found++;
      }
      section.hidden = found === 0;
      total += found;
    }
    reset.hidden = !input.value;
    empty.hidden = total !== 0;
    count.textContent = words.length ? `${total} ${total === 1 ? 'dish' : 'dishes'} found` : '';
  }

  input.addEventListener('input', showResults);
  reset.addEventListener('click', () => {
    input.value = '';
    showResults();
    input.focus();
  });
  for (const link of document.querySelectorAll('.menu-jump a')) {
    link.addEventListener('click', () => {
      input.value = '';
      showResults();
      const heading = document.getElementById(link.hash.slice(1))?.querySelector('h2');
      heading?.focus({preventScroll:true});
    });
  }
  search.hidden = false;
  showResults();
})();
