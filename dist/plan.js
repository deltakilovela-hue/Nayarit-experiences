// «Arma tu plan»: recorrido en tres pasos (qué vivir → dónde → tu plan) con un mapa interactivo de Nayarit dibujado en SVG.
// No hace solicitudes a terceros. Al terminar emite el evento `nayarit:apply-plan`, que script.js usa para precargar el formulario.
import { experiences } from './catalog.js';
import { GEO, project } from './map-geo.js';
import { regions, intents, points, presets } from './map-data.js';

const root = document.querySelector('[data-plan]');
const $ = (selector, scope = root) => scope.querySelector(selector);
const $$ = (selector, scope = root) => [...scope.querySelectorAll(selector)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const expById = id => experiences.find(item => item.id === id);
const pointById = id => points.find(item => item.id === id);
const intentOf = expId => intents.find(item => item.experiences.includes(expId))?.id;
const pointLabel = p => p.code ? `${p.name} (${p.code})` : p.name;
const todayISO = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; })();
const km = (a, b) => {
  const rad = x => x * Math.PI / 180, dLat = rad(b.lat - a.lat), dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
};
const coords = p => p.kind === 'linea' ? null : { lat: p.lat, lon: p.lon };

const state = { pointsOpen: false, step: 1, intents: new Set(), exps: [], place: null, selected: null, route: { origin: null, destination: null }, region: 'nayarit', people: '', date: '' };
const steps = [{ n: 1, label: 'Qué vivir' }, { n: 2, label: 'Dónde' }, { n: 3, label: 'Tu plan' }];

function init() {
  root.innerHTML = `
    <ol class="plan-steps" aria-label="Pasos del recorrido"></ol>
    <div class="plan-progress" aria-hidden="true"><i></i></div>
    <div class="plan-layout">
      <div class="plan-stage" data-stage></div>
      <div class="plan-map-wrap"><div class="plan-map" data-map></div></div>
    </div>
    <div class="plan-bar" data-bar></div>`;
  buildMap();
  renderAll();
}

/* ───────────── Mapa ───────────── */
let svg, mapEl, tip, cw = 0, ch = 0, vb = { x: 0, y: 0, w: GEO.width, h: GEO.height }, raf = 0;
const scalables = [];
const pinEls = new Map();

function buildMap() {
  mapEl = $('[data-map]');
  const states = GEO.states.map(s => `<path class="state${s.id === 'nayarit' ? ' is-nayarit' : ''}" d="${s.d}"/>`).join('');
  const labels = GEO.states.filter(s => s.id !== 'aguascalientes').map(s => `<g class="st-label" data-sx="${s.label[0]}" data-sy="${s.label[1]}"><text class="${s.id === 'nayarit' ? 'big' : ''}">${s.name.toUpperCase()}</text></g>`).join('');
  const rivers = GEO.rivers.map(r => `<path class="map-river${r.id === 'rio-santiago' ? ' main' : ''}" d="${r.d}"/>`).join('');
  const coast = GEO.coast.map(d => `<path class="map-coast" d="${d}"/>`).join('');
  const santiago = GEO.rivers.find(r => r.id === 'rio-santiago');
  const hits = (santiago ? `<path class="line-hit" data-pin="rio-santiago" tabindex="0" role="button" aria-label="Río Santiago, paseo aéreo" d="${santiago.d}"/>` : '') +
    GEO.coast.map(d => `<path class="line-hit" data-pin="playas" tabindex="0" role="button" aria-label="Playas de Nayarit, paseo aéreo" d="${d}"/>`).join('');
  mapEl.innerHTML = `
    <svg class="map-svg" viewBox="0 0 ${GEO.width} ${GEO.height}" role="group" aria-label="Mapa interactivo de Nayarit">
      <rect class="map-sea" x="-1500" y="-1500" width="4000" height="4000"/>
      <g class="map-states">${states}</g>
      <g class="map-rivers">${rivers}</g>
      <g class="map-coasts">${coast}</g>
      <g class="map-labels">${labels}</g>
      <g class="map-routes"></g>
      <g class="map-lines">${hits}</g>
      <g class="map-pins"></g>
    </svg>
    <div class="map-regions" role="group" aria-label="Zonas del mapa">${regions.map(r => `<button type="button" data-region="${r.id}">${r.label}</button>`).join('')}</div>
    <div class="map-legend" aria-hidden="true"><span><i class="lg dest"></i>Destino</span><span><i class="lg dam"></i>Presa</span><span><i class="lg air"></i>Aeropuerto</span></div>
    <div class="map-tip" role="tooltip" hidden></div>`;
  svg = $('.map-svg', mapEl); tip = $('.map-tip', mapEl);

  $$('.st-label', mapEl).forEach(el => scalables.push({ el, x: +el.dataset.sx, y: +el.dataset.sy }));
  const pinLayer = $('.map-pins', mapEl);
  points.filter(p => p.kind !== 'linea').forEach(p => {
    const [x, y] = project(p.lon, p.lat);
    const [dx, dy, anchor] = p.label || [10, 4, 'start'];
    const glyph = {
      destino: '<circle class="ring" r="11"/><circle class="match" r="15"/><circle class="dot" r="6.5"/>',
      presa: '<circle class="ring" r="11"/><circle class="match" r="15"/><rect class="dot" x="-5.5" y="-5.5" width="11" height="11" transform="rotate(45)"/>',
      aeropuerto: '<circle class="ring" r="12"/><circle class="match" r="16"/><circle class="halo" r="10"/><path class="dot plane" d="M9 0 2.5 2.2-1 9H-3L-1.5 2.2-6 1.6-7.8 4H-9L-8 0-9-4h1.2L-6-1.6l4.5-.6L-3-9h2l3.5 6.8Z"/>',
      zona: '<circle class="zone" r="26"/><circle class="ring" r="30"/><circle class="match" r="34"/><circle class="dot" r="4.5"/>',
      cluster: '<circle class="ring" r="18"/><circle class="match" r="22"/><circle class="dot" r="13"/><text class="cluster-n" y="4">' + (p.members?.length || '') + '</text>'
    }[p.kind];
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', `pin ${p.kind}`);
    g.dataset.pin = p.id; g.setAttribute('tabindex', '0'); g.setAttribute('role', 'button');
    g.setAttribute('aria-label', `${pointLabel(p)}, ${p.tag}`);
    g.innerHTML = `<circle class="pin-hit" r="20"/>${glyph}<text class="lbl" x="${dx + (p.kind === 'zona' ? 0 : 0)}" y="${dy}" text-anchor="${anchor}">${esc(p.kind === 'cluster' ? p.name : pointLabel(p))}</text><text class="badge" x="9" y="-9"></text>`;
    pinLayer.append(g); pinEls.set(p.id, g);
    scalables.push({ el: g, x, y, point: p });
  });

  mapEl.addEventListener('click', event => {
    const region = event.target.closest('[data-region]'); if (region) { setRegion(region.dataset.region); return; }
    const pin = event.target.closest('[data-pin]'); if (pin) selectPoint(pin.dataset.pin);
  });
  mapEl.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const pin = event.target.closest('[data-pin]'); if (pin) { event.preventDefault(); selectPoint(pin.dataset.pin); }
  });
  mapEl.addEventListener('pointerover', event => { const pin = event.target.closest('.pin'); if (pin) showTip(pin); });
  mapEl.addEventListener('pointerout', event => { if (event.target.closest('.pin')) tip.hidden = true; });
  mapEl.addEventListener('focusin', event => { const pin = event.target.closest('.pin'); if (pin) showTip(pin); });
  mapEl.addEventListener('focusout', () => { tip.hidden = true; });

  new ResizeObserver(() => { measure(); if (cw) setView(fitRegion(state.region), false); }).observe(mapEl);
  measure(); setRegion(state.region, false);
}

function measure() { const r = mapEl.getBoundingClientRect(); cw = r.width; ch = r.height; }

function fitRegion(id, pad = 0.07) {
  const [lo0, la0, lo1, la1] = regions.find(r => r.id === id).bbox;
  const [x0, y0] = project(lo0, la1), [x1, y1] = project(lo1, la0);
  let w = (x1 - x0) * (1 + pad * 2), h = (y1 - y0) * (1 + pad * 2);
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, aspect = (cw || 1) / (ch || 1);
  if (w / h < aspect) w = h * aspect; else h = w / aspect;
  return { x: cx - w / 2, y: cy - h / 2, w, h };
}

function setView(next, animate = true) {
  cancelAnimationFrame(raf);
  if (!animate || reduce.matches || !cw) { vb = next; applyView(); return; }
  const from = { ...vb }, t0 = performance.now(), dur = 800;
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const frame = now => {
    const t = Math.min(1, (now - t0) / dur), e = ease(t);
    vb = { x: from.x + (next.x - from.x) * e, y: from.y + (next.y - from.y) * e, w: from.w + (next.w - from.w) * e, h: from.h + (next.h - from.h) * e };
    applyView();
    if (t < 1) raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
}

function applyView() {
  if (!cw) return;
  svg.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
  const k = vb.w / cw;
  mapEl.style.setProperty('--k', k);
  scalables.forEach(s => {
    s.el.setAttribute('transform', `translate(${s.x} ${s.y}) scale(${k})`);
    if (s.point?.showK) s.el.classList.toggle('is-hidden', k < s.point.showK[0] || k >= s.point.showK[1]);
  });
  $$('.route-fly', mapEl).forEach(el => el.setAttribute('transform', `scale(${k})`));
  $$('.route-km', mapEl).forEach(el => el.setAttribute('transform', `translate(${el.dataset.x} ${el.dataset.y}) scale(${k})`));
}

function syncAirports() { svg.classList.toggle('show-air', state.region === 'rutas' || state.exps.includes('taxi-aereo')); }

function setRegion(id, animate = true) {
  state.region = id;
  syncAirports();
  $$('[data-region]', mapEl).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.region === id)));
  setView(fitRegion(id), animate);
}

function showTip(pin) {
  const p = pointById(pin.dataset.pin); if (!p) return;
  tip.innerHTML = `<strong>${esc(pointLabel(p))}</strong><span>${esc(p.tag)}</span>`;
  tip.hidden = false;
  const a = pin.getBoundingClientRect(), m = mapEl.getBoundingClientRect();
  tip.style.left = `${Math.min(Math.max(a.left + a.width / 2 - m.left, 70), m.width - 70)}px`;
  tip.style.top = `${Math.max(a.top - m.top - 6, 46)}px`;
}

function updateMapState() {
  syncAirports();
  const relevant = new Set(state.intents.size ? [...state.intents].flatMap(id => intents.find(i => i.id === id).experiences) : []);
  pinEls.forEach((el, id) => {
    const p = pointById(id);
    el.classList.toggle('is-selected', state.selected === id);
    el.classList.toggle('is-place', state.place === id);
    el.classList.toggle('is-match', Boolean(relevant.size) && p.featured.some(f => relevant.has(f)));
    el.querySelector('.badge').textContent = state.route.origin === id ? 'A' : state.route.destination === id ? 'B' : '';
  });
  const planHasPano = state.exps.includes('panoramico');
  svg.classList.toggle('hl-river', planHasPano || state.selected === 'rio-santiago');
  svg.classList.toggle('hl-coast', planHasPano || state.selected === 'playas');
  $$('.line-hit', mapEl).forEach(el => el.classList.toggle('is-selected', el.dataset.pin === state.selected));
  drawRoute();
}

function drawRoute() {
  const layer = $('.map-routes', mapEl); layer.innerHTML = '';
  const a = pointById(state.route.origin), b = pointById(state.route.destination);
  if (!a || !b) return;
  const [x0, y0] = project(a.lon, a.lat), [x1, y1] = project(b.lon, b.lat);
  const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy) || 1;
  const cx = mx - dy / len * len * 0.2, cy = my + dx / len * len * 0.2;
  const d = `M${x0} ${y0}Q${cx} ${cy} ${x1} ${y1}`;
  const labelX = 0.25 * x0 + 0.5 * cx + 0.25 * x1, labelY = 0.25 * y0 + 0.5 * cy + 0.25 * y1;
  const dist = Math.round(km(coords(a), coords(b)) / 5) * 5;
  const fly = reduce.matches ? '' : `<g class="route-plane"><g class="route-fly" transform="scale(${vb.w / (cw || 1)})"><path class="plane-glyph" d="M9 0 2.5 2.2-1 9H-3L-1.5 2.2-6 1.6-7.8 4H-9L-8 0-9-4h1.2L-6-1.6l4.5-.6L-3-9h2l3.5 6.8Z"/></g><animateMotion dur="${Math.max(3, Math.min(8, len / 90))}s" repeatCount="indefinite" rotate="auto" path="${d}"/></g>`;
  layer.innerHTML = `<path class="route-base" d="${d}"/><path class="route-line" d="${d}" pathLength="1"/>${fly}<g class="route-km" data-x="${labelX}" data-y="${labelY}" transform="translate(${labelX} ${labelY}) scale(${vb.w / (cw || 1)})"><rect x="-34" y="-11" width="68" height="20" rx="10"/><text y="3.5">≈ ${dist} km</text></g>`;
}

/* ───────────── Estado y acciones ───────────── */
function selectPoint(id, { zoom = true } = {}) {
  const p = pointById(id); if (!p) return;
  state.selected = id;
  if (state.step !== 2) state.step = 2;
  if (zoom) {
    const target = p.kind === 'cluster' ? 'riviera' : p.region;
    const k = vb.w / (cw || 1), needs = !regionContains(state.region, p) || (p.showK && (k < p.showK[0] || k >= p.showK[1]));
    if (needs) setRegion(target);
  }
  renderAll();
}
function regionContains(regionId, p) {
  if (p.kind === 'linea') return true;
  const [lo0, la0, lo1, la1] = regions.find(r => r.id === regionId).bbox;
  return p.lon >= lo0 && p.lon <= lo1 && p.lat >= la0 && p.lat <= la1;
}
function toggleIntent(id) {
  if (state.intents.has(id)) { state.intents.delete(id); const own = intents.find(i => i.id === id).experiences; state.exps = state.exps.filter(e => !own.includes(e)); }
  else state.intents.add(id);
  renderAll();
}
function toggleExp(id) {
  const at = state.exps.indexOf(id);
  if (at >= 0) state.exps.splice(at, 1);
  else { state.exps.push(id); const it = intentOf(id); if (it) state.intents.add(it); }
  renderAll();
}
function setPlace(id) { state.place = state.place === id ? null : id; renderAll(); }
function setRouteEnd(end, id) {
  const other = end === 'origin' ? 'destination' : 'origin';
  state.route[end] = state.route[end] === id ? null : id;
  if (state.route[other] === id) state.route[other] = null;
  renderAll();
}
function applyPreset(id) {
  const preset = presets.find(p => p.id === id); if (!preset) return;
  state.intents = new Set(preset.intents); state.exps = [...preset.experiences]; state.place = preset.place; state.selected = preset.place;
  state.route = { origin: preset.route?.origin || null, destination: preset.route?.destination || null };
  state.step = 3; renderAll(true);
  const p = pointById(preset.place); if (p) setRegion(p.kind === 'cluster' ? 'riviera' : p.region);
}
function autofill() {
  state.intents.forEach(intentId => {
    const own = intents.find(i => i.id === intentId).experiences;
    if (state.exps.some(e => own.includes(e))) return;
    const place = pointById(state.place), preferred = own.find(e => place?.featured?.includes(e)) || own[0];
    state.exps.push(preferred);
  });
  state.exps.forEach(e => { const it = intentOf(e); if (it) state.intents.add(it); });
}
function canGo(n) { return n === 1 || (n === 2 && (state.intents.size > 0 || state.exps.length > 0)) || (n === 3 && (state.intents.size > 0 || state.exps.length > 0)); }
function goStep(n) {
  if (!canGo(n)) return;
  if (n === 3) autofill();
  state.step = n;
  if (n === 2 && !state.selected && state.intents.has('moverme') && state.region === 'nayarit') setRegion('rutas');
  renderAll(true);
}

/* ───────────── Render ───────────── */
let lastStep = 0;
function renderAll(announce = false) {
  const focusKey = document.activeElement?.dataset?.key;
  root.dataset.current = state.step;
  $('.plan-steps').innerHTML = steps.map(s => `<li><button type="button" data-step="${s.n}" ${state.step === s.n ? 'aria-current="step"' : ''} ${canGo(s.n) ? '' : 'disabled'} class="${state.step > s.n ? 'done' : ''}"><i>${state.step > s.n ? '✓' : s.n}</i><span>${s.label}</span></button></li>`).join('');
  $('.plan-progress i').style.width = `${(state.step - 1) / (steps.length - 1) * 100}%`;
  const stage = $('[data-stage]');
  stage.innerHTML = `<div class="plan-view${state.step !== lastStep ? ' enter' : ''}">${[stepOne, stepTwo, stepThree][state.step - 1]()}</div>`;
  lastStep = state.step;
  renderBar();
  updateMapState();
  if (focusKey) $(`[data-key="${focusKey}"]`)?.focus({ preventScroll: true });
  if (announce && stage.dataset.ready) stage.scrollIntoView({ block: 'nearest', behavior: reduce.matches ? 'auto' : 'smooth' });
  stage.dataset.ready = '1';
}

function stepOne() {
  const tiles = intents.map(i => `<button type="button" class="tile" data-key="intent-${i.id}" data-intent="${i.id}" aria-pressed="${state.intents.has(i.id)}"><img src="./assets/${i.image}" alt="" width="600" height="450" loading="lazy"><span class="check" aria-hidden="true">✓</span><span class="tile-copy"><strong>${i.label}</strong><small>${i.caption}</small></span></button>`).join('');
  const cards = presets.map(p => `<button type="button" class="preset" data-key="preset-${p.id}" data-preset="${p.id}"><img src="./assets/${p.image}" alt="" width="160" height="160" loading="lazy"><span><strong>${p.title}</strong><small>${p.blurb}</small></span><i aria-hidden="true">↗</i></button>`).join('');
  return `<p class="eyebrow">PASO 1 / QUÉ QUIERES VIVIR</p><h3>¿Qué quieres vivir?</h3><p class="plan-lead">Elige una o varias. Después las ubicamos en el mapa.</p><div class="plan-tiles">${tiles}</div><p class="plan-sub">O parte de una idea</p><div class="plan-presets">${cards}</div><p class="plan-fine">Son ideas de viaje, no paquetes confirmados. El proveedor confirma disponibilidad, condiciones y cotización.</p>`;
}

function expChip(id, p) {
  const e = expById(id); if (!e) return '';
  const price = p?.priceFor?.includes(id) && e.price ? `<small>${esc(e.price)}</small>` : '';
  return `<button type="button" class="exp-chip" data-key="exp-${id}" data-exp="${id}" aria-pressed="${state.exps.includes(id)}"><span class="exp-name">${esc(e.name)}</span>${price}<i aria-hidden="true">${state.exps.includes(id) ? '✓' : '+'}</i></button>`;
}

function stepTwo() {
  const p = pointById(state.selected);
  const hasTaxi = state.exps.includes('taxi-aereo');
  let card;
  if (!p) {
    card = `<article class="plan-card plan-card-empty"><h4>Toca un punto del mapa</h4><p>Descubre qué se puede consultar en cada lugar y suma lo que te guste a tu plan.${state.intents.has('moverme') ? ' Para el taxi aéreo, marca un origen y un destino.' : ''}</p></article>`;
  } else {
    const rest = state.intents.size ? [...state.intents].flatMap(id => intents.find(i => i.id === id).experiences).filter(e => !p.featured.includes(e)) : [];
    const origin = state.route.origin === p.id, dest = state.route.destination === p.id;
    card = `<article class="plan-card"><p class="plan-kicker">${esc(p.tag)}</p><h4>${esc(pointLabel(p))}</h4><p>${esc(p.blurb)}</p>
      ${p.featured.length ? `<p class="plan-sub">Se puede consultar aquí</p><div class="exp-list">${p.featured.map(id => expChip(id, p)).join('')}</div>` : ''}
      ${rest.length ? `<p class="plan-sub">Otros servicios que elegiste</p><div class="exp-list">${rest.map(id => expChip(id, p)).join('')}</div><p class="plan-fine">El proveedor confirma si cubre este lugar.</p>` : ''}
      <div class="plan-actions">
        ${p.kind === 'linea' ? '' : `<button type="button" class="plan-btn ${state.place === p.id ? 'is-on' : ''}" data-key="act-place" data-act="place">${state.place === p.id ? '✓ Es mi lugar' : 'Elegir como mi lugar'}</button>`}
        ${hasTaxi && p.kind !== 'linea' ? `<button type="button" class="plan-btn ghost ${origin ? 'is-on' : ''}" data-key="act-origin" data-act="origin">${origin ? '✓ Origen (A)' : 'Usar como origen'}</button><button type="button" class="plan-btn ghost ${dest ? 'is-on' : ''}" data-key="act-dest" data-act="destination">${dest ? '✓ Destino (B)' : 'Usar como destino'}</button>` : ''}
      </div></article>`;
  }
  const groups = [['Destinos', 'destino'], ['Rutas y presas', 'linea', 'presa', 'zona'], ['Aeropuertos', 'aeropuerto']];
  const all = groups.map(([label, ...kinds]) => `<div><h5>${label}</h5><div class="point-list">${points.filter(q => kinds.includes(q.kind) || (kinds[0] === 'destino' && q.kind === 'cluster')).map(q => `<button type="button" data-key="pt-${q.id}" data-point="${q.id}" aria-pressed="${state.selected === q.id}">${esc(q.kind === 'cluster' ? q.name : pointLabel(q))}</button>`).join('')}</div></div>`).join('');
  const taxiHint = hasTaxi ? routeSummary(true) : '';
  return `<p class="eyebrow">PASO 2 / DÓNDE</p><h3>Ubícalo en Nayarit</h3><p class="plan-lead">Toca los puntos del mapa o elígelos de la lista. Cambia de zona con los botones del mapa.</p>${card}${taxiHint}<details class="plan-points" ${state.pointsOpen ? 'open' : ''}><summary>Ver todos los puntos</summary>${all}</details>`;
}

function routeSummary(compact = false) {
  const a = pointById(state.route.origin), b = pointById(state.route.destination);
  if (!a && !b) return compact ? `<p class="plan-route plan-fine">Taxi aéreo: marca un <strong>origen (A)</strong> y un <strong>destino (B)</strong> en el mapa para ver la ruta.</p>` : `<div class="plan-row"><span>Ruta</span><div><button type="button" class="plan-link" data-key="route-edit" data-goto="2">Elige origen y destino en el mapa</button></div></div>`;
  const dist = a && b ? ` <em>≈ ${Math.round(km(coords(a), coords(b)) / 5) * 5} km en línea recta</em>` : '';
  const text = `${a ? esc(pointLabel(a)) : '¿Origen?'} → ${b ? esc(pointLabel(b)) : '¿Destino?'}${dist}`;
  return compact ? `<p class="plan-route">${text}</p>` : `<div class="plan-row"><span>Ruta</span><div>${text} <button type="button" class="plan-link" data-key="route-edit" data-goto="2">Cambiar</button></div></div>`;
}

function stepThree() {
  const place = pointById(state.place);
  const groups = [...state.intents].map(id => {
    const it = intents.find(i => i.id === id);
    return `<div class="opt-group"><h5>${it.label}</h5><div class="opt-list">${it.experiences.map(eid => {
      const e = expById(eid), on = state.exps.includes(eid);
      return `<button type="button" class="opt" data-key="opt-${eid}" data-exp="${eid}" aria-pressed="${on}"><span class="opt-check" aria-hidden="true">${on ? '✓' : ''}</span><span class="opt-body"><strong>${esc(e.name)}</strong><small>${esc(e.description)}</small>${e.price ? `<em>Referencia: ${esc(e.price)}</em>` : ''}</span></button>`;
    }).join('')}</div></div>`;
  }).join('');
  const prices = state.exps.map(expById).filter(e => e?.price);
  return `<p class="eyebrow">PASO 3 / TU PLAN</p><h3>Así va tu plan</h3><p class="plan-lead">Marca lo que quieres consultar. Lo llevamos al formulario ya llenado.</p>
    <div class="plan-row"><span>Lugar</span><div>${place ? esc(pointLabel(place)) : 'Aún sin elegir'} <button type="button" class="plan-link" data-key="place-edit" data-goto="2">${place ? 'Cambiar' : 'Elegir en el mapa'}</button></div></div>
    ${state.exps.includes('taxi-aereo') ? routeSummary() : ''}
    ${groups}
    <div class="plan-fields"><label>Personas <input type="number" min="1" max="100" step="1" inputmode="numeric" placeholder="Ej. 3" value="${esc(state.people)}" data-key="people" data-field="people"></label><label>Fecha tentativa <input type="date" min="${todayISO}" value="${esc(state.date)}" data-key="date" data-field="date"></label></div>
    ${prices.length ? `<div class="plan-prices"><h5>Referencias de precio</h5><ul>${prices.map(e => `<li><strong>${esc(e.name)}:</strong> ${esc(e.price)}</li>`).join('')}</ul><p class="plan-fine">Cifras orientativas en MXN. El resto de los servicios se cotiza con el proveedor.</p></div>` : ''}
    <p class="plan-fine">Esto es una idea de plan, no una reservación. El proveedor confirma disponibilidad, condiciones y cotización.</p>`;
}

function renderBar() {
  const bar = $('[data-bar]');
  const chips = [...state.exps.map(id => expById(id)?.name), pointById(state.place) ? `📍 ${pointLabel(pointById(state.place))}` : null].filter(Boolean);
  const intentNames = state.exps.length ? [] : [...state.intents].map(id => intents.find(i => i.id === id).label);
  const summary = [...chips, ...intentNames];
  const next = { 1: ['Ubicar en el mapa', 2, state.intents.size > 0], 2: ['Revisar mi plan', 3, canGo(3)], 3: ['Preparar mi solicitud', 'apply', state.exps.length > 0] }[state.step];
  bar.innerHTML = `<div class="bar-summary" aria-live="polite">${summary.length ? summary.map(t => `<span>${esc(t)}</span>`).join('') : '<em>Tu plan aparecerá aquí</em>'}</div>
    <div class="bar-actions">${state.step > 1 ? `<button type="button" class="plan-btn ghost" data-key="bar-back" data-goto="${state.step - 1}">Atrás</button>` : ''}<button type="button" class="plan-btn primary" data-key="bar-next" data-next="${next[1]}" ${next[2] ? '' : 'disabled'}>${next[0]} <span aria-hidden="true">${next[1] === 'apply' ? '↗' : '→'}</span></button></div>`;
}

function applyToForm() {
  const place = pointById(state.place), a = pointById(state.route.origin), b = pointById(state.route.destination);
  const names = state.exps.map(id => expById(id)?.name).filter(Boolean);
  const distance = a && b ? Math.round(km(coords(a), coords(b)) / 5) * 5 : null;
  const river = ['rio-santiago', 'aguamilpa', 'el-cajon', 'la-yesca'];
  const zoneOption = place?.id === 'playas' ? 'Playas de Nayarit' : river.includes(place?.id) ? 'Río Santiago y presas (La Yesca, El Cajón, Aguamilpa)' : 'Por definir';
  const parts = [`Plan armado en el mapa: ${names.join(', ')}.`];
  if (place) parts.push(`Lugar: ${pointLabel(place)}.`);
  if (a || b) parts.push(`Ruta: ${a ? pointLabel(a) : '¿origen?'} → ${b ? pointLabel(b) : '¿destino?'}${distance ? ` (≈ ${distance} km en línea recta)` : ''}.`);
  document.dispatchEvent(new CustomEvent('nayarit:apply-plan', { detail: {
    experienceIds: [...state.exps], people: state.people, date: state.date, summary: parts.join(' '),
    brief: { zone: place ? pointLabel(place) : '', zoneOption, origin: a ? pointLabel(a) : place ? pointLabel(place) : '', destination: b ? pointLabel(b) : '', pickup: place ? pointLabel(place) : '' }
  } }));
}

/* ───────────── Eventos del panel ───────────── */
root?.addEventListener('click', event => {
  const t = event.target;
  const intent = t.closest('[data-intent]'); if (intent) return toggleIntent(intent.dataset.intent);
  const preset = t.closest('[data-preset]'); if (preset) return applyPreset(preset.dataset.preset);
  const exp = t.closest('[data-exp]'); if (exp) return toggleExp(exp.dataset.exp);
  const point = t.closest('[data-point]'); if (point) return selectPoint(point.dataset.point);
  const act = t.closest('[data-act]');
  if (act) { const id = state.selected; return act.dataset.act === 'place' ? setPlace(id) : setRouteEnd(act.dataset.act, id); }
  const step = t.closest('[data-step]'); if (step) return goStep(+step.dataset.step);
  const go = t.closest('[data-goto]'); if (go) return goStep(+go.dataset.goto);
  const next = t.closest('[data-next]'); if (next) return next.dataset.next === 'apply' ? applyToForm() : goStep(+next.dataset.next);
});
root?.addEventListener('toggle', event => { if (event.target.matches('.plan-points')) state.pointsOpen = event.target.open; }, true);
root?.addEventListener('input', event => {
  const field = event.target.closest('[data-field]'); if (!field) return;
  state[field.dataset.field] = field.value;
});

if (root) init();
