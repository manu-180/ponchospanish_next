"""Contenido compartido de los seis e-books de examen (GCSE e IGCSE).

Los seis libros cubren el mismo idioma con distinto examen y distinto nivel, así que el
vocabulario, la gramática y los ejercicios viven acá una sola vez y cada libro arma sus
capítulos con los temas que pide su especificación:

    from books._exam_core import topic, practice, grammar_toolbox, vocab_toolbox

`level` es "F" (Foundation / IGCSE base) o "H" (Higher). Cambia la caja de gramática de
cada unidad, la caja de herramientas y los ejercicios, no el vocabulario: las listas de
los exámenes se solapan casi del todo entre niveles.

El módulo empieza con "_" para que `build.py --all` no lo tome como un libro.
"""

# --------------------------------------------------------------------------- temas

TOPICS = {
    "identity": {
        "title": "¿Cómo eres?",
        "en": "Yourself and your personality",
        "intro": "Your name, your age, where you live and what you are like. It is the first thing every examiner asks, so it should be the part you never have to think about.",
        "words": [
            ("Me llamo… / Soy…", "My name is… / I'm…", "Me llamo Noa y tengo quince años.", "I'm Noa and I'm fifteen.", None),
            ("Tengo … años", "I'm … years old", "Tengo dieciséis años y vivo en Brighton.", "I'm sixteen and I live in Brighton.", None),
            ("Soy de…", "I'm from…", "Soy de Inglaterra, pero mi madre es española.", "I'm from England, but my mum is Spanish.", None),
            ("simpático / simpática", "kind, friendly", "Mis amigos dicen que soy simpática y habladora.", "My friends say I'm friendly and chatty.", None),
            ("trabajador / trabajadora", "hard-working", "Soy bastante trabajador en clase de ciencias.", "I'm quite hard-working in science.", None),
            ("perezoso / perezosa", "lazy", "A veces soy un poco perezoso los domingos.", "Sometimes I'm a bit lazy on Sundays.", None),
            ("el carácter", "personality", "Tengo un carácter tranquilo y paciente.", "I've got a calm, patient personality.", None),
            ("llevarse bien con", "to get on well with", "Me llevo muy bien con mi hermana mayor.", "I get on really well with my older sister.", None),
        ],
        "tip": ("En el examen", "Never answer <b>¿Cómo eres?</b> with one adjective. Add an intensifier and a reason: <b>Soy bastante tímido, pero con mis amigos soy muy hablador.</b> Two extra words is the difference between a basic answer and a good one."),
    },
    "family": {
        "title": "Mi familia",
        "en": "Family and relationships",
        "intro": "Who is at home, what they are like and how you get on with them. Family comes up in every paper, and it is the easiest place to show off opinions and reasons.",
        "words": [
            ("los padres", "parents", "Mis padres están divorciados y vivo con mi madre.", "My parents are divorced and I live with my mum.", None),
            ("el hermano / la hermana", "brother / sister", "Tengo dos hermanos mayores y una hermanastra.", "I've got two older brothers and a stepsister.", None),
            ("hijo único / hija única", "only child", "Soy hija única, así que tengo mi propia habitación.", "I'm an only child, so I've got my own room.", None),
            ("los abuelos", "grandparents", "Mis abuelos viven cerca y los veo cada domingo.", "My grandparents live nearby and I see them every Sunday.", None),
            ("discutir", "to argue", "Discuto con mi hermano por el mando de la tele.", "I argue with my brother over the TV remote.", None),
            ("apoyar", "to support", "Mi familia me apoya en todo lo que hago.", "My family supports me in everything I do.", None),
            ("el ambiente", "atmosphere", "En casa hay muy buen ambiente los fines de semana.", "At home the atmosphere is great at weekends.", None),
            ("casarse / el matrimonio", "to get married / marriage", "Mi tía se casó el año pasado en Sevilla.", "My aunt got married last year in Seville.", None),
        ],
        "dialogue": {
            "title": "¿Cómo es tu familia?",
            "lines": [
                ("Examinador", "Háblame de tu familia.", "Tell me about your family."),
                ("Dani", "Somos cuatro: mi madre, mi padrastro, mi hermana y yo.", "There are four of us: my mum, my stepdad, my sister and me."),
                ("Examinador", "¿Te llevas bien con ellos?", "Do you get on well with them?"),
                ("Dani", "Con mi madre sí, porque es muy comprensiva. Con mi hermana discuto a veces, pero la quiero mucho.", "With my mum yes, because she's very understanding. I argue with my sister sometimes, but I love her a lot."),
            ],
        },
    },
    "friends": {
        "title": "Mis amigos",
        "en": "Friendship and relationships",
        "intro": "What makes a good friend, who you spend your time with and how you talk about other people. This is where adjectives and comparatives earn marks.",
        "words": [
            ("el mejor amigo / la mejor amiga", "best friend", "Mi mejor amiga se llama Leila y la conozco desde los seis años.", "My best friend is called Leila and I've known her since I was six.", None),
            ("conocer", "to know (a person)", "Conozco a Sam desde la escuela primaria.", "I've known Sam since primary school.", None),
            ("confiar en", "to trust", "Puedo confiar en ella con cualquier secreto.", "I can trust her with any secret.", None),
            ("comprensivo / comprensiva", "understanding", "Un buen amigo tiene que ser comprensivo y leal.", "A good friend has to be understanding and loyal.", None),
            ("fiel / leal", "loyal", "Lo más importante en un amigo es que sea leal.", "The most important thing in a friend is that they're loyal.", None),
            ("pelearse", "to fall out, to fight", "Nos peleamos una vez, pero lo arreglamos enseguida.", "We fell out once, but we sorted it out straight away.", None),
            ("el apoyo", "support", "Mis amigos son un gran apoyo cuando estoy estresada.", "My friends are a great support when I'm stressed.", None),
            ("quedar con", "to meet up with", "Quedo con mis amigos en el parque los sábados.", "I meet up with my friends in the park on Saturdays.", None),
        ],
        "fact": ("¿Sabías que...?", "In Spain quedar means to arrange to meet: ¿Quedamos a las seis? In Argentina people are more likely to say ¿Nos vemos a las seis? Both are everywhere in the speaking exam."),
    },
    "home": {
        "title": "Mi casa y mi rutina",
        "en": "Home and daily routine",
        "intro": "Where you live, what your home is like and what a normal day looks like. Reflexive verbs live here, and examiners love a routine with times in it.",
        "words": [
            ("la casa / el piso", "house / flat", "Vivo en un piso pequeño en el centro.", "I live in a small flat in the centre.", "ES"),
            ("el departamento", "flat, apartment", "Mi departamento está en el cuarto piso.", "My flat is on the fourth floor.", "AR"),
            ("la habitación", "bedroom", "Comparto la habitación con mi hermano.", "I share a bedroom with my brother.", None),
            ("despertarse", "to wake up", "Me despierto a las siete menos cuarto.", "I wake up at quarter to seven.", None),
            ("ducharse", "to have a shower", "Me ducho y desayuno antes de salir.", "I have a shower and breakfast before leaving.", None),
            ("ayudar en casa", "to help at home", "Ayudo en casa: pongo la mesa y saco la basura.", "I help at home: I lay the table and take the bin out.", None),
            ("las tareas domésticas", "housework, chores", "Odio las tareas domésticas, sobre todo fregar los platos.", "I hate housework, especially washing up.", None),
            ("acostarse", "to go to bed", "Entre semana me acuesto sobre las diez y media.", "On weekdays I go to bed at about half ten.", None),
        ],
        "tip": ("Los verbos reflexivos", "Routine verbs carry a little pronoun: <b>me</b> levanto, <b>te</b> duchas, <b>se</b> acuesta. Forget it and the sentence changes meaning: <b>levanto</b> on its own means <i>I lift</i>."),
    },
    "freetime": {
        "title": "Mi tiempo libre",
        "en": "Free time and sport",
        "intro": "Hobbies, sport and weekends. The safest topic in the speaking exam and the one where you can always add an opinion, a reason and a plan.",
        "words": [
            ("el tiempo libre", "free time", "En mi tiempo libre toco la batería.", "In my free time I play the drums.", None),
            ("practicar / hacer deporte", "to do sport", "Hago deporte tres veces a la semana.", "I do sport three times a week.", None),
            ("entrenar", "to train", "Entreno con el equipo los martes y los jueves.", "I train with the team on Tuesdays and Thursdays.", None),
            ("el partido", "match", "El sábado tenemos un partido importante.", "On Saturday we've got an important match.", None),
            ("montar en bici", "to go cycling", "Monto en bici por el campo con mi padre.", "I go cycling in the countryside with my dad.", "ES"),
            ("andar en bici", "to go cycling", "Ando en bici hasta la escuela todos los días.", "I cycle to school every day.", "AR"),
            ("relajarse", "to relax", "Los domingos me relajo viendo series.", "On Sundays I relax watching series.", None),
            ("aburrirse", "to get bored", "Nunca me aburro porque siempre tengo un plan.", "I never get bored because I always have a plan."
             , None),
        ],
        "fact": ("¿Sabías que...?", "Spanish uses jugar for games you play (jugar al tenis) and hacer for activities you do (hacer natación, hacer atletismo). Getting that pair right is a quick, visible mark in the writing paper."),
    },
    "music_tv": {
        "title": "Música, series y famosos",
        "en": "Music, screens and celebrity culture",
        "intro": "What you watch, what you listen to and what you think of the people everyone follows. Perfect territory for opinions, comparatives and the odd complaint.",
        "words": [
            ("la canción / el grupo", "song / band", "Mi canción favorita es de un grupo argentino.", "My favourite song is by an Argentinian band.", None),
            ("el cantante / la cantante", "singer", "Es la cantante más famosa del momento.", "She's the most famous singer right now.", None),
            ("la serie / la película", "series / film", "Veo series en español con subtítulos.", "I watch series in Spanish with subtitles.", None),
            ("el programa de telerrealidad", "reality TV programme", "No soporto los programas de telerrealidad.", "I can't stand reality TV programmes.", None),
            ("el influencer / la influencer", "influencer", "Sigo a una influencer que cocina recetas fáciles.", "I follow an influencer who cooks easy recipes.", None),
            ("tener éxito", "to be successful", "Tuvo mucho éxito con su primer álbum.", "She was very successful with her first album.", None),
            ("ser un buen modelo a seguir", "to be a good role model", "No todos los famosos son buenos modelos a seguir.", "Not all celebrities are good role models.", None),
            ("la fama", "fame", "La fama tiene un lado muy duro.", "Fame has a very hard side to it.", None),
        ],
        "tip": ("Opiniones que suben la nota", "Swap <b>me gusta</b> for something sharper: <b>me encanta</b>, <b>me chifla</b> {ES}, <b>no soporto</b>, <b>me parece una tontería</b>. Then justify it: <b>…porque la letra es muy original.</b>"),
    },
    "food": {
        "title": "La comida",
        "en": "Food, drink and eating out",
        "intro": "Meals at home, eating out and the food of the Spanish-speaking world. A guaranteed role-play topic and an easy source of cultural detail.",
        "words": [
            ("el desayuno / la merienda", "breakfast / afternoon snack", "Desayuno tostadas y meriendo fruta.", "I have toast for breakfast and fruit as a snack.", None),
            ("la comida / el almuerzo", "lunch", "La comida en España es a las dos o las tres.", "Lunch in Spain is at two or three.", None),
            ("la cena", "dinner", "Ceno con mi familia sobre las ocho.", "I have dinner with my family at about eight.", None),
            ("probar", "to try, to taste", "Quiero probar la paella valenciana.", "I want to try Valencian paella.", None),
            ("el plato típico", "typical dish", "El plato típico de Argentina es el asado.", "The typical dish of Argentina is asado.", None),
            ("vegetariano / vegetariana", "vegetarian", "Soy vegetariana desde hace dos años.", "I've been vegetarian for two years.", None),
            ("la cuenta", "the bill", "La cuenta, por favor. ¿Está incluida la propina?", "The bill, please. Is the tip included?", None),
            ("tener hambre / sed", "to be hungry / thirsty", "Tengo hambre: ¿pedimos algo de picar?", "I'm hungry: shall we order something to nibble?", None),
        ],
        "dialogue": {
            "title": "En el restaurante",
            "lines": [
                ("Camarero", "Buenas tardes, ¿qué van a tomar?", "Good afternoon, what are you going to have?"),
                ("Cliente", "De primero, una sopa. ¿El pollo lleva nueces?", "To start, a soup. Does the chicken have nuts in it?"),
                ("Camarero", "No, pero lleva nata. ¿Es usted alérgico?", "No, but it has cream in it. Are you allergic?"),
                ("Cliente", "Sí, soy alérgico a los frutos secos. Entonces tomaré el pescado.", "Yes, I'm allergic to nuts. I'll have the fish then."),
            ],
        },
    },
    "health": {
        "title": "La salud y el bienestar",
        "en": "Healthy living and wellbeing",
        "intro": "Keeping healthy, what you should do and what you actually do. Modal verbs, the body and stress: a topic that rewards honest, grown-up answers.",
        "words": [
            ("sano / saludable", "healthy", "Intento llevar una vida sana entre semana.", "I try to lead a healthy life during the week.", None),
            ("la comida basura", "junk food", "Como comida basura solo los fines de semana.", "I only eat junk food at weekends.", None),
            ("estar en forma", "to be fit", "Corro para estar en forma y despejarme.", "I run to keep fit and clear my head.", None),
            ("el estrés", "stress", "Los exámenes me producen mucho estrés.", "Exams cause me a lot of stress.", None),
            ("dormir lo suficiente", "to get enough sleep", "No duermo lo suficiente porque me acuesto tarde.", "I don't get enough sleep because I go to bed late.", None),
            ("la salud mental", "mental health", "Hablar con alguien ayuda a cuidar la salud mental.", "Talking to someone helps you look after your mental health.", None),
            ("me duele… / me duelen…", "my … hurts", "Me duele la cabeza y me duelen los ojos.", "My head hurts and my eyes hurt.", None),
            ("el médico / la médica", "doctor", "Tengo cita con el médico el jueves.", "I've got a doctor's appointment on Thursday.", None),
        ],
        "tip": ("Deber, poder, hay que", "Health answers live on these three: <b>debo</b> comer mejor, <b>puedo</b> hacer más ejercicio, <b>hay que</b> dormir ocho horas. Each one is followed by an infinitive, never a conjugated verb."),
    },
}

TOPICS.update({
    "school": {
        "title": "El instituto",
        "en": "School life",
        "intro": "Subjects, timetable, rules and uniform. Every board asks about school, and the comparison between your school and a Spanish one is an easy way to sound informed.",
        "words": [
            ("la asignatura", "school subject", "Mi asignatura preferida es la historia.", "My favourite subject is history.", None),
            ("el instituto / el insti", "secondary school", "Mi insti es bastante grande: hay mil alumnos.", "My school is quite big: there are a thousand students.", "ES"),
            ("el colegio / la escuela", "school", "La escuela empieza a las ocho de la mañana.", "School starts at eight in the morning.", "AR"),
            ("el horario", "timetable", "El horario de los lunes es horrible.", "Monday's timetable is horrible.", None),
            ("el uniforme", "uniform", "Llevamos uniforme, pero en España no es normal.", "We wear a uniform, but in Spain that's not normal.", None),
            ("sacar buenas notas", "to get good marks", "Saco buenas notas en idiomas.", "I get good marks in languages.", None),
            ("aprobar / suspender", "to pass / to fail", "Aprobé el examen de música, pero suspendí el de física.", "I passed the music exam, but I failed physics.", None),
            ("las normas", "rules", "Está prohibido usar el móvil durante las clases.", "Using your phone during lessons is banned.", None),
        ],
        "fact": ("¿Sabías que...?", "In most Spanish state schools students do not wear a uniform, lessons often finish at two or three, and marks are out of ten: a five is a pass and a nine or ten is a sobresaliente."),
    },
    "future": {
        "title": "Mis estudios y mi futuro",
        "en": "Studying and future plans",
        "intro": "What you want to study, the job you imagine and why. This is where future tenses, conditionals and a well-placed me gustaría do most of the work.",
        "words": [
            ("el año que viene", "next year", "El año que viene voy a estudiar bachillerato.", "Next year I'm going to do sixth form.", None),
            ("seguir estudiando", "to carry on studying", "Quiero seguir estudiando español en la universidad.", "I want to carry on studying Spanish at university.", None),
            ("la carrera", "degree, career", "Me gustaría hacer una carrera de medicina.", "I'd like to do a medical degree.", None),
            ("el trabajo / el empleo", "work / job", "Busco un trabajo de fin de semana en una tienda.", "I'm looking for a weekend job in a shop.", None),
            ("las prácticas", "work experience", "Hice prácticas en una clínica veterinaria.", "I did work experience in a vet's.", None),
            ("ganar dinero", "to earn money", "Trabajo de camarero para ganar dinero.", "I work as a waiter to earn money.", None),
            ("tomarse un año sabático", "to take a gap year", "Me gustaría tomarme un año sabático y viajar.", "I'd like to take a gap year and travel.", None),
            ("ser útil / tener salida", "to be useful / to have job prospects", "Los idiomas tienen mucha salida.", "Languages have great job prospects.", None),
        ],
        "tip": ("Tres niveles de futuro", "<b>Voy a estudiar</b> (going to, safest), <b>estudiaré</b> (will, future tense), <b>me gustaría estudiar</b> (I'd like to). Use all three in one answer and you have covered three structures in thirty seconds."),
    },
    "town": {
        "title": "Mi barrio",
        "en": "My town and neighbourhood",
        "intro": "What there is where you live, what you do there and what it needs. Hay, se puede and a short opinion about your area take you a long way.",
        "words": [
            ("el barrio", "neighbourhood", "Vivo en un barrio tranquilo a las afueras.", "I live in a quiet neighbourhood on the outskirts.", None),
            ("el centro comercial", "shopping centre", "Quedamos en el centro comercial los sábados.", "We meet at the shopping centre on Saturdays.", None),
            ("el polideportivo", "sports centre", "Hay un polideportivo nuevo cerca de mi casa.", "There's a new sports centre near my house.", None),
            ("el ayuntamiento", "town hall, council", "El ayuntamiento ha construido un carril bici.", "The council has built a cycle lane.", None),
            ("ruidoso / tranquilo", "noisy / quiet", "El centro es ruidoso, pero mi calle es tranquila.", "The centre is noisy, but my street is quiet.", None),
            ("hace falta", "what's needed is", "Hace falta un cine y más zonas verdes.", "What's needed is a cinema and more green spaces.", None),
            ("el transporte público", "public transport", "El transporte público funciona muy bien aquí.", "Public transport works really well here.", None),
            ("estar situado / situada", "to be situated", "Mi pueblo está situado en la costa sur.", "My town is situated on the south coast.", None),
        ],
        "dialogue": {
            "title": "¿Dónde está la estación?",
            "lines": [
                ("Turista", "Perdone, ¿hay una estación por aquí?", "Excuse me, is there a station around here?"),
                ("Vecina", "Sí, siga todo recto y tome la segunda a la derecha.", "Yes, go straight on and take the second on the right."),
                ("Turista", "¿Está lejos?", "Is it far?"),
                ("Vecina", "Está a diez minutos andando, enfrente del mercado.", "It's ten minutes on foot, opposite the market."),
            ],
        },
    },
    "travel": {
        "title": "Los viajes y el turismo",
        "en": "Travel, holidays and transport",
        "intro": "Where you went, where you would like to go and what went wrong. Holidays are the classic past-tense topic: if you can tell a short holiday story, you can handle most writing tasks.",
        "words": [
            ("de vacaciones", "on holiday", "El verano pasado fui de vacaciones a Málaga.", "Last summer I went on holiday to Malaga.", None),
            ("el alojamiento", "accommodation", "Nos alojamos en un hotel cerca de la playa.", "We stayed in a hotel near the beach.", None),
            ("hacer la maleta", "to pack", "Hice la maleta la noche anterior.", "I packed the night before.", None),
            ("el billete / el boleto", "ticket", "Compré un billete de ida y vuelta.", "I bought a return ticket.", "ES/AR"),
            ("retrasarse", "to be delayed", "El vuelo se retrasó tres horas.", "The flight was delayed three hours.", None),
            ("el paisaje", "landscape, scenery", "El paisaje de los Andes es impresionante.", "The landscape in the Andes is breathtaking.", None),
            ("hacer turismo", "to go sightseeing", "Hicimos turismo por el casco antiguo.", "We went sightseeing around the old town.", None),
            ("volvería", "I would go back", "Volvería a Argentina sin pensarlo.", "I'd go back to Argentina without thinking twice.", None),
        ],
        "tip": ("Una anécdota de vacaciones", "A holiday answer with one problem in it beats a perfect list of beaches: <b>Lo pasamos genial, pero perdimos el autobús y tuvimos que coger un taxi.</b> Problems force the preterite and sound real."),
    },
    "tech": {
        "title": "La tecnología y las redes",
        "en": "Media, technology and social media",
        "intro": "Phones, apps and what screens do to us. The exam wants both sides: what technology is good for, and what worries you about it.",
        "words": [
            ("el móvil", "mobile phone", "Paso demasiado tiempo con el móvil.", "I spend too much time on my phone.", "ES"),
            ("el celular", "mobile phone", "Dejo el celular en otra habitación para estudiar.", "I leave my phone in another room to study.", "AR"),
            ("las redes sociales", "social media", "Uso las redes sociales para hablar con mis primos.", "I use social media to talk to my cousins.", None),
            ("colgar / subir una foto", "to post a photo", "Subí una foto del concierto anoche.", "I posted a photo of the concert last night.", None),
            ("descargar", "to download", "Descargo música y pódcast en español.", "I download music and podcasts in Spanish.", None),
            ("la contraseña", "password", "Nunca comparto mi contraseña con nadie.", "I never share my password with anyone.", None),
            ("el ciberacoso", "cyberbullying", "El ciberacoso es un problema muy serio.", "Cyberbullying is a very serious problem.", None),
            ("enganchado / enganchada", "hooked, addicted", "Estoy un poco enganchada a los vídeos cortos.", "I'm a bit hooked on short videos.", None),
        ],
        "fact": ("¿Sabías que...?", "Spanish borrows English tech words but makes them its own: chatear, postear, un selfi, guglear. In exams the safer choice is the Spanish version: colgar una foto, buscar en internet."),
    },
    "environment": {
        "title": "El medio ambiente",
        "en": "The environment and where people live",
        "intro": "What is going wrong with the planet and what you actually do about it. Higher-level vocabulary here is worth real marks, and the structures repeat.",
        "words": [
            ("el medio ambiente", "the environment", "Proteger el medio ambiente es cosa de todos.", "Protecting the environment is everyone's job.", None),
            ("el cambio climático", "climate change", "El cambio climático ya afecta a mi región.", "Climate change already affects my region.", None),
            ("la contaminación", "pollution", "La contaminación del aire es peor en la ciudad.", "Air pollution is worse in the city.", None),
            ("reciclar", "to recycle", "En casa reciclamos el vidrio y el papel.", "At home we recycle glass and paper.", None),
            ("ahorrar energía", "to save energy", "Apago las luces para ahorrar energía.", "I turn the lights off to save energy.", None),
            ("el plástico de un solo uso", "single-use plastic", "Deberíamos prohibir el plástico de un solo uso.", "We should ban single-use plastic.", None),
            ("la sequía / las inundaciones", "drought / floods", "El año pasado hubo una sequía muy larga.", "Last year there was a very long drought.", None),
            ("tomar medidas", "to take action", "Los gobiernos tienen que tomar medidas ya.", "Governments have to take action now.", None),
        ],
        "tip": ("La frase que lo cambia todo", "<b>Deberíamos</b> + infinitive (we should) turns a list of problems into an opinion: <b>Deberíamos usar más el transporte público.</b> Learn it once, use it in every environment answer."),
    },
    "celebrations": {
        "title": "Fiestas y tradiciones",
        "en": "Customs, festivals and celebrations",
        "intro": "How families celebrate here and in the Spanish-speaking world. Cultural detail is what lifts an answer out of the ordinary, and it is easy to remember.",
        "words": [
            ("la fiesta", "party, festival", "En mi pueblo hay fiestas en agosto.", "In my town there are festivals in August.", None),
            ("celebrar", "to celebrate", "Celebramos la Nochebuena con toda la familia.", "We celebrate Christmas Eve with the whole family.", None),
            ("el cumpleaños", "birthday", "Para mi cumpleaños hicimos una barbacoa.", "For my birthday we had a barbecue.", None),
            ("el día festivo", "public holiday", "El seis de enero es día festivo en España.", "The sixth of January is a public holiday in Spain.", None),
            ("el desfile", "parade", "Fuimos a ver el desfile de carnaval.", "We went to see the carnival parade.", None),
            ("los fuegos artificiales", "fireworks", "Hubo fuegos artificiales a medianoche.", "There were fireworks at midnight.", None),
            ("la costumbre", "custom", "Es costumbre comer doce uvas en Nochevieja.", "It's a custom to eat twelve grapes on New Year's Eve.", None),
            ("reunirse", "to get together", "Toda la familia se reúne en casa de mis abuelos.", "The whole family gets together at my grandparents' house.", None),
        ],
        "fact": ("¿Sabías que...?", "On 6 January Spanish children get their presents from los Reyes Magos, not Father Christmas, and in Mexico el Día de Muertos (1–2 November) is a joyful festival, not a sad one."),
    },
    "world": {
        "title": "El mundo hispanohablante",
        "en": "Countries, languages and the international world",
        "intro": "Where Spanish is spoken, how countries differ and why learning the language matters. Useful for the reading paper, where texts are set all over the Spanish-speaking world.",
        "words": [
            ("el país / la nacionalidad", "country / nationality", "Argentina es un país enorme y muy variado.", "Argentina is a huge and very varied country.", None),
            ("el idioma / la lengua", "language", "El español es el idioma oficial de veinte países.", "Spanish is the official language of twenty countries.", None),
            ("hispanohablante", "Spanish-speaking", "Hay más de 490 millones de hispanohablantes.", "There are more than 490 million Spanish speakers.", None),
            ("la frontera", "border", "Perú comparte frontera con cinco países.", "Peru shares a border with five countries.", None),
            ("el extranjero", "abroad", "Me gustaría trabajar en el extranjero.", "I'd like to work abroad.", None),
            ("la cultura", "culture", "Me fascina la cultura mexicana.", "Mexican culture fascinates me.", None),
            ("el intercambio", "exchange", "Hice un intercambio con una familia de Valencia.", "I did an exchange with a family from Valencia.", None),
            ("merecer la pena", "to be worth it", "Aprender un idioma merece la pena.", "Learning a language is worth it.", None),
        ],
        "tip": ("Cuidado con los países", "Nationalities are written in lower case in Spanish: <b>soy inglés</b>, <b>una familia española</b>. Countries keep the capital letter: <b>Inglaterra</b>, <b>España</b>, <b>México</b>."),
    },
})

# ------------------------------------------------- gramática por tema y por nivel

GRAMMAR = {
    "identity": {
        "F": ("Ser + adjetivo", "<p><b>Ser</b> says what someone <i>is</i>. The adjective changes to match the person.</p><table><tr><td>(yo) <b>soy</b></td><td>(nosotros) <b>somos</b></td></tr><tr><td>(tú) <b>eres</b> / (vos) <b>sos</b></td><td>(vosotros) <b>sois</b> {ES}</td></tr><tr><td>(él / ella) <b>es</b></td><td>(ellos / ellas) <b>son</b></td></tr></table><p>Soy generos<b>o</b> · Soy generos<b>a</b> · Somos generos<b>os</b>. Adjectives in <b>-e</b> and <b>-ista</b> never change: <b>Soy optimista</b>.</p>"),
        "H": ("Ser, estar y lo + adjetivo", "<p><b>Ser</b> is what you are; <b>estar</b> is how you are right now.</p><table><tr><td><b>Soy</b> una persona tranquila.</td><td>what I'm like</td></tr><tr><td><b>Estoy</b> agobiada por los exámenes.</td><td>how I am today</td></tr></table><p>To sound more sophisticated, use <b>lo</b> + adjective: <b>lo mejor de mí es que soy leal</b>, <b>lo que más me define es mi sentido del humor</b>.</p>"),
    },
    "family": {
        "F": ("Los posesivos", "<table><tr><td><b>mi</b> hermano / <b>mis</b> hermanos</td><td>my</td></tr><tr><td><b>tu</b> madre / <b>tus</b> padres</td><td>your</td></tr><tr><td><b>su</b> casa / <b>sus</b> primos</td><td>his, her, their</td></tr><tr><td><b>nuestro</b> perro / <b>nuestra</b> casa</td><td>our</td></tr></table><p>They agree with the <i>thing owned</i>, not the owner: <b>mis abuelos</b> (several grandparents, one me)."),
        "H": ("Que, quien, lo que", "<p>Join two ideas instead of writing two short sentences.</p><table><tr><td>Tengo una hermana <b>que</b> estudia en Leeds.</td><td>who / that</td></tr><tr><td>Mi tía, <b>con quien</b> vivo, es enfermera.</td><td>with whom</td></tr><tr><td><b>Lo que</b> más valoro es el apoyo de mi familia.</td><td>what (the thing that)</td></tr></table><p><b>Lo que</b> + verb + <b>es</b> is a free upgrade in any writing task.</p>"),
    },
    "friends": {
        "F": ("Comparar personas", "<table><tr><td>Mi amigo es <b>más</b> divertido <b>que</b> yo.</td><td>more … than</td></tr><tr><td>Soy <b>menos</b> tímida <b>que</b> mi prima.</td><td>less … than</td></tr><tr><td>Leila es <b>tan</b> leal <b>como</b> Sara.</td><td>as … as</td></tr></table><p>Two irregulars you must know: <b>mejor</b> (better) and <b>peor</b> (worse), never <i>más bueno</i>.</p>"),
        "H": ("El superlativo y el subjuntivo", "<p>Superlative: <b>el / la / los / las</b> + <b>más</b> + adjective: <b>Es la persona más generosa que conozco.</b></p><p>After a description of someone who may or may not exist, Spanish uses the subjunctive:</p><table><tr><td>Busco un amigo que <b>sea</b> leal.</td><td>I'm looking for a friend who is loyal</td></tr><tr><td>Lo importante es que <b>escuche</b>.</td><td>the important thing is that they listen</td></tr></table>"),
    },
    "home": {
        "F": ("Los verbos reflexivos", "<table><tr><td>(yo) <b>me</b> levanto</td><td>I get up</td></tr><tr><td>(tú) <b>te</b> duchas</td><td>you have a shower</td></tr><tr><td>(él / ella) <b>se</b> viste</td><td>he / she gets dressed</td></tr><tr><td>(nosotros) <b>nos</b> acostamos</td><td>we go to bed</td></tr></table><p>Say the time with <b>a las</b>: <b>Me levanto a las siete y media.</b></p>"),
        "H": ("Soler y el imperfecto", "<p><b>Soler</b> + infinitive = usually do something: <b>Suelo levantarme a las siete.</b></p><p>For how things used to be, use the imperfect:</p><table><tr><td>Cuando era pequeño, <b>me acostaba</b> a las ocho.</td><td>I used to go to bed at eight</td></tr><tr><td>Antes <b>vivíamos</b> en un piso más pequeño.</td><td>we used to live in a smaller flat</td></tr></table>"),
    },
    "freetime": {
        "F": ("Gustar y compañía", "<p><b>Gustar</b> works backwards: the thing is the subject.</p><table><tr><td><b>Me gusta</b> el fútbol.</td><td>one thing</td></tr><tr><td><b>Me gustan</b> los videojuegos.</td><td>more than one thing</td></tr><tr><td><b>Me gusta</b> jugar al tenis.</td><td>+ infinitive: always singular</td></tr></table><p>Same pattern: <b>me encanta</b>, <b>me interesa</b>, <b>me aburre</b>.</p>"),
        "H": ("A mí me…, lo que me…", "<p>Add <b>a mí</b>, <b>a mi hermano</b> to make it clear who you mean and to add emphasis: <b>A mí me apasiona el atletismo, pero a mi hermano le aburre.</b></p><table><tr><td>Me apasiona / me chifla {ES}</td><td>I'm mad about</td></tr><tr><td>No soporto / odio</td><td>I can't stand / I hate</td></tr><tr><td>Lo que más me gusta es…</td><td>what I like most is…</td></tr></table>"),
    },
    "music_tv": {
        "F": ("Dar tu opinión", "<table><tr><td><b>Creo que</b> / <b>Pienso que</b></td><td>I think that</td></tr><tr><td><b>Me parece</b> + adjetivo</td><td>I find it / it seems to me</td></tr><tr><td><b>En mi opinión</b></td><td>in my opinion</td></tr></table><p>Always follow with <b>porque</b> and a reason: <b>Me parece aburrida porque la historia es lenta.</b></p>"),
        "H": ("No creo que + subjuntivo", "<p>Positive opinions take the normal (indicative) verb; negative ones take the subjunctive.</p><table><tr><td><b>Creo que</b> es un buen modelo.</td><td>I think he is</td></tr><tr><td><b>No creo que</b> <b>sea</b> un buen modelo.</td><td>I don't think he is</td></tr><tr><td><b>Dudo que</b> <b>tenga</b> talento.</td><td>I doubt he has</td></tr></table><p>Two or three of these per essay are enough to show the examiner you can handle the structure.</p>"),
    },
    "food": {
        "F": ("Pedir en un restaurante", "<table><tr><td><b>Quiero</b> / <b>Quisiera</b>…</td><td>I want / I'd like</td></tr><tr><td><b>Para mí</b>, la sopa.</td><td>for me, the soup</td></tr><tr><td><b>¿Me trae</b> la cuenta?</td><td>could you bring me the bill?</td></tr><tr><td><b>¿Lleva</b> frutos secos?</td><td>does it contain nuts?</td></tr></table><p><b>Quisiera</b> is politer than <b>quiero</b>, and politeness is marked in the role-play.</p>"),
        "H": ("El se impersonal", "<p>To talk about what people do in general, use <b>se</b> + the verb.</p><table><tr><td>En España <b>se cena</b> muy tarde.</td><td>people have dinner very late</td></tr><tr><td><b>Se comen</b> doce uvas en Nochevieja.</td><td>twelve grapes are eaten</td></tr><tr><td>Aquí no <b>se deja</b> propina.</td><td>you don't leave a tip here</td></tr></table><p>The verb is plural when the thing after it is plural.</p>"),
    },
    "health": {
        "F": ("Deber, poder, hay que", "<table><tr><td><b>Debo</b> comer más fruta.</td><td>I must / I should</td></tr><tr><td><b>Puedo</b> ir en bici al insti.</td><td>I can</td></tr><tr><td><b>Hay que</b> dormir ocho horas.</td><td>you have to (in general)</td></tr><tr><td><b>Tengo que</b> acostarme antes.</td><td>I have to</td></tr></table><p>All four are followed by the infinitive, with no <b>que</b> in between (except <b>tener que</b>).</p>"),
        "H": ("Es importante que + subjuntivo", "<p>After impersonal expressions, Spanish uses the subjunctive.</p><table><tr><td>Es importante <b>que duermas</b> bien.</td><td>it's important that you sleep well</td></tr><tr><td>Es necesario <b>que hagamos</b> ejercicio.</td><td>it's necessary that we exercise</td></tr></table><p>Softer advice uses the conditional: <b>deberías</b> beber más agua, <b>podrías</b> empezar poco a poco.</p>"),
    },
    "school": {
        "F": ("El presente regular", "<table><tr><td></td><td><b>estudiar</b></td><td><b>aprender</b></td><td><b>escribir</b></td></tr><tr><td>yo</td><td>estudi<b>o</b></td><td>aprend<b>o</b></td><td>escrib<b>o</b></td></tr><tr><td>tú</td><td>estudi<b>as</b></td><td>aprend<b>es</b></td><td>escrib<b>es</b></td></tr><tr><td>él / ella</td><td>estudi<b>a</b></td><td>aprend<b>e</b></td><td>escrib<b>e</b></td></tr><tr><td>nosotros</td><td>estudi<b>amos</b></td><td>aprend<b>emos</b></td><td>escrib<b>imos</b></td></tr><tr><td>ellos</td><td>estudi<b>an</b></td><td>aprend<b>en</b></td><td>escrib<b>en</b></td></tr></table>"),
        "H": ("Desde hace y el pretérito escolar", "<p><b>Desde hace</b> + time, with the <i>present</i> tense, for something still going on: <b>Estudio español <b>desde hace</b> cinco años.</b></p><table><tr><td>El año pasado <b>saqué</b> un nueve.</td><td>finished action: preterite</td></tr><tr><td>En primaria <b>llevábamos</b> uniforme.</td><td>how it used to be: imperfect</td></tr></table>"),
    },
    "future": {
        "F": ("Ir a + infinitivo", "<table><tr><td>(yo) <b>voy a</b> estudiar</td><td>I'm going to study</td></tr><tr><td>(tú) <b>vas a</b> trabajar</td><td>you're going to work</td></tr><tr><td>(él / ella) <b>va a</b> viajar</td><td>he / she is going to travel</td></tr><tr><td>(nosotros) <b>vamos a</b> ir</td><td>we're going to go</td></tr></table><p>Add <b>me gustaría</b> + infinitive for what you'd like: <b>Me gustaría ser enfermera.</b></p>"),
        "H": ("Futuro, condicional y si", "<table><tr><td>estudiar<b>é</b>, ser<b>é</b>, ir<b>é</b></td><td>I will study, be, go</td></tr><tr><td>estudiar<b>ía</b>, ser<b>ía</b>, ir<b>ía</b></td><td>I would study, be, go</td></tr></table><p>Irregular stems: <b>tendré</b>, <b>haré</b>, <b>podré</b>, <b>saldré</b>, <b>vendré</b>.</p><p><b>Si</b> + imperfect subjunctive + conditional: <b>Si pudiera, estudiaría en Madrid.</b></p>"),
    },
    "town": {
        "F": ("Hay, está y las preposiciones", "<table><tr><td><b>Hay</b> un parque y dos cines.</td><td>there is / there are</td></tr><tr><td>El museo <b>está</b> en el centro.</td><td>it is (located)</td></tr><tr><td><b>al lado de</b> / <b>enfrente de</b></td><td>next to / opposite</td></tr><tr><td><b>cerca de</b> / <b>lejos de</b></td><td>near / far from</td></tr></table><p>Remember <b>a + el = al</b> and <b>de + el = del</b>: <b>al lado del mercado</b>.</p>"),
        "H": ("Se puede, se podría, falta", "<table><tr><td>En mi barrio <b>se puede</b> patinar.</td><td>you can</td></tr><tr><td><b>Se podría</b> construir un cine.</td><td>one could build</td></tr><tr><td>Lo que <b>falta</b> son zonas verdes.</td><td>what's missing is</td></tr><tr><td><b>Si hubiera</b> más autobuses, saldría más.</td><td>if there were more buses…</td></tr></table>"),
    },
    "travel": {
        "F": ("El pretérito: lo que hiciste", "<table><tr><td></td><td><b>viajar</b></td><td><b>comer</b></td><td><b>ir / ser</b></td></tr><tr><td>yo</td><td>viaj<b>é</b></td><td>com<b>í</b></td><td><b>fui</b></td></tr><tr><td>tú</td><td>viaj<b>aste</b></td><td>com<b>iste</b></td><td><b>fuiste</b></td></tr><tr><td>él / ella</td><td>viaj<b>ó</b></td><td>com<b>ió</b></td><td><b>fue</b></td></tr><tr><td>nosotros</td><td>viaj<b>amos</b></td><td>com<b>imos</b></td><td><b>fuimos</b></td></tr></table><p>Also essential: <b>hice</b> (I did), <b>tuve</b> (I had), <b>estuve</b> (I was), <b>hubo</b> (there was).</p>"),
        "H": ("Pretérito, imperfecto y pluscuamperfecto", "<table><tr><td><b>Fuimos</b> a Sevilla en julio.</td><td>the events: preterite</td></tr><tr><td><b>Hacía</b> calor y la gente <b>cantaba</b>.</td><td>the background: imperfect</td></tr><tr><td><b>Habíamos reservado</b> el hotel antes.</td><td>earlier still: pluperfect</td></tr></table><p>A holiday paragraph that mixes all three is exactly what the top mark bands describe.</p>"),
    },
    "tech": {
        "F": ("¿Con qué frecuencia?", "<table><tr><td><b>todos los días</b></td><td>every day</td></tr><tr><td><b>una vez a la semana</b></td><td>once a week</td></tr><tr><td><b>a menudo</b> / <b>a veces</b></td><td>often / sometimes</td></tr><tr><td><b>casi nunca</b> / <b>nunca</b></td><td>hardly ever / never</td></tr></table><p>With <b>nunca</b> before the verb you need no other negative: <b>Nunca uso Twitter.</b></p>"),
        "H": ("El pretérito perfecto", "<p><b>He</b>, <b>has</b>, <b>ha</b>, <b>hemos</b>, <b>habéis</b>, <b>han</b> + past participle (-ado / -ido).</p><table><tr><td><b>He colgado</b> una foto esta mañana.</td><td>I've posted a photo</td></tr><tr><td>Nunca <b>he sufrido</b> ciberacoso.</td><td>I've never suffered cyberbullying</td></tr></table><p>Irregular participles: <b>hecho</b>, <b>dicho</b>, <b>escrito</b>, <b>visto</b>, <b>vuelto</b>.</p>"),
    },
    "environment": {
        "F": ("Frases para proteger el planeta", "<table><tr><td><b>Hay que</b> reciclar más.</td><td>we have to</td></tr><tr><td><b>No se debe</b> malgastar agua.</td><td>you mustn't</td></tr><tr><td><b>Es mejor</b> ir en bici.</td><td>it's better to</td></tr><tr><td><b>Deberíamos</b> apagar las luces.</td><td>we should</td></tr></table><p>Opposites that score: <b>malgastar</b> (to waste) and <b>ahorrar</b> (to save).</p>"),
        "H": ("Para que + subjuntivo", "<table><tr><td><b>para que</b> el planeta <b>sobreviva</b></td><td>so that the planet survives</td></tr><tr><td><b>aunque</b> <b>sea</b> difícil</td><td>even if it's difficult</td></tr><tr><td><b>cuando</b> <b>seamos</b> adultos</td><td>when we're adults</td></tr><tr><td><b>a menos que</b> <b>actuemos</b></td><td>unless we act</td></tr></table><p>These four connectives always take the subjunctive and instantly raise the level of an essay.</p>"),
    },
    "celebrations": {
        "F": ("Verbos irregulares en pretérito", "<table><tr><td><b>fui</b></td><td>I went / I was</td></tr><tr><td><b>hice</b></td><td>I did / I made</td></tr><tr><td><b>hubo</b></td><td>there was / there were</td></tr><tr><td><b>vi</b></td><td>I saw</td></tr><tr><td><b>comimos</b> / <b>bailamos</b></td><td>we ate / we danced</td></tr></table><p>Start the sentence with when it happened: <b>El año pasado fui a…</b></p>"),
        "H": ("Tradiciones en imperfecto", "<p>For what always used to happen, use the imperfect or <b>solía</b> + infinitive.</p><table><tr><td>De pequeña <b>celebrábamos</b> la Nochevieja en casa.</td><td>we used to celebrate</td></tr><tr><td><b>Solíamos</b> ver el desfile juntos.</td><td>we used to watch</td></tr><tr><td>Mientras <b>cenábamos</b>, <b>empezaron</b> los fuegos.</td><td>background + event</td></tr></table>"),
    },
    "world": {
        "F": ("Las nacionalidades", "<table><tr><td>español / español<b>a</b></td><td>Spanish</td></tr><tr><td>inglés / ingles<b>a</b></td><td>English</td></tr><tr><td>argentino / argentin<b>a</b></td><td>Argentinian</td></tr><tr><td>estadounidense</td><td>American (US)</td></tr></table><p>No capital letters, and the accent disappears in the feminine: <b>inglés</b> → <b>inglesa</b>.</p>"),
        "H": ("Superlativos y aunque", "<table><tr><td>el país <b>más</b> grande <b>de</b> Sudamérica</td><td>the biggest in South America</td></tr><tr><td>una ciudad <b>buenísima</b></td><td>a fantastic city</td></tr><tr><td><b>aunque</b> <b>sea</b> caro, vale la pena</td><td>even if it's expensive</td></tr></table><p>Note <b>de</b>, not <i>en</i>, after a superlative: <b>la ciudad más bonita del mundo</b>.</p>"),
    },
}


def topic(key, level, **over):
    """Unidad de un tema con la caja de gramática del nivel pedido ('F' o 'H')."""
    u = dict(TOPICS[key])
    u["grammar"] = GRAMMAR[key][level]
    u.update(over)
    return u


# ------------------------------------------------------- caja de herramientas

_PRESENT = ("-ar, -er, -ir en presente", "<table><tr><td></td><td><b>hablar</b></td><td><b>comer</b></td><td><b>vivir</b></td></tr><tr><td>yo</td><td>habl<b>o</b></td><td>com<b>o</b></td><td>viv<b>o</b></td></tr><tr><td>tú</td><td>habl<b>as</b></td><td>com<b>es</b></td><td>viv<b>es</b></td></tr><tr><td>vos {AR}</td><td>habl<b>ás</b></td><td>com<b>és</b></td><td>viv<b>ís</b></td></tr><tr><td>él / ella / usted</td><td>habl<b>a</b></td><td>com<b>e</b></td><td>viv<b>e</b></td></tr><tr><td>nosotros</td><td>habl<b>amos</b></td><td>com<b>emos</b></td><td>viv<b>imos</b></td></tr><tr><td>vosotros {ES}</td><td>habl<b>áis</b></td><td>com<b>éis</b></td><td>viv<b>ís</b></td></tr><tr><td>ellos / ellas / ustedes</td><td>habl<b>an</b></td><td>com<b>en</b></td><td>viv<b>en</b></td></tr></table>")

_IRREG = ("Los cinco verbos que más caen", "<table><tr><td></td><td><b>ser</b></td><td><b>estar</b></td><td><b>tener</b></td><td><b>ir</b></td><td><b>hacer</b></td></tr><tr><td>yo</td><td>soy</td><td>estoy</td><td>tengo</td><td>voy</td><td>hago</td></tr><tr><td>tú</td><td>eres</td><td>estás</td><td>tienes</td><td>vas</td><td>haces</td></tr><tr><td>él / ella</td><td>es</td><td>está</td><td>tiene</td><td>va</td><td>hace</td></tr><tr><td>nosotros</td><td>somos</td><td>estamos</td><td>tenemos</td><td>vamos</td><td>hacemos</td></tr><tr><td>ellos / ellas</td><td>son</td><td>están</td><td>tienen</td><td>van</td><td>hacen</td></tr></table>")


def grammar_toolbox(level, subjunctive=None):
    """Unidades del capítulo de gramática. subjunctive=None usa el nivel."""
    if subjunctive is None:
        subjunctive = level == "H"
    units = [
        {
            "title": "Sustantivos, artículos y adjetivos",
            "en": "Nouns, articles and agreement",
            "intro": "Agreement is the single thing examiners notice most, and it is pure habit: every noun is masculine or feminine, and everything around it has to match.",
            "grammar": ("Concordancia", "<table><tr><td></td><td>masculino</td><td>femenino</td></tr><tr><td>singular</td><td><b>el</b> chico alt<b>o</b></td><td><b>la</b> chica alt<b>a</b></td></tr><tr><td>plural</td><td><b>los</b> chicos alt<b>os</b></td><td><b>las</b> chicas alt<b>as</b></td></tr><tr><td>un / una</td><td><b>un</b> libro</td><td><b>una</b> casa</td></tr></table><p>Adjectives normally go <i>after</i> the noun: <b>una película divertida</b>. Watch the ones ending in <b>-e</b> or a consonant: they only change in the plural (<b>fáciles</b>, <b>azules</b>).</p>"),
            "grid": [
                ("más … que", "more … than"), ("menos … que", "less … than"), ("tan … como", "as … as"),
                ("el / la más …", "the most …"), ("mejor / peor", "better / worse"), ("mayor / menor", "older / younger"),
                ("muy / bastante", "very / quite"), ("un poco / demasiado", "a bit / too"), ("buenísimo", "really good"),
            ],
        },
        {
            "title": "El presente",
            "en": "The present tense",
            "intro": "Everything you say about your life now runs on this tense. Learn the three endings, then the handful of verbs that break the rules.",
            "grammar": _PRESENT,
            "tip": ("Verbos que cambian la raíz", "Some verbs change their vowel in all forms except <i>nosotros</i>: <b>querer → quiero</b>, <b>poder → puedo</b>, <b>jugar → juego</b>, <b>pedir → pido</b>, <b>preferir → prefiero</b>."),
        },
        {
            "title": "Ser, estar, tener, ir, hacer",
            "en": "The irregular verbs you cannot avoid",
            "grammar": _IRREG,
            "tip": ("Ser o estar", "<b>Ser</b> for what something is (<b>Soy inglesa</b>, <b>Es profesor</b>, <b>Son las tres</b>). <b>Estar</b> for where it is and how it feels (<b>Está en Madrid</b>, <b>Estoy cansada</b>)."),
        },
        {
            "title": "Hablar del pasado",
            "en": "The past tenses",
            "intro": "Two past tenses, two jobs: the preterite tells the story, the imperfect paints the background. Marks come from using both in the same paragraph.",
            "grammar": ("Pretérito e imperfecto", "<table><tr><td></td><td><b>visitar</b></td><td><b>comer</b></td><td><b>ir / ser</b></td></tr><tr><td>yo</td><td>visit<b>é</b></td><td>com<b>í</b></td><td>fui</td></tr><tr><td>tú</td><td>visit<b>aste</b></td><td>com<b>iste</b></td><td>fuiste</td></tr><tr><td>él / ella</td><td>visit<b>ó</b></td><td>com<b>ió</b></td><td>fue</td></tr><tr><td>nosotros</td><td>visit<b>amos</b></td><td>com<b>imos</b></td><td>fuimos</td></tr><tr><td>ellos</td><td>visit<b>aron</b></td><td>com<b>ieron</b></td><td>fueron</td></tr></table><table><tr><td>imperfecto</td><td>habl<b>aba</b></td><td>com<b>ía</b></td><td><b>era</b> / <b>iba</b></td></tr></table><p><b>Ayer fui</b> al cine (event) · <b>Antes iba</b> todos los sábados (routine in the past).</p>"),
            "tip": ("Irregulares del pretérito", "<b>hice</b>, <b>tuve</b>, <b>estuve</b>, <b>pude</b>, <b>puse</b>, <b>vine</b>, <b>dije</b>, <b>hubo</b>. None of them carries an accent in the <i>yo</i> form."),
        },
        {
            "title": "Hablar del futuro",
            "en": "The future and the conditional",
            "grammar": ("Voy a…, estudiaré, estudiaría", "<table><tr><td><b>voy a</b> + infinitivo</td><td>I'm going to…</td></tr><tr><td>estudiar<b>é</b>, com<b>eré</b>, ir<b>é</b></td><td>I will…</td></tr><tr><td>estudiar<b>ía</b>, com<b>ería</b>, ir<b>ía</b></td><td>I would…</td></tr><tr><td><b>me gustaría</b> + infinitivo</td><td>I'd like to…</td></tr></table><p>Both tenses add the endings to the whole infinitive. Irregular stems: <b>tendr-</b>, <b>har-</b>, <b>podr-</b>, <b>saldr-</b>, <b>vendr-</b>, <b>dir-</b>.</p>"),
            "tip": ("Una frase de oro", "<b>El año que viene voy a estudiar bachillerato y, si saco buenas notas, estudiaré Medicina.</b> One sentence, two future structures, one condition."),
        },
        {
            "title": "Pronombres, negativos y preguntas",
            "en": "Pronouns, negatives and question words",
            "grammar": ("Lo, la, le y los negativos", "<table><tr><td><b>lo</b> / <b>la</b> / <b>los</b> / <b>las</b></td><td>it, them (direct)</td></tr><tr><td><b>me</b> / <b>te</b> / <b>le</b> / <b>nos</b> / <b>les</b></td><td>to me, to you, to him…</td></tr><tr><td>No <b>lo</b> veo nunca.</td><td>I never see him</td></tr><tr><td>No tengo <b>nada</b> / <b>nadie</b> / <b>ningún</b></td><td>nothing / nobody / no…</td></tr></table><p>Spanish keeps the double negative: <b>No hago nada.</b></p>"),
            "grid": [
                ("¿Qué?", "What?"), ("¿Quién?", "Who?"), ("¿Dónde?", "Where?"),
                ("¿Adónde?", "Where to?"), ("¿Cuándo?", "When?"), ("¿Cómo?", "How? What like?"),
                ("¿Cuántos?", "How many?"), ("¿Por qué?", "Why?"), ("¿Cuál?", "Which?"),
            ],
        },
    ]
    if subjunctive:
        units.append({
            "title": "El subjuntivo, sin miedo",
            "en": "The subjunctive, without the fear",
            "intro": "You do not need to master the subjunctive. You need four or five phrases that trigger it, used correctly, in the places where the mark scheme is looking for complex language.",
            "grammar": ("Cómo se forma y cuándo se usa", "<table><tr><td>hablar → <b>hable</b></td><td>comer → <b>coma</b></td><td>vivir → <b>viva</b></td></tr><tr><td>ser → <b>sea</b></td><td>tener → <b>tenga</b></td><td>hacer → <b>haga</b></td></tr><tr><td>ir → <b>vaya</b></td><td>poder → <b>pueda</b></td><td>haber → <b>haya</b></td></tr></table><p>The endings swap over: -ar verbs take <b>-e</b>, -er / -ir verbs take <b>-a</b>.</p>"),
            "grid": [
                ("cuando sea mayor", "when I'm older"), ("para que + subj.", "so that"), ("aunque sea difícil", "even if it's hard"),
                ("no creo que sea", "I don't think it is"), ("es importante que", "it's important that"), ("ojalá pudiera", "I wish I could"),
                ("espero que te guste", "I hope you like it"), ("quiero que vengas", "I want you to come"), ("si pudiera, iría", "if I could, I'd go"),
            ],
            "tip": ("Dónde ponerlo", "Save one subjunctive phrase for the end of your writing task: <b>Espero que el año que viene pueda visitar España.</b> It is the last thing the examiner reads."),
        })
    return units


def vocab_toolbox(level):
    """Unidades del capítulo de vocabulario y frases de examen."""
    return [
        {
            "title": "Las palabras que más se repiten",
            "en": "High-frequency words",
            "intro": "These are the words that appear in every paper, whatever the topic. Knowing them is what makes a reading text feel readable.",
            "grid": [
                ("siempre / nunca", "always / never"), ("también / tampoco", "also / neither"), ("pero / sin embargo", "but / however"),
                ("mucho / poco", "a lot / little"), ("todo / nada", "everything / nothing"), ("alguien / nadie", "someone / nobody"),
                ("antes / después", "before / after"), ("ahora / luego", "now / later"), ("aquí / allí", "here / there"),
                ("sobre todo", "above all"), ("además", "besides, furthermore"), ("por ejemplo", "for example"),
                ("en cambio", "on the other hand"), ("por eso", "that's why"), ("en realidad", "actually"),
                ("a lo mejor / quizás", "maybe"), ("de hecho", "in fact"), ("al final", "in the end"),
            ],
        },
        {
            "title": "Opiniones, conectores e intensificadores",
            "en": "Opinions, connectives and intensifiers",
            "intro": "Every mark scheme rewards opinions with reasons. Keep a short list you can use on any topic and you will never run out of something to say.",
            "grid": [
                ("creo que / pienso que", "I think that"), ("me parece que", "it seems to me"), ("en mi opinión", "in my opinion"),
                ("lo bueno / lo malo es que", "the good / bad thing is that"), ("lo que más me gusta es", "what I like most is"), ("estoy a favor / en contra de", "I'm for / against"),
                ("porque / ya que", "because / since"), ("aunque", "although"), ("mientras que", "whereas"),
                ("por un lado… por otro lado", "on one hand… on the other"), ("además / encima", "what's more"), ("por lo tanto", "therefore"),
                ("muy / bastante / demasiado", "very / quite / too"), ("totalmente / completamente", "totally"), ("un poco / algo", "a bit / somewhat"),
            ],
            "tip": ("La fórmula de una buena respuesta", "Opinion + reason + example + contrast: <b>Me encanta el atletismo porque me relaja. Por ejemplo, corro cada mañana. Sin embargo, en invierno es más difícil.</b>"),
        },
        {
            "title": "El tiempo, los números y la frecuencia",
            "en": "Time, numbers and frequency",
            "intro": "Dates, times and numbers decide more listening marks than any grammar point, because one wrong number is one wrong answer.",
            "grid": [
                ("ayer / hoy / mañana", "yesterday / today / tomorrow"), ("anoche", "last night"), ("pasado mañana", "the day after tomorrow"),
                ("la semana pasada", "last week"), ("el mes que viene", "next month"), ("hace dos años", "two years ago"),
                ("a las siete y media", "at half past seven"), ("a las ocho menos cuarto", "at quarter to eight"), ("de la mañana / tarde / noche", "a.m. / afternoon / evening"),
                ("quince, dieciséis, veinte", "15, 16, 20"), ("treinta, cuarenta, cincuenta", "30, 40, 50"), ("cien, doscientos, mil", "100, 200, 1000"),
                ("primero, segundo, tercero", "first, second, third"), ("una vez / dos veces", "once / twice"), ("todos los días", "every day"),
            ],
            "tip": ("Trampa de dictado", "In Spanish the decimal point is a comma and thousands take a full stop: <b>1.500 euros</b>, <b>3,5 kilómetros</b>. Write the number as you hear it, not as you would in English."),
        },
        {
            "title": "Frases para el examen",
            "en": "Phrases for the exam itself",
            "intro": "Learn these by heart. They buy you thinking time in the speaking test and rescue you when a word disappears from your head.",
            "grid": [
                ("¿Puede repetir, por favor?", "Could you repeat, please?"), ("No he entendido la pregunta.", "I didn't understand the question."), ("¿Puede hablar más despacio?", "Could you speak more slowly?"),
                ("Pues… / Bueno…", "Well…"), ("A ver…", "Let's see…"), ("Es decir…", "That is to say…"),
                ("No estoy seguro, pero creo que…", "I'm not sure, but I think…"), ("Lo que quiero decir es que…", "What I mean is that…"), ("¿Cómo se dice… en español?", "How do you say… in Spanish?"),
                ("En primer lugar", "firstly"), ("Para terminar", "to finish"), ("En resumen", "in short"),
            ],
            "tip": ("Nunca te quedes en silencio", "If a word vanishes, talk around it: <b>es una cosa que se usa para…</b>, <b>es como un/una…</b>. Hesitating in Spanish still counts as speaking Spanish; silence does not."),
        },
    ]


def instructions_unit(ci_label="las instrucciones"):
    """Unidad con las palabras de instrucción que aparecen en los enunciados."""
    return {
        "title": "Las instrucciones del examen",
        "en": "Understanding the rubrics",
        "intro": "Some papers give their instructions in Spanish. Losing a mark because you described instead of comparing is the most avoidable mistake there is.",
        "grid": [
            ("Contesta a las preguntas", "Answer the questions"), ("Escribe la letra correcta", "Write the correct letter"), ("Elige / Escoge", "Choose"),
            ("Rellena los espacios", "Fill in the gaps"), ("Empareja", "Match up"), ("Marca con una cruz", "Mark with a cross"),
            ("Según el texto…", "According to the text…"), ("¿Verdadero o falso?", "True or false?"), ("Menciona dos cosas", "Mention two things"),
            ("Describe / Explica", "Describe / Explain"), ("Compara", "Compare"), ("Justifica tu respuesta", "Justify your answer"),
            ("No es necesario escribir frases completas", "You don't need to write full sentences"), ("Escribe aproximadamente 90 palabras", "Write approximately 90 words"), ("Responde a los cuatro puntos", "Answer all four bullet points"),
        ],
        "tip": ("Lee el enunciado dos veces", "<b>Menciona dos</b> means two, and a third one does not earn a third mark. <b>Justifica</b> means a reason is part of the answer. Underline the instruction verb before you start writing."),
    }


# ------------------------------------------------------------------ ejercicios

EX = {
    "identity": {"type": "match", "title": "¿Cómo eres?", "pairs": [
        ("simpático", "friendly"), ("trabajador", "hard-working"), ("perezoso", "lazy"), ("comprensivo", "understanding"),
        ("hablador", "chatty"), ("tímido", "shy"), ("orgulloso", "proud"), ("maduro", "mature")]},
    "family": {"type": "gap", "title": "Mi familia", "text": "Somos cinco en mi ___: mis padres, mis dos hermanos y yo. Me ___ bien con mi hermana, pero ___ con mi hermano por tonterías. Mis ___ viven en Valencia y los vemos en verano. En casa hay muy buen ___.", "answers": ["familia", "llevo", "discuto", "abuelos", "ambiente"]},
    "friends": {"type": "quiz", "title": "Ser o estar", "items": [
        ("Mi mejor amiga ___ muy leal.", ["es", "está", "son"], 0),
        ("Hoy Marco ___ enfadado conmigo.", ["es", "está", "estoy"], 1),
        ("Mis amigos ___ en el parque.", ["son", "están", "es"], 1),
        ("Nosotros ___ compañeros desde primaria.", ["estamos", "somos", "son"], 1),
        ("Yo ___ un poco tímida al principio.", ["soy", "estoy", "eres"], 0),
        ("¿Tú ___ cansado o aburrido?", ["eres", "estás", "está"], 1)]},
    "home": {"type": "gap", "title": "Mi rutina", "inst": "Write the correct form of the reflexive verb in brackets.", "text": "Entre semana (despertarse) ___ a las siete. Mi hermano (ducharse) ___ antes que yo. Nosotros (vestirse) ___ deprisa y desayunamos juntos. Mis padres (levantarse) ___ a las seis. Yo (acostarse) ___ sobre las diez y media.", "answers": ["me despierto", "se ducha", "nos vestimos", "se levantan", "me acuesto"]},
    "freetime": {"type": "ws", "title": "Sopa del tiempo libre", "words": ["DEPORTE", "PARTIDO", "ENTRENAR", "NATACION", "BAILAR", "EQUIPO", "BICI", "MUSICA", "TEATRO", "AJEDREZ", "QUEDAR", "SALIR"]},
    "music_tv": {"type": "odd", "title": "Odd one out", "items": [
        (["la canción", "el grupo", "el cantante", "el ayuntamiento"], 3, "it's a place, not music"),
        (["la serie", "la película", "el documental", "la contraseña"], 3, "it's not something you watch"),
        (["me encanta", "no soporto", "me parece", "descargar"], 3, "it's not an opinion phrase"),
        (["famoso", "exitoso", "conocido", "ruidoso"], 3, "it doesn't describe fame")]},
    "food": {"type": "translate", "title": "En el restaurante", "items": [
        ("I'd like the fish, please.", "Quisiera el pescado, por favor."),
        ("Does it contain nuts? I'm allergic.", "¿Lleva frutos secos? Soy alérgico / alérgica."),
        ("The bill, please.", "La cuenta, por favor."),
        ("I'm vegetarian, so I don't eat meat.", "Soy vegetariano / vegetariana, así que no como carne."),
        ("What is the typical dish of this region?", "¿Cuál es el plato típico de esta región?")]},
    "health": {"type": "quiz", "title": "Consejos de salud", "items": [
        ("___ dormir ocho horas cada noche.", ["Hay que", "Hay", "Hace"], 0),
        ("Debo ___ más fruta y verdura.", ["como", "comer", "comiendo"], 1),
        ("No ___ fumar nunca.", ["se debe", "se debes", "debe se"], 0),
        ("Me ___ la cabeza desde ayer.", ["duele", "duelen", "duelo"], 0),
        ("Para estar en forma, ___ ejercicio tres veces a la semana.", ["hago", "hace", "haces"], 0),
        ("Los exámenes me producen mucho ___.", ["estrés", "estresado", "estresar"], 0)]},
    "school": {"type": "gap", "title": "En el instituto", "inst": "Write the correct form of the verb in brackets.", "text": "En mi instituto (nosotros, estudiar) ___ diez asignaturas. Yo (preferir) ___ los idiomas porque son útiles. Mi amiga Zoe (sacar) ___ muy buenas notas en ciencias. Los profesores (ser) ___ bastante exigentes. ¿Tú (llevar) ___ uniforme en tu colegio?", "answers": ["estudiamos", "prefiero", "saca", "son", "llevas"]},
    "future": {"type": "order", "title": "Mis planes", "items": [
        "El año que viene voy a estudiar bachillerato.",
        "Me gustaría trabajar en el extranjero.",
        "Si saco buenas notas estudiaré Medicina.",
        "Mi hermana hizo prácticas en una oficina.",
        "Quiero seguir estudiando español porque tiene salida."]},
    "town": {"type": "match", "title": "¿Qué hay en tu barrio?", "pairs": [
        ("el polideportivo", "sports centre"), ("el ayuntamiento", "town hall"), ("la biblioteca", "library"),
        ("el centro comercial", "shopping centre"), ("las afueras", "the outskirts"), ("el casco antiguo", "the old town"),
        ("las zonas verdes", "green spaces"), ("el carril bici", "cycle lane")]},
    "travel": {"type": "gap", "title": "Las vacaciones del año pasado", "inst": "Write the correct preterite form of the verb in brackets.", "text": "El verano pasado (ir) ___ a Málaga con mi familia. (Nosotros, alojarse) ___ en un hotel cerca de la playa. El primer día (hacer) ___ muchísimo calor. Mis padres (visitar) ___ la catedral y yo (bañarse) ___ en el mar. Lo (nosotros, pasar) ___ genial.", "answers": ["fui", "nos alojamos", "hizo", "visitaron", "me bañé", "pasamos"]},
    "tech": {"type": "tf", "title": "¿Verdadero o falso?", "items": [
        ("«Colgar una foto» significa to post a photo.", True),
        ("«La contraseña» significa the screen.", False),
        ("«Enganchado» significa addicted, hooked.", True),
        ("«Descargar» significa to delete.", False),
        ("«Las redes sociales» significa social media.", True),
        ("«El ciberacoso» significa online shopping.", False)]},
    "environment": {"type": "translate", "title": "El medio ambiente", "items": [
        ("We should recycle more.", "Deberíamos reciclar más."),
        ("Air pollution is a serious problem.", "La contaminación del aire es un problema serio."),
        ("At home we save energy.", "En casa ahorramos energía."),
        ("Governments have to take action.", "Los gobiernos tienen que tomar medidas."),
        ("I go by bike to protect the environment.", "Voy en bici para proteger el medio ambiente.")]},
    "celebrations": {"type": "gap", "title": "Una fiesta inolvidable", "text": "El año pasado ___ a las fiestas de mi pueblo. ___ un desfile enorme por la calle principal y, a medianoche, ___ fuegos artificiales. Toda la familia se ___ en casa de mis abuelos y ___ paella. Es una ___ que me encanta.", "answers": ["fui", "Hubo", "vimos", "reunió", "comimos", "costumbre"]},
    "world": {"type": "match", "title": "Países y nacionalidades", "pairs": [
        ("España · español", "Spain · Spanish"), ("Argentina · argentino", "Argentina · Argentinian"), ("México · mexicano", "Mexico · Mexican"),
        ("Colombia · colombiano", "Colombia · Colombian"), ("Perú · peruano", "Peru · Peruvian"), ("Inglaterra · inglés", "England · English"),
        ("Gales · galés", "Wales · Welsh"), ("Escocia · escocés", "Scotland · Scottish")]},
}

_GRAMMAR_PRACTICE_F = [
    {"type": "gap", "title": "El presente", "inst": "Write the correct present-tense form of the verb in brackets.", "text": "Yo (vivir) ___ en Bristol. Mi madre (trabajar) ___ en un hospital. Nosotros (comer) ___ juntos los domingos. ¿Tú (estudiar) ___ francés? Mis amigos (jugar) ___ al baloncesto.", "answers": ["vivo", "trabaja", "comemos", "estudias", "juegan"]},
    {"type": "quiz", "title": "Ser, estar, tener, ir", "items": [
        ("Mi hermana ___ dieciocho años.", ["es", "tiene", "está"], 1),
        ("Nosotros ___ al cine los viernes.", ["vamos", "van", "voy"], 0),
        ("El museo ___ en el centro.", ["es", "está", "hay"], 1),
        ("___ un parque cerca de mi casa.", ["Hay", "Está", "Es"], 0),
        ("Yo ___ deporte dos veces a la semana.", ["hace", "hago", "haces"], 1),
        ("Mis padres ___ profesores.", ["están", "son", "somos"], 1)]},
    {"type": "gap", "title": "Pasado y futuro", "inst": "Write the correct form of the verb in brackets.", "text": "Ayer (yo, ir) ___ al polideportivo. El fin de semana pasado (nosotros, ver) ___ una película. Mañana (yo, ir a) ___ a estudiar para el examen. El año que viene (yo, estudiar) ___ bachillerato. Me (gustar) ___ viajar a Perú.", "answers": ["fui", "vimos", "voy", "estudiaré", "gustaría"]},
]

_GRAMMAR_PRACTICE_H = [
    {"type": "gap", "title": "Pretérito e imperfecto", "inst": "Write the correct past-tense form of the verb in brackets.", "text": "El verano pasado (nosotros, ir) ___ a Granada. (Hacer) ___ muchísimo calor y la ciudad (estar) ___ llena de turistas. Mientras (nosotros, visitar) ___ la Alhambra, (empezar) ___ a llover. Antes (yo, pensar) ___ que la historia era aburrida, pero cambié de opinión.", "answers": ["fuimos", "Hacía", "estaba", "visitábamos", "empezó", "pensaba"]},
    {"type": "quiz", "title": "¿Indicativo o subjuntivo?", "items": [
        ("Creo que ___ un buen modelo a seguir.", ["es", "sea", "sería"], 0),
        ("No creo que ___ justo.", ["es", "sea", "está"], 1),
        ("Cuando ___ mayor, viajaré por Sudamérica.", ["soy", "sea", "seré"], 1),
        ("Es importante que ___ ocho horas.", ["duermes", "duermas", "dormirás"], 1),
        ("Aunque ___ difícil, merece la pena.", ["es", "sea", "fue"], 1),
        ("Espero que te ___ el regalo.", ["gusta", "guste", "gustará"], 1)]},
    {"type": "translate", "title": "Estructuras de nivel alto", "items": [
        ("If I could, I would study in Madrid.", "Si pudiera, estudiaría en Madrid."),
        ("I've been studying Spanish for five years.", "Estudio español desde hace cinco años."),
        ("What I like most is the atmosphere.", "Lo que más me gusta es el ambiente."),
        ("We should take action before it's too late.", "Deberíamos tomar medidas antes de que sea demasiado tarde."),
        ("I had already booked the hotel.", "Ya había reservado el hotel.")]},
]

_VOCAB_PRACTICE = [
    {"type": "match", "title": "Conectores", "pairs": [
        ("sin embargo", "however"), ("además", "what's more"), ("por lo tanto", "therefore"),
        ("aunque", "although"), ("mientras que", "whereas"), ("por un lado", "on one hand"),
        ("ya que", "since"), ("sobre todo", "above all")]},
    {"type": "ws", "title": "Sopa de palabras clave", "words": ["SIEMPRE", "NUNCA", "TAMBIEN", "PERO", "PORQUE", "AUNQUE", "ADEMAS", "LUEGO", "ANTES", "AHORA", "QUIZAS", "BASTANTE"]},
    {"type": "tf", "title": "¿Lo dirías así en el examen?", "items": [
        ("«¿Puede repetir, por favor?» es una frase útil en el oral.", True),
        ("«Justifica tu respuesta» significa que hay que dar una razón.", True),
        ("«Menciona dos cosas» significa que puedes escribir cinco.", False),
        ("«1.500» en español significa mil quinientos.", True),
        ("«3,5» en español significa treinta y cinco.", False),
        ("Si no sabes una palabra, es mejor quedarse en silencio.", False)]},
]


def practice(keys, write=None, extra=None):
    """Ejercicios de un capítulo: los de sus temas + una tarea de escritura del libro."""
    exs = [EX[k] for k in keys if k in EX]
    if extra:
        exs += extra
    if write:
        exs.append(write)
    return exs


def grammar_practice(level, write=None):
    exs = list(_GRAMMAR_PRACTICE_H if level == "H" else _GRAMMAR_PRACTICE_F)
    if write:
        exs.append(write)
    return exs


def vocab_practice(write=None):
    exs = list(_VOCAB_PRACTICE)
    if write:
        exs.append(write)
    return exs


# ---------------------------------------------------------- piezas de cada libro

HOW_STEPS = [
    ("Start with chapter 1.", "Ten minutes understanding how your papers work is worth more than an hour of random vocabulary."),
    ("Cover the English column", "and say the Spanish out loud. Reading silently feels like revision; speaking is revision."),
    ("Treat the grammar boxes as a reference,", "not as a chapter to finish. Come back to them whenever a sentence breaks."),
    ("Do the activities in pen", "and mark them honestly with the answers at the back. A wrong answer you understand is a mark gained."),
    ("Write a little and often.", "Three short paragraphs a week beat one long essay the night before the mock."),
]

NOTE_REGIONS = ("España y Argentina", "<p>Spanish changes from country to country. When you see two options, the first is the one used in Spain {ES} and the second the one used in Argentina {AR}. Both are correct and both are accepted in your exam.</p><p class=\"pair\"><b>el móvil</b> {ES} &nbsp;=&nbsp; <b>el celular</b> {AR}</p>")

NOTE_SOURCE = ("Comprueba tu especificación", "<p>The exam details in this book follow the exam board's own published specification. Boards do update documents, so check the current version and your exact paper codes with your teacher before your first mock.</p>")


def paper_unit(title, en, intro, tasks, tip=None, fact=None):
    """Unidad del capítulo del examen: una prueba, con sus tareas en una cuadrícula."""
    u = {"title": title, "en": en, "intro": intro, "grid": tasks}
    if tip:
        u["tip"] = tip
    if fact:
        u["fact"] = fact
    return u


def welcome(title, lead, body, notes):
    return {"title": title, "lead": lead, "body": body, "how": HOW_STEPS, "notes": notes}


def end_page(photo, text, title="¡Mucha suerte!", script="you've got this"):
    return {"photo": photo, "title": title, "script": script, "text": text}
