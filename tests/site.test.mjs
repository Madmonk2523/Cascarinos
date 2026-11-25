import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {filmFrame, FILM_SECONDS} from '../cover-scroll.mjs';
const build='dist/';
const read=p=>fs.readFileSync(build+p,'utf8');
const pages=['index.html','menu.html','privacy.html','accessibility.html','photography.html'];
const toast='https://toast.app/r/cascarinos-brick-oven-pizzeria-ristorante-152-59-10th-ave/order';
test('review pages have one heading, mobile metadata and noindex',()=>{
 for(const name of pages){const html=read(name);assert.match(html,/<html lang="en">/);assert.match(html,/name="viewport"/);assert.match(html,/noindex,nofollow/);assert.equal((html.match(/<h1\b/g)||[]).length,1,name);}
 assert.match(read('robots.txt'),/Disallow: \//);
});
test('every local link or fragment resolves in the built site',()=>{
 for(const name of pages){const html=read(name);for(const [,href] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
 if(/^(https?:|tel:|mailto:)/.test(href))continue;
 const [file,fragment]=href.split('#');const path=file||name;assert.ok(fs.existsSync(build+path),href);if(fragment)assert.ok(read(path).includes('id="'+fragment+'"'),href);
 }}
});
test('ordering points only to current Toast and the address matches',()=>{
 for(const name of ['index.html','menu.html']){const html=read(name);assert.ok(html.includes(toast));assert.ok(html.includes('152-59 10th Avenue'));assert.ok(html.includes('tel:+17187464370'));assert.doesNotMatch(html,/slicelife|cascarinosmenu\.com|<form\b/i);}
 assert.match(read('index.html'),/See Toast for current pickup and delivery hours/);
});
test('menu items are present without JavaScript',()=>{
 const html=read('menu.html');for(const c of ['pizza','pasta','starters','desserts'])assert.ok(html.includes('id="'+c+'"'));
 for(const dish of ['Grandma','Penne Vodka','Tiramisu'])assert.ok(html.includes(dish));
 assert.doesNotMatch(html,/\$\d+/);
});
test('every image has an alt and intrinsic dimensions; photo credits disclose intent',()=>{
 for(const name of pages){for(const [img] of read(name).matchAll(/<img\b[^>]+>/g)){if(img.includes("data-cover-scene")){assert.match(img,/alt="" aria-hidden="true"/);}else{assert.match(img,/alt="[^"]+"/);}assert.match(img,/width="\d+"/);assert.match(img,/height="\d+"/);}}
 assert.match(read('photography.html'),/not footage or photography of Cascarino’s actual food/);
 assert.match(read('photography.html'),/Anhelina Vasylyk/);
 assert.match(read('photography.html'),/Rene Strgar/);
 assert.match(read('index.html'),/Cheese pizza on a wooden table, illustrative photograph/);
 assert.deepEqual(fs.readdirSync(build+'assets').filter(x=>/\.(webp|mp4)$/.test(x)).sort(), ['logo.webp','pizza-finishing-film.mp4','table-pizza-1100.webp','table-pizza-560.webp']);
 assert.ok(fs.statSync(build+'assets/pizza-finishing-film.mp4').size < 1150000);
 for(const [,srcset] of read('index.html').matchAll(/srcset="([^"]+)"/g)){
   for(const candidate of srcset.split(','))assert.ok(fs.existsSync(build+candidate.trim().split(/\s+/)[0]));
 }
});
test('site is legible without scroll motion or decorative arrows',()=>{
 const css=read('styles.css');assert.match(css,/prefers-reduced-motion/);assert.match(css,/:focus-visible/);
 for(const name of pages)assert.doesNotMatch(read(name),/[↓↗↑←→]/);
 assert.doesNotMatch(css,/scroll-snap|animation-timeline/);
});

test('the five-second cover edits from the opening still to one continuous moving shot',()=>{
 assert.equal(FILM_SECONDS,5);
 assert.deepEqual(filmFrame(-1),{opacity:0,shotProgress:0});
 assert.ok(filmFrame(.16).opacity>0 && filmFrame(.16).opacity<1);
 assert.ok(filmFrame(.75).shotProgress > filmFrame(.5).shotProgress);
 assert.deepEqual(filmFrame(1),{opacity:1,shotProgress:1});
 const html=read('index.html');
 const video=html.match(/<video\b[^>]*>/g);
 assert.equal(video?.length,1);
 assert.match(video[0],/muted playsinline/);
 assert.doesNotMatch(video[0],/autoplay| loop| src=/);
 for(const [,file] of html.matchAll(/data-src="([^"]+)"/g))assert.ok(fs.existsSync(build+file));
 assert.doesNotMatch(read('cover-scroll.mjs'),/scale\(|setInterval|preventDefault|\.play\(/);
 assert.match(read('styles.css'),/has-cover-motion \.cover\{position:sticky/);
});

test('touch layouts account for safe areas and allow a direct exit from the film',()=>{
 for (const page of ['index.html','menu.html']) assert.match(read(page),/viewport-fit=cover/);
 assert.match(read('index.html'),/class="skip-cover" href="#after-cover">Skip film/);
 assert.match(read('styles.css'),/--mobile-dock:calc\(62px \+ env\(safe-area-inset-bottom/);
 assert.match(read('styles.css'),/orientation:landscape/);
 assert.match(read('cover-scroll.mjs'),/allowed\.matches && fits\(\)/);
});
