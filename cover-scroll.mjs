// Scroll position, not elapsed clock time, is the film's playback head.
const clamp = n => Math.max(0, Math.min(1, n));
const smooth = n => { const x = clamp(n); return x * x * (3 - 2 * x); };
export const FILM_SECONDS = 5;
const CAPTURE_FPS = 20;
export function filmFrame(progress) {
  const elapsed = FILM_SECONDS * clamp(progress);
  return {
    pan: 50 + 2.6 * smooth(elapsed / 2.2),
    opacity: smooth((elapsed - 1.28) / .87),
    shotProgress: clamp((elapsed - 1.28) / (FILM_SECONDS - 1.28))
  };
}

function installFilm(sequence) {
  const stage = sequence.querySelector('.cover');
  const film = sequence.querySelector('[data-cover-film]');
  if (!stage || !film || !film.canPlayType('video/mp4; codecs="avc1.4d401f"')) return;
  const allowed = matchMedia('(prefers-reduced-motion: no-preference) and (min-height: 540px)');
  let raf = 0;
  let near = true;
  let loaded = false;
  let loading = null;
  let failed = false;
  let initialFrame = false;
  let active = false;

  function paint() {
    raf = 0;
    if (!active || !near) return;
    const rect = sequence.getBoundingClientRect();
    const travel = rect.height - stage.getBoundingClientRect().height;
    const {pan, opacity, shotProgress} = filmFrame(travel > 0 ? -rect.top / travel : 0);
    stage.style.setProperty('--film-pan', pan.toFixed(3) + '%');
    if (!Number.isFinite(film.duration) || film.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
    const last = Math.max(0, Math.ceil(film.duration * CAPTURE_FPS) - 1);
    const next = Math.round(shotProgress * last) / CAPTURE_FPS;
    if (initialFrame || !film.seeking) film.style.opacity = opacity.toFixed(4);
    if (!film.seeking && Math.abs(next - film.currentTime) > .019) film.currentTime = next;
    if (!film.seeking) initialFrame = true;
  }

  function schedule() {
    if (active && near && !raf) raf = requestAnimationFrame(paint);
  }

  function sync() {
    active = allowed.matches && !failed && !navigator.connection?.saveData && CSS.supports('position','sticky');
    sequence.classList.toggle('has-cover-motion', active);
    if (!active) {
      loading?.abort();
      loading = null;
      stage.style.removeProperty('--film-pan');
      film.style.opacity = '0';
      return;
    }
    if (!loaded && !loading) {
      const controller = new AbortController();
      loading = controller;
      // The small local clip is buffered once so backward seeks work even when
      // a static server does not provide byte-range responses.
      fetch(film.dataset.src, {signal:controller.signal})
        .then(response => {
          if (!response.ok) throw new Error('Film unavailable');
          return response.blob();
        })
        .then(blob => {
          if (loading !== controller || !active) return;
          if (!blob.size) throw new Error('Film file empty');
          loaded = true;
          film.defaultMuted = true;
          film.muted = true;
          film.preload = 'auto';
          const url = URL.createObjectURL(blob);
          film.addEventListener('loadeddata', () => URL.revokeObjectURL(url), {once:true});
          film.src = url;
        })
        .catch(error => {
          if (error.name !== 'AbortError' && loading === controller) {
            failed = true;
            sync();
          }
        })
        .finally(() => { if (loading === controller) loading = null; });
    }
    schedule();
  }

  for (const event of ['loadeddata','canplay','seeked']) film.addEventListener(event, schedule);
  film.addEventListener('error', () => { failed = true; sync(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      near = entry.isIntersecting;
      if (near) schedule();
    }, {rootMargin:'120px 0px'}).observe(sequence);
  }
  allowed.addEventListener?.('change', sync);
  navigator.connection?.addEventListener?.('change', sync);
  addEventListener('resize', sync, {passive:true});
  addEventListener('scroll', schedule, {passive:true});
  sync();
}
if (typeof document !== 'undefined') {
  const section = document.querySelector('[data-cover-sequence]');
  if (section) installFilm(section);
}
