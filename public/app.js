import { copy, profile, projects } from './content.js';
import { renderSite, projectDetails } from './render.js';
import { MeshScene } from './mesh.js';
const app=document.getElementById('app');
let lang='fr',activeFilter='all',expanded=false,scenes=[],controller,revealObserver,navObserver,opener,savedLang;
try{savedLang=localStorage.getItem('portfolio-language');}catch{}
const urlLang=new URLSearchParams(location.search).get('lang');
if(urlLang==='en'||urlLang==='fr')lang=urlLang;else if(savedLang==='en'||savedLang==='fr')lang=savedLang;

function mount(nextLang=lang){
  const oldY=window.scrollY;scenes.forEach(s=>s.destroy());scenes=[];controller?.abort();revealObserver?.disconnect();navObserver?.disconnect();
  lang=nextLang;const t=copy[lang];document.documentElement.lang=lang;document.title=t.title;
  document.querySelector('meta[name="description"]').content=t.description;
  document.querySelector('meta[property="og:title"]').content=t.title;
  document.querySelector('meta[property="og:description"]').content=t.description;
  document.querySelector('meta[property="og:locale"]').content=lang==='fr'?'fr_FR':'en_GB';
  app.innerHTML=renderSite(lang);document.body.classList.add('enhanced');
  controller=new AbortController();const options={signal:controller.signal};activeFilter='all';expanded=false;
  const dialog=document.getElementById('project-dialog'),menu=document.getElementById('main-nav'),menuButton=document.querySelector('.menu-toggle');
  function closeMenu(){menu.classList.remove('menu-open');menuButton.setAttribute('aria-expanded','false');}
  menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menu.classList.toggle('menu-open',open);},options);
  menu.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();},options);
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.classList.contains('menu-open')){closeMenu();menuButton.focus();}},options);
  document.addEventListener('click',event=>{if(!event.target.closest('.site-header'))closeMenu();},options);
  for(const button of document.querySelectorAll('[data-language]'))button.addEventListener('click',()=>{const next=button.dataset.language;if(next===lang)return;try{localStorage.setItem('portfolio-language',next);}catch{}const url=new URL(location.href);url.searchParams.set('lang',next);history.replaceState(null,'',url);mount(next);document.querySelector(`[data-language="${next}"]`).focus({preventScroll:true});},options);
  for(const button of document.querySelectorAll('[data-filter]'))button.addEventListener('click',()=>{activeFilter=button.dataset.filter;filterProjects();},options);
  document.getElementById('show-all-projects').addEventListener('click',()=>{expanded=!expanded;filterProjects();},options);
  for(const trigger of document.querySelectorAll('[data-project]'))trigger.addEventListener('click',event=>{event.preventDefault();const project=projects.find(p=>p.id===trigger.dataset.project);if(!project)return;opener=trigger;document.getElementById('dialog-content').innerHTML=projectDetails(project,lang);dialog.showModal();dialog.scrollTop=0;},options);
  document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close(),options);
  dialog.addEventListener('click',event=>{const r=dialog.getBoundingClientRect();if(event.target===dialog&&(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom))dialog.close();},options);
  dialog.addEventListener('close',()=>opener?.focus({preventScroll:true}),options);
  document.getElementById('copy-email').addEventListener('click',async()=>{const status=document.getElementById('copy-status');try{await navigator.clipboard.writeText(profile.email);status.textContent=t.copied;}catch{status.textContent=t.copyFailed;const range=document.createRange();range.selectNodeContents(document.querySelector('.email-link'));const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);}},options);
  const heroScene=new MeshScene(document.getElementById('hero-mesh')),featureScene=new MeshScene(document.getElementById('feature-mesh'),'tetra');scenes=[heroScene,featureScene];
  const rotateButton=document.querySelector('[data-rotation="hero"]'),rotateCheck=document.querySelector('[data-rotation="feature"]');rotateButton.setAttribute('aria-pressed',String(heroScene.playing));rotateCheck.checked=featureScene.playing;
  rotateButton.addEventListener('click',()=>{heroScene.setPlaying(!heroScene.playing);rotateButton.setAttribute('aria-pressed',String(heroScene.playing));},options);
  rotateCheck.addEventListener('change',()=>featureScene.setPlaying(rotateCheck.checked),options);
  document.getElementById('hero-mesh').addEventListener('motionpreference',event=>rotateButton.setAttribute('aria-pressed',String(event.detail)),options);
  document.getElementById('feature-mesh').addEventListener('motionpreference',event=>{rotateCheck.checked=event.detail;},options);
  document.querySelector('[data-point-mode]').addEventListener('click',event=>{const button=event.currentTarget,on=button.getAttribute('aria-pressed')!=='true';button.setAttribute('aria-pressed',String(on));heroScene.setMode(on?'points':'edges');},options);
  for(const input of document.querySelectorAll('[name="mesh-display"]'))input.addEventListener('change',()=>featureScene.setMode(input.value),options);
  const motion=!matchMedia('(prefers-reduced-motion: reduce)').matches;document.body.classList.toggle('motion-enabled',motion);
  if(motion&&'IntersectionObserver' in window){revealObserver=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.remove('pending-reveal');revealObserver.unobserve(entry.target);}},{rootMargin:'0px 0px 35px 0px',threshold:.03});for(const el of document.querySelectorAll('.reveal'))if(el.getBoundingClientRect().top>innerHeight){el.classList.add('pending-reveal');revealObserver.observe(el);}}
  if('IntersectionObserver' in window){navObserver=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting)for(const link of menu.querySelectorAll('a')){if(link.hash===`#${entry.target.id}`)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');}},{rootMargin:'-15% 0px -55% 0px',threshold:0});for(const id of ['top','projects','experience','education','singapore','contact'])navObserver.observe(document.getElementById(id));}
  filterProjects();window.scrollTo({top:oldY,behavior:'instant'});
}
function filterProjects(){
  const t=copy[lang];let count=0;
  for(const card of document.querySelectorAll('[data-project-card]')){const match=(activeFilter==='all'||card.dataset.category===activeFilter)&&(activeFilter!=='all'||expanded||card.dataset.extra!=='true');card.hidden=!match;if(match){count++;card.classList.remove('pending-reveal');}}
  const showOpen=activeFilter==='all'||activeFilter==='open';document.querySelector('[data-open-source]').hidden=!showOpen;if(showOpen)count+=2;
  for(const button of document.querySelectorAll('[data-filter]'))button.setAttribute('aria-pressed',String(button.dataset.filter===activeFilter));
  document.querySelector('.more-projects').hidden=activeFilter!=='all';
  const button=document.getElementById('show-all-projects');button.textContent=expanded?t.showLess:t.showAll;button.setAttribute('aria-expanded',String(expanded));
  document.getElementById('project-count').textContent=`${count} ${t.projectCount}`;
}
mount();
