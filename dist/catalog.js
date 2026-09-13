// Content model: categories and providers can grow independently of the UI.
export const categories = [
  { id: 'aventura', label: 'Aventura', status: 'inquiry' },
  { id: 'aviacion', label: 'Aviación', status: 'inquiry' },
  { id: 'transporte', label: 'Transporte', status: 'inquiry' },
  { id: 'hospedaje', label: 'Hospedaje', status: 'inquiry' },
  { id: 'casas', label: 'Casas de lujo', status: 'inquiry' },
  { id: 'gastronomia', label: 'Chef privado', status: 'inquiry' },
  { id: 'mixologia', label: 'Mixología', status: 'inquiry' },
  { id: 'vinedos', label: 'Viñedos', status: 'planned' },
  { id: 'restaurantes', label: 'Restaurantes', status: 'planned' },
  { id: 'day-pass', label: 'Day pass', status: 'planned' }
];
export const providers = [{
  id: 'dirty-monkey', name: 'Dirty Monkey Adventure', status: 'reference', partnership: 'not_confirmed',
  sourceUrl: 'https://dirtymonkeyadventure.com/es/tour/nayarit-route-capomo', verifiedOn: '2026-09-13'
}];
const aviationExperiences = [
  {
    id: 'panoramico', categoryId: 'aviacion', providerIds: [], status: 'inquiry', filter: 'paisajes',
    name: 'Vuelo panorámico', tag: 'PARA CAMBIAR DE PERSPECTIVA', badge: 'Paisajes que se quedan', image: 'coast.webp', imagePosition: '50% 48%',
    alt: 'Vista aérea del mar turquesa y la playa de Punta Mita, Nayarit',
    description: 'Redescubre los paisajes, la costa y la ciudad desde una perspectiva que se queda contigo.',
    detail: 'Imagina compartir una vista diferente de Nayarit con alguien especial. Cuéntanos qué paisaje te gustaría conocer para consultar una propuesta de vuelo panorámico con un proveedor.',
    occasion: 'Escapada, regalo o celebración',
    considerations: ['Comparte tu zona o paisaje de interés.', 'Indica cuántas personas viajarían y una fecha tentativa.', 'El proveedor define ruta, duración, capacidad y condiciones operativas.']
  },
  {
    id: 'revelacion', categoryId: 'aviacion', providerIds: [], status: 'inquiry', filter: 'celebraciones',
    name: 'Revelación de género', tag: 'UN MOMENTO PARA COMPARTIR', badge: 'Celebraciones', image: 'aircraft.webp', imagePosition: '50% 52%',
    alt: 'Aeronave ligera en tierra al atardecer; fotografía de referencia',
    description: 'Explora una idea desde el aire para convertir ese gran anuncio en un recuerdo especial.',
    detail: 'Cada celebración es distinta. Comparte tu idea, el lugar del evento y la fecha para consultar si un proveedor puede desarrollar una propuesta aérea adecuada para la ocasión.',
    occasion: 'Una celebración en familia',
    considerations: ['Comparte el municipio y tipo de espacio de tu evento.', 'La dinámica se define únicamente después de revisar su viabilidad.', 'No se promete un sobrevuelo, lanzamiento de materiales ni una operación específica.']
  },
  {
    id: 'especial', categoryId: 'aviacion', providerIds: [], status: 'inquiry', filter: 'descubrir',
    name: 'Vuelo especial', tag: 'TU IDEA DEFINE EL INICIO', badge: 'A tu manera', image: 'tepic.webp', imagePosition: '50% 54%',
    alt: 'Tepic y el cerro Sangangüey entre nubes al atardecer',
    description: '¿Tienes un destino o una ocasión en mente? Cuéntanos tu idea y exploremos sus posibilidades.',
    detail: 'Una solicitud personalizada comienza por entender qué necesitas. Describe el propósito y la región que tienes en mente para que el equipo pueda buscar un proveedor apropiado y consultar la viabilidad.',
    occasion: 'Proyectos y solicitudes especiales',
    considerations: ['Indica el propósito, origen y destino tentativos.', 'El proveedor determina qué operación puede realizar y bajo qué condiciones.', 'No constituye una oferta de transporte regular ni una ruta confirmada.']
  },
  {
    id: 'piloto', categoryId: 'aviacion', providerIds: [], status: 'inquiry', filter: 'descubrir',
    name: 'Piloto por un día', tag: 'DALE ALAS A TU CURIOSIDAD', badge: 'Descubre la aviación', image: 'cockpit.webp', imagePosition: '50% 50%',
    alt: 'Instrumentos y controles de una cabina de aviación ligera; fotografía de referencia',
    description: 'Conoce de cerca el mundo de la aviación y pregunta por una experiencia introductoria acompañada.',
    detail: 'Si siempre te ha llamado la atención la aviación, este es el punto de partida para explorar una actividad introductoria. Un proveedor especializado deberá definir su alcance y las actividades permitidas.',
    occasion: 'Curiosidad, aprendizaje o regalo',
    considerations: ['Cuéntanos si es tu primer acercamiento a la aviación.', 'La edad mínima, el acompañamiento y las actividades dependen del proveedor.', 'No implica formación certificada ni garantiza que puedas operar los controles.']
  }
];

const newExperiences = [
  {
    id: 'capomo', categoryId: 'aventura', providerIds: ['dirty-monkey'], status: 'inquiry',
    name: 'Ruta Capomo en RZR', tag: 'DIRTY MONKEY ADVENTURE', badge: 'Aventura · Bajo consulta', image: 'capomo.webp', imagePosition: '50% 54%',
    alt: 'Vehículo Polaris RZR de referencia; no es una fotografía de la Ruta Capomo',
    description: 'Explora senderos y cruces de río en una expedición guiada por Nayarit.',
    detail: 'Dirty Monkey Adventure describe una ruta de 3 horas en Polaris RZR, con guías bilingües y recogida en puntos designados. La salida habitual es grupal; la modalidad privada se consulta aparte.',
    occasion: 'Una aventura entre naturaleza y montaña',
    facts: [['Duración publicada', '3 horas'], ['Modalidad', 'Salida grupal; privada bajo consulta']],
    considerations: [
      'Conductores: desde 16 años con licencia o permiso vigente. Pasajeros: desde 4 años; menores con autorización.',
      'Protección contra colisiones obligatoria: 30 USD por RZR, adicional y pagadera al check-in. Cotización por vehículo.',
      'La salida es desde una base en Nayarit. Recogida y condiciones deben confirmarse con el operador.',
      'La ruta y el acceso al río dependen del clima. Revisa todas las restricciones en la fuente oficial.'
    ],
    briefFields: [
      { name:'pickup', label:'Zona de recogida', placeholder:'Municipio o zona donde te hospedas' },
      { name:'mode', label:'Modalidad de interés', options:['Por definir','Salida grupal','Consultar salida privada'] }
    ],
    photoNote: 'Imagen de referencia; no corresponde al recorrido ni a los vehículos del operador.'
  },
  {
    id: 'casas-lujo', categoryId: 'casas', providerIds: [], status: 'inquiry',
    name: 'Casas de lujo en la playa', tag: 'UN ESPACIO SOLO PARA USTEDES', badge: 'Renta vacacional · Bajo consulta', image: 'villa.webp', imagePosition: '50% 50%',
    alt: 'Casa con alberca como inspiración; no representa una propiedad disponible en Nayarit',
    description: 'Imagina una casa para compartir, descansar y disfrutar las playas de Nayarit a tu ritmo.',
    detail: 'Prepara una búsqueda de renta vacacional de casas y villas de lujo en las playas de Nayarit. Cuéntanos la zona, las fechas y el número de huéspedes para explorar opciones con un proveedor. No hay propiedades ni inventario confirmados en este catálogo.',
    occasion: 'Vacaciones en familia, amigos o una escapada especial',
    considerations: ['Indica playa o zona, fechas, recámaras y presupuesto aproximado.', 'Vista al mar, acceso a playa, alberca y demás amenidades se revisan para cada propiedad.', 'El proveedor confirma inmueble, disponibilidad, tarifa, depósito, reglas y contrato.'],
    stay: true,
    briefFields: [
      { name:'zone', label:'Playa o zona de interés', placeholder:'Ej. Punta de Mita, Sayulita o por definir', required:true },
      { name:'checkout', label:'Fecha de salida', type:'date', required:true },
      { name:'rooms', label:'Recámaras deseadas', type:'number', min:1, max:50, placeholder:'Ej. 4' },
      { name:'budget', label:'Presupuesto por noche (MXN)', placeholder:'Aproximado, opcional' }
    ],
    photoNote: 'Fotografía de inspiración. No es una propiedad ofertada ni una ubicación confirmada en Nayarit.'
  },
  {
    id: 'transporte-privado', categoryId: 'transporte', providerIds: [], status: 'inquiry',
    name: 'Transporte privado', tag: 'EL VIAJE TAMBIÉN SE DISFRUTA', badge: 'Traslados · Bajo consulta', image: 'transporte.webp', imagePosition: '50% 55%',
    alt: 'Vehículo de referencia para ilustrar transporte privado; unidad y proveedor por confirmar',
    description: 'Del aeropuerto a tu estancia, entre destinos o para acompañar un día especial en Nayarit.',
    detail: 'Solicita opciones de transporte terrestre privado para tu itinerario. Comparte origen, destino, horario, pasajeros y equipaje para consultar la unidad adecuada. La cobertura, tipo de vehículo y servicio se confirman con el proveedor.',
    occasion: 'Aeropuerto, hospedaje, experiencias y eventos',
    considerations: ['Indica si necesitas ida, viaje redondo o servicio por horas.', 'Comparte equipaje y necesidades de movilidad para consultar opciones.', 'El proveedor define tarifa, punto de encuentro, tiempos de espera y condiciones.'],
    briefFields: [
      { name:'origin', label:'Origen', placeholder:'Aeropuerto, hotel o zona', required:true },
      { name:'destination', label:'Destino', placeholder:'Playa, hospedaje o municipio', required:true },
      { name:'time', label:'Hora aproximada', type:'time' },
      { name:'trip', label:'Tipo de traslado', options:['Por definir','Solo ida','Viaje redondo','Por horas'] }
    ]
  },
  {
    id: 'chef-privado', categoryId: 'gastronomia', providerIds: [], status: 'inquiry',
    name: 'Chef privado', tag: 'GASTRONOMÍA HECHA PARA TU MESA', badge: 'En tu estancia · Bajo consulta', image: 'chef.webp', imagePosition: '50% 55%',
    alt: 'Chef preparando un platillo; fotografía de inspiración sin proveedor confirmado',
    description: 'Una cena especial, una celebración o una propuesta gastronómica para compartir en tu estancia.',
    detail: 'Cuéntanos qué tipo de comida te gustaría disfrutar y dónde sería el servicio. Conectamos tu interés con opciones de chef privado para consultar un menú y una experiencia a la medida de tu grupo.',
    occasion: 'Cena privada, celebración o comidas durante tu estancia',
    considerations: ['Comparte comensales, ocasión, estilo de cocina y presupuesto aproximado.', 'El chef confirma menú, ingredientes, equipo de cocina necesario y personal incluido.', 'Horarios, montaje, servicio y limpieza deben quedar definidos en la propuesta.'],
    briefFields: [
      { name:'zone', label:'Zona del servicio', placeholder:'Municipio, playa o estancia', required:true },
      { name:'occasion', label:'Ocasión', placeholder:'Cena, cumpleaños o varios días' },
      { name:'cuisine', label:'Estilo de cocina', placeholder:'Mexicana, mariscos, menú degustación…' }
    ]
  },
  {
    id: 'mixologia-privada', categoryId: 'mixologia', providerIds: [], status: 'inquiry',
    name: 'Mixología privada', tag: 'UN BRINDIS CON TU PROPIO ESTILO', badge: 'Eventos · Bajo consulta', image: 'mixologia.webp', imagePosition: '50% 50%',
    alt: 'Preparación de un cóctel en barra; imagen de referencia sin proveedor confirmado',
    description: 'Explora una barra personalizada de cócteles y opciones sin alcohol para tu reunión.',
    detail: 'Diseña la idea de un servicio de mixología para una villa, estancia o celebración privada. Indica el estilo de bebidas, invitados y duración para consultar una propuesta con un especialista.',
    occasion: 'Celebraciones, reuniones y experiencias en tu estancia',
    considerations: ['Se pueden consultar opciones sin alcohol. Las bebidas con alcohol se destinan únicamente a adultos.', 'El proveedor confirma destilados, mezcladores, hielo, cristalería y montaje incluidos.', 'Horario, cantidad de bebidas, personal y desmontaje se cotizan según el evento.'],
    briefFields: [
      { name:'zone', label:'Zona del evento', placeholder:'Municipio, playa o estancia', required:true },
      { name:'drinks', label:'Estilo de bebidas', options:['Por definir','Sin alcohol','Con y sin alcohol','Cócteles para adultos'] },
      { name:'duration', label:'Duración aproximada', placeholder:'Ej. 3 horas' }
    ]
  },
  {
    id: 'hospedaje', categoryId: 'hospedaje', providerIds: [], status: 'inquiry',
    name: 'Hospedaje a tu medida', tag: 'ENCUENTRA TU FORMA DE DESCANSAR', badge: 'Estancias · Bajo consulta', image: 'hospedaje.webp', imagePosition: '50% 50%',
    alt: 'Habitación de inspiración; no representa un hotel ni una estancia disponible en Nayarit',
    description: 'Desde una escapada en pareja hasta una estancia para todo el grupo: cuéntanos cómo quieres descansar.',
    detail: 'Solicita orientación para encontrar hospedaje en Nayarit según tu plan y presupuesto. Comparte fechas, zona y preferencias para explorar alternativas con proveedores. Las propiedades y tarifas se confirman en la propuesta.',
    occasion: 'Escapadas, vacaciones y viajes en grupo',
    considerations: ['Indica zona, fechas de entrada y salida, huéspedes y habitaciones.', 'Comparte el tipo de estancia y servicios que te gustaría consultar.', 'El proveedor confirma alojamiento, tarifa final, ocupación y políticas de cambio o cancelación.'],
    stay: true,
    briefFields: [
      { name:'zone', label:'Zona de interés', placeholder:'Playa, municipio o por definir', required:true },
      { name:'checkout', label:'Fecha de salida', type:'date', required:true },
      { name:'rooms', label:'Habitaciones deseadas', type:'number', min:1, max:50, placeholder:'Ej. 2' },
      { name:'budget', label:'Presupuesto por noche (MXN)', placeholder:'Aproximado, opcional' }
    ]
  }
];
export const experiences = [newExperiences[0], aviationExperiences[0], ...newExperiences.slice(1), ...aviationExperiences.slice(1)];
export const complementaryIds = ['transporte-privado','hospedaje','casas-lujo','chef-privado','mixologia-privada'];
