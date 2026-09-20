import { experiences, categories, providers, complementaryIds } from './catalog.js';
import { webhookUrl } from './config.js';
const $ =(selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const header = $('[data-header]');
const menu = $('.menu-toggle');
const nav = $('#site-nav');
const form = $('#interest-form');
const success = $('.success-state');
const detailDialog = $('.detail-dialog');
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const mobile = matchMedia('(max-width: 760px)');
let lastDialogTrigger;
let activeServiceId = null;
const serviceDrafts = new Map();
const selectedComplementIds = new Set();
const categoryLabel = id => categories.find(category => category.id === id)?.label || 'Experiencias';
const activeExperience = () => experiences.find(item => item.name === form.elements.experience.value);
const allFields = () => [...fields.map(name => form.elements[name]), ...$$('#service-brief input, #service-brief select')];

function closeMenu() {
  header.classList.remove('menu-open');
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Abrir menú');
  nav.inert = mobile.matches;
}
function syncMenu() { closeMenu(); }
menu.addEventListener('click', () => {
  const open = !header.classList.contains('menu-open');
  header.classList.toggle('menu-open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  nav.inert = !open && mobile.matches;
});
mobile.addEventListener('change', syncMenu);
syncMenu();
$$('.site-nav a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('click', event => { if (!header.contains(event.target)) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && header.classList.contains('menu-open')) { closeMenu(); menu.focus(); } });

const grid = $('#experience-grid');
function renderCatalog(filter = 'all') {
  const list = experiences.filter(item => filter === 'all' || item.categoryId === filter);
  grid.innerHTML = list.map(item => `<article class="experience-card" style="animation-delay:${Math.min(list.indexOf(item),4)*65}ms"><div class="card-interactive" data-tilt>
    <button class="card-photo-button" data-open-experience="${item.id}" aria-label="Abrir ficha: ${item.name}"><img src="./assets/${item.image}" alt="${item.alt}" width="1200" height="800" loading="lazy" decoding="async" style="object-position:${item.imagePosition}"><span class="card-badge">${item.badge}</span><span class="photo-explore" aria-hidden="true">Explorar ↗</span><span class="card-photo-caption">Fotografía de referencia</span><span class="card-number" aria-hidden="true">${String(experiences.indexOf(item)+1).padStart(2,'0')} / ${String(experiences.length).padStart(2,'0')}</span></button>
    <div class="card-body"><div class="card-topline">${item.tag}</div><h3>${item.name}</h3><p>${item.description}</p><div class="card-source">${item.providerIds.length ? "Operador de referencia: " + providers.find(provider => provider.id === item.providerIds[0]).name : "Proveedor y disponibilidad por confirmar"}</div><button class="card-action" data-open-experience="${item.id}" aria-label="Ver experiencia: ${item.name}">Ver experiencia <span aria-hidden="true">↗</span></button></div></div></article>`).join('');
  $$('#experience-grid [data-tilt]').forEach(setupTilt);
  $('#filter-status').textContent = `${list.length} ${list.length === 1 ? 'experiencia' : 'experiencias'} para explorar.`;
}
function renderCatalogControls() {
  const availableCategories = categories.filter(category => category.status === 'inquiry');
  $('.filter-list').innerHTML = `<button class="filter active" data-filter="all" aria-pressed="true">Todo <span>${experiences.length}</span></button>` + availableCategories.map(category => `<button class="filter" data-filter="${category.id}" aria-pressed="false">${category.label}</button>`).join('');
  $('.filter-list').addEventListener('click', event => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    $$('[data-filter]').forEach(filter => { filter.classList.toggle('active', filter === button); filter.setAttribute('aria-pressed', String(filter === button)); });
    renderCatalog(button.dataset.filter);
  });
  form.elements.experience.innerHTML = '<option value="">Selecciona tu experiencia o servicio</option>' + availableCategories.map(category => `<optgroup label="${category.label}">${experiences.filter(item=>item.categoryId===category.id).map(item=>`<option value="${item.name}">${item.name}</option>`).join('')}</optgroup>`).join('') + '<option>Otra idea</option>';
}


function showDialog(dialog, trigger) {
  lastDialogTrigger = trigger;
  dialog.showModal();
  document.body.classList.add('modal-open');
}
function openExperience(id, trigger) {
  const item = experiences.find(x => x.id === id);
  if (!item) return;
  const provider = providers.find(provider => item.providerIds.includes(provider.id));
  const providerPanel = provider ? `<aside class="source-panel"><strong>Operador de referencia: ${provider.name}</strong><a href="${provider.sourceUrl}" target="_blank" rel="noopener noreferrer">Consultar la ficha oficial del operador ↗</a><small>Información consultada el 13 de septiembre de 2026. Sujeta a cambios. La mención no implica una alianza confirmada.</small></aside>` : '';
  const extraFacts = (item.facts || []).map(([label,value])=>`<div><dt>${label}</dt><dd>${value}</dd></div>`).join('');
  $('.detail-content').innerHTML = `<img class="detail-image" src="./assets/${item.image}" alt="${item.alt}" style="object-position:${item.imagePosition}"><div class="detail-body"><p class="eyebrow">${categoryLabel(item.categoryId).toUpperCase()} / SOLICITUD DE INFORMACIÓN</p><h2 id="detail-title">${item.name}</h2><p class="detail-description">${item.detail}</p>${providerPanel}<dl class="detail-facts"><div><dt>UNA IDEA PARA</dt><dd>${item.occasion}</dd></div><div><dt>PRECIO Y DISPONIBILIDAD</dt><dd>A confirmar por el proveedor</dd></div>${extraFacts}</dl><ul class="detail-checklist">${item.considerations.map(text => `<li>${text}</li>`).join('')}</ul><p class="detail-note">Nayarit Experiences es tu puente de contacto. El proveedor valida la viabilidad y realiza la confirmación y el cierre. ${item.photoNote || 'Fotografía de inspiración; proveedor por confirmar.'}</p><button class="button button-dark" data-select-experience="${item.id}">Me interesa esta opción <span aria-hidden="true">↗</span></button></div>`;
  showDialog(detailDialog, trigger);
}
document.addEventListener('click', event => {
  const open = event.target.closest('[data-open-experience]');
  if (open) openExperience(open.dataset.openExperience, open);
  const selected = event.target.closest('[data-select-experience]');
  if (selected) {
    const item = experiences.find(x => x.id === selected.dataset.selectExperience);
    detailDialog.close();
    showForm();
    form.elements.experience.value = item.name;
    syncServiceBrief();
    validateField(form.elements.experience, false);
    form.elements.name.focus({ preventScroll: true });
    $('#solicitud').scrollIntoView({ behavior: reduce.matches ? 'instant' : 'smooth' });
  }
});
$$('dialog').forEach(dialog => {
  $('.dialog-close', dialog).addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const box = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    // Selecting an experience deliberately moves focus into the form.
    if (!form.contains(document.activeElement)) lastDialogTrigger?.focus({preventScroll:true});
  });
});
$('[data-credits]').addEventListener('click', event => showDialog($('.credits-dialog'), event.currentTarget));

const dateField = form.elements.date;
const now = new Date();
const today = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
dateField.min = today;
const fields = ['name','phone','experience','people','date','consent'];

function syncServiceBrief() {
  if (activeServiceId) {
    serviceDrafts.set(activeServiceId, Object.fromEntries($$('#service-brief input, #service-brief select').map(field=>[field.name,field.value])));
  }
  const item=activeExperience();
  activeServiceId=item?.id || null;
  const definitions=item?.briefFields || [];
  const container=$('.brief-grid');
  container.innerHTML=definitions.map(definition=>{
    const name='brief_'+definition.name;
    const common=`id="${name}" name="${name}" data-brief-label="${definition.label}" ${definition.required?'required':''} aria-describedby="${name}-error"`;
    const control=definition.options ? `<select ${common}>${definition.options.map(option=>`<option>${option}</option>`).join('')}</select>` : `<input ${common} type="${definition.type || 'text'}" ${definition.type==='number'?`min="${definition.min}" max="${definition.max}" step="1"`:'maxlength="200"'} placeholder="${definition.placeholder||''}" ${definition.type==='date'?`min="${today}"`:''}>`;
    return `<label for="${name}">${definition.label} ${definition.required?'<span>*</span>':'<span class="optional">Opcional</span>'}${control}<small class="field-error" id="${name}-error"></small></label>`;
  }).join('');
  const draft=serviceDrafts.get(activeServiceId)||{};
  $$('#service-brief input, #service-brief select').forEach(field=>{if(draft[field.name]!==undefined)field.value=draft[field.name];});
  $('#service-brief').hidden=!definitions.length;
  dateField.required=Boolean(item?.stay);
  $('[data-date-label]').textContent=item?.stay?'Fecha de entrada':'Fecha tentativa';
  $('[data-date-badge]').textContent=item?.stay?'Requerida':'Opcional';
  dateField.removeAttribute('aria-invalid');
  $('#date-error').textContent='';
  $('.complementary-options').innerHTML=complementaryIds.filter(id=>id!==activeServiceId).map(id=>{
    const complement=experiences.find(item=>item.id===id);
    return `<label class="complementary-choice"><input type="checkbox" name="complements" value="${id}" ${selectedComplementIds.has(id)?'checked':''}><span>${complement.name}</span></label>`;
  }).join('');
}
form.elements.experience.addEventListener('change',syncServiceBrief);
$('.complementary-options').addEventListener('change',event=>{
  const field=event.target;
  if(field.name!=='complements')return;
  if(field.checked)selectedComplementIds.add(field.value);else selectedComplementIds.delete(field.value);
});
function validateField(field, showError = true) {
  let error = '';
  const value = field.value.trim();
  if (field.name === 'name' && value.length < 2) error = 'Escribe tu nombre (al menos 2 caracteres).';
  if (field.name === 'phone') {
    const digits = value.replace(/\D/g, '');
    if (!/^[+\d\s().-]+$/.test(value) || digits.length < 10 || digits.length > 15) error = 'Escribe un teléfono válido de 10 a 15 dígitos.';
  }
  if (field.name === 'experience' && !value) error = 'Elige una experiencia.';
  if (field.name === 'people' && (!value || !Number.isInteger(Number(value)) || Number(value)<1 || Number(value)>100)) error = 'Indica de 1 a 100 personas para consultar opciones.';
  if (field.name === 'date' && ((field.required && !value) || (value && (value < today || !field.checkValidity())))) error = field.required ? 'Indica una fecha de entrada de hoy en adelante.' : 'Elige hoy o una fecha futura.';
  if (field.name === 'consent' && !field.checked) error = 'Confirma que conoces el alcance de la solicitud.';
  if (field.name.startsWith('brief_')) {
    if (field.required && !value) error='Completa este dato para orientar tu solicitud.';
    else if (value && !field.checkValidity()) error='Revisa el valor de este campo.';
    if (field.name==='brief_checkout' && value && (!dateField.value || value<=dateField.value)) error='La salida debe ser posterior a la fecha de entrada.';
  }
  if (showError || !error) {
    field.setAttribute('aria-invalid', String(Boolean(error)));
    $(`#${field.name}-error`).textContent = error;
  }
  return !error;
}
for (const eventName of ['input','change']) form.addEventListener(eventName,event=>{
  const field=event.target;
  if(field.getAttribute('aria-invalid')==='true')validateField(field);
});
const submitButton = $('button[type="submit"]', form);
function applyLiveCopy() {
  if (!webhookUrl) return;
  $('.demo-note p').innerHTML = '<strong>Solicitud sin compromiso.</strong>Cuéntanos tu idea y te contactamos por WhatsApp para orientarte.';
  submitButton.firstChild.textContent = 'Enviar mi solicitud ';
  $('.consent span').textContent = 'Entiendo que esta solicitud no confirma una reservación ni disponibilidad. El proveedor confirma y realiza el cierre. Autorizo que me contacten por WhatsApp con los datos que envío.';
  $('.success-state .eyebrow').textContent = 'SOLICITUD RECIBIDA';
  $('.success-disclaimer').textContent = 'Recibimos tu solicitud. El proveedor confirma disponibilidad, condiciones y precio; te contactaremos por WhatsApp.';
  $('[data-edit-request]').hidden = true;
}
function buildPayload(data, item) {
  const payload = new URLSearchParams();
  const fullName = String(data.get('name')).trim();
  const [firstName, ...rest] = fullName.split(/\s+/);
  const complements = data.getAll('complements').map(id => experiences.find(entry => entry.id === id)?.name).filter(Boolean);
  const provider = item?.providerIds.length ? providers.find(entry => item.providerIds.includes(entry.id))?.name : '';
  const add = (key, value) => { if (value !== undefined && value !== null && String(value).trim() !== '') payload.append(key, String(value).trim()); };
  add('name', fullName);
  add('first_name', firstName);
  add('last_name', rest.join(' '));
  add('phone', data.get('phone'));
  add('experience', data.get('experience'));
  add('category', item ? categoryLabel(item.categoryId) : '');
  add('people', data.get('people'));
  add('date', data.get('date'));
  add('details', data.get('details'));
  add('complements', complements.join(', '));
  add('reference_provider', provider);
  (item?.briefFields || []).forEach(definition => add('brief_' + definition.name, data.get('brief_' + definition.name)));
  add('consent', 'true');
  add('source', 'nayarit-experiences.deltakilo.com.mx');
  add('page_url', location.origin + location.pathname);
  add('submitted_at', new Date().toISOString());
  const incomingParams = new URLSearchParams(location.search);
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(key => add(key, incomingParams.get(key)));
  return payload;
}
async function sendToWebhook(payload) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    // Solicitud "simple" en modo no-cors: llega a cualquier receptor sin depender de CORS, pero la respuesta es opaca.
    await fetch(webhookUrl, { method: 'POST', body: payload, mode: 'no-cors', keepalive: true, signal: controller.signal });
  } finally { clearTimeout(timer); }
}
applyLiveCopy();
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (submitButton.disabled) return;
  const invalid = allFields().filter(field=>!validateField(field));
  if (invalid.length) { $('.form-status').textContent='Revisa los campos señalados para continuar.';invalid[0].focus();return; }
  $('.form-status').textContent='';
  const data = new FormData(form);
  if (webhookUrl) {
    submitButton.disabled = true;
    $('.form-status').textContent = 'Enviando tu solicitud…';
    try { await sendToWebhook(buildPayload(data, activeExperience())); }
    catch { $('.form-status').textContent = 'No pudimos enviar tu solicitud. Revisa tu conexión e inténtalo de nuevo.'; submitButton.disabled = false; return; }
    submitButton.disabled = false;
    $('.form-status').textContent = '';
  }
  $('.success-copy').textContent = webhookUrl ? `${String(data.get('name')).trim().split(/\s+/)[0]}, este es el resumen de tu solicitud.` : `${String(data.get('name')).trim().split(/\s+/)[0]}, así se ve la solicitud que preparaste.`;
  const summary = $('.request-summary');summary.replaceChildren();
  const item=activeExperience();
  const formatDate = value => new Date(`${value}T12:00:00`).toLocaleDateString('es-MX',{day:'numeric',month:'long',year:'numeric'});
  const values = [['Experiencia o servicio',data.get('experience')],['Nombre',data.get('name')],['WhatsApp',data.get('phone')],['Personas',data.get('people')],[item?.stay?'Fecha de entrada':'Fecha tentativa',data.get('date') ? formatDate(data.get('date')) : 'Por definir'],['Tu idea',String(data.get('details')).trim() || 'Sin comentarios adicionales']];
  (item?.briefFields||[]).forEach(definition=>{
    const value=data.get('brief_'+definition.name);
    if(value)values.push([definition.label,definition.type==='date'?formatDate(value):value]);
  });
  const complements=data.getAll('complements').map(id=>experiences.find(item=>item.id===id)?.name).filter(Boolean);
  if(complements.length)values.push(['También te interesa',complements.join(', ')]);
  if(item?.providerIds.length)values.push(['Operador de referencia',providers.find(provider=>item.providerIds.includes(provider.id)).name]);
  values.forEach(([label,value]) => { const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;row.append(dt,dd);summary.append(row); });
  form.hidden=true;$('.form-heading').hidden=true;success.hidden=false;success.focus({preventScroll:true});
  $('.form-shell').scrollIntoView({behavior:reduce.matches?'instant':'smooth',block:'start'});
});
function showForm(){success.hidden=true;form.hidden=false;$('.form-heading').hidden=false;}
$('[data-edit-request]').addEventListener('click',()=>{showForm();form.elements.name.focus();});
$('[data-new-request]').addEventListener('click',()=>{form.reset();serviceDrafts.clear();selectedComplementIds.clear();activeServiceId=null;syncServiceBrief();fields.forEach(name=>{form.elements[name].removeAttribute('aria-invalid');$(`#${name}-error`).textContent='';});$('.form-status').textContent='';showForm();form.elements.name.focus();});
$('[data-year]').textContent=new Date().getFullYear();

// Progressive motion: all content is visible if JS or observers are unavailable.
if ('IntersectionObserver' in window && !reduce.matches) {
  document.documentElement.classList.add('motion-ready');
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target);}}),{threshold:.08});
  $$('.reveal').forEach(element => revealObserver.observe(element));
}
let scrollFrame = 0;
const progress = $('.scroll-progress');
function updateScroll(){const y=window.scrollY;header.classList.toggle('scrolled',y>30);const range=document.documentElement.scrollHeight-window.innerHeight;progress.style.transform=`scaleX(${range>0?Math.min(y/range,1):0})`;scrollFrame=0;}
window.addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScroll);},{passive:true});
window.addEventListener('resize',updateScroll);updateScroll();
function motionAllowed(){return !reduce.matches && finePointer.matches;}
function setupTilt(element){
  let rect,frame=0,x=0,y=0;
  element.addEventListener('pointerenter',()=>{rect=element.getBoundingClientRect();});
  element.addEventListener('pointermove',event=>{
    if(!motionAllowed() || !rect)return;
    x=event.clientX-rect.left;y=event.clientY-rect.top;
    if(!frame)frame=requestAnimationFrame(()=>{element.style.setProperty('--rx',`${(0.5-y/rect.height)*3}deg`);element.style.setProperty('--ry',`${(x/rect.width-0.5)*3}deg`);frame=0;});
  });
  element.addEventListener('pointerleave',()=>{cancelAnimationFrame(frame);frame=0;element.style.removeProperty('--rx');element.style.removeProperty('--ry');});
}
const hero = $('.hero');const media = $('.hero-media');let heroFrame=0;
hero.addEventListener('pointermove',event=>{
  if(!motionAllowed() || heroFrame)return;
  heroFrame=requestAnimationFrame(()=>{const rect=hero.getBoundingClientRect();const x=(event.clientX-rect.left)/rect.width,y=(event.clientY-rect.top)/rect.height;hero.style.setProperty('--mx',`${x*100}%`);hero.style.setProperty('--my',`${y*100}%`);media.style.setProperty('--px',`${(x-.5)*-16}px`);media.style.setProperty('--py',`${(y-.5)*-12}px`);heroFrame=0;});
});
hero.addEventListener('pointerleave',()=>{cancelAnimationFrame(heroFrame);heroFrame=0;media.style.setProperty('--px','0px');media.style.setProperty('--py','0px');});
$$('[data-magnetic]').forEach(button=>{
  let rect;
  button.addEventListener('pointerenter',()=>{rect=button.getBoundingClientRect();});
  button.addEventListener('pointermove',event=>{if(motionAllowed()&&rect)button.style.transform=`translate(${(event.clientX-rect.left-rect.width/2)*.045}px,${(event.clientY-rect.top-rect.height/2)*.09}px)`;});
  button.addEventListener('pointerleave',()=>{button.style.transform='';});
});
reduce.addEventListener('change',()=>{if(reduce.matches){document.documentElement.classList.remove('motion-ready');$$('[data-magnetic]').forEach(el=>el.style.transform='');}});
renderCatalogControls();
// Editorial URLs only accept known catalog IDs; user input is never injected as HTML.
const incoming = new URLSearchParams(location.search);
const incomingExperience = experiences.find(item=>item.id===incoming.get('interes'));
if(incomingExperience){
  form.elements.experience.value=incomingExperience.name;
  (incoming.get('complementos')||'').split(',').filter(id=>complementaryIds.includes(id)&&id!==incomingExperience.id).forEach(id=>selectedComplementIds.add(id));
}
syncServiceBrief();
renderCatalog();
if(incomingExperience)requestAnimationFrame(()=>$('#solicitud').scrollIntoView({behavior:'instant',block:'start'}));
if(location.hash==='#creditos')showDialog($('.credits-dialog'),$('[data-credits]'));
