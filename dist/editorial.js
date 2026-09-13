const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const menu=$('.menu-toggle'),header=$('[data-header]'),nav=$('#site-nav'),mobile=matchMedia('(max-width:760px)');
function closeMenu(){header.classList.remove('menu-open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir menú');nav.inert=mobile.matches;}
closeMenu();mobile.addEventListener('change',closeMenu);
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';header.classList.toggle('menu-open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');nav.inert=mobile.matches&&!open;});
document.addEventListener('click',e=>{if(!header.contains(e.target))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
let frame=0;function scrollState(){const y=scrollY,range=document.documentElement.scrollHeight-innerHeight;header.classList.toggle('scrolled',y>30);$('.scroll-progress').style.transform=`scaleX(${range>0?Math.min(y/range,1):0})`;frame=0;}
addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(scrollState);},{passive:true});scrollState();
const normalize=s=>s.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'');let topic='all';
function filterArticles(){const query=normalize($('[data-search]').value.trim());let count=0;$$('[data-article]').forEach(card=>{const visible=(topic==='all'||card.dataset.category===topic)&&normalize(card.textContent).includes(query);card.hidden=!visible;if(visible)count++;});$('.journal-results').textContent=`${count} ${count===1?'historia':'historias'} para explorar.`;$('.journal-empty').hidden=count>0;}
$$('[data-topic]').forEach(button=>button.addEventListener('click',()=>{topic=button.dataset.topic;$$('[data-topic]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});filterArticles();}));
$('[data-search]')?.addEventListener('input',filterArticles);
