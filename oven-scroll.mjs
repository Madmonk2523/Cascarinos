const clamp = n => Math.max(0, Math.min(1, n));
export function ovenTravel(progress) {
  const x = clamp((progress - .04) / .76);
  const ease = x * x * (3 - 2 * x);
  return { door: -103 * ease, photo: 3.4 * (1 - 2 * ease) };
}

function enableStory(story) {
  const frame = story.querySelector('.oven-frame');
  const photo = frame?.querySelector('img');
  if (!frame || !photo) return;
  const desktop = matchMedia('(prefers-reduced-motion: no-preference) and (min-width:681px) and (min-height:580px)');
  const phone = matchMedia('(prefers-reduced-motion: no-preference) and (max-width:680px) and (min-height:560px)');
  let active = false;
  let drawId = 0;
  function draw() {
    drawId = 0;
    if (!active) return;
    const range = story.offsetHeight - frame.offsetHeight;
    const pin = parseFloat(getComputedStyle(frame).top) || 0;
    if (range <= 0) return;
    const {door, photo} = ovenTravel((pin - story.getBoundingClientRect().top) / range);
    frame.style.setProperty('--door-shift', door.toFixed(2) + '%');
    frame.style.setProperty('--photo-shift', photo.toFixed(2) + '%');
  }
  function queue() {
    if (active && !drawId) drawId = requestAnimationFrame(draw);
  }
  function sync() {
    active = (desktop.matches || phone.matches) && photo.complete && photo.naturalWidth > 0;
    story.classList.toggle('has-oven-motion', active);
    queue();
  }
  photo.addEventListener('load', sync);
  desktop.addEventListener('change', sync);
  phone.addEventListener('change', sync);
  addEventListener('scroll', queue, {passive:true});
  addEventListener('resize', queue, {passive:true});
  sync();
}

function animateSlip(slip) {
  const preference = matchMedia('(prefers-reduced-motion: no-preference)');
  const section = slip.closest('section');
  let id = 0;
  function draw() {
    id = 0;
    if (!preference.matches) return;
    const {top,height} = section.getBoundingClientRect();
    const progress = clamp((innerHeight - top) / Math.min(height, innerHeight * .72));
    const remaining = (1 - progress) ** 2;
    slip.style.setProperty('--slip-travel', (36 * remaining).toFixed(1) + 'px');
    slip.style.setProperty('--slip-angle', (3 - 8 * remaining).toFixed(1) + 'deg');
  }
  function queue() {
    if (preference.matches && !id) id = requestAnimationFrame(draw);
  }
  addEventListener('scroll',queue,{passive:true});
  addEventListener('resize',queue,{passive:true});
  preference.addEventListener('change',queue);
  queue();
}

if (typeof document !== 'undefined') {
  const story = document.querySelector('[data-oven-story]');
  if (story) enableStory(story);
  const slip = document.querySelector('.order-slip');
  if (slip && slip.closest('section')) animateSlip(slip);
}
