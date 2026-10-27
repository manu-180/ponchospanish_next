"""Cambridge IGCSE Spanish 0530 · Paper 2 Reading · modelo B.

Mismo formato y puntaje que el modelo A (1 hora, 40 puntos), con textos, temas y
preguntas distintos. Todo original de Poncho.
"""

from books._exam_paper import shell

SECTION = {
    "name": "Preguntas 1–6", "sub": "Lectura", "total": 40,
    "questions": [
        {
            "n": 1, "title": "En la cocina",
            "lead": "Lee las etiquetas de estos seis objetos. Para cada pregunta escribe la letra correcta (A–F) en la casilla.",
            "blocks": [
                {"t": "signs", "items": [
                    "un cuchillo", "una sartén", "un delantal",
                    "una receta", "un horno", "unos guantes de cocina",
                ]},
                {"t": "letters", "items": [
                    ("No me acuerdo de cuánta harina lleva.", "D"),
                    ("La bandeja está ardiendo.", "F"),
                    ("Hay que cortar la cebolla.", "A"),
                    ("Me voy a manchar la ropa.", "C"),
                    ("Voy a hacer una tortilla.", "B"),
                ]},
            ],
        },
        {
            "n": 2, "title": "En la estación",
            "lead": "Lee los letreros. Para cada pregunta escribe la letra correcta (A–H) en la casilla.",
            "blocks": [
                {"t": "signs", "items": [
                    "Consigna de equipajes", "Venta de billetes: andén 1", "Sala de espera climatizada", "Prohibido correr por los andenes",
                    "Objetos perdidos", "Ascensor fuera de servicio", "Cafetería abierta 24 horas", "Aseos al final del pasillo",
                ]},
                {"t": "letters", "items": [
                    ("Me he dejado el abrigo en el tren de ayer.", "E"),
                    ("No puedo subir la maleta por las escaleras.", "F"),
                    ("Tengo tres horas hasta mi tren y hace mucho frío fuera.", "C"),
                    ("Quiero dejar la mochila mientras visito la ciudad.", "A"),
                    ("Son las cuatro de la mañana y me muero de hambre.", "G"),
                ]},
            ],
        },
        {
            "n": 3, "title": "El coro del instituto",
            "lead": "Lee el texto. Para cada pregunta indica tu respuesta escribiendo una X en la casilla correcta (A–D).",
            "blocks": [
                {"t": "text", "t_title": "Lola y el coro", "es": [
                    "Me llamo Lola y entré en el coro del instituto hace seis meses, justo después de las vacaciones de Navidad. Al principio fui porque mi hermana mayor me insistió durante semanas.",
                    "Normalmente ensayamos en el aula de música, aunque las semanas antes de un concierto nos dejan el salón de actos. En la iglesia del pueblo sólo cantamos en diciembre.",
                    "El director se llama Andrés y nunca se enfada, ni cuando entramos todos a destiempo. Fue él quien me puso en la fila de las voces graves y acertó.",
                    "Lo que me decidió del todo fue un vídeo: vi en clase a un coro de Sudáfrica cantando sin instrumentos y se me puso la piel de gallina.",
                    "Ahora estamos preparando canciones de América Latina. Las piezas clásicas las dejamos para el curso que viene, cuando seamos más.",
                    "Lo único que me falta es una carpeta rígida: las partituras se me doblan en la mochila y Andrés dice que así no hay quien lea nada.",
                    "Desde que canto me cuesta mucho menos hablar en público. Antes me ponía roja sólo con levantar la mano.",
                ]},
                {"t": "mcq", "items": [
                    ("Lola entró en el coro…", ["hace seis meses.", "hace un año.", "hace dos semanas.", "en diciembre."], 0),
                    ("¿Dónde ensayan normalmente?", ["en la iglesia", "en el salón de actos", "en el aula de música", "en el patio"], 2),
                    ("¿Quién es Andrés?", ["el hermano de Lola", "el director del coro", "un compañero de clase", "el profesor de historia"], 1),
                    ("¿Qué la decidió a entrar en el coro?", ["un vídeo", "un concierto", "una canción de la radio", "un libro"], 0),
                    ("En estos momentos preparan canciones…", ["clásicas.", "de América Latina.", "de Navidad.", "en inglés."], 1),
                    ("¿Qué necesita comprar Lola?", ["una carpeta", "unas partituras", "una mochila", "un atril"], 0),
                    ("Desde que canta, Lola…", ["duerme mejor.", "habla en público con más facilidad.", "saca mejores notas.", "sale más con sus amigas."], 1),
                ]},
            ],
        },
        {
            "n": 4, "title": "Un río que volvió a vivir",
            "lead": "Lee el texto. Para cada hueco (a) a (h), escribe una X en la casilla correcta (A–D).",
            "blocks": [
                {"t": "text", "es": [
                    "Hace treinta años, el río que cruza la ___(a)___ estaba tan sucio que nadie se acercaba a él. El agua bajaba ___(b)___ y olía mal durante todo el verano.",
                    "La situación empezó a cambiar cuando un grupo de vecinos se puso a ___(c)___ la basura de la orilla todos los domingos. ___(d)___ ellos, el ayuntamiento no habría hecho nada.",
                    "Hoy hay un paseo ___(e)___ del agua y los fines de semana se llena de gente. Hasta se han ___(f)___ peces que llevaban décadas sin aparecer, ___(g)___ el trabajo no ha terminado.",
                    "El verano que viene se ___(h)___ una zona de baño vigilada, la primera desde los años noventa.",
                ]},
                {"t": "mcq", "items": [
                    ("", ["ciudad", "montaña", "isla", "playa"], 0),
                    ("", ["clara", "oscura", "fresca", "rápida"], 1),
                    ("", ["tirar", "recoger", "comprar", "vender"], 1),
                    ("", ["Según", "Para", "Entre", "Sin"], 3),
                    ("", ["debajo", "lejos", "al lado", "dentro"], 2),
                    ("", ["perdido", "visto", "comido", "olvidado"], 1),
                    ("", ["porque", "pero", "si", "cuando"], 1),
                    ("", ["cerrará", "venderá", "abrirá", "romperá"], 2),
                ]},
            ],
        },
        {
            "n": 5, "title": "¿Qué curso eliges?",
            "lead": "Lee los textos (A–D). Une las afirmaciones (a–h) con el texto correcto (A–D). Para cada afirmación, escribe una X en la casilla correcta (A–D).",
            "blocks": [
                {"t": "speakers", "items": [
                    ("A · Taller de radio", "Dos tardes por semana, en el estudio del centro cívico. Se aprende a entrevistar, a grabar y a montar un programa. No hace falta experiencia, pero sí hablar sin miedo delante de un micrófono."),
                    ("B · Curso de montaña", "Fines de semana completos, con noche en refugio. Se sale haga el tiempo que haga y hay que cargar la mochila uno mismo. Plazas limitadas a diez personas."),
                    ("C · Club de cocina", "Los jueves por la tarde, en la cocina del instituto. Cada semana un plato de un país distinto y, al final, se come lo que se ha hecho. Ideal si vives solo por primera vez."),
                    ("D · Taller de informática para mayores", "Lunes por la mañana, en la biblioteca. Pensado para quien nunca ha usado un ordenador: correo, banca y videollamadas, muy despacio y repitiendo lo que haga falta."),
                ]},
                {"t": "letters", "opts": "ABCD", "items": [
                    ("Quiero aprender a hacer cosas prácticas que me sirvan ahora que vivo por mi cuenta.", "C"),
                    ("Busco algo al aire libre aunque el tiempo no acompañe.", "B"),
                    ("Mi abuela nunca ha encendido un ordenador y quiere escribirnos.", "D"),
                    ("Me gustaría probar con la comunicación y no me da vergüenza hablar.", "A"),
                    ("Prefiero un grupo muy pequeño.", "B"),
                    ("Necesito algo por la mañana, entre semana.", "D"),
                    ("Me interesa conocer platos de otros países.", "C"),
                    ("Quiero aprender a grabar y editar.", "A"),
                ]},
            ],
        },
        {
            "n": 6, "title": "La biblioteca del barrio",
            "lead": "Lee el texto. Para cada pregunta indica tu respuesta escribiendo una X en la casilla correcta (A–D).",
            "blocks": [
                {"t": "text", "t_title": "Ignacio y la biblioteca", "es": [
                    "Antes de empezar en este proyecto, Ignacio conducía un camión de reparto y pasaba el día solo. No estaba mal, pero echaba de menos hablar con gente.",
                    "Una tarde lo llamó Teresa, que había sido vecina suya de pequeño y a la que no veía desde el colegio. Le dijo que buscaban a alguien para abrir una biblioteca en un local vacío del barrio.",
                    "Cuando Teresa se lo propuso, Ignacio no contestó en el momento: se pasó dos semanas dándole vueltas antes de decir que sí.",
                    "Ahora los clubes de lectura son los lunes y los jueves a última hora de la tarde, y hay lista de espera.",
                    "Uno de los cambios que más le gustan es el de Said, un chico de catorce años que ha decidido leer en voz alta a los más pequeños los sábados.",
                    "Hace unos días pasó algo que Ignacio no se esperaba: los socios habían pintado entre todos la sala infantil sin decirle nada.",
                    "Lo que a Ignacio le gustaría es que la biblioteca abriera también los domingos por la mañana.",
                ]},
                {"t": "mcq", "items": [
                    ("¿Qué echaba de menos Ignacio en su trabajo anterior?", ["el dinero", "hablar con gente", "conducir", "los horarios"], 1),
                    ("En el pasado, Teresa…", ["trabajó con Ignacio.", "fue vecina de Ignacio.", "vivió con Ignacio.", "fue su profesora."], 1),
                    ("Cuando Teresa le propuso el proyecto, Ignacio…", ["aceptó en el momento.", "dijo que no.", "tardó dos semanas en decidirse.", "le hizo muchas preguntas."], 2),
                    ("¿Cuándo son los clubes de lectura?", ["los sábados por la mañana", "los lunes y los jueves por la tarde", "todos los días", "los domingos"], 1),
                    ("¿Qué ha decidido hacer Said?", ["pintar la sala infantil", "leer en voz alta a los pequeños", "apuntarse a un curso", "ordenar los libros"], 1),
                    ("¿Qué ocurrió hace unos días?", ["Los socios pintaron la sala infantil.", "La biblioteca cerró un día.", "Llegaron libros nuevos.", "Vino un escritor famoso."], 0),
                    ("¿Qué le gustaría a Ignacio?", ["tener más socios", "abrir los domingos por la mañana", "contratar a otra persona", "mudarse a un local mayor"], 1),
                ]},
            ],
        },
    ],
}

PAPER = shell("igcse_cambridge", "B", [SECTION])
