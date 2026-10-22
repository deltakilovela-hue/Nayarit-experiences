// Genera dist/map-geo.js: contorno de Nayarit y estados vecinos, Río Grande de Santiago y litoral,
// ya simplificados y proyectados a coordenadas SVG, para que el mapa no dependa de servicios externos.
//
// Fuente: Natural Earth (dominio público), https://www.naturalearthdata.com
//   ne_10m_admin_1_states_provinces y ne_10m_rivers_lake_centerlines (repositorio nvkelso/natural-earth-vector).
//
// Uso (descarga los datos, ~48 MB):   node scripts/build-map-geo.mjs
// Uso con archivos locales:          node scripts/build-map-geo.mjs admin1.geojson rivers.geojson
//
// Solo hace falta volver a correrlo si se quiere cambiar el encuadre o el nivel de detalle del mapa.
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/';
const [admin1Arg, riversArg] = process.argv.slice(2);
const load = async (arg, name) => JSON.parse(arg ? await readFile(arg, 'utf8') : await (await fetch(BASE + name)).text());

// Encuadre completo: incluye los aeropuertos de Mazatlán, Durango, Zacatecas, Guadalajara y Puerto Vallarta.
const EXTENT = { lonMin: -106.9, lonMax: -102.2, latMin: 20.25, latMax: 24.35 };
const LAT0 = 22.3;                       // latitud de referencia para la escala horizontal
const WIDTH = 1000;
const kx0 = Math.cos(LAT0 * Math.PI / 180);
const S = WIDTH / ((EXTENT.lonMax - EXTENT.lonMin) * kx0);   // px por grado de latitud
const HEIGHT = Math.round((EXTENT.latMax - EXTENT.latMin) * S);
const project = ([lon, lat]) => [(lon - EXTENT.lonMin) * kx0 * S, (EXTENT.latMax - lat) * S];
const r1 = n => Math.round(n * 10) / 10;

const KEEP = { 'Nayarit': 'nayarit', 'Jalisco': 'jalisco', 'Sinaloa': 'sinaloa', 'Durango': 'durango', 'Zacatecas': 'zacatecas', 'Aguascalientes': 'aguascalientes' };

// Douglas–Peucker
function simplify(pts, tol) {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop(); let max = 0, idx = -1;
    for (let i = a + 1; i < b; i++) { const d = distSeg(pts[i], pts[a], pts[b]); if (d > max) { max = d; idx = i; } }
    if (max > tol && idx > 0) { keep[idx] = 1; stack.push([a, idx], [idx, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}
function distSeg(p, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1], l2 = dx * dx + dy * dy;
  let t = l2 ? ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l2 : 0; t = Math.max(0, Math.min(1, t));
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
}
// Recorte de polígono contra un rectángulo (Sutherland–Hodgman)
function clipRing(ring, box) {
  const edges = [
    [p => p[0] >= box.x0, (a, b) => { const t = (box.x0 - a[0]) / (b[0] - a[0]); return [box.x0, a[1] + t * (b[1] - a[1])]; }],
    [p => p[0] <= box.x1, (a, b) => { const t = (box.x1 - a[0]) / (b[0] - a[0]); return [box.x1, a[1] + t * (b[1] - a[1])]; }],
    [p => p[1] >= box.y0, (a, b) => { const t = (box.y0 - a[1]) / (b[1] - a[1]); return [a[0] + t * (b[0] - a[0]), box.y0]; }],
    [p => p[1] <= box.y1, (a, b) => { const t = (box.y1 - a[1]) / (b[1] - a[1]); return [a[0] + t * (b[0] - a[0]), box.y1]; }]
  ];
  let out = ring;
  for (const [inside, cross] of edges) {
    const input = out; out = [];
    for (let i = 0; i < input.length; i++) {
      const cur = input[i], prev = input[(i + input.length - 1) % input.length];
      if (inside(cur)) { if (!inside(prev)) out.push(cross(prev, cur)); out.push(cur); }
      else if (inside(prev)) out.push(cross(prev, cur));
    }
    if (!out.length) break;
  }
  return out;
}
const pathOf = (pts, close) => pts.length < 2 ? '' : 'M' + pts.map(p => r1(p[0]) + ' ' + r1(p[1])).join('L') + (close ? 'Z' : '');
const area = ring => Math.abs(ring.reduce((s, p, i) => { const q = ring[(i + 1) % ring.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0) / 2);
const centroid = ring => { let a = 0, cx = 0, cy = 0; ring.forEach((p, i) => { const q = ring[(i + 1) % ring.length], f = p[0] * q[1] - q[0] * p[1]; a += f; cx += (p[0] + q[0]) * f; cy += (p[1] + q[1]) * f; }); a /= 2; return [cx / (6 * a), cy / (6 * a)]; };
const polys = g => g.type === 'MultiPolygon' ? g.coordinates : [g.coordinates];

const admin1 = await load(admin1Arg, 'ne_10m_admin_1_states_provinces.geojson');
const rivers = await load(riversArg, 'ne_10m_rivers_lake_centerlines.geojson');
const fix = s => (s || '').normalize('NFC');

const pad = 1.0;
const box = { x0: EXTENT.lonMin - pad, x1: EXTENT.lonMax + pad, y0: EXTENT.latMin - pad, y1: EXTENT.latMax + pad };
const stateFeatures = admin1.features.filter(f => f.properties.admin === 'Mexico' && KEEP[fix(f.properties.name)]);

const states = [];
for (const f of stateFeatures) {
  const id = KEEP[fix(f.properties.name)];
  const tol = id === 'nayarit' ? 0.004 : 0.02;
  const rings = polys(f.geometry).map(poly => clipRing(poly[0], box)).filter(r => r.length > 2);
  const simp = rings.map(r => simplify(r, tol));
  const proj = simp.map(r => r.map(project));
  const main = proj.reduce((a, b) => area(b) > area(a) ? b : a, proj[0]);
  states.push({ id, name: fix(f.properties.name), d: proj.map(r => pathOf(r, true)).join(''), label: centroid(main).map(r1) });
}

// Litoral de Nayarit continental: aristas que no son frontera con otro estado.
const nay = stateFeatures.find(f => KEEP[fix(f.properties.name)] === 'nayarit');
const neighbours = stateFeatures.filter(f => f !== nay);
const nbSegs = neighbours.flatMap(f => polys(f.geometry).flatMap(poly => poly.flatMap(ring => ring.slice(1).map((p, i) => [ring[i], p]))));
const isBorder = (a, b) => { const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; return nbSegs.some(([p, q]) => Math.abs(p[0] - m[0]) < 0.05 && Math.abs(p[1] - m[1]) < 0.05 && distSeg(m, p, q) < 0.012); };
const mainland = polys(nay.geometry).map(p => p[0]).reduce((a, b) => b.length > a.length ? b : a);
const runs = []; let cur = [];
for (let i = 0; i < mainland.length - 1; i++) {
  const a = mainland[i], b = mainland[i + 1];
  if (!isBorder(a, b)) { if (!cur.length) cur.push(a); cur.push(b); } else if (cur.length) { runs.push(cur); cur = []; }
}
if (cur.length) runs.push(cur);
const coastRuns = runs.filter(r => r.length > 10).sort((a, b) => b.length - a.length);

// Ríos
const riverOut = [];
for (const f of rivers.features) {
  const name = fix(f.properties.name);
  if (!/Santiago|San Pedro/.test(name)) continue;
  const lines = f.geometry.type === 'MultiLineString' ? f.geometry.coordinates : [f.geometry.coordinates];
  const d = lines.map(l => pathOf(simplify(l.filter(p => p[0] > box.x0 && p[0] < box.x1 && p[1] > box.y0 && p[1] < box.y1), 0.006).map(project), false)).join('');
  if (d) riverOut.push({ id: /Santiago/.test(name) ? 'rio-santiago' : 'rio-san-pedro', name: /Santiago/.test(name) ? 'Río Grande de Santiago' : 'Río San Pedro', d });
}
// Une los tramos del Río Santiago (cauce y tramo en vaso de presa) en una sola entrada.
const merged = [];
for (const r of riverOut) { const prev = merged.find(m => m.id === r.id); if (prev) prev.d += r.d; else merged.push({ ...r }); }

const out = `// Generado por scripts/build-map-geo.mjs a partir de Natural Earth (dominio público). No editar a mano.
export const GEO = ${JSON.stringify({
  width: WIDTH, height: HEIGHT,
  proj: { lon0: EXTENT.lonMin, lat1: EXTENT.latMax, kx: kx0, s: S },
  extent: EXTENT,
  states,
  rivers: merged,
  coast: coastRuns.map(r => pathOf(simplify(r, 0.004).map(project), false))
})};
export const project = (lon, lat) => [(lon - GEO.proj.lon0) * GEO.proj.kx * GEO.proj.s, (GEO.proj.lat1 - lat) * GEO.proj.s];
`;
await writeFile(join(root, 'dist', 'map-geo.js'), out);
console.log(`dist/map-geo.js: ${(out.length / 1024).toFixed(1)} KB · ${WIDTH}x${HEIGHT} · estados ${states.map(s => s.id).join(', ')} · ríos ${merged.map(r => r.id).join(', ')} · tramos de litoral ${coastRuns.length}`);
