// Scroll position, not elapsed clock time, is the film's playback head.
const clamp = n => Math.max(0, Math.min(1, n));
const smooth = n => { const x = clamp(n); return x * x * (3 - 2 * x); };
export const FILM_SECONDS = 5;
export const MOBILE_FRAME_COUNT = 42;
const CAPTURE_FPS = 24;
const COLUMNS = 7;

export function filmFrame(progress) {
  const elapsed = FILM_SECONDS * clamp(progress);
  return {
    opacity: smooth((elapsed - .5) / .64),
    shotProgress: clamp((elapsed - .5) / (FILM_SECONDS - .5))
  };
}
export function mobileFrame(progress) {
  const {opacity, shotProgress} = filmFrame(progress);
  return {opacity, index: Math.round(shotProgress * (MOBILE_FRAME_COUNT - 1))};
}

function installFilm(sequence) {
  const stage = sequence.querySelector('.cover');
  const photo = sequence.querySelector('.cover-photo');
  const video = sequence.querySelector('[data-cover-film]');
  const canvas = sequence.querySelector('[data-cover-frames]');
  if (!stage || !photo || !video || !canvas) return;
  const touch = matchMedia('(max-width: 760px), (hover: none) and (pointer: coarse)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const tall = matchMedia('(min-height: 540px)');
  const connection = navigator.connection;
  let mode = '', raf = 0, atlas, ctx, painted = -1, requested = false;
  let videoFailed = false, videoReady = false, deadline = 0, near = true;

  function paint() {
    raf = 0;
    if (!near) return;
    if (mode === 'frames') {
      if (!atlas || !ctx) return;
      // Keep the whole animation inside the image's time on screen. The page
      // never adds scroll distance or changes height as the media loads.
      const rect = photo.getBoundingClientRect();
      const range = Math.max(95, rect.height * .70);
      const {index, opacity} = mobileFrame(scrollY / range);
      if (index !== painted) {
        const {width, height} = canvas;
        ctx.drawImage(atlas, (index % COLUMNS) * width, Math.floor(index / COLUMNS) * height,
          width, height, 0, 0, width, height);
        painted = index;
      }
      canvas.style.opacity = opacity.toFixed(4);
    } else if (mode === 'video' && videoReady) {
      const rect = sequence.getBoundingClientRect();
      // Don't move the content below a visitor if the video was slow to load.
      if (!sequence.classList.contains('has-cover-motion')) {
        if (rect.top < 0) return;
        sequence.classList.add('has-cover-motion');
      }
      const travel = sequence.offsetHeight - stage.offsetHeight;
      const {opacity, shotProgress} = filmFrame(travel > 0 ? -rect.top / travel : 0);
      if (!Number.isFinite(video.duration) || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
      const last = Math.max(0, Math.ceil(video.duration * CAPTURE_FPS) - 1);
      const next = Math.round(shotProgress * last) / CAPTURE_FPS;
      if (!video.seeking && Math.abs(next - video.currentTime) > 1 / (CAPTURE_FPS * 2)) video.currentTime = next;
      if (!video.seeking || opacity === 0) video.style.opacity = opacity.toFixed(4);
    }
  }
  function schedule() {
    if (mode && near && !raf) raf = requestAnimationFrame(paint);
  }
  function failVideo() {
    videoFailed = true;
    clearTimeout(deadline);
    refresh();
  }
  function refresh() {
    const next = reduced.matches || connection?.saveData ? ''
      : touch.matches ? 'frames'
      : tall.matches && !videoFailed && CSS.supports('position','sticky') &&
        CSS.supports('height','100svh') && video.canPlayType('video/mp4; codecs="avc1.4d401f"') ? 'video' : '';
    if (next !== mode) {
      mode = next;
      if (mode !== 'video') {
        sequence.classList.remove('has-cover-motion');
        video.style.opacity = '0';
      }
      if (mode !== 'frames') canvas.style.opacity = '0';
    }
    if (mode === 'frames' && !requested) {
      requested = true;
      ctx = canvas.getContext('2d', {alpha:false});
      if (!ctx) return;
      const img = new Image();
      img.onload = () => {
        if (img.naturalWidth !== canvas.width * COLUMNS ||
            img.naturalHeight !== canvas.height * (MOBILE_FRAME_COUNT / COLUMNS)) return;
        atlas = img;
        schedule();
      };
      img.src = canvas.dataset.src;
    } else if (mode === 'video' && !video.hasAttribute('src')) {
      video.defaultMuted = video.muted = true;
      video.preload = 'auto';
      video.src = video.dataset.src;
      deadline = setTimeout(() => { if (!videoReady) failVideo(); }, 7000);
    }
    schedule();
  }
  function readyVideo() {
    if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
    videoReady = true;
    clearTimeout(deadline);
    schedule();
  }
  for (const event of ['loadeddata','canplay']) video.addEventListener(event, readyVideo);
  video.addEventListener('seeked', schedule);
  video.addEventListener('error', failVideo);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      near = entry.isIntersecting;
      if (near) schedule();
    }, {rootMargin:'120px 0px'}).observe(sequence);
  }
  for (const mq of [touch, reduced, tall]) {
    if (mq.addEventListener) mq.addEventListener('change', refresh);
    else mq.addListener?.(refresh);
  }
  connection?.addEventListener?.('change', refresh);
  addEventListener('resize', schedule, {passive:true});
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('pageshow', refresh);
  refresh();
}

if (typeof document !== 'undefined') {
  const section = document.querySelector('[data-cover-sequence]');
  if (section) installFilm(section);
}
