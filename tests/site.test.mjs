import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {ovenTravel} from '../oven-scroll.mjs';
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
test('served photos are responsive, attributed and explicitly illustrative',()=>{
 for(const name of pages)for(const [img] of read(name).matchAll(/<img\b[^>]+>/g)){
  assert.match(img,/alt="[^"]+"/);
  assert.match(img,/width="\d+"/);
  assert.match(img,/height="\d+"/);
 }
 assert.match(read('photography.html'),/not photos of Cascarino’s actual food/);
 for(const credit of ['Nikita Krasnov','Dario Garcia'])assert.ok(read('photography.html').includes(credit));
 assert.deepEqual(fs.readdirSync(build+'assets').filter(x=>x.endsWith('.webp')).sort(),['logo.webp','print-slice-1100.webp','print-slice-640.webp','print-table-1560.webp','print-table-720.webp']);
 for(const [,srcset] of read('index.html').matchAll(/srcset="([^"]+)"/g))
  for(const candidate of srcset.split(','))assert.ok(fs.existsSync(build+candidate.trim().split(/\s+/)[0]));
});
test('site is legible without scroll motion or decorative arrows',()=>{
 const css=read('styles.css');assert.match(css,/prefers-reduced-motion/);assert.match(css,/:focus-visible/);
 for(const name of pages)assert.doesNotMatch(read(name),/[↓↗↑←→]/);
 assert.doesNotMatch(css,/scroll-snap|animation-timeline/);
});

test('native scroll reveals the second photo with bounded, reversible movement',()=>{
 assert.ok(Math.abs(ovenTravel(-1).door)===0);
 assert.ok(ovenTravel(.4).door < -30 && ovenTravel(.4).door > -80);
 assert.equal(ovenTravel(.9).door,-103);
 assert.equal(ovenTravel(2).photo,-3.4);
 const css=read('styles.css'), js=read('oven-scroll.mjs');
 assert.match(css,/\.has-oven-motion \.oven-frame\{position:sticky/);
 assert.match(css,/translateX\(var\(--door-shift/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.doesNotMatch(js,/scale\(|setInterval|preventDefault/);
 assert.match(read('index.html'),/class="oven-door" aria-hidden="true"/);
});
