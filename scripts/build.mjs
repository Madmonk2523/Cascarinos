import {mkdir,rm,copyFile} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});
await mkdir('dist/assets',{recursive:true});
for(const file of ['index.html','menu.html','privacy.html','accessibility.html','photography.html','styles.css','menu.css','menu-page.js','oven-scroll.mjs','robots.txt']){
  await copyFile(file,`dist/${file}`);
}
for(const asset of ['favicon.svg','logo.webp','print-table-720.webp','print-table-1560.webp','print-slice-640.webp','print-slice-1100.webp','cormorant.woff2','cormorant-italic.woff2','LICENSE-cormorantgaramond.txt']){
  await copyFile(`assets/${asset}`,`dist/assets/${asset}`);
}
console.log('Static build ready: dist');
