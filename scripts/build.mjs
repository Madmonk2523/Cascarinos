import {mkdir,rm,copyFile,cp} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});await mkdir('dist',{recursive:true});
for(const file of ['index.html','menu.html','privacy.html','accessibility.html','styles.css','script.js','robots.txt'])await copyFile(file,`dist/${file}`);
await cp('assets','dist/assets',{recursive:true});console.log('Static build ready: dist');
