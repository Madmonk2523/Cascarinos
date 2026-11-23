import {mkdir,rm,copyFile} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});
await mkdir('dist/assets',{recursive:true});
for(const file of ['index.html','menu.html','privacy.html','accessibility.html','photography.html','styles.css','menu.css','menu-page.js','robots.txt']){
  await copyFile(file,`dist/${file}`);
}
for(const asset of ['favicon.svg','logo.webp','oven.webp','menu-pizza.webp','penne-vodka.webp','catering-pasta.webp','tiramisu.webp']){
  await copyFile(`assets/${asset}`,`dist/assets/${asset}`);
}
console.log('Static build ready: dist');
