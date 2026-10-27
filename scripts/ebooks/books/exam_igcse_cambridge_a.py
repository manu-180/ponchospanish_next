"""Cambridge IGCSE Spanish 0530 · Paper 2 Reading · modelo A.

Formato y puntaje: el specimen paper 0530/02 para exámenes desde 2028 (1 hora,
40 puntos; seis preguntas de 5, 5, 7, 8, 8 y 7 puntos).
En el examen real los textos de las preguntas 3 a 6 vienen en un cuadernillo aparte
(Insert) y la pregunta 1 son dibujos; en este recurso los textos van dentro del mismo
papel y la pregunta 1 usa etiquetas escritas, para que se pueda imprimir y hacer solo.
Los textos y las preguntas son originales de Poncho.
"""

from books._exam_paper import shell

SECTION = {
    "name": "Preguntas 1–6", "sub": "Lectura", "total": 40,
    "questions": [
        {
            "n": 1, "title": "En la mochila",
            "lead": "Lee las etiquetas de estos seis objetos. Para cada pregunta escribe la letra correcta (A–F) en la casilla.",
            "blocks": [
                {"t": "signs", "items": [
                    "un paraguas", "unas botas", "una cantimplora",
                    "un mapa", "unos guantes", "una linterna",
                ]},
                {"t": "letters", "items": [
                    ("Está lloviendo otra vez.", "A"),
                    ("Tengo las manos heladas.", "E"),
                    ("No sé por dónde se va al refugio.", "D"),
                    ("Me he quedado sin agua.", "C"),
                    ("Aquí dentro no se ve nada.", "F"),
                ]},
            ],
        },
        {
            "n": 2, "title": "En el camping",
            "lead": "Lee los letreros. Para cada pregunta escribe la letra correcta (A–H) en la casilla.",
            "blocks": [
                {"t": "signs", "items": [
                    "Recepción: 08:00–22:00", "Lavandería: segunda planta", "Descuento para estudiantes", "Prohibido hacer fuego",
                    "Alquiler de tiendas", "Punto de reciclaje", "Duchas de agua caliente", "Wifi gratuito en la cafetería",
                ]},
                {"t": "letters", "items": [
                    ("Tengo que llamar a mis padres y no me queda saldo.", "H"),
                    ("Mi saco está mojado y huele fatal.", "B"),
                    ("Venimos del instituto, ¿pagamos menos?", "C"),
                    ("¿Dónde tiro las latas?", "F"),
                    ("No traemos dónde dormir.", "E"),
                ]},
            ],
        },
        {
            "n": 3, "title": "Las clases de circo",
            "lead": "Lee el texto. Para cada pregunta indica tu respuesta escribiendo una X en la casilla correcta (A–D).",
            "blocks": [
                {"t": "text", "t_title": "Daniel y el circo", "es": [
                    "Me llamo Daniel y empecé las clases de circo hace casi un año, justo antes de las vacaciones de verano. Al principio iba sólo para acompañar a un amigo que se aburría.",
                    "Normalmente entrenamos en el polideportivo del barrio, aunque cuando hay función nos dejan el teatro municipal. En el parque sólo ensayamos si hace muy buen tiempo.",
                    "Mi profesora se llama Susana y es la persona más paciente que conozco. Fue ella quien me convenció para quedarme cuando mi amigo lo dejó.",
                    "La idea de apuntarme no se me ocurrió a mí: una tarde vi un documental sobre una escuela de circo en Chile y no pude pensar en otra cosa durante semanas.",
                    "Ahora estamos con los malabares y con la cuerda floja. Lo del trapecio llegará más adelante, cuando tengamos más fuerza.",
                    "Lo único que me falta son unas zapatillas blandas: las mías resbalan y Susana dice que así no voy a avanzar.",
                    "Desde que hago circo duermo mucho mejor. Antes me pasaba media noche dando vueltas en la cama.",
                ]},
                {"t": "mcq", "items": [
                    ("Daniel empezó las clases de circo…", ["hace casi un año.", "hace cinco semanas.", "hace medio año.", "hace diez días."], 0),
                    ("¿Dónde entrenan normalmente?", ["en el teatro", "en el parque", "en el polideportivo", "en el colegio"], 2),
                    ("¿Quién es Susana?", ["la madre de Daniel", "la amiga de Daniel", "la profesora de Daniel", "la hermana de Daniel"], 2),
                    ("¿Qué le dio a Daniel la idea de apuntarse?", ["un documental", "una película", "una revista", "un libro"], 0),
                    ("En estos momentos practican…", ["trapecio.", "malabares y cuerda floja.", "sólo malabares.", "danza."], 1),
                    ("¿Qué necesita comprar Daniel?", ["unas zapatillas", "una cuerda", "un sombrero", "unas gafas"], 0),
                    ("Desde que hace circo, Daniel…", ["duerme mejor.", "come más.", "estudia menos.", "sale más."], 0),
                ]},
            ],
        },
        {
            "n": 4, "title": "Un pueblo que no se rinde",
            "lead": "Lee el texto. Para cada hueco (a) a (h), escribe una X en la casilla correcta (A–D).",
            "blocks": [
                {"t": "text", "es": [
                    "Hace veinte años, Candeleda era un pueblo de ___(a)___ al que casi nadie llegaba. Los inviernos eran largos y ___(b)___, y las familias jóvenes se marchaban a la ciudad en cuanto podían.",
                    "Todo cambió cuando tres hermanas decidieron quedarse ___(c)___ en la casa de sus abuelos y abrir una pequeña quesería. ___(d)___ ellas, el pueblo habría cerrado la escuela.",
                    "Hoy la quesería está ___(e)___ de la plaza y da trabajo a once personas. El queso se ha ___(f)___ en tiendas de media Europa, ___(g)___ las hermanas siguen haciéndolo a mano.",
                    "El año que viene ___(h)___ un pequeño museo del queso, y en el pueblo ya hay dieciocho niños en la escuela.",
                ]},
                {"t": "mcq", "items": [
                    ("", ["montaña", "selva", "playa", "fiesta"], 0),
                    ("", ["frecuentes", "divertidos", "alegres", "fríos"], 3),
                    ("", ["paseando", "viviendo", "entrando", "durmiendo"], 1),
                    ("", ["Según", "Para", "Entre", "Sin"], 3),
                    ("", ["dentro", "enfrente", "debajo", "lejos"], 1),
                    ("", ["querido", "pertenecido", "vendido", "comprado"], 2),
                    ("", ["si", "pero", "porque", "aunque"], 1),
                    ("", ["abrirá", "cerrará", "volverá", "vivirá"], 0),
                ]},
            ],
        },
        {
            "n": 5, "title": "¿Qué libro te llevas?",
            "lead": "Lee los textos (A–D). Une las afirmaciones (a–h) con el texto correcto (A–D). Para cada afirmación, escribe una X en la casilla correcta (A–D).",
            "blocks": [
                {"t": "speakers", "items": [
                    ("A · «Niebla en el faro»", "Una novela lenta, casi sin acción, en la que dos farero(a)s se escriben cartas durante treinta años. Todo ocurre junto al mar y casi nunca pasa nada, pero la historia de amor engancha."),
                    ("B · «La ciudad de abajo»", "Un grupo de adolescentes descubre un túnel bajo su instituto y, con él, algo que los adultos del barrio llevan años callando. Pasa todo en la ciudad y los protagonistas tienen quince años."),
                    ("C · «Expedición Sur»", "Cuatro científicos quedan aislados en la Antártida cuando se les estropean todos los aparatos. Sin radio y sin GPS, tienen que salir adelante como se hacía hace cien años. Paisajes de hielo en cada página."),
                    ("D · «Turno de noche»", "Novela corta sobre una enfermera de urgencias y un bombero que se cruzan cada madrugada en el mismo hospital de una ciudad grande. Sin magia y sin aventuras: sólo trabajo, cansancio y gente adulta."),
                ]},
                {"t": "letters", "opts": "ABCD", "items": [
                    ("Me entretienen las aventuras donde la tecnología moderna no sirve de nada.", "C"),
                    ("Suelo leer libros con personajes adultos y me interesa el ambiente urbano.", "D"),
                    ("Estoy harto de historias tristes y prefiero cosas que no ocurrirían nunca en la vida real.", "B"),
                    ("Quiero ver cómo un grupo de personas vive una situación difícil en medio de paisajes naturales.", "C"),
                    ("Prefiero leer historias tranquilas donde se ve el mar, en vez de situaciones peligrosas en la ciudad.", "A"),
                    ("Soy sanitaria y me encantan los libros que muestran otros trabajos importantes para la sociedad.", "D"),
                    ("Me gustan los libros donde no pasa mucho, pero tienen una parte romántica.", "A"),
                    ("Me divierte cuando los jóvenes descubren secretos que el resto de la gente no conoce.", "B"),
                ]},
            ],
        },
        {
            "n": 6, "title": "La huerta del colegio",
            "lead": "Lee el texto. Para cada pregunta indica tu respuesta escribiendo una X en la casilla correcta (A–D).",
            "blocks": [
                {"t": "text", "t_title": "Marta y la huerta", "es": [
                    "Antes de empezar en este proyecto, Marta trabajaba en una oficina y volvía a casa sin ganas de nada. No estaba triste, pero se aburría muchísimo.",
                    "Un día la llamó Jorge, que había sido compañero suyo en la universidad y al que no veía desde hacía quince años. Le contó que buscaban a alguien para montar una huerta en un colegio del barrio.",
                    "Cuando Jorge se lo explicó por primera vez, Marta no dijo que sí enseguida: le hizo tantas preguntas que él tuvo que llamarla otro día para seguir.",
                    "Ahora las clases de huerta son los martes y los viernes durante la pausa de la comida, y siempre se queda gente fuera.",
                    "Uno de los cambios que más le gustan es el de Nuria, una alumna de once años que ha decidido gastar menos dinero en chucherías para comprarse semillas.",
                    "Hace una semana pasó algo que Marta no esperaba: los niños habían preparado en secreto una comida con lo que habían cultivado y la invitaron.",
                    "Lo que a Marta le gustaría ver es la misma huerta funcionando en los otros colegios de la zona.",
                ]},
                {"t": "mcq", "items": [
                    ("¿Cómo se sentía Marta antes de tener su trabajo actual?", ["feliz", "triste", "aburrida", "enfadada"], 2),
                    ("En el pasado, Jorge…", ["vivió con Marta.", "trabajó con Marta.", "fue vecino de Marta.", "fue a clase con Marta."], 3),
                    ("Cuando Jorge le habló del proyecto por primera vez, Marta…", ["aceptó inmediatamente.", "le hizo muchas preguntas.", "casi no recordaba quién era.", "dijo que no."], 1),
                    ("¿Cuándo son las clases de huerta?", ["todos los días", "los martes por la mañana", "después del colegio", "durante la pausa de la comida"], 3),
                    ("¿Qué ha decidido hacer Nuria?", ["comer más fruta", "gastar menos en chucherías", "aprender otros temas", "cambiar de colegio"], 1),
                    ("¿Qué ocurrió hace una semana?", ["Marta se sorprendió con lo que hicieron sus alumnos.", "Unos niños se quedaron dormidos.", "Unos cocineros visitaron el colegio.", "A Marta le dieron un premio."], 0),
                    ("¿Qué desea ver Marta en el futuro?", ["una huerta más grande", "el mismo proyecto en otros colegios", "más dinero del ayuntamiento", "una visita al campo"], 1),
                ]},
            ],
        },
    ],
}

PAPER = shell("igcse_cambridge", "A", [SECTION])
