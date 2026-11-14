# Lo que Kairo sabe de Poncho

El bot lo lee de `main` cada vez que Anto cierra una tanda con "Listo" y, con esto más la
charla reciente, decide si le contesta ya (preguntas, textos, traducciones) o si la tanda
va a la rutina. Si un dato no está acá, el bot no lo inventa: deriva. Mantenelo al día
cuando cambie algo de lo que dice (la rutina también): corto, en hechos, sin historia.

## El negocio

- Poncho Spanish: escuela online de español de Anto (Antonela Risaro). Clases en vivo
  1 a 1 y en grupo, y una academia con cursos en video y e-books.
- Público: chicos y adolescentes de 7 a 18, sobre todo en el Reino Unido, y familias
  angloparlantes en España u otro país hispanohablante con hijos en colegios británicos
  o internacionales (GCSE, IGCSE). Adultos sólo como excepción.
- La web está en inglés británico. Anto vive en Buenos Aires; todo es online.
- Anto prefiere "menos es más": no se suman secciones ni páginas que ella no pidió.

## La academia (ponchospanish.com/ondemand)

- En la home, la tarjeta que lleva a la academia se llama **Poncho Academy** (antes
  "On demand courses"), y la sección de clases en vivo se titula "Live online Spanish
  lessons" (2026-11-07).
- Cursos en video: Spanish for Confident Kids, Spanish for Confident Teens y Spanish
  for Travel (87 lecciones, 2 h, entregado el 2026-11-13 por link de Drive).
- La portada de un curso en video es su pantalla de apertura (la foto de tapa, el
  título y el nivel), en JPG 1920x1080: la tarjeta del curso en la Academy es 16:9,
  a diferencia de los e-books y recursos, que llevan la página 1 del PDF en
  1240x1754 (2026-11-14).
- E-books y mini diccionarios en ponchospanish.com/ondemand (cada uno con su página en
  `/ondemand/ebooks/<nombre>`): Spanish for Travel, Spanish for International
  Residents, Spanish for Confident Teens E-Book, Confident Kids Workbook, mini
  diccionarios (Football, Animal Lovers, Music Lovers, Foodie, Travel, Real-Life
  Conversations, Day of the Dead) y material de examen GCSE e IGCSE (AQA y Edexcel,
  Foundation y Higher, con sus Paper de lectura).
- Recursos (fondo gris, formato mini diccionario: 22 páginas, 6 secciones de
  vocabulario, frases, actividades y respuestas). Además de los mini diccionarios:
  Day of the Dead, Spanish Speaking Countries, Christmas, Birthdays, Frida Kahlo y
  Typical Dishes (comidas típicas del mundo hispano). Son multinivel: sirven para
  chicos y para adolescentes. Christmas tiene 7 secciones: la última es la Navidad
  en Latinoamérica, con el verano, el pan dulce, las posadas y la novena (2026-11-06).
  El recurso de Leo Messi se dio de baja el 2026-11-06: Anto no encontró imágenes sin
  regalías y quedaba genérico; lo reemplaza Typical Dishes.
- E-books (fondo negro, más largos: capítulos con aperturas a sangre, unidades,
  ejercicios por capítulo, caja de herramientas de gramática y respuestas al final).
  La serie Spanish for Confident Teens tiene cuatro libros: el primero (KS3, año 1),
  Spanish for Confident Teens 2 (año 2: pretérito, comparativo, futuro próximo),
  Spanish for Confident Teens 3 Foundation y Spanish for Confident Teens 3 Higher
  (año 3; el Higher suma imperfecto, futuro simple y pronombres de objeto directo).
  Los cuatro comparten la misma foto de tapa (2026-11-05), y los dos libros 3 llevan
  en la portada un cartel grande con el nivel: FOUNDATION en amarillo y HIGHER en
  terracota, para distinguirlos de un vistazo (2026-11-06).
- Los recursos y e-books de una tanda se le mandan a Anto por el grupo como PDF. Se
  publican en la Academy sólo si ella lo pide. Cuando los sube ella, además del PDF se
  le manda la portada en JPG (la página 1 del PDF, 1240×1754) para el campo de imagen
  del producto.

## Fotos (2026-11-13, Anto)

- Nunca imágenes de animales muertos en cursos, e-books ni recursos: nada de
  carnicerías, carne cruda, asados a la vista, pescados enteros ni platos donde se
  reconozca el animal. Para la comida van platos sin carne a la vista, mesas, gente
  comiendo o brindando, mercados de verdura o quesos, mate, dulces.
- Cada foto nueva se mira antes de entregar: el id de Pexels no alcanza (ver AGENTS.md,
  la caché armada desde los PDF puede tener fotos con el id cruzado).
- Se cambiaron el 2026-11-13: la carnicería de La Nochebuena (Christmas), el asado de
  Argentina y Uruguay (Typical Dishes), el pescado y el asado del Foodie Dictionary y la
  foto de ¡A comer! de Spanish for Confident Teens 2.

## Códigos de acceso

- Anto los crea desde su panel de administración. Pueden ser para un curso, para un
  e-book o globales (sirven para cualquier curso o e-book). Pueden tener límite de usos
  y fecha de vencimiento.
- Su código global de octubre de 2026 no tiene límite de usos y vence el 31/12/2027.
- Cómo lo usa un alumno: entra a ponchospanish.com/ondemand, abre el curso o e-book que
  quiere, toca "Create a free account" (o entra con su cuenta), y en "or use a code"
  escribe el código y toca "Apply access code". Para otro curso o e-book, repite en esa
  página con el mismo código. Cada canje cuenta como un uso.
- Si lo escribe en el recuadro "Got a free-access code?" de su panel, un código global
  o de e-book lo manda al catálogo para que elija (desde el 2026-10-30).

## Cómo trabaja Kairo con Anto

- Anto es la tía de Manu: ella le dice Manolett, él le dice Ann, y se cargan. En el grupo
  Kairo es uno más: el bot lo hace charlar entre tandas, además de contestar al "Listo".
- Kairo es el mismo de todas las tandas y tiene todo lo que ya se hizo.
- Anto compra las tandas de e-books y recursos a Manu: la plata es entre ellos.
- Anto manda pedidos por el grupo "Poncho" y cierra con "Listo".
- Los cursos en video se re-renderizan en la PC de Manu: los cambios de guion se hacen
  enseguida, pero el video nuevo tarda; no se le promete una fecha.
- Pagos (PayPal) y precios: no se tocan sin que Anto lo pida explícitamente.
