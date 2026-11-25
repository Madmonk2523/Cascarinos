// The three independent photographs dissolve with native scroll, no playback loop.
const clamp = n => Math.max(0, Math.min(1, n));

function dissolve(progress, start, end) {
  const t = clamp((progress - start) / (end - start));
  return t * t * (3 - 2 * t);
}

export function coverMix(progress) {
  return [dissolve(progress, 0.07, 0.35), dissolve(progress, 0.49, 0.80)];
}

if (typeof document !== 'undefined') {
  const sequence = document.querySelector('[data-cover-sequence]');
  const stage = sequence?.querySelector('.cover');
  const scenes = [...(sequence?.querySelectorAll('[data-cover-scene]') ?? [])];
  const allowed = matchMedia('(prefers-reduced-motion: no-preference) and (min-height: 540px)');
  let initialized = false;
  let queued = false;
  let active = true;

  function paint() {
    queued = false;
    if (!sequence?.classList.contains('has-cover-motion')) return;
    const rect = sequence.getBoundingClientRect();
    const travel = rect.height - stage.getBoundingClientRect().height;
    const mix = coverMix(travel > 0 ? -rect.top / travel : 0);
    for (let i = 0; i < scenes.length; i++) {
      if (scenes[i].complete && scenes[i].naturalWidth) {
        scenes[i].style.opacity = mix[i].toFixed(4);
      }
    }
  }

  function schedule() {
    if (!active || queued) return;
    queued = true;
    requestAnimationFrame(paint);
  }

  function sync() {
    if (!sequence || !stage || scenes.length !== 2) return;
    if (!allowed.matches || !CSS.supports('position', 'sticky')) {
      sequence.classList.remove('has-cover-motion');
      for (const img of scenes) img.style.opacity = '0';
      return;
    }
    if (!initialized) {
      initialized = true;
      for (const img of scenes) {
        img.addEventListener('load', schedule);
        img.srcset = img.dataset.srcset;
        img.src = img.dataset.src;
      }
    }
    sequence.classList.add('has-cover-motion');
    schedule();
  }

  if (sequence && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      if (active) schedule();
    }, {rootMargin:'100px 0px'}).observe(sequence);
  }

  allowed.addEventListener?.('change', sync);
  addEventListener('resize', sync, {passive:true});
  addEventListener('scroll', schedule, {passive:true});
  sync();
}
