'use strict';
const categories={"pizza": [["12\" Cheese", ""], ["12\" Margherita", ""], ["12\" Pepperoni", ""], ["12\" Buffalo Chicken", ""], ["Cascarinos Famous Grandma", ""], ["MVP Grandma", ""], ["Vodka Grandma", ""], ["Upside Down Sicilian", ""]], "pasta": [["Baked Ziti", ""], ["Cheese Ravioli", ""], ["Gnocchi Sorrentino", ""], ["Homemade Lasagna", ""], ["Lobster Ravioli Vodka", ""], ["Penne Vodka", ""], ["Rigatoni Florentine", ""], ["Spaghetti & Meatballs", ""]], "sides": [["Arancini Rice Ball", ""], ["Bruschetta", ""], ["Calamari Fritti", ""], ["Clams Oreganata", ""], ["Eggplant Rollatini", ""], ["Mozzarella Sticks", ""]], "desserts": [["Cannoli", ""], ["Chocolate Fudge Cake", ""], ["NY Cheesecake", ""], ["Pistachio Ricotta Cake", ""], ["Tartufo", ""], ["Tiramisu", ""]]};
const list=document.getElementById('menu-list');
const search=document.getElementById('menu-search');
const clearSearch=document.getElementById('clear-search');
const status=document.getElementById('menu-status');
const labels={pizza:'Pizza',pasta:'Pasta',sides:'Starters',desserts:'Desserts'};
let selectedCategory='pizza';
function menuResults(category,query=''){
 const words=query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
 return (words.length?Object.entries(categories):[[category,categories[category]||[]]])
 .flatMap(([key,items])=>items.map(item=>({title:item[0],description:item[1],category:key})))
 .filter(item=>words.every(word=>(item.title+' '+labels[item.category]).toLocaleLowerCase().includes(word)));
}
function showMenu(category){
 if(!list||!categories[category])return;
 selectedCategory=category;
 const query=search?.value.trim()||'';
 const results=menuResults(category,query);
 const photo=document.getElementById('menu-image');
 if(photo){const photos={pizza:['assets/menu-pizza.webp','Illustrative AI-created cheese pizza with a blistered crust','50% 55%'],pasta:['assets/pasta.webp','Illustrative photograph of tomato pasta','50% 50%'],sides:['assets/dough.webp','Illustrative photograph of dough preparation','50% 40%'],desserts:['assets/tiramisu.webp','Illustrative photograph of tiramisu','30% 50%']};const item=photos[category];photo.src=item[0];photo.alt=item[1];photo.style.objectPosition=item[2];}
 const elements=results.map(item=>{const article=document.createElement('article');article.className='menu-item';const title=document.createElement('h3');title.textContent=item.title;article.append(title);if(query||item.description){const description=document.createElement('p');description.textContent=query?labels[item.category]:item.description;article.append(description);}return article;});
 if(!elements.length){const empty=document.createElement('p');empty.className='menu-empty';empty.textContent='No matches in this selection. Try another word, browse a category, or see the full menu on Toast.';elements.push(empty);}
 list.replaceChildren(...elements);
 if(status)status.textContent=query?`${results.length} ${results.length===1?'match':'matches'} across all categories`:`${labels[category]} · ${results.length} selections`;
 if(clearSearch)clearSearch.hidden=!query;
 document.querySelectorAll('.filter').forEach(button=>{const active=!query&&button.dataset.category===category;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
}
document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{if(search)search.value='';showMenu(button.dataset.category);if(!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches){list.querySelectorAll?.('.menu-item').forEach((el,i)=>el.animate?.([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:350,delay:i*35,fill:'backwards',easing:'ease-out'}));}}));
if(search){document.querySelector('.menu-search').hidden=false;search.addEventListener('input',()=>showMenu(selectedCategory));clearSearch?.addEventListener('click',()=>{search.value='';showMenu(selectedCategory);search.focus();});}
showMenu('pizza');
const toggle=document.querySelector('.menu-toggle'),nav=document.getElementById('mobile-nav');
function closeMenu(restoreFocus=false){if(!toggle||!nav)return;toggle.setAttribute('aria-expanded','false');nav.hidden=true;if(restoreFocus)toggle.focus();}
if(toggle&&nav){toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));nav.hidden=open;});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>closeMenu()));document.addEventListener('keydown',event=>{if(event.key==='Escape' && !nav.hidden)closeMenu(true);});document.addEventListener('click',event=>{if(!event.target.closest('.header'))closeMenu();});window.matchMedia('(min-width: 761px)').addEventListener('change',event=>{if(event.matches)closeMenu();});}
const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();


// Progressive enhancement only: content is visible before and without JavaScript.
const motion=window.matchMedia?.('(prefers-reduced-motion: reduce)');
if(!motion?.matches && typeof IntersectionObserver !== 'undefined'){
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   const el=entry.target;
   if(typeof el.animate!=='function')return;
   if(el.matches('.editorial-photo')){
    el.animate([{clipPath:'inset(0 0 15% 0)',transform:'translateY(28px)'},{clipPath:'inset(0 0 0% 0)',transform:'translateY(0)'}],{duration:1050,easing:'cubic-bezier(.16,1,.3,1)'});
   }else{
    const parts=el.querySelectorAll('h2,p,address,.button,.text-link');
    parts.forEach((part,i)=>part.animate([{opacity:.15,transform:'translateY(36px)'},{opacity:1,transform:'translateY(0)'}],{duration:800,delay:Math.min(i*70,280),easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'}));
   }
   observer.unobserve(el);
  });
 },{threshold:.12});
 document.querySelectorAll('.section-heading,.intro-copy,.table-copy,.visit-details,.editorial-photo,.final-cta').forEach(el=>observer.observe(el));
}

// Honor preference changes even after reveal animations have started.
motion?.addEventListener?.('change',event=>{if(event.matches){document.getAnimations?.().forEach(animation=>animation.cancel());}});
