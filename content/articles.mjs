// Original editorial drafts. Service IDs link each guide to the inquiry catalog.
export const articles = [
  {
    slug: 'escapada-privada-punta-de-mita', category: 'Destinos', image: 'coast.webp',
    title: 'Punta de Mita a tu manera: cómo imaginar una escapada privada',
    description: 'Una guía para combinar estancia, transporte y experiencias privadas en Punta de Mita, empezando por lo que tu grupo necesita.',
    service: 'casas-lujo', complements: ['transporte-privado','chef-privado'],
    lead: 'Una escapada privada empieza mucho antes de elegir una casa o una actividad. Empieza con una pregunta sencilla: ¿cómo quieren pasar el tiempo juntos? Esa respuesta puede ordenar todo el viaje.',
    sections: [
      {title:'Primero, el ritmo del viaje', paragraphs:[
        'Para planear unos días en Punta de Mita, anota qué momentos quieres compartir y cuáles prefieres dejar abiertos. Tal vez el centro del viaje sea una celebración; quizá busques desayunos largos, una salida de aventura o simplemente tiempo para descansar. No hace falta llenar cada hora para que la experiencia tenga sentido.',
        'Define quiénes viajan, las fechas y un presupuesto aproximado. Añade las necesidades que afectan al grupo: distribución de habitaciones, facilidad de acceso, espacios para reunirse o flexibilidad en los horarios. Esta primera conversación ayuda a pedir propuestas que respondan a tu plan.'
      ]},
      {title:'La estancia como punto de encuentro', paragraphs:[
        'Si imaginas una casa, describe cómo la usarían. Una mesa para cenar juntos puede ser tan relevante como el número de recámaras. Distingue entre una propiedad frente al mar, una con vista y una ubicada cerca de la playa: no son características equivalentes y deben verificarse para cada opción.',
        'Si prefieres hospedaje, señala qué servicios necesitas y cuáles son opcionales. Antes de elegir, pide ubicación precisa, capacidad autorizada, tarifa completa y condiciones. Las fotografías deben corresponder al alojamiento que el proveedor te propone.'
      ]},
      {title:'Combina servicios alrededor de un momento', paragraphs:[
        'En lugar de armar una lista interminable, piensa en una escena: llegar a la estancia, instalarte con calma y compartir una cena. Esa idea puede traducirse en una consulta de transporte y chef privado. Otra posibilidad es dejar un día abierto para una experiencia de aventura, según las condiciones que confirme el operador.',
        'Los servicios se revisan por separado. Una casa no implica que tenga chef incluido, y una actividad no garantiza traslado desde tu domicilio. Preguntar por esos detalles evita que una buena idea dependa de supuestos.'
      ]},
      {title:'Un primer mensaje que ayude a avanzar', paragraphs:[
        'Comparte zona de interés, fechas, personas, estilo de estancia y hasta tres prioridades. Si aún no tienes algo decidido, dilo. Es más útil saber que una fecha es flexible que construir una propuesta alrededor de un dato provisional.',
        'Nayarit Experiences reúne ese interés para orientar la conexión con proveedores. La propuesta, disponibilidad y confirmación corresponden a cada proveedor. Esta guía es una idea para organizar tu consulta, no un paquete ni un itinerario confirmado.'
      ]}
    ], checklist:['Fechas y número de viajeros','Zona y tipo de estancia','Un momento que quieras hacer especial','Servicios que deseas combinar'], cta:'Imaginar mi escapada'
  },
  {
    slug: 'renta-casas-lujo-playas-nayarit', category: 'Estancias', image: 'villa.webp',
    title: 'Casas de lujo en las playas de Nayarit: qué revisar antes de elegir',
    description: 'Ubicación, recámaras, espacios compartidos y servicios: prepara una consulta de renta vacacional con prioridades claras.',
    service: 'casas-lujo', complements: ['chef-privado'],
    lead: 'Una casa puede convertirse en el escenario de todo el viaje. Para encontrar una que tenga sentido para tu grupo, conviene mirar más allá de una fotografía atractiva y explicar cómo quieren vivir la estancia.',
    sections: [
      {title:'Describe a tu grupo, no solo el número de personas', paragraphs:[
        'El total de huéspedes es el punto de partida. Después viene la distribución: cuántas habitaciones desean, qué camas necesitan y qué espacios les gustaría compartir. Familias, parejas y amigos pueden necesitar configuraciones distintas aunque viajen en el mismo número.',
        'Comparte también si habrá una celebración o visitas durante la estancia. La capacidad para dormir y la autorización para recibir un evento son cuestiones diferentes. El proveedor debe confirmar qué usos permite cada inmueble.'
      ]},
      {title:'Aclara qué significa estar cerca del mar', paragraphs:[
        'Al consultar casas en las playas de Nayarit, precisa si buscas acceso directo, vista al mar o proximidad a una playa. Solicita la ubicación y pregunta por el recorrido real de acceso. Una imagen de costa no describe por sí sola la relación de la casa con la playa.',
        'Ordena tus preferencias entre indispensables y deseables. Alberca, sombra, áreas exteriores, cocina equipada o facilidad de acceso pueden ser más útiles para tu grupo que una lista extensa de amenidades que no utilizarán.'
      ]},
      {title:'Pregunta qué incluye la propuesta', paragraphs:[
        'Pide una descripción completa de lo incluido: limpieza, personal, consumos, mantenimiento y servicios adicionales. Consulta horarios de entrada y salida, depósito, reglas de la propiedad y condiciones para cambios. Compara propuestas con el mismo alcance para entender sus diferencias.',
        'Si quieres chef o mixología privada, consulta si la casa permite proveedores externos y qué instalaciones pueden utilizar. Define quién coordina el acceso, el montaje y la entrega del espacio. La renta y los servicios complementarios requieren confirmaciones específicas.'
      ]},
      {title:'Prepara una búsqueda con margen', paragraphs:[
        'Envía tus fechas, zona, huéspedes, habitaciones y presupuesto aproximado por noche. Si puedes cambiar de fecha o de zona, indícalo. También ayuda compartir qué característica no estás dispuesto a sacrificar.',
        'Nuestro catálogo muestra la posibilidad de solicitar orientación; no presenta un inventario de casas disponibles. Las fotos son de inspiración. Nayarit Experiences funciona como puente de contacto y el proveedor debe confirmar la propiedad concreta, la tarifa y las condiciones de contratación.'
      ]}
    ], checklist:['Fechas de entrada y salida','Huéspedes y distribución de recámaras','Ubicación y acceso que esperas','Presupuesto y servicios adicionales'], cta:'Consultar una casa para mi grupo'
  },
  {
    slug: 'chef-mixologia-privada-nayarit', category: 'Gastronomía', image: 'chef.webp',
    title: 'Chef y mixología privada: una celebración empieza en tu mesa',
    description: 'Cómo preparar la idea de una cena y una barra privada en Nayarit: ocasión, menú, bebidas, espacio y alcance del servicio.',
    service: 'chef-privado', complements: ['mixologia-privada'],
    lead: 'Una cena especial no tiene que empezar por un menú cerrado. Puede comenzar con el tipo de encuentro que quieres crear: íntimo, relajado, festivo o pensado para una larga conversación.',
    sections: [
      {title:'Cuéntanos qué quieres celebrar', paragraphs:[
        'Para consultar un chef privado en Nayarit, describe la ocasión, el lugar y cuántas personas se sentarán a la mesa. Una cena de cumpleaños, una comida familiar y varios días de servicio durante una estancia plantean necesidades distintas.',
        'Comparte el estilo de cocina que te interesa y un presupuesto aproximado. Puedes explicar sabores que disfrutas o el tipo de presentación que imaginas sin diseñar cada plato. El chef será quien proponga un menú viable y detalle sus condiciones.'
      ]},
      {title:'El espacio también forma parte del menú', paragraphs:[
        'Antes de confirmar, consulta qué cocina y equipo necesita el profesional. Pregunta por utensilios, refrigeración, vajilla, montaje y personal de servicio. Una cocina doméstica y un espacio preparado para eventos no ofrecen necesariamente las mismas posibilidades.',
        'Define con el proveedor los tiempos de preparación, servicio y limpieza. Si la estancia es rentada, consulta con su responsable las reglas para recibir personal externo. Conviene que todos sepan quién autoriza el acceso y cómo se entrega el espacio al terminar.'
      ]},
      {title:'Una barra que acompañe el encuentro', paragraphs:[
        'La mixología privada puede consultarse como complemento o como servicio principal. Describe si buscas bebidas sin alcohol, una selección mixta o cócteles para adultos. El número de invitados, la duración y el estilo del evento ayudan a definir una propuesta.',
        'Pregunta qué incluye: insumos, hielo, cristalería, equipo de barra, montaje y personal. Aclara si la propuesta considera una cantidad de bebidas o un periodo de servicio, y cómo se cotizan cambios de alcance. No supongas que el precio del chef cubre también la barra.'
      ]},
      {title:'De la idea a una propuesta clara', paragraphs:[
        'En tu solicitud, reúne zona, fecha, comensales, ocasión y preferencias generales. Las restricciones alimentarias y otras necesidades particulares deben revisarse directamente con el profesional antes de confirmar el menú.',
        'Nayarit Experiences ayuda a expresar tu interés y conectarlo con proveedores. Cada profesional confirma disponibilidad, ingredientes, personal, tarifa y condiciones. Las imágenes del catálogo ilustran el tipo de experiencia; no identifican a un chef contratado ni a una barra disponible.'
      ]}
    ], checklist:['Zona y tipo de espacio','Fecha y número de comensales','Ocasión y estilo de cocina','Bebidas y duración del encuentro'], cta:'Preparar mi cena privada'
  },
  {
    slug: 'transporte-privado-nayarit', category: 'Planea tu viaje', image: 'transporte.webp',
    title: 'Transporte privado en Nayarit: los detalles que ordenan tu llegada',
    description: 'Prepara una consulta de traslado privado con origen, destino, pasajeros, equipaje y horarios claros.',
    service: 'transporte-privado', complements: ['hospedaje'],
    lead: 'Un traslado bien planteado conecta las partes de tu viaje. Para consultar una opción de transporte privado, lo más útil es compartir el recorrido real y las necesidades del grupo desde el principio.',
    sections: [
      {title:'Empieza con dos puntos concretos', paragraphs:[
        'Define el origen y el destino con la mayor claridad posible. Si todavía no conoces la dirección de tu estancia, comparte la zona y aclara que está por confirmarse. Evita asumir que el nombre de una playa describe el punto exacto de llegada.',
        'Si se trata de un aeropuerto, indica cuál y la fecha prevista. Los datos específicos del vuelo y las instrucciones de encuentro se pueden revisar directamente con el proveedor al avanzar con la propuesta.'
      ]},
      {title:'Pasajeros y equipaje van juntos', paragraphs:[
        'El número de asientos es solo una parte de la consulta. Describe cuántas maletas llevarán y si viajan con equipo voluminoso. Añade las necesidades de movilidad o de acceso que el proveedor deba considerar al proponer una unidad.',
        'No elijas un tipo de vehículo únicamente por una fotografía. Pide que el proveedor confirme capacidad, espacio para equipaje y características de la unidad que realmente propone para tu servicio.'
      ]},
      {title:'Distingue traslado, viaje redondo y servicio por horas', paragraphs:[
        'Un recorrido de ida tiene un alcance distinto a un viaje redondo. Si necesitas regreso, comparte otra fecha y horario, aunque sean tentativos. Si buscas acompañamiento durante varias actividades, explica el itinerario y las paradas que imaginas.',
        'Pregunta cómo se definen tiempos de espera, paradas adicionales y cambios de recorrido. Un servicio por horas tampoco debe interpretarse como cobertura ilimitada: su alcance tiene que quedar descrito en la propuesta.'
      ]},
      {title:'Conecta el traslado con el resto del plan', paragraphs:[
        'Coordina la llegada con el horario de entrada de tu hospedaje o con el punto de encuentro de tu experiencia. Deja esas dependencias claras al pedir información; el proveedor podrá explicar qué horarios y condiciones puede atender.',
        'En Nayarit Experiences puedes indicar transporte como interés principal o como complemento de otra idea. La cobertura, tarifa, unidad y confirmación corresponden al proveedor. El catálogo no representa una flota propia ni garantiza tiempos de recorrido.'
      ]}
    ], checklist:['Origen y destino','Fecha y horario tentativo','Pasajeros y equipaje','Ida, regreso o itinerario por horas'], cta:'Consultar mi traslado'
  },
  {
    slug: 'ruta-capomo-rzr-nayarit', category: 'Aventura', image: 'capomo.webp',
    title: 'Ruta Capomo en RZR: cómo integrar una aventura a tu viaje por Nayarit',
    description: 'Prepara tu consulta sobre Ruta Capomo con Dirty Monkey Adventure y conecta esa idea con el resto de tu estancia.',
    service: 'capomo', complements: ['transporte-privado'],
    lead: 'Si quieres sumar una salida de aventura a tu estancia, la Ruta Capomo de Dirty Monkey Adventure es una opción de referencia para explorar. El primer paso es conocer la ficha del operador y entender cómo encaja con tu grupo.',
    sections: [
      {title:'La aventura empieza con las preguntas correctas', paragraphs:[
        'Antes de elegir una fecha, habla con quienes viajarán contigo. ¿Todos quieren participar? ¿Qué esperan de la experiencia? ¿Buscan compartir una salida o consultar una modalidad privada? Explicar esas preferencias ayuda a orientar una solicitud sin dar por hecho que todas las opciones tienen el mismo alcance.',
        'En la ficha de Nayarit Experiences encontrarás un resumen de referencia y un enlace al operador. Revisa allí las condiciones vigentes antes de tomar una decisión. Los datos de un tour pueden cambiar y una descripción editorial no sustituye la confirmación directa.'
      ]},
      {title:'Alinea la actividad con tu estancia', paragraphs:[
        'Comparte dónde te hospedarás y si esa ubicación ya está definida. Pregunta por el punto de encuentro, la recogida y lo que debes tener previsto antes de salir. No asumas que un servicio de transporte adicional es necesario ni que está incluido desde cualquier domicilio.',
        'Si piensas combinar la actividad con otra experiencia o una cena, evita fijar horarios consecutivos sin consultar al operador. Es mejor construir el resto del día alrededor de una logística confirmada que ajustar el plan durante la salida.'
      ]},
      {title:'Revisa el alcance completo', paragraphs:[
        'Solicita la cotización con sus inclusiones y cargos adicionales. Aclara quiénes participarán, qué requisitos les corresponden y cuáles son las condiciones aplicables a cambios. Estas preguntas ayudan a comparar tu expectativa con la propuesta real.',
        'Las imágenes de nuestro catálogo son ilustrativas. No muestran necesariamente el recorrido ni los vehículos del operador. Para detalles específicos, utiliza la fuente oficial enlazada y pide la información que necesites antes de confirmar.'
      ]},
      {title:'Tu interés, en un solo lugar', paragraphs:[
        'Puedes preparar una solicitud con el nombre de la experiencia, personas, fecha tentativa y zona de estancia. Si tu grupo tiene una preferencia de modalidad, inclúyela. También puedes señalar otros servicios que quieras explorar para el mismo viaje.',
        'Nayarit Experiences es un puente de contacto. Dirty Monkey Adventure aparece como operador de referencia; su mención no implica una alianza confirmada. La disponibilidad, condiciones y cierre de esta actividad corresponden al operador.'
      ]}
    ], checklist:['Personas y fecha tentativa','Zona de estancia','Modalidad que te interesa','Dudas para revisar con el operador'], cta:'Explorar Ruta Capomo',
    source: {label:'Ficha oficial de Ruta Capomo — Dirty Monkey Adventure',url:'https://dirtymonkeyadventure.com/es/tour/nayarit-route-capomo'}
  },
  {
    slug: 'experiencias-aviacion-nayarit', category: 'Aventura', image: 'cockpit.webp',
    title: 'Nayarit desde otra perspectiva: cómo consultar una experiencia de aviación',
    description: 'Vuelo panorámico, una ocasión especial o un acercamiento a la aviación: explica tu idea y conoce qué debe confirmar el proveedor.',
    service: 'panoramico', complements: ['transporte-privado'],
    lead: 'Hay ideas que comienzan mirando al cielo. Tal vez quieras contemplar un paisaje desde otra perspectiva, compartir un regalo o acercarte al mundo de la aviación. Explicar esa motivación es el primer paso.',
    sections: [
      {title:'Elige el propósito antes que la ruta', paragraphs:[
        'Para una consulta de vuelo panorámico, cuenta qué paisaje o región te interesa y con quién te gustaría compartir la experiencia. Si tu idea gira alrededor de una celebración, explica el lugar, la fecha y el tipo de momento que imaginas.',
        'No necesitas llegar con una operación diseñada. Es el proveedor quien debe determinar qué puede realizar, dónde y bajo qué condiciones. Una buena solicitud describe el objetivo y deja los detalles operativos a quien puede confirmarlos.'
      ]},
      {title:'Comparte los datos que orientan la propuesta', paragraphs:[
        'Indica personas, fecha tentativa y zona de interés. Si puedes considerar otras fechas, menciona esa flexibilidad. Añade si se trata de un regalo, una sorpresa o una primera aproximación a la aviación, porque cada propósito puede requerir una explicación diferente.',
        'En una experiencia introductoria, pregunta qué actividades contempla la propuesta y qué acompañamiento ofrece. El nombre de una experiencia no implica formación certificada ni significa que puedas operar los controles de una aeronave.'
      ]},
      {title:'Qué revisar con el proveedor', paragraphs:[
        'Pide que la propuesta detalle punto de encuentro, duración, capacidad, requisitos y condiciones aplicables. Consulta también cómo se manejan cambios de fecha o de operación. No interpretes una fotografía como la identificación de una aeronave disponible.',
        'En celebraciones y solicitudes especiales, la viabilidad debe revisarse antes de organizar otros elementos que dependan de la actividad. Describir una idea en el catálogo no confirma un sobrevuelo, una ruta o una maniobra específica.'
      ]},
      {title:'Del interés a la conversación', paragraphs:[
        'Nayarit Experiences inicia su historia con la aviación y amplía su catálogo para que puedas conectar distintas partes de tu viaje. Puedes explorar una idea aérea y añadir interés en transporte o estancia sin convertir esa combinación en un paquete confirmado.',
        'Nuestro papel es reunir y orientar tu solicitud. La evaluación, disponibilidad, precio y cierre corresponden al proveedor. Empieza por contarnos qué te gustaría recordar de la experiencia; los detalles se construyen a partir de una propuesta viable.'
      ]}
    ], checklist:['Motivo de la experiencia','Zona o paisaje de interés','Personas y fecha tentativa','Preguntas para el proveedor'], cta:'Consultar una experiencia aérea'
  }
];
