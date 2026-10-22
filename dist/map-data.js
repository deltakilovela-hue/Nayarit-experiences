// Datos del mapa y del recorrido «Arma tu plan». Las coordenadas son de Wikipedia (consultadas el 22 de octubre de 2026).
// Los textos no prometen cobertura: el proveedor confirma ruta, disponibilidad y cotización.

// Encuadres del mapa: [lonMin, latMin, lonMax, latMax].
export const regions = [
  { id: 'nayarit', label: 'Todo Nayarit', bbox: [-105.85, 20.55, -103.8, 23.15] },
  { id: 'riviera', label: 'Riviera Nayarit', bbox: [-105.64, 20.63, -105.22, 20.97] },
  { id: 'tepic', label: 'Tepic y costa', bbox: [-105.45, 21.15, -104.45, 21.95] },
  { id: 'sierra', label: 'Sierra y presas', bbox: [-105.0, 21.1, -103.85, 22.45] },
  { id: 'rutas', label: 'Rutas de taxi aéreo', bbox: [-106.9, 20.25, -102.2, 24.35] }
];

// Qué quiere vivir el prospecto. `experiences` son IDs del catálogo.
export const intents = [
  { id: 'volar', label: 'Volar', caption: 'Paseos, celebraciones y aviación', image: 'coast.webp', experiences: ['panoramico', 'revelacion', 'especial', 'piloto'] },
  { id: 'moverme', label: 'Moverme', caption: 'Taxi aéreo y traslados', image: 'aircraft.webp', experiences: ['taxi-aereo', 'transporte-privado'] },
  { id: 'aventura', label: 'Aventura', caption: 'Ruta Capomo en RZR', image: 'capomo.webp', experiences: ['capomo'] },
  { id: 'descansar', label: 'Descansar', caption: 'Casas y hospedaje', image: 'villa.webp', experiences: ['casas-lujo', 'hospedaje'] },
  { id: 'sabor', label: 'Sabor', caption: 'Chef y mixología privada', image: 'chef.webp', experiences: ['chef-privado', 'mixologia-privada'] }
];

// kind: destino | presa | aeropuerto | zona | linea | cluster.
// featured: servicios del catálogo que se mencionan para ese lugar. priceFor: de ellos, cuáles muestran precio de referencia.
// showK: rango de «unidades de mapa por píxel» en que se ve el punto (mayor = más alejado). label: [dx, dy, anchor].
export const points = [
  { id: 'tepic', name: 'Tepic', kind: 'destino', lon: -104.9, lat: 21.5, tag: 'Capital de Nayarit', region: 'tepic',
    blurb: 'Capital del estado. Cuéntanos qué te gustaría vivir aquí; el proveedor confirma la cobertura.',
    featured: ['revelacion', 'especial', 'transporte-privado'], priceFor: ['revelacion'], label: [10, 4, 'start'] },
  { id: 'san-blas', name: 'San Blas', kind: 'destino', lon: -105.2856, lat: 21.5397, tag: 'Costa', region: 'tepic',
    blurb: 'Municipio costero de Nayarit. Cuéntanos qué te gustaría vivir aquí; el proveedor confirma la cobertura.',
    featured: [], label: [-10, 4, 'end'] },
  { id: 'santa-maria-del-oro', name: 'Santa María del Oro', kind: 'destino', lon: -104.586, lat: 21.3567, tag: 'Laguna de cráter', region: 'tepic',
    blurb: 'Municipio con una laguna de origen volcánico. Cuéntanos qué te gustaría vivir aquí; el proveedor confirma la cobertura.',
    featured: [], label: [10, 14, 'start'] },
  { id: 'compostela', name: 'Compostela', kind: 'destino', lon: -104.901, lat: 21.2372, tag: 'Sur de Nayarit', region: 'tepic',
    blurb: 'Municipio del sur del estado. Cuéntanos qué te gustaría vivir aquí; el proveedor confirma la cobertura.',
    featured: [], label: [-10, 14, 'end'] },
  { id: 'riviera', name: 'Riviera Nayarit', kind: 'cluster', lon: -105.37, lat: 20.82, tag: 'Costa sur · Bahía de Banderas', region: 'riviera', members: ['punta-de-mita', 'sayulita-san-pancho', 'bucerias', 'nuevo-nayarit'],
    blurb: 'Playas y pueblos costeros del sur de Nayarit. Acércate para ver sus puntos.',
    featured: ['casas-lujo', 'hospedaje', 'chef-privado', 'transporte-privado'], showK: [0.6, 99], label: [-14, 4, 'end'] },
  { id: 'punta-de-mita', name: 'Punta de Mita', kind: 'destino', lon: -105.527, lat: 20.7752, tag: 'Riviera Nayarit', region: 'riviera',
    blurb: 'Una de las zonas de referencia para consultar casas, traslados y chef privado.',
    featured: ['casas-lujo', 'hospedaje', 'transporte-privado', 'chef-privado'], showK: [0, 0.6], label: [-10, 4, 'end'] },
  { id: 'sayulita-san-pancho', name: 'Sayulita / San Pancho', kind: 'destino', lon: -105.427, lat: 20.886, tag: 'Riviera Nayarit', region: 'riviera',
    blurb: 'Pueblos costeros de la Riviera Nayarit para consultar hospedaje y casas.',
    featured: ['hospedaje', 'casas-lujo', 'chef-privado'], showK: [0, 0.6], label: [-10, 4, 'end'] },
  { id: 'bucerias', name: 'Bucerías', kind: 'destino', lon: -105.3342, lat: 20.755, tag: 'Riviera Nayarit', region: 'riviera',
    blurb: 'Costa de la Bahía de Banderas, cerca del aeropuerto de Puerto Vallarta.',
    featured: ['hospedaje', 'transporte-privado'], showK: [0, 0.6], label: [10, 4, 'start'] },
  { id: 'nuevo-nayarit', name: 'Nuevo Nayarit', kind: 'destino', lon: -105.2895, lat: 20.702, tag: 'Riviera Nayarit', region: 'riviera',
    blurb: 'Zona turística de la Bahía de Banderas, en el límite con Puerto Vallarta.',
    featured: ['hospedaje', 'transporte-privado'], showK: [0, 0.6], label: [10, 14, 'start'] },
  { id: 'aguamilpa', name: 'Presa Aguamilpa', kind: 'presa', lon: -104.8028, lat: 21.8394, tag: 'Presa hidroeléctrica', region: 'sierra',
    blurb: 'Parte del paseo aéreo por el Río Santiago y las presas.',
    featured: ['panoramico'], priceFor: ['panoramico'], showK: [0, 1.4], label: [10, 4, 'start'] },
  { id: 'el-cajon', name: 'Presa El Cajón', kind: 'presa', lon: -104.4519, lat: 21.4281, tag: 'Presa hidroeléctrica', region: 'sierra',
    blurb: 'Parte del paseo aéreo por el Río Santiago y las presas.',
    featured: ['panoramico'], priceFor: ['panoramico'], showK: [0, 1.4], label: [10, -6, 'start'] },
  { id: 'la-yesca', name: 'Presa La Yesca', kind: 'presa', lon: -104.0956, lat: 21.1972, tag: 'Presa hidroeléctrica', region: 'sierra',
    blurb: 'Parte del paseo aéreo por el Río Santiago y las presas.',
    featured: ['panoramico'], priceFor: ['panoramico'], showK: [0, 1.4], label: [-10, 14, 'end'] },
  { id: 'sierra', name: 'Sierra de Nayarit', kind: 'zona', lon: -104.518, lat: 22.2514, tag: 'Pueblos y comunidades', region: 'sierra',
    blurb: 'Zona de referencia de la sierra. El proveedor confirma a qué pueblos y comunidades puede volar.',
    featured: ['taxi-aereo'], priceFor: ['taxi-aereo'], label: [0, -34, 'middle'] },
  { id: 'pvr', name: 'Puerto Vallarta', code: 'PVR', kind: 'aeropuerto', lon: -105.2542, lat: 20.68, tag: 'Aeropuerto · Jalisco', region: 'rutas',
    blurb: 'Aeropuerto internacional junto a la Riviera Nayarit.', featured: ['taxi-aereo'], priceFor: [], showK: [0.6, 99], label: [-10, 4, 'end'] },
  { id: 'gdl', name: 'Guadalajara', code: 'GDL', kind: 'aeropuerto', lon: -103.3111, lat: 20.5217, tag: 'Aeropuerto · Jalisco', region: 'rutas',
    blurb: 'Aeropuerto internacional de Guadalajara.', featured: ['taxi-aereo'], priceFor: [], showK: [0.6, 99], label: [10, 4, 'start'] },
  { id: 'mzt', name: 'Mazatlán', code: 'MZT', kind: 'aeropuerto', lon: -106.2661, lat: 23.1614, tag: 'Aeropuerto · Sinaloa', region: 'rutas',
    blurb: 'Aeropuerto internacional de Mazatlán.', featured: ['taxi-aereo'], priceFor: [], showK: [0.6, 99], label: [10, 4, 'start'] },
  { id: 'zcl', name: 'Zacatecas', code: 'ZCL', kind: 'aeropuerto', lon: -102.6869, lat: 22.8972, tag: 'Aeropuerto · Zacatecas', region: 'rutas',
    blurb: 'Aeropuerto internacional de Zacatecas.', featured: ['taxi-aereo'], priceFor: [], showK: [0.6, 99], label: [-10, 4, 'end'] },
  { id: 'dgo', name: 'Durango', code: 'DGO', kind: 'aeropuerto', lon: -104.5314, lat: 24.1242, tag: 'Aeropuerto · Durango', region: 'rutas',
    blurb: 'Aeropuerto internacional de Durango.', featured: ['taxi-aereo'], priceFor: [], showK: [0.6, 99], label: [10, 4, 'start'] },
  // Líneas: se seleccionan tocando el trazo en el mapa o su botón.
  { id: 'rio-santiago', name: 'Río Santiago', kind: 'linea', path: 'rio-santiago', tag: 'Paseo aéreo', region: 'sierra',
    blurb: 'El paseo recorre el Río Santiago y las presas hidroeléctricas La Yesca, El Cajón y Aguamilpa.',
    featured: ['panoramico'], priceFor: ['panoramico'] },
  { id: 'playas', name: 'Playas de Nayarit', kind: 'linea', path: 'coast', tag: 'Paseo aéreo', region: 'nayarit',
    blurb: 'El paseo en avión visita las playas de Nayarit. El proveedor define la ruta.',
    featured: ['panoramico'], priceFor: ['panoramico'] }
];

// Ideas de plan: conceptos de viaje, no paquetes confirmados.
export const presets = [
  { id: 'aire', title: 'Nayarit desde el aire', blurb: 'Playas, Río Santiago y presas en un paseo en avión.', image: 'coast.webp', intents: ['volar'], experiences: ['panoramico'], place: 'rio-santiago' },
  { id: 'riviera', title: 'Escapada en Riviera Nayarit', blurb: 'Una casa cerca del mar, traslado y una cena privada.', image: 'villa.webp', intents: ['descansar', 'moverme', 'sabor'], experiences: ['casas-lujo', 'transporte-privado', 'chef-privado'], place: 'punta-de-mita' },
  { id: 'sierra', title: 'A la sierra en taxi aéreo', blurb: 'Un vuelo especial para tres personas a pueblos y comunidades de la sierra.', image: 'aircraft.webp', intents: ['moverme'], experiences: ['taxi-aereo'], place: 'sierra', route: { destination: 'sierra' } },
  { id: 'celebracion', title: 'Celebración desde el cielo', blurb: 'Una revelación de género en Tepic y una barra privada.', image: 'tepic.webp', intents: ['volar', 'sabor'], experiences: ['revelacion', 'mixologia-privada'], place: 'tepic' }
];
