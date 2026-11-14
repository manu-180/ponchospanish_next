"""Curso en video "Spanish for Travel", armado sobre el e-book del mismo nombre.

Texto suelto = narradora (inglés británico); «…» = voz de España; ‹…› = voz de Argentina.
Las palabras, tablas, diálogos y ejercicios salen del libro; acá va sólo lo que se dice.
El libro guarda el capítulo con title en inglés y en en español: swap_chapter_names los da vuelta.
"""

BOOK = "spanish_for_travel"

COURSE = {
    "title": "Spanish for Travel",
    "slug": "Spanish-for-Travel",
    "level": "For travellers of every age",
    "cover_photo": "spanish-for-travel-cover.jpg",
    # Bajada de la portada (la de la laptop); sin esto se usa "level".
    "cover_tagline": "A Self-Paced Spanish Programme for Travellers of Every Age",
    "swap_chapter_names": True,
    "modules_line": "There are fourteen modules, one for every part of the trip.",
    "modules_sub": "Fourteen modules",
    "outline_welcome": "How the course works: fourteen modules, voices from Spain and Argentina, and your first ¡Tu turno!",
    "photo_pos": {},
    "say_as": {
    },
    "say_ctx": {
        ("es", "y"): "En español, los conectores unen dos ideas.",
        ("ar", "¡Felicitaciones!"): "Terminaste todo el curso de español.",
    },
    "welcome": [
        "¡Hola! Welcome to Spanish for Travel.",
        "This course goes with you on the whole trip, from the airport to the beach, from the market to a party with new friends.",
        "There are fourteen modules.",
        "Every lesson is short. You'll hear Spanish voices, from Spain, «¡Hola! ¿Qué tal?»",
        "and from Argentina. ‹¡Hola! ¿Cómo andás?›",
        "Both are correct, and you'll learn to understand both.",
        "When you see «¡Tu turno!», it's your turn: say the answer out loud before you hear it.",
        "Keep your e-book next to you. It has every word, extra activities and all the answers.",
        "You don't need to be perfect to be understood. Speak up and smile.",
    ],
    "chapters": [
        {  # 1 The Basics
            "fact": [
                "Did you know? In Spain, friends greet each other with two kisses on the cheeks, starting on the right.",
                "In Argentina it's usually just one.",
            ],
            "units": [
                {"hook": ["Every conversation starts with a greeting. Let's learn how to say hello, at any time of day."]},
                {
                    "hook": ["Please, thank you and sorry: the small words that open every door."],
                    "tip": [
                        "When you walk past people eating, it's polite to say", "«¡Buen provecho!»",
                        "or, in Spain,", "«¡Que aproveche!»", "Enjoy your meal.",
                    ],
                },
                {"hook": ["Here are the phrases that will save you on day one, like I don't understand, or where's the toilet?"]},
                {"hook": ["Let's break the ice. Here's how to start a conversation with someone new."]},
                {"hook": ["Big, small, cheap, beautiful. Let's learn the adjectives you'll use all through the trip."]},
                {
                    "hook": ["With just a few verbs, you can ask for almost anything."],
                    "grammar": {
                        "explain": ["Three verbs open almost every request. Add any verb after them."],
                        "rows": ["«Quiero ir a la playa.»", "«¿Puedo pagar con tarjeta?»", "«Necesito comprar agua.»"],
                        "after": ["I want, can I, and I need."],
                    },
                },
                {
                    "hook": ["The street, the key, the money: the everyday nouns every traveller needs."],
                    "fact": [
                        "Some words break the rule.", "«el día»", "and", "«el mapa»",
                        "end in A, but they're masculine.", "And", "«la mano»", "is feminine. Surprise!",
                    ],
                },
            ],
        },
        {  # 2 Eating
            "fact": [
                "Did you know? Meals are late in Spain and Argentina, and after eating, people stay at the table chatting for ages.",
                "That time has its own word:", "«la sobremesa».",
            ],
            "units": [
                {"hook": ["Table for two? Let's order at a restaurant, from the menu to the bill."]},
                {"hook": ["Into the kitchen! Here are the words for cooking together."]},
                {
                    "hook": ["Breakfast, lunch, a snack and dinner: let's talk about the meals of the day."],
                    "fact": [
                        "In Argentina, the afternoon snack is a special moment:", "‹la merienda›,",
                        "with", "‹mate›", "and", "‹medialunas›,", "small sweet croissants.",
                    ],
                },
                {
                    "hook": ["Water, juice or hot chocolate? Let's learn the drinks."],
                    "tip": [
                        "In Argentina and Uruguay, friends share", "‹el mate›,",
                        "a herbal drink sipped through a metal straw.",
                        "If someone offers you one, it's a sign of friendship.",
                    ],
                },
                {"hook": ["Bread, rice, cheese and more: the food you'll find on every table."]},
                {"hook": ["For those who eat them, here are the words for meat and fish."]},
                {"hook": ["Let's fill the basket with fresh vegetables."]},
                {
                    "hook": ["Sweet and juicy: let's learn the fruits."],
                    "fact": [
                        "Fruit names change a lot. A strawberry is", "«una fresa»", "in Madrid, and", "‹una frutilla›",
                        "in Buenos Aires.",
                    ],
                },
                {
                    "hook": ["Salt, pepper and a little spice. Let's learn the condiments."],
                    "tip": ["Before you dig in, ask", "«¿Pica?»", "Is it spicy?"],
                },
            ],
        },
        {  # 3 Accommodation
            "fact": [
                "Did you know? In Spain, the ground floor is", "«la planta baja»,",
                "just like in the UK. In Argentina, people say", "‹el primer piso›", "for the first floor up.",
            ],
            "units": [
                {"hook": ["You've arrived! Let's check in at the hotel."]},
                {"hook": ["Shared rooms and new friends: welcome to the hostel."]},
                {
                    "hook": ["Staying with a family? Here's the language of daily life at home."],
                    "tip": [
                        "Offering to help is always appreciated.", "«¿Te ayudo a poner la mesa?»",
                        "Shall I help you lay the table?",
                    ],
                },
                {"hook": ["A towel, the wifi password, another pillow. Let's learn how to ask for things, politely."]},
                {
                    "hook": ["Tents, sleeping bags and starry skies. Let's go camping."],
                    "fact": [
                        "In Patagonia, many campsites ask visitors to", "‹no dejar rastro›:",
                        "leave no trace. Take your rubbish with you, and never feed wild animals.",
                    ],
                },
            ],
        },
        {  # 4 Transportation
            "fact": [
                "Did you know? In Buenos Aires, the bus is", "‹el colectivo›,",
                "and you pay with a rechargeable card called", "‹la SUBE›.",
            ],
            "units": [
                {"hook": ["Bus, train or underground? Let's get around the city."]},
                {"hook": ["Lost? No problem. Let's ask for directions, and understand the answer."]},
                {
                    "hook": ["North, south, east and west: the cardinal points."],
                    "fact": [
                        "In the southern hemisphere, the midday sun is in the north.",
                        "So in Argentina, the sunniest balcony faces north.",
                    ],
                },
                {"hook": ["Seatbelts on! Here are the words for travelling by car."]},
                {"hook": ["Passport ready? Let's go through the airport, from check-in to the gate."]},
            ],
        },
        {  # 5 Shopping
            "fact": [
                "Did you know? In the north of Argentina, Bolivia and Peru, many textiles are woven by hand.",
                "Buying from the artisan means your money stays with the person who made it.",
            ],
            "units": [
                {"hook": ["Cash or card? Let's learn how to pay."]},
                {"hook": ["How much is it? Let's go shopping, and maybe ask for a discount."]},
                {"hook": ["A kilo of tomatoes, half a dozen eggs. Let's buy food at the market."]},
                {"hook": ["Trying on clothes, asking for a size: let's go round the shops."]},
                {
                    "hook": ["Red, blue, green and more. Let's learn the colours."],
                    "tip": [
                        "Add light or dark after the colour:", "«verde claro, azul oscuro».",
                        "And", "‹celeste›", "is the light blue of the Argentinian flag.",
                    ],
                },
                {"hook": ["Ceramics, textiles and jewellery: let's talk about arts and crafts."]},
                {
                    "hook": ["Banks, cash machines and changing money. Let's sort out the money."],
                    "fact": [
                        "Careful with", "«billete».", "In Spain it means a ticket and a banknote.",
                        "In Argentina, the ticket is", "‹el boleto›.",
                    ],
                },
                {
                    "hook": ["Prices, rooms and phone numbers: you'll need numbers everywhere."],
                    "grammar": {
                        "explain": [
                            "From thirty-one to ninety-nine, join the tens and units with «y».",
                            "«treinta y cinco, sesenta y ocho»",
                            "And prices sound like this:", "«doce euros con cincuenta».",
                        ],
                    },
                },
            ],
        },
        {  # 6 Hobbies and Fun
            "fact": [
                "Did you know? Padel, a mix of tennis and squash, is hugely popular in Spain and Argentina.",
                "It was invented in Mexico in nineteen sixty-nine.",
            ],
            "units": [
                {"hook": ["Football, swimming, tennis or padel? Let's talk about sports."]},
                {
                    "hook": ["Hiking, cycling and kayaking. Let's head outdoors."],
                    "tip": [
                        "On a guided walk you'll hear", "«¡Cuidado!»", "careful, and", "«¡Vamos!»", "let's go.",
                        "If you need a break, say", "«Necesito descansar un momento».",
                    ],
                },
            ],
        },
        {  # 7 Tourism
            "fact": [
                "Did you know? Spanish is the official language of twenty countries,",
                "and it's the second most spoken first language in the world.",
            ],
            "units": [
                {
                    "hook": ["Mountains, rivers and waterfalls. Let's explore nature."],
                    "fact": [
                        "The Iguazú Falls have about two hundred and seventy-five waterfalls.",
                        "The biggest is called", "‹la Garganta del Diablo›,", "the Devil's Throat.",
                    ],
                },
                {"hook": ["Sun cream on! Let's go to the beach."]},
                {
                    "hook": ["From llamas to whales: let's meet the animals."],
                    "tip": [
                        "Before booking an activity with animals, ask", "«¿Es un santuario o un zoo?»",
                        "The best experiences let animals live freely.",
                    ],
                },
                {"hook": ["Where are you from? Let's learn the countries."]},
            ],
        },
        {  # 8 Socializing
            "fact": [
                "Did you know? At a birthday in Spain or Argentina, friends pull the birthday person's ears, once for each year.",
                "It's called", "«tirar de las orejas».",
            ],
            "units": [
                {"hook": ["New friends are the best part of any trip. Let's meet new people."]},
                {"hook": ["The cinema, a concert or an ice cream in the square. Let's go out."]},
                {"hook": ["Music, cake and dancing. Let's celebrate!"]},
                {
                    "hook": ["Happy, tired, excited? Let's talk about feelings and opinions."],
                    "grammar": {
                        "explain": [
                            "Both «ser» and «estar» mean to be.",
                            "Use «ser» for who someone is.", "«Soy simpático.»",
                            "Use «estar» for how someone feels right now.", "«Estoy cansado.»",
                        ],
                    },
                },
            ],
        },
        {  # 9 Conversation Aids
            "fact": [
                "Did you know? Spanish speakers fill pauses with", "«pues, bueno, a ver»", "and in Argentina,", "‹este›.",
                "Using them sounds much more natural than a long silence.",
            ],
            "units": [
                {"hook": ["And, but, because: connectors turn short phrases into real conversations."]},
                {"hook": ["He said, she told me. Let's learn how to report what someone said."]},
                {
                    "hook": ["Everybody makes mistakes. Here are the most common ones, so you can avoid them."],
                    "tip": ["Words that look like English but mean something else are called", "«falsos amigos»,",
                            "false friends. When a word looks too easy, double-check it!"],
                },
                {
                    "hook": ["I agree, I'm not sure, I disagree. Let's share our opinions."],
                    "tip": ["Disagreeing kindly is an art. Start with", "«Entiendo lo que dices, pero…»",
                            "and the conversation stays friendly."],
                },
                {"hook": ["Time to go! Here's how to end a conversation nicely."]},
            ],
        },
        {  # 10 Romance
            "fact": [
                "Did you know? People often call the person they love", "«mi media naranja»,",
                "my other half of the orange.",
            ],
            "units": [
                {
                    "hook": ["Friends, crushes and partners. Let's talk about love, with respect."],
                    "tip": [
                        "«Te quiero»", "is for family, friends and partners.",
                        "«Te amo»", "is deeper and more romantic.",
                    ],
                },
            ],
        },
        {  # 11 People
            "fact": [
                "Did you know? Most people in Spanish-speaking countries have two surnames,",
                "the first from one parent and the second from the other.",
            ],
            "units": [
                {"hook": ["Friendly, funny, patient? Let's describe personality."]},
                {"hook": ["Head, shoulders, knees and toes. Let's learn the body."]},
                {
                    "hook": ["Tall or short hair, glasses or a beard? Let's describe what people look like."],
                    "tip": ["When describing people, focus on what helps: hair, clothes, glasses.",
                            "Comments about someone's body are best left out, in any language."],
                },
                {"hook": ["T-shirts, jumpers and trainers. Let's talk about clothes."]},
                {"hook": ["A trim, please! Let's visit the hairdresser."]},
                {
                    "hook": ["Parents, brothers, sisters and cousins. Let's talk about family."],
                    "fact": [
                        "In Spanish,", "«los hermanos»", "can mean brothers, or brothers and sisters.",
                        "Many people also say", "«hermanas y hermanos»", "to include everyone.",
                    ],
                },
                {
                    "hook": ["Doctor, teacher or chef? Let's talk about jobs."],
                    "grammar": {
                        "explain": [
                            "To say what you do, use «ser», without «un» or «una».",
                            "«Soy enfermero.»", "«Mi madre es ingeniera.»",
                        ],
                    },
                },
            ],
        },
        {  # 12 Time and Weather
            "fact": [
                "Did you know? When it's summer in the UK, it's winter in Argentina.",
                "And Christmas in Buenos Aires is often hot enough for the beach!",
            ],
            "units": [
                {
                    "hook": ["Monday to Sunday: let's learn the days of the week."],
                    "tip": ["In Spanish, days and months don't take a capital letter.", "«el lunes, en marzo»"],
                },
                {"hook": ["January to December: let's learn the months."]},
                {"hook": ["Spring, summer, autumn and winter. Let's learn the seasons."]},
                {"hook": ["Five minutes, two hours, a whole week. Let's talk about how long things take."]},
                {"hook": ["What time is it? Let's learn to tell the time."]},
                {
                    "hook": ["Tomorrow we're going to the beach! Let's talk about plans."],
                    "grammar": {
                        "explain": ["The easiest way to talk about plans: «ir», plus «a», plus a verb."],
                        "rows": ["«voy a, vamos a»", "«vas a»‹vos vas a›«vais a»", "«va a, van a»"],
                        "after": ["«Vamos a nadar.»", "We're going to swim."],
                    },
                },
                {"hook": ["Now, later, always, never. Let's learn the time expressions."]},
                {"hook": ["Sunny, rainy or windy? Let's talk about the weather."]},
            ],
        },
        {  # 13 Telecommunications
            "fact": [
                "Did you know? In Spain people answer the phone with", "«¿Dígame?»,",
                "in Argentina with", "‹¿Hola?›,", "and in Mexico with", "«¿Bueno?»",
            ],
            "units": [
                {"hook": ["Ring, ring! Let's make a phone call."]},
                {"hook": ["Wifi, passwords and messages. Let's go online."]},
                {
                    "hook": ["Phones, chargers and headphones. Let's learn the electronic devices."],
                    "tip": ["A phrase every traveller needs:", "«Me quedé sin batería»,", "my battery died."],
                },
            ],
        },
        {  # 14 Emergencies
            "fact": [
                "Did you know? The emergency number in Spain and the rest of the European Union is one, one, two.",
                "In Argentina, nine, one, one works in most cities. Save them in your phone before you travel.",
            ],
            "units": [
                {"hook": ["Lost your bag, or missed the bus? Let's learn the words for problems, calmly."]},
                {"hook": ["Feeling unwell? Let's go to the doctor."]},
                {"hook": ["We hope you never need them, but here are the words for road accidents."]},
                {"hook": ["Exit, danger, closed. Let's read the important signs."]},
            ],
        },
    ],
}
