# Nayarit Experiences — MVP privado

Sitio responsive en HTML, CSS y JavaScript nativos, desplegado en Sites con acceso exclusivo al propietario. No requiere dependencias en producción. El formulario prepara un resumen en pantalla y, si se configura un webhook en `dist/config.js`, envía la solicitud a esa URL (ver «Webhook del formulario»). Sin URL configurada no transmite ni persiste datos.

## Diseño y navegación

Portada fotográfica, catálogo, experiencias privadas, blog y solicitud. El catálogo tiene diez fichas en siete categorías: aventura, aviación, transporte, hospedaje, casas de lujo, chef privado y mixología. La selección se lleva al formulario, que conserva los datos al editar la vista previa.

El formulario adapta sus campos al servicio principal: recogida y modalidad para Ruta Capomo; origen, destino, hora y tipo de viaje para transporte; entrada, salida, zona, habitaciones y presupuesto para estancias; zona, ocasión y cocina para chef; zona, bebidas y duración para mixología. Permite combinar intereses mediante casillas. Los borradores por servicio permanecen únicamente en memoria y se eliminan al reiniciar o recargar. No se solicitan datos de pago ni se escriben leads.

`/privadas/` presenta tres ideas de combinación y preguntas frecuentes. Los botones preparan una solicitud con servicio principal y complementos. Son conceptos de viaje, no paquetes confirmados.

Interacciones: entrada con fade, revelado al desplazar, zoom suave de fotos, inclinación leve de tarjetas, parallax limitado en portada, iluminación al mouse, botones con desplazamiento suave y barra de progreso. Se desactivan movimientos de profundidad con puntero táctil o prefers-reduced-motion. El menú móvil utiliza inert para excluir vínculos ocultos del recorrido de teclado. Los diálogos aceptan Escape y restauran el foco.

Las fotos se alojan en el mismo sitio; la carga inicial no requiere solicitudes a terceros. La portada usa una variante de 960 px para pantallas pequeñas; el resto de las fotos usa carga diferida.

## Archivos

- `dist/index.html`: estructura, formulario, semántica y créditos fotográficos.
- `dist/styles.css`: sistema visual, breakpoints y animaciones.
- `dist/config.js`: URL del webhook del formulario (vacía = modo vista previa).
- `dist/catalog.js`: experiencias, categorías y estructura de proveedores.
- `dist/script.js`: filtros, fichas, formulario y movimiento progresivo.
- `dist/assets/`: imágenes WebP e isotipo SVG propio.
- `dist/blog/`: índice y seis artículos estáticos con URL individual.
- `dist/privadas/index.html`: página de experiencias privadas.
- `dist/editorial.css` y `dist/editorial.js`: diseño y navegación editorial, búsqueda y filtros del blog.
- `content/articles.mjs`: seis artículos originales y referencias a los IDs del catálogo.
- `scripts/build-editorial.mjs`: genera el blog, la página privada y sus secciones de portada.
- `.openai/hosting.json`: asociación con el proyecto existente y carpeta estática.

Para revisar localmente: ejecutar `python3 -m http.server 4173 --directory dist` y abrir http://localhost:4173. Los módulos requieren un servidor HTTP.

Al editar artículos o planes: ejecutar `node scripts/build-editorial.mjs`. No editar directamente las páginas generadas ni el bloque `EDITORIAL:START` / `EDITORIAL:END` de la portada. No hay dependencias de compilación externas.

## Webhook del formulario

`dist/config.js` exporta `webhookUrl`. Vacía: el formulario solo muestra el resumen (los textos indican que no se envía nada). Con una URL: al enviar, valida igual que antes y hace un POST `application/x-www-form-urlencoded` (modo `no-cors`, sin depender de CORS) con: `name`, `first_name`, `last_name`, `phone`, `experience`, `category`, `people`, `date`, `details`, `complements`, `reference_provider`, `brief_*` (campos contextuales del servicio), `consent`, `source`, `page_url`, `submitted_at` y `utm_*` si vienen en la URL. Con `no-cors` la respuesta es opaca: solo se detectan fallos de red, no errores HTTP del receptor; probar siempre con un envío real. La URL queda visible en el código público de la página. Al activarla cambian los textos de la página (botón, consentimiento, confirmación) y se oculta «Editar mi solicitud» para evitar reenvíos.

## Contenido y crecimiento

`categories` distingue `inquiry` de `planned`. Viñedos, restaurantes y day pass siguen planeados. `experiences` usa IDs estables, `categoryId`, `providerIds`, `status`, textos, imagen y `briefFields`. El renderizado de filtros y selección deriva de este modelo.

`providers` incluye Dirty Monkey Adventure como referencia documental, con `partnership: not_confirmed`, fuente oficial y fecha de consulta. No significa alianza, reserva ni inventario. Ruta Capomo se distingue expresamente de una salida privada. Los demás servicios no tienen proveedores asignados. Las casas y fotografías no representan inmuebles disponibles.

Fuente de Ruta Capomo: https://dirtymonkeyadventure.com/es/tour/nayarit-route-capomo (consultada el 13 de septiembre de 2026). Los datos publicados pueden cambiar; el operador confirma vigencia y cotización. No se utiliza su fotografía ni su logotipo.

Para integrar más adelante, validar registros de proveedor con IDs estables y estados explícitos, relacionarlos con las experiencias y definir un endpoint propio para recepción y calificación de leads. Cualquier CRM, mensajería, pagos, analítica o cambio de audiencia requiere autorización. La confirmación y cierre siempre corresponden al proveedor. No hay tarifas base ni inventario confirmados. El cargo adicional mencionado en Ruta Capomo se atribuye a la fuente oficial.

## Blog y posicionamiento

Seis guías originales sobre Punta de Mita, casas de lujo, chef y mixología, transporte, Ruta Capomo y aviación. Cada artículo tiene contenido HTML estático, título y descripción propios, canonical, Open Graph, BlogPosting, encabezados jerárquicos, enlaces relacionados y una llamada a la solicitud. El índice filtra por tema y permite búsqueda sin distinguir acentos. Las URLs con `interes` y `complementos` solo aceptan IDs conocidos; no incorporan texto arbitrario al HTML.

El sitio conserva acceso exclusivo al propietario, `noindex,nofollow` en todas las páginas y `robots.txt` con `Disallow: /`. Por ello no puede ganar posicionamiento público mientras siga privado. Los metadatos son una base de implementación; no se han enviado URLs a buscadores ni conectado analítica o Search Console. Una futura apertura e indexación requieren autorización explícita y revisión de contenido, proveedores y recepción de solicitudes. Los artículos son guías editoriales, no reportajes de visitas realizadas ni testimonios.

Referencias de dirección editorial y estructura, sin copiar textos, marca ni ofertas: https://visitnayarit.travel/category/blog-nayarit/, https://www.vallarta-adventures.com/es/punta-mita y https://www.vallarta-adventures.com/es/tours-privados.

## Validación de esta versión

Recorrido real con Chromium en 1440×1000, 390×844 y 320×720: diez fichas, ocho filtros, seis nuevos recorridos de detalle a formulario, campos contextuales, salida posterior a entrada, datos requeridos de transporte, combinación de servicios, resumen, edición, borradores aislados y reinicio. Sin errores de consola, imágenes rotas, solicitudes de red a terceros ni desplazamiento horizontal. Las pruebas usan datos ficticios y no escriben solicitudes.

La revisión editorial comprueba las seis URLs, búsqueda con y sin resultados, filtros, metadatos, planes privados y enlaces al formulario. Incluye también el ancho de tableta de 820 px. Las animaciones existentes conservan soporte para `prefers-reduced-motion`; los nuevos efectos de fotos lo respetan.

## Fotografías

Fotografías de inspiración bajo la licencia Unsplash; no representan proveedores afiliados, aeronaves ofrecidas ni operaciones confirmadas. Enlaces y autores también disponibles en el pie de página.

| Archivo | Autor | Fuente |
| --- | --- | --- |
| hero.webp / hero-mobile.webp | Emmanuel Appiah | https://unsplash.com/photos/I2hA6Kmn29U |
| coast.webp | David Anderson | https://unsplash.com/photos/JyjKyCbVpyg |
| tepic.webp | Javier Garcia Chavez | https://unsplash.com/photos/OM6JtCungUs |
| aircraft.webp | Kamil Pietrzak | https://unsplash.com/photos/w9KTlrW7rOU |
| cockpit.webp | Sigmund | https://unsplash.com/photos/lm_3ZjH61r0 |
| capomo.webp | them snapshots | https://unsplash.com/photos/GP5HzcrKciI |
| chef.webp | Martin Baron | https://unsplash.com/photos/A2CEg2omFJI |
| mixologia.webp | Diana Díaz | https://unsplash.com/photos/dfae7jtxCM8 |
| villa.webp | Amine Ben Mohamed | https://unsplash.com/photos/OEkwyGpBIDU |
| hospedaje.webp | Antonio Araujo | https://unsplash.com/photos/uZoA9WaygLQ |
| transporte.webp | Nikolay Dimitrov | https://unsplash.com/photos/XDZsJnC5z6s |

Licencia: https://unsplash.com/license. Únicamente se optimizaron tamaño y compresión; el encuadre en pantalla se controla por CSS.
