// Scroll position, not elapsed clock time, is the film's playback head.
const clamp = n => Math.max(0, Math.min(1, n));
const smooth = n => { const x = clamp(n); return x * x * (3 - 2 * x); };
export const FILM_SECONDS = 5;
const CAPTURE_FPS = 24;
export function filmFrame(progress) {
  const elapsed = FILM_SECONDS * clamp(progress);
  return {
    opacity: smooth((elapsed - .5) / .64),
    shotProgress: clamp((elapsed - .5) / (FILM_SECONDS - .5))
  };
}

function installFilm(sequence) {
  const stage = sequence.querySelector('.cover');
  const film = sequence.querySelector('[data-cover-film]');
  if (!stage || !film || !film.canPlayType('video/mp4; codecs="avc1.4d401f"')) return;
  const mobile = matchMedia('(max-width: 760px)');
  const allowed = matchMedia('(prefers-reduced-motion: no-preference) and (min-height: 540px)');
  let raf = 0;
  let near = true;
  let loaded = false;
  let loading = null;
  let failed = false;
  let initialFrame = false;
  let mediaUrl = null;
  let active = false;
  let deadline = 0;

  function paint() {
    raf = 0;
    if (!active || !near) return;
    const rect = sequence.getBoundingClientRect();
    const travel = rect.height - stage.getBoundingClientRect().height;
    const stageTop = parseFloat(getComputedStyle(stage).top) || 0;
    const {opacity, shotProgress} = filmFrame(travel > 0 ? (stageTop - rect.top) / travel : 0);
    if (!Number.isFinite(film.duration) || film.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
    const last = Math.max(0, Math.ceil(film.duration * CAPTURE_FPS) - 1);
    const next = Math.round(shotProgress * last) / CAPTURE_FPS;
    if (initialFrame || !film.seeking) film.style.opacity = opacity.toFixed(4);
    if (!film.seeking && Math.abs(next - film.currentTime) > 1 / (CAPTURE_FPS * 2)) film.currentTime = next;
    if (!film.seeking) initialFrame = true;
  }

  function schedule() {
    if (active && near && !raf) raf = requestAnimationFrame(paint);
  }

  function fits() {
    if (!mobile.matches) return true;
    // Leave room for the actual text and buttons at the visitor's font size.
    // On short screens the ordinary cover remains a normal, scrollable block.
    const copy = stage.querySelector('.cover-copy');
    const copyHeight = copy?.getBoundingClientRect().height ?? 0;
    const rootFont = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const dock = document.querySelector('.mobile-tools')?.getBoundingClientRect().height ?? 0;
    const header = document.querySelector('.site-header');
    const safeTop = header ? parseFloat(getComputedStyle(header).paddingTop) || 0 : 0;
    const available = Math.min(innerHeight, window.visualViewport?.height ?? innerHeight);
    return available >= safeTop + copyHeight + 10 * rootFont + Math.max(62, dock) + 18;
  }

  function sync() {
    const wasActive = active;
    active = allowed.matches && fits() && !failed && !navigator.connection?.saveData &&
      CSS.supports('position','sticky') && CSS.supports('height','100svh');
    sequence.classList.toggle('has-cover-motion', active);
    if (!active) {
      loading?.abort();
      loading = null;
      clearTimeout(deadline);
      film.style.opacity = '0';
      return;
    }
    if (!wasActive && film.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      deadline = setTimeout(() => {
        if (film.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) { failed = true; sync(); }
      }, 7000);
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
          mediaUrl = URL.createObjectURL(blob);
          film.src = mediaUrl;
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
  film.addEventListener('loadeddata', () => clearTimeout(deadline));
  addEventListener('pagehide', event => { if (!event.persisted && mediaUrl) URL.revokeObjectURL(mediaUrl); });
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
  document.fonts?.ready.then(sync);
  if ('ResizeObserver' in window) {
    const copy = stage.querySelector('.cover-copy');
    if (copy) new ResizeObserver(sync).observe(copy);
  }
  sync();
}
if (typeof document !== 'undefined') {
  const section = document.querySelector('[data-cover-sequence]');
  if (section) installFilm(section);
}
