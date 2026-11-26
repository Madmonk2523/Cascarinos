import {mkdir,rm,copyFile} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});
await mkdir('dist/assets',{recursive:true});
for(const file of ['index.html','menu.html','privacy.html','accessibility.html','photography.html','styles.css','menu.css','menu-page.js','cover-scroll.mjs','robots.txt']){
  await copyFile(file,`dist/${file}`);
}
for(const asset of ['favicon.svg','logo.webp','table-pizza-560.webp','table-pizza-1100.webp','pizza-finishing-film.mp4','pizza-film-frames.webp','cormorant.woff2','cormorant-italic.woff2','LICENSE-cormorantgaramond.txt']){
  await copyFile(`assets/${asset}`,`dist/assets/${asset}`);
}
console.log('Static build ready: dist');
