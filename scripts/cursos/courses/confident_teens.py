"""Curso en video "Spanish for Confident Teens", armado sobre el e-book del mismo nombre.

Texto suelto = narradora (inglés británico); «…» = voz de España; ‹…› = voz de Argentina.
Las palabras, tablas, diálogos y ejercicios salen del libro; acá va sólo lo que se dice.
`rows` va fila por fila de la tabla de gramática del libro (None = fila de encabezado).
"""

BOOK = "spanish_for_confident_teens"

COURSE = {
    "title": "Spanish for Confident Teens",
    "slug": "Spanish-for-Confident-Teens",
    "level": "Ages 11–14 · KS3",
    "cover_photo": "confident-teens-cover.jpg",
    "photo_pos": {0: "38% 40%", 1: "50% 45%", 2: "62% 45%", 3: "35% 55%", 4: "50% 55%", 5: "50% 40%"},
    "welcome": [
        "¡Hola! Welcome to Spanish for Confident Teens.",
        "This course follows the big topics of Key Stage 3, so you can speak, read and write about your own life in Spanish.",
        "There are six modules: all about me, my free time, my school, my family and friends, my town, and a grammar toolbox.",
        "Every lesson is short. You'll hear real Spanish voices, from Spain, «¡Hola! ¿Qué tal?»",
        "and from Argentina. ‹¡Hola! ¿Cómo andás?›",
        "Both are correct, and you'll learn to understand both.",
        "When you see «¡Te toca!», it's your turn: say the answer out loud before you hear it.",
        "Keep your e-book next to you. It has every word, extra activities and all the answers.",
        "Mistakes are how we learn. ¡Vamos!",
    ],
    "chapters": [
        {
            "fact": [
                "Did you know? Spanish is the official language of twenty countries,",
                "from Spain to Argentina, Mexico, Cuba and Equatorial Guinea in Africa.",
                "In the United States, more than forty million people speak it at home.",
            ],
            "units": [
                {
                    "hook": ["Let's start with the very first thing you'll say to someone new: who you are and where you live."],
                    "tip": [
                        "Spanish sounds are regular, so once you know them, you can read any word.",
                        "J sounds like a strong H.", "«jirafa»",
                        "Double L sounds like Y in Spain,", "«me llamo»",
                        "and like SH in Argentina.", "‹me llamo›",
                        "This letter sounds like N Y.", "«España»",
                        "And H is always silent.", "«hola»",
                    ],
                },
                {
                    "hook": ["How would your friends describe you? Let's find the words for your personality."],
                    "grammar": {
                        "explain": ["Many adjectives end in O for a boy and A for a girl. Adjectives ending in E stay the same."],
                        "rows": ["«Soy simpático. Soy simpática.»", "«Soy inteligente.»"],
                        "after": [
                            "Use the ending that fits you, or the one that feels right.",
                            "Then make it stronger or softer with «muy», «bastante» or «un poco».",
                            "«Soy muy creativa y un poco tímida.»",
                        ],
                    },
                },
                {
                    "hook": ["Now, age and family. In Spanish you don't say how old you are: you say how many years you have!"],
                    "grammar": {
                        "explain": ["Here's one of the most useful verbs in Spanish: «tener», to have."],
                        "rows": ["«yo tengo»", "«tú tienes»‹vos tenés›", "«él tiene, ella tiene»"],
                        "after": ["So, to say I'm eleven:", "«Tengo once años.»"],
                    },
                },
                {
                    "hook": ["Numbers, months and birthdays: everything you need for your big day."],
                    "tip": [
                        "Dates follow a simple pattern: «el», then the number, then «de», then the month.",
                        "«el cinco de abril»",
                        "For the first of the month, people say «el uno», or, especially in Argentina,", "‹el primero›",
                    ],
                },
                {
                    "hook": ["Do you have a pet, or a pet you dream of? Let's meet the animals."],
                    "grammar": {
                        "explain": ["Adjectives agree with the noun: masculine or feminine, singular or plural."],
                        "rows": ["«un perro negro, una gata negra»", "«dos perros negros, dos gatas negras»"],
                        "after": ["Colours like «verde» and «azul» just add S, or E S, in the plural.", "«dos peces azules»"],
                    },
                    "fact": [
                        "In Spain and Argentina, more and more families adopt pets from rescue centres, called", "«refugios»",
                        "or", "«protectoras».", "The motto is", "«adopta, no compres»:", "adopt, don't shop.",
                    ],
                },
                {
                    "hook": ["Project time! Make a set of fact cards about animals of the Spanish-speaking world that need our protection."],
                    "tip": [
                        "For each card, use five sentence starters.",
                        "«Se llama… Vive en… Come… Es… Podemos…»",
                        "It's called, it lives in, it eats, it is, and one idea to help: we can.",
                    ],
                },
            ],
        },
        {
            "fact": [
                "Did you know? Football is the number one sport in Spain and Argentina,",
                "but basketball, handball and padel are hugely popular too.",
                "In Argentina the national sport is officially", "‹el pato›,", "a game played on horseback with a ball with handles!",
            ],
            "units": [
                {
                    "hook": ["What do you love doing? Let's talk about the things you enjoy."],
                    "grammar": {
                        "explain": ["To say what you like doing, use «me gusta» with a verb."],
                        "rows": ["«Me encanta bailar.»", "«Me gusta leer.»", "«No me gusta cantar.»", "«Odio cocinar.»"],
                        "after": ["Join your ideas with «y», «pero» and «también»: and, but, and also."],
                    },
                },
                {
                    "hook": ["Your first regular verbs! With one pattern, you can talk about hundreds of activities."],
                    "grammar": {
                        "explain": ["Take off the A R, and add the ending."],
                        "rows": ["«yo bailo, nosotros bailamos»", "«tú bailas»‹vos bailás›«vosotros bailáis»", "«ella baila, ellos bailan»"],
                    },
                },
                {
                    "hook": ["Sunny, rainy or snowy? Let's talk about the weather, and what you do in it."],
                    "tip": [
                        "Use «cuando», when, to build longer sentences.",
                        "«Cuando llueve, escucho música.»",
                        "You've just joined two ideas like a pro!",
                    ],
                },
                {
                    "hook": ["Football, swimming, dance: let's talk about the sports you play and do."],
                    "grammar": {
                        "explain": [
                            "Use «jugar a» for games with a ball or rules.", "«Juego al fútbol.»",
                            "Use «hacer» for other sports and activities.", "«Hago natación.»",
                        ],
                        "rows": ["«juego, juegas, juega»", "«hago, haces, hace»"],
                    },
                },
                {
                    "hook": ["Phones, apps and technology: the Spanish you use every day online."],
                    "fact": [
                        "In many schools in Spain, phones aren't allowed during the school day.",
                        "Lots of teens say they chat more with their friends at break time because of it!",
                    ],
                },
                {
                    "hook": ["Project time! Ask ten classmates about their free time, and present the results in Spanish."],
                },
            ],
        },
        {
            "fact": [
                "Did you know? In Spain, secondary school is called", "«el instituto»,", "or", "«el insti»", "for short,",
                "and most students don't wear a uniform. In Argentina it's", "‹el colegio›", "or", "‹la secundaria›,",
                "and many schools use a white coat called", "‹un guardapolvo›.",
            ],
            "units": [
                {
                    "hook": ["Maths, art, science: let's name the subjects you study at school."],
                    "tip": [
                        "To say what we do, use the A M O S ending.",
                        "«Estudiamos ciencias los lunes.»",
                        "On Mondays we study science.",
                    ],
                },
                {
                    "hook": ["Love it or hate it? Give your opinion about school subjects, and say why."],
                    "grammar": {
                        "explain": ["Use «gusta» with one thing, and «gustan» with more than one. And always keep the article."],
                        "rows": ["«Me gusta el inglés. Me gustan las ciencias.»"],
                    },
                },
                {
                    "hook": ["Libraries, labs and sports halls: let's describe your school."],
                    "grammar": {
                        "explain": ["Here's how to say a, and some. They change to match the noun."],
                        "rows": ["«un gimnasio, unos laboratorios»", "«una biblioteca, unas aulas»"],
                    },
                },
                {
                    "hook": ["Break time! What do you eat, drink and do between lessons?"],
                    "grammar": {
                        "explain": ["Verbs ending in E R and I R follow a pattern too. Look how similar they are."],
                        "rows": [None, "«como, escribo»", "«comes, escribes»", "«come, escribe»", "«comemos, escribimos»", "«comen, escriben»"],
                    },
                },
                {
                    "hook": ["Project time! Every child in the world has the right to go to school. Let's find out about a school in a Spanish-speaking country."],
                    "fact": [
                        "In some rural schools in Argentina, Bolivia and Peru, students of all ages share one classroom and one teacher.",
                        "Older students often help the younger ones learn to read.",
                    ],
                },
            ],
        },
        {
            "fact": [
                "Did you know? In Spanish-speaking countries, most people have two surnames, one from each parent.",
                "And grandparents play a huge part in family life. Sunday lunch at", "«la casa de los abuelos»",
                "is a tradition for many families.",
            ],
            "units": [
                {
                    "hook": ["Every family is different, and every family is a family. Let's meet yours."],
                    "grammar": {
                        "explain": ["To say my, your, or his and her, use these little words. They add an S in the plural."],
                        "rows": ["«mi hermano, mis hermanos»", "«tu madre, tus padres»", "«su tía, sus tías»"],
                    },
                },
                {
                    "hook": ["Blue eyes, curly hair: let's describe what people look like."],
                    "grammar": {
                        "explain": ["Use «ser» for what someone is like, and «tener» for the features they have."],
                        "rows": ["«Es alta y simpática.»", "«Tiene el pelo rizado.»"],
                    },
                },
                {
                    "hook": ["Now let's put it all together, and describe the people around you."],
                    "tip": [
                        "When you describe people, choose words that are kind and useful: hair, eyes, clothes, personality.",
                        "Comments about someone's body or weight are best left out, in any language.",
                    ],
                },
                {
                    "hook": ["Flat or house, village or city? Let's describe the place you call home."],
                    "grammar": {
                        "explain": ["To say where something is, use «estar»."],
                        "rows": ["«estoy, estamos»", "«estás, estáis»", "«está, están»"],
                        "after": ["«Mi casa está en un pueblo.»"],
                    },
                },
                {
                    "hook": ["Project time! Choose a portrait by a Spanish-speaking artist, like Frida Kahlo from Mexico, and describe the people in it."],
                    "fact": [
                        "Frida Kahlo lived with lots of animals in her Blue House in Mexico City:",
                        "dogs, monkeys, parrots and even a deer. Many of them appear in her self-portraits.",
                    ],
                },
            ],
        },
        {
            "fact": [
                "Did you know? Almost every town in Spain has a main square,", "«la plaza mayor»,",
                "where people meet, chat and play. In Argentina, the central square is usually", "‹la plaza principal›,",
                "often named after a hero of independence.",
            ],
            "units": [
                {
                    "hook": ["Parks, shops and cinemas: let's explore your town."],
                    "grammar": {
                        "explain": ["Use «hay» to say there is, or there are."],
                        "rows": ["«Hay un parque.»", "«Hay unos museos.»", "«Hay muchas tiendas.»", "«No hay playa.»"],
                    },
                },
                {
                    "hook": ["What time is it, and where are you going? Let's tell the time, and use the verb «ir»."],
                    "grammar": {
                        "explain": ["«Ir», to go, is irregular, so learn it by heart."],
                        "rows": ["«voy, vamos»", "«vas, vais»", "«va, van»"],
                        "after": ["And remember: «a» plus «el» makes «al».", "«Voy al parque, pero voy a la playa.»"],
                    },
                },
                {
                    "hook": ["Time for a snack! Let's order at a café, just like you would in Madrid or Buenos Aires."],
                    "grammar": {
                        "explain": ["To order, use «querer», to want."],
                        "rows": ["«quiero, queremos»", "«quieres, queréis»", "«quiere, quieren»"],
                    },
                },
                {
                    "hook": ["Big plans for the weekend? Let's talk about the future, the easy way."],
                    "grammar": {
                        "explain": ["«Ir», plus «a», plus a verb, tells people your plans."],
                        "rows": ["«Voy a nadar.»", "«Vamos a bailar.»", "«¿Qué vas a hacer?»"],
                    },
                },
                {
                    "hook": ["Project time! Create a brochure about a festival from the Spanish-speaking world: where, when, and what people do."],
                    "fact": [
                        "During the Day of the Dead, families in Mexico build altars called", "«ofrendas»,",
                        "with photos, flowers called", "«cempasúchil»,", "and their loved ones' favourite food.",
                        "It's a colourful celebration of memory and love.",
                    ],
                },
            ],
        },
        {
            "fact": [
                "Did you know? Spanish has two verbs for to be:", "«ser» y «estar».",
                "Here's a trick: «ser» is for what something is, «estar» is for how and where it is.",
            ],
            "units": [
                {
                    "hook": ["Welcome to your grammar toolbox. Here are the three regular verb families, all in one place."],
                    "grammar": {
                        "explain": ["Every regular verb follows one of three patterns: A R, E R, or I R."],
                        "rows": [None, "«hablo, como, vivo»", "«hablas, comes, vives»", "‹hablás, comés, vivís›",
                                 "«habla, come, vive»", "«hablamos, comemos, vivimos»", "«habláis, coméis, vivís»",
                                 "«hablan, comen, viven»"],
                    },
                    "tip": [
                        "In Spain, «vosotros» means you, plural, with friends, and «ustedes» is formal.",
                        "In Argentina and Latin America,", "‹ustedes›", "is used for everyone.",
                    ],
                },
                {
                    "hook": ["The five verbs you'll use the most. They break the rules, so let's learn them together."],
                    "grammar": {
                        "explain": ["«Ser», «estar», «tener», «ir» and «hacer». You'll use them every single day."],
                        "rows": [None, "«soy, estoy, tengo, voy, hago»", "«eres, estás, tienes, vas, haces»",
                                 "«es, está, tiene, va, hace»", "«somos, estamos, tenemos, vamos, hacemos»",
                                 "«sois, estáis, tenéis, vais, hacéis»", "«son, están, tienen, van, hacen»"],
                    },
                },
                {
                    "hook": ["The, a, and some: small words that make a big difference."],
                    "grammar": {
                        "explain": ["Every noun in Spanish is masculine or feminine, and the words around it agree."],
                        "rows": [None, "«el libro, la casa»", "«los libros, las casas»", "«un, unos, una, unas»",
                                 "«un gato negro, una gata negra»", "«unos gatos negros, unas gatas negras»"],
                    },
                },
                {
                    "hook": ["Who, what, where, when? Let's master the question words."],
                    "tip": [
                        "Spanish questions and exclamations open with an upside-down sign.",
                        "«¿Cómo estás? ¡Qué bien!»",
                        "And question words always carry an accent.",
                    ],
                },
                {
                    "hook": ["Level up your Spanish with connectives and opinions."],
                    "tip": [
                        "To make your writing shine, use one connective, one opinion and one reason in every paragraph.",
                        "«En mi opinión, el dibujo es genial porque es creativo.»",
                    ],
                },
            ],
        },
    ],
}
