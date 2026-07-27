/* =============================================================
   Eagle Ray Expeditions — translations (EN / ES / FR).
   Every visible string on the page lives here. main.js applies
   the active language by walking [data-i18n] / [data-i18n-*].
   ============================================================= */
(function () {
  "use strict";

  window.__I18N__ = {

  en: {
    meta: {
      title: "Eagle Ray Expeditions — Private sailing expeditions · La Paz, Baja California Sur",
      description: "Private catamaran expeditions across the Sea of Cortez — small groups, adaptive routes built around wind and tide, diving, and wildlife. Sailing out of La Paz, Baja California Sur.",
      ogTitle: "Eagle Ray Expeditions — The aquarium of the world, in private",
      ogDescription: "Sailing, diving and wildlife encounters in the Sea of Cortez. Private expeditions for small groups out of La Paz, BCS.",
      ogLocale: "en_US"
    },
    nav: { difference: "Difference", wildlife: "Wildlife", routes: "Routes", boats: "Boats", crew: "Crew", faq: "FAQ", customize: "Go Sailing Now!" },
    navm: { difference: "Difference", wildlife: "Where we sail", routes: "Three routes", day: "A day aboard", boats: "The boats", crew: "The crew", faq: "FAQ", customize: "Customize your expedition" },
    hero: {
      title: "We run sailing expeditions where<br>the ocean does most of the planning.",
      sub: "Private catamaran routes across the Sea of Cortez, built for exploration and redrawn by weather, tide, and whoever's on board for the week.",
      ctaPrimary: "Customize your first Baja expedition",
      ctaSecondary: "See what makes us different",
      factDeparture: "Departure", factDepartureV: "Marina de La Paz",
      factGroup: "Group", factGroupV: "2 to 10 guests",
      factDuration: "Duration", factDurationV: "3 to 8 days",
      factItinerary: "Itinerary", factItineraryV: "Open"
    },
    difference: {
      kicker: "What we do",
      title: "We don't sell charter trips.<br><em>We design ocean experiences.</em>",
      lede: "Eagle Ray Expeditions designs and leads small-group ocean expeditions combining sailing, diving, and wildlife encounters in Baja California Sur. Built for people who want more than a boat.",
      vsThemTitle: "Charter trips",
      vsThem: ["Boat-first, comfort-driven.", "Neutral crew, hired by the week.", "Fixed routes, printed before you meet them.", "The water is scenery — watched from the cockpit.", "You write to an office and a form answers back."],
      vsUsTitle: "Eagle Ray Expeditions",
      vsUs: ["Experience-first, exploration-driven.", "The same crew, who know the channel by memory.", "Adaptive routes, redrawn by weather and tide.", "The water is the plan — dive, snorkel, kayak, every day.", "You write to the founder, and the founder answers."],
      quoteKicker: "They sell trips.<br>We design human expeditions.",
      quote: "I didn't want to sell boats. I wanted to build the kind of trip I'd actually want to be on — with people who know the ocean, not just how to hand you a set of keys.",
      quoteCite: "— Thibault Poirson De Cardon, Founder"
    },
    wildlife: {
      kicker: "Where we sail",
      title: "The aquarium<br><em>of the world.</em>",
      lede: "Cousteau's name for the Sea of Cortez. A narrow gulf that concentrates what other oceans spread across thousands of miles — cold upwellings, deserted islands, and a density of life that still surprises people who've sailed it for years. We work the stretch between La Paz, Espíritu Santo, and Cerralvo.",
      note: "Espíritu Santo is a protected national park and part of the UNESCO World Heritage Site \"Islands and Protected Areas of the Gulf of California.\" We anchor only at authorized buoys, and sightings follow the distances and timing set by regulation. Wildlife isn't guaranteed — it's wildlife."
    },
    fauna: {
      "whale-shark": { name: "Whale sharks", season: "Oct — Apr", place: "Bahía de La Paz", note: "Juveniles feeding right in the bay. You snorkel alongside them, no scuba gear needed." },
      "mobula": { name: "Mobula rays", season: "May — Jul", place: "Cerralvo Channel", note: "Schools of hundreds leaping clear of the water. You hear them before you see them." },
      "sea-lions": { name: "Sea lions — Los Islotes", season: "Year-round", place: "Los Islotes colony", note: "A permanent colony. The juveniles dive with you, not the other way around." },
      "dolphins": { name: "Dolphins", season: "Year-round", place: "underway", note: "They show up at the bow while under sail. We don't look for them — they find us." },
      "manta": { name: "Manta rays", season: "May — Sep", place: "reefs & sandy bottoms", note: "Over reef pinnacles and sandy bottoms, usually during the morning dive." },
      "humpback": { name: "Humpback whales", season: "Jan — Mar", place: "migration, seasonal", note: "Seasonal migration, observed from the boat at the distance regulation requires." }
    },
    routes: {
      kicker: "Three real routes",
      title: "Starting points,<br><em>not itineraries.</em>",
      lede: "Not packages — the three directions we tend to sail out of La Paz, with a rough four-day itinerary. All of it reshuffles if the north wind picks up, or if someone wants one more day in a cove.",
      note: "These routes are a starting point — every expedition adapts to weather, sea conditions, and what your group wants.",
      espirituSanto: {
        name: "Espíritu Santo Focus",
        claim: "Wildlife-first: sea lions, mangroves, and the white-sand coves that make this the route most people underestimate.",
        meta: ["4 days", "Any level", "No long crossings"],
        days: [
          { t: "Sail to Espíritu Santo", d: "Late-morning departure with the thermal breeze, a few hours of sailing to the first anchorage, and a reconnaissance snorkel before lunch." },
          { t: "Snorkel with sea lions", d: "Two sessions with the Los Islotes colony. Juveniles come within inches of your mask and stay for the whole dive." },
          { t: "Kayak through mangroves &amp; wild beaches", d: "Mangrove channels by kayak in the morning, an empty-beach landing in the afternoon, dinner on deck with the island behind you." },
          { t: "Return to La Paz", d: "Downwind sail back, one last swim stop at Playa Bonanza, marina arrival mid-afternoon." }
        ],
        quote: "\"Los Islotes never gets old — swimming with the sea lion colony is the moment every guest remembers first.\"",
        cite: "— Adly, Expedition Leader"
      },
      laVentana: {
        name: "La Ventana Focus",
        claim: "Wind-first: kite and wingfoil sessions built around the thermal that gives La Ventana its name.",
        meta: ["4 days", "Kite / wingfoil level", "Seasonal wind window"],
        days: [
          { t: "Sail to La Ventana", d: "Morning sail down the channel, gear rigged on deck before the afternoon thermal fills in." },
          { t: "Kite or wingfoil session", d: "A full day on the water — the crew includes a kite and wingfoil instructor, so beginners and experienced riders both have a plan." },
          { t: "Sunset &amp; dinner at anchor", d: "Wind eases by late afternoon; the boat swings to a quiet anchorage for a slow dinner on deck." },
          { t: "Return to La Paz", d: "Early departure to beat the building breeze, back in the marina before midday." }
        ],
        quote: "\"When the wind picks up in La Ventana, everything else stops mattering.\"",
        cite: "— Adly, Expedition Leader"
      },
      balandra: {
        name: "Balandra Focus",
        claim: "Reef and paddle-first: shallow turquoise water, easy snorkeling, and a slower pace than the other two routes.",
        meta: ["4 days", "Any level", "Calm, protected water"],
        days: [
          { t: "Sail to Balandra", d: "A short sail to one of the most photographed bays on the gulf, usually empty by early evening." },
          { t: "Reef snorkeling", d: "Shallow reef, warm water, and a pace built for kids, grandparents, and everyone in between." },
          { t: "Paddleboard &amp; exploration", d: "Paddleboards out at sunrise, a walk to a lookout point, and an afternoon with no plan at all." },
          { t: "Return to La Paz", d: "Easy sail back with the afternoon breeze, marina arrival by early evening." }
        ],
        quote: "\"Balandra's water color still surprises me, and I've sailed the Sea of Cortez for years.\"",
        cite: "— Denise, Captain"
      }
    },
    showcase: {
      title: "A day in<br><em>Eagle Ray.</em>",
      cards: [
        { t: "Sail", d: "Sail towards our objective of the day, coffee in hand while the anchor comes up." },
        { t: "Activity", d: "Diving, kiting, swimming — whatever the crew is drawn to that morning." },
        { t: "Lunch", d: "The catch of the day, cooked and shared in the cockpit shade." },
        { t: "Explore", d: "Shorelines, cliffs, water, unknown spots worth a slow paddle." },
        { t: "Sunset", d: "A pause to take it in — swim, surf, or just drift." },
        { t: "Dinner", d: "Back onboard. Stories, salt, and a reset before the next day." }
      ]
    },
    activities: {
      kicker: "What you might do",
      title: "Not an itinerary.<br><em>A world full of options.</em>",
      lede: "Tell us what appeals to you before you arrive — the rest gets decided onboard, day by day, by what the sea allows.",
      note: "Espíritu Santo is a protected national park (UNESCO Biosphere Reserve). Eagle Ray operates in full respect of regulated zones.",
      list: ["Scuba diving", "Freediving", "Spearfishing", "Kitesurfing", "Wingfoil", "Snorkeling", "Cliff jumping", "Sea plunges", "Night swimming", "Sunrise swims", "Island hopping", "Cave exploring", "Whale spotting", "Wildlife encounters", "Foraging", "Fire cooking", "Surfing", "Yoga", "Stretching sessions", "Breathwork", "Card games", "Music sessions", "Stargazing"],
      markedOf: "{n} of {total} marked",
      interestedIn: "Interested in:"
    },
    boats: {
      kicker: "Your expedition",
      title: "Two boats. One standard:<br><em>fully private, fully yours.</em>",
      customizeBtn: "Customize my expedition",
      bali: { name: "Bali 4.4", tagline: "Your home on water", desc: "4 double cabins, 4 private bathrooms, spacious indoor/outdoor living, 2024 model. Ideal for families and groups who want maximum space to spread out.",
        length: "13.90 m", cabins: "4 double", bathrooms: "4 private", guests: "up to 10" },
      astrea: { name: "Fountaine Pajot Astrea 42", tagline: "Elegance at sea", desc: "4 double cabins with private bathrooms, spacious cockpit and sun deck, refined finishes, smooth sailing performance. Ideal for a more design-forward feel.",
        length: "12.80 m", cabins: "4 double", bathrooms: "4 private", guests: "up to 8" },
      specLength: "Length", specCabins: "Cabins", specBathrooms: "Bathrooms", specGuests: "Guests",
      includedHeading: "Always included",
      included: ["Private catamaran, prepared for life aboard", "Professional skipper", "Dinghy with motor", "Snorkeling gear onboard", "Permits / access bracelets for protected areas", "Boat prep &amp; cleaning", "ERE coordination before and during your trip", "Flexible itinerary, adapted to weather and your group"],
      notIncludedHeading: "À la carte / not included",
      notIncluded: ["Food &amp; drinks", "Skipper tip", "WiFi / Starlink", "Extra gear (kayak, paddle, fishing)", "Fuel consumed during the trip", "Diving, kite &amp; wingfoil, guided activities", "Personal travel insurance"]
    },
    crew: {
      kicker: "Who you sail with",
      title: "Far more than service staff —<br><em>they sail, dive, and move with you.</em>",
      founderLabel: "Founder",
      founderBody: "Ocean entrepreneur with 10+ years in Mexico, building the Baja network of captains, chefs, and expedition leaders from the ground up. He's the one who answers your WhatsApp — before, during, and after your trip.",
      founderSign: "Direct line, no call center · +52 55 6809 0942",
      pilotKicker: "The Baja pilot crew",
      members: {
        denise: { role: "Captain", line: "Years spent navigating the Sea of Cortez and some of the world's most demanding private yachts.", body: "Years spent navigating the Sea of Cortez and some of the world's most demanding private yachts. Safety, navigation, and making sure everyone fully enjoys the experience. Speaks Spanish, English, Portuguese." },
        benjamin: { role: "Skipper", line: "An engineer by training with years exploring the Gulf of California.", body: "An engineer by training with years exploring the Gulf of California. Methodical navigation with a real passion for adventure — every expedition stays safe, smooth, and adapted to the sea." },
        adly: { role: "Expedition Leader", line: "Between the wind of La Ventana and the waters of the Sea of Cortez, the ocean is home.", body: "Between the wind of La Ventana and the waters of the Sea of Cortez, the ocean is home. Diving and kite instructor sharing a real passion for Baja's authentic exploration. Speaks Spanish, English, Arabic." },
        antoine: { role: "Gold Chef", line: "A background in luxury hospitality, restaurants, and entrepreneurship.", body: "A background in luxury hospitality, restaurants, and entrepreneurship. Turns every meal into a shared moment, inspired by local products and the spirit of the journey." },
        ana: { role: "Silver Chef", line: "Entrepreneur and founder of her own pastry business.", body: "Entrepreneur and founder of her own pastry business. Generous, convivial cooking that brings guests together — plus signature cocktails and a real passion for fishing and seafood." }
      },
      dreamCoupleKicker: "The ERE Dream Couple · Q4 2026",
      joiningTag: "Joining Q4 2026",
      javier: { role: "Captain &amp; Filmmaker", line: "Yacht Master 200GT, PADI Dive Instructor, IKO Kitesurf Instructor, freediving &amp; spearfishing guide, drone pilot.", body: "Yacht Master 200GT, PADI Dive Instructor, IKO Kitesurf Instructor, freediving &amp; spearfishing guide, drone pilot. Currently commanding a 51ft catamaran on crewed charters in Greece; joining Baja for Q4 2026." },
      flavia: { role: "Stewardess, Chef &amp; Filmmaker", line: "Cook, deckhand, personal trainer, and filmmaker.", body: "Cook, deckhand, personal trainer, and filmmaker. Culinary arts trained. Together with Javier, the model for Eagle Ray's Captain-Filmmaker &amp; Chef-Stew pairing." },
      rolesKicker: "The three roles of the Expedition Leader",
      roles: [
        { t: "Guide &amp; Expert", d: "At the center of every trip: a captain or first officer who knows the ocean well — diver, freediver, kite/wingfoil instructor." },
        { t: "Host &amp; Energy Creator", d: "They design the rhythm, the moments, the group dynamic. Not a skipper, not a tour guide. Something new." },
        { t: "Storyteller &amp; Brand", d: "They create the content and the memory that make the experience compound long after the trip ends." }
      ],
      trustLine: "Flexible by nature. Safety always comes first. And a direct line to Thibault — no call center, no chatbot.",
      trust: [
        { t: "Flexible by nature", d: "Routes adapt to weather, tide, and your group — nothing about your expedition is fixed in stone." },
        { t: "Safety always comes first", d: "Your skipper has final say on the water. If conditions aren't right, the plan changes — never the other way around." },
        { t: "A direct line to Thibault", d: "No call center, no chatbot. You're talking to the person actually building your expedition." }
      ]
    },
    faq: {
      kicker: "Questions",
      title: "Before you<br><em>reach out.</em>",
      items: [
        { q: "How many people can join an expedition?", a: "From an intimate group of friends to a full family reunion — expeditions typically run from a handful of guests up to larger groups, fully private. It's your boat, your crew, your pace." },
        { q: "Is this suitable for kids or grandparents?", a: "Yes. Routes and activity pace adapt to whoever's on board — a family with young kids and grandparents sails very differently from a group of divers, and we plan for that from the first conversation." },
        { q: "Who's responsible for the kids onboard?", a: "Parents remain responsible for their children at all times. Our crew keeps a close eye during activities and briefs every family on boat safety before departure." },
        { q: "What's the weather/safety policy?", a: "Your skipper has final say on the water. Routes, anchorages, and activities adjust to wind, swell, and visibility — safety always outranks the original plan." },
        { q: "What's included in an expedition?", a: "Your private catamaran, professional skipper, dinghy with motor, snorkeling gear, park permits, boat prep, and full coordination from Thibault before and during your trip. Food, drinks, guided diving/kite activities, and travel insurance are booked à la carte." },
        { q: "How far in advance should I book?", a: "We recommend reaching out 6–8 weeks ahead for the best boat and date availability, though we do our best to accommodate shorter notice." },
        { q: "Will photos from my trip be used anywhere?", a: "Only with your permission. If you're comfortable being featured, our storytelling crew may ask to share a few moments — otherwise, your trip stays entirely private." },
        { q: "Do you sail outside Baja?", a: "Today, every expedition sails out of La Paz, Baja California Sur. It's where our boats, crew, and permits are based." }
      ],
      footText: "Still have a question?",
      footLink: "WhatsApp Thibault directly →"
    },
    live: {
      kicker: "Already sailing",
      title: "First private expeditions<br><em>already sailing out of La Paz.</em>",
      lede: "This isn't a project on paper. This season's departures are already operating out of the La Paz marina, and the photos you see on Instagram are from last week, not a stock library.",
      igLabel: "Follow on Instagram →"
    },
    funnel: {
      kicker: "Build your expedition",
      title: "Customize your first<br><em>Baja expedition.</em>",
      lede: "4 quick questions. At the end, WhatsApp opens with your expedition already drafted — Thibault gets the full picture and replies with a real proposal within 48 hours, not a \"thanks for your interest.\"",
      escapeText: "Prefer to skip this? Message us directly on WhatsApp →",
      stepOf: "Step {n} of {total}",
      autosaveRestored: "✓ Picking up where you left off",
      autosaveSaved: "✓ Progress saved",
      back: "← Back",
      cont: "Continue →",
      submit: "Send my expedition request",
      sending: "Sending…",
      submitError: "Something went wrong sending your request — please try again, or use the WhatsApp link above.",
      successTitle: "Received — thank you",
      successBody: "Thibault will review your expedition and reply within 48 hours.",
      successWaBtn: "Continue the conversation on WhatsApp",
      recapTitle: "Your expedition so far",
      msgIntro: "Hi Thibault! I'd like to customize an Eagle Ray expedition.",
      msgDuration: "Duration", msgFor: "For", msgGuests: "Guests", msgRoute: "Route focus", msgPriority: "Top priority", msgDates: "Dates", msgBoat: "Boat", msgName: "Name", msgEmail: "Email", msgContact: "WhatsApp", msgNotes: "Notes",
      datesFrom: "from", datesTbd: "to be confirmed",
      nameError: "Please tell us your name.",
      emailError: "Please enter a valid email.",
      steps: {
        s1: {
          legend: "Trip basics",
          q1: "How many days are you thinking?", opts: ["3 – 4 days", "5 – 6 days", "7 – 8 days", "10 or more"],
          q2: "Who's this expedition for?", whoOpts: ["Family", "Couple", "Friends group", "Corporate / team"],
          q3: "How many of you will be aboard?", hint: "Up to 10 guests on the Bali 4.4, up to 8 on the Astrea 42. More than that, and we sail with both boats.", fewer: "Fewer guests", more: "More guests"
        },
        s2: {
          legend: "Route &amp; priorities",
          q1: "Which focus calls to you most?", opts: ["Espíritu Santo — wildlife", "La Ventana — kite &amp; wingfoil", "Balandra — reef &amp; paddle", "Not sure yet"],
          q2: "If you could ask for just one thing?", priorityOpts: ["Wildlife &amp; snorkeling", "Kite &amp; wingfoil", "Slow pace &amp; relaxation", "A bit of everything"]
        },
        s3: {
          legend: "Dates &amp; boat",
          from: "From", to: "To", orWrite: "Or write it your way", placeholder: "e.g. Late October 2026, or flexible",
          q1: "Any boat preference?", opts: ["Bali 4.4", "Fountaine Pajot Astrea 42", "No preference"]
        },
        s4: {
          legend: "Who does Thibault talk to?",
          name: "Name", email: "Email", namePh: "First name", emailPh: "you@email.com",
          contact: "WhatsApp number", contactOptional: "(optional, for a faster reply)", contactPh: "+52 55 0000 0000",
          extra: "Anything we should know (optional)", extraPh: "Allergies, diving level, celebrating something, seasickness…",
          privacy: "🔒 We only use this to prepare your proposal. No spam, ever."
        }
      }
    },
    finalCta: {
      kicker: "Baja California Sur",
      title: "Your Baja expedition starts with<br><em>a conversation, not a booking form.</em>",
      cta: "Customize your first Baja expedition"
    },
    footer: {
      claim: "The Sea of Cortez<br><em>isn't visited. It's sailed.</em>",
      base: "Base", baseBody: "Marina de La Paz<br>La Paz, Baja California Sur<br>Mexico",
      coords: "Coordinates",
      alsoIn: "Also based in", alsoInBody: "London · Barcelona · Lisbon",
      follow: "Follow", followInstagram: "Instagram", followWhatsapp: "WhatsApp", followEmail: "Email",
      rights: "All rights reserved",
      creditsText: "Photography under Creative Commons.", creditsLink: "Photo credits →",
      termsLink: "Terms &amp; Conditions", privacyLink: "Privacy Policy"
    },
    credits: {
      title: "Photo credits",
      lede: "Photography used on this site is licensed under Creative Commons via",
      back: "← Back to Eagle Ray Expeditions"
    },
    legal: {
      termsTitle: "Terms &amp; Conditions",
      termsLede: "The terms below govern every private expedition booked with Eagle Ray Expeditions. Please read them before confirming a trip.",
      privacyTitle: "Privacy Policy",
      privacyLede: "How Eagle Ray Expeditions collects, uses, and protects the information you share with us.",
      draftNote: "This page is a working draft. Final wording is pending review by Eagle Ray Expeditions before the site goes live.",
      updated: "Last updated"
    },
    depth: {
      surface: "Surface",
      stops: ["Anchorage", "San Lorenzo Channel", "Espíritu Santo", "A day aboard", "À la carte", "The boats", "Aboard", "Before you book", "Already at sea", "Charting your route"]
    }
  },

  es: {
    meta: {
      title: "Eagle Ray Expeditions — Expediciones privadas en velero · La Paz, Baja California Sur",
      description: "Expediciones privadas en catamarán por el Mar de Cortés — grupos pequeños, rutas que se adaptan al viento y la marea, buceo y fauna marina. Zarpando desde La Paz, Baja California Sur.",
      ogTitle: "Eagle Ray Expeditions — El acuario del mundo, en privado",
      ogDescription: "Vela, buceo y encuentros con fauna marina en el Mar de Cortés. Expediciones privadas para grupos pequeños desde La Paz, BCS.",
      ogLocale: "es_MX"
    },
    nav: { difference: "Diferencia", wildlife: "Fauna", routes: "Rutas", boats: "Barcos", crew: "Tripulación", faq: "Preguntas", customize: "Personalizar" },
    navm: { difference: "Diferencia", wildlife: "Dónde navegamos", routes: "Tres rutas", day: "Un día a bordo", boats: "Los barcos", crew: "La tripulación", faq: "Preguntas", customize: "Personaliza tu expedición" },
    hero: {
      title: "Diseñamos expediciones en vela donde<br>el mar decide casi todo el itinerario.",
      sub: "Rutas privadas en catamarán por el Mar de Cortés, pensadas para explorar y redibujadas por el viento, la marea y quien esté a bordo esa semana.",
      ctaPrimary: "Personaliza tu primera expedición en Baja",
      ctaSecondary: "Descubre qué nos hace diferentes",
      factDeparture: "Salida", factDepartureV: "Marina de La Paz",
      factGroup: "Grupo", factGroupV: "De 2 a 10 personas",
      factDuration: "Duración", factDurationV: "De 3 a 8 días",
      factItinerary: "Itinerario", factItineraryV: "Abierto"
    },
    difference: {
      kicker: "Lo que hacemos",
      title: "No vendemos charters.<br><em>Diseñamos experiencias en el mar.</em>",
      lede: "Eagle Ray Expeditions diseña y guía expediciones marítimas para grupos pequeños que combinan vela, buceo y encuentros con fauna en Baja California Sur. Pensado para quienes quieren algo más que un barco.",
      vsThemTitle: "Charters tradicionales",
      vsThem: ["El barco es lo primero, todo gira en torno a la comodidad.", "Tripulación neutral, contratada por semana.", "Rutas fijas, definidas antes de conocerte.", "El agua es paisaje — se mira desde la cabina.", "Le escribes a una oficina y te responde un formulario."],
      vsUsTitle: "Eagle Ray Expeditions",
      vsUs: ["La experiencia es lo primero, todo gira en torno a explorar.", "Siempre la misma tripulación, que conoce el canal de memoria.", "Rutas que se adaptan, redibujadas por el viento y la marea.", "El agua es el plan — buceo, snorkel, kayak, todos los días.", "Le escribes al fundador, y el fundador te responde."],
      quoteKicker: "Ellos venden viajes.<br>Nosotros diseñamos expediciones humanas.",
      quote: "No quería vender barcos. Quería construir el tipo de viaje en el que yo mismo querría estar — con gente que conoce el mar de verdad, no solo cómo entregarte unas llaves.",
      quoteCite: "— Thibault Poirson De Cardon, Fundador"
    },
    wildlife: {
      kicker: "Dónde navegamos",
      title: "El acuario<br><em>del mundo.</em>",
      lede: "Así llamó Cousteau al Mar de Cortés. Un golfo angosto que concentra en pocas millas lo que otros océanos reparten en miles — corrientes frías que suben del fondo, islas desiertas y una densidad de vida que sigue sorprendiendo a quien lleva años navegándolo. Trabajamos el tramo entre La Paz, Espíritu Santo y Cerralvo.",
      note: "Espíritu Santo es un parque nacional protegido y parte del sitio Patrimonio Mundial de la UNESCO \"Islas y Áreas Protegidas del Golfo de California\". Fondeamos solo en boyas autorizadas, y los avistamientos siguen las distancias y horarios que marca la normativa. La fauna no está garantizada: es fauna silvestre."
    },
    fauna: {
      "whale-shark": { name: "Tiburón ballena", season: "Oct — Abr", place: "Bahía de La Paz", note: "Juveniles alimentándose justo en la bahía. Nadas junto a ellos en snorkel, sin equipo de buceo." },
      "mobula": { name: "Mobulas", season: "May — Jul", place: "Canal de Cerralvo", note: "Bancos de cientos saltando fuera del agua. El sonido llega antes que la imagen." },
      "sea-lions": { name: "Lobos marinos — Los Islotes", season: "Todo el año", place: "colonia de Los Islotes", note: "Una colonia permanente. Los juveniles bucean contigo, no al revés." },
      "dolphins": { name: "Delfines", season: "Todo el año", place: "en navegación", note: "Aparecen en la proa mientras navegas a vela. No los buscamos — nos encuentran ellos." },
      "manta": { name: "Mantarrayas", season: "May — Sep", place: "arrecifes y fondos de arena", note: "Sobre pináculos y fondos de arena, casi siempre en la inmersión de la mañana." },
      "humpback": { name: "Ballenas jorobadas", season: "Ene — Mar", place: "migración, temporada", note: "Migración de temporada, observada desde el barco a la distancia que marca la normativa." }
    },
    routes: {
      kicker: "Tres rutas reales",
      title: "Puntos de partida,<br><em>no itinerarios cerrados.</em>",
      lede: "No son paquetes — son las tres direcciones en las que solemos zarpar desde La Paz, con un itinerario aproximado de cuatro días. Todo se reordena si se levanta el viento del norte, o si alguien quiere quedarse un día más en una ensenada.",
      note: "Estas rutas son un punto de partida — cada expedición se adapta al clima, al estado del mar y a lo que tu grupo quiera.",
      espirituSanto: {
        name: "Enfoque Espíritu Santo",
        claim: "Fauna primero: lobos marinos, manglares y las ensenadas de arena blanca que hacen de esta la ruta que más subestima la gente.",
        meta: ["4 días", "Cualquier nivel", "Sin travesías largas"],
        days: [
          { t: "Vela hacia Espíritu Santo", d: "Salida a media mañana con la térmica, unas horas de vela hasta el primer fondeadero y un snorkel de reconocimiento antes de comer." },
          { t: "Snorkel con lobos marinos", d: "Dos sesiones con la colonia de Los Islotes. Los juveniles se acercan a centímetros de tu máscara y se quedan toda la inmersión." },
          { t: "Kayak entre manglares y playas vírgenes", d: "Canales de manglar en kayak por la mañana, desembarco en playa vacía por la tarde, cena en cubierta con la isla de fondo." },
          { t: "Regreso a La Paz", d: "Vela de vuelta con el viento a favor, última parada de baño en Playa Bonanza, llegada a marina a media tarde." }
        ],
        quote: "«Los Islotes nunca deja de sorprender — nadar con la colonia de lobos marinos es el momento que todos recuerdan primero.»",
        cite: "— Adly, Líder de expedición"
      },
      laVentana: {
        name: "Enfoque La Ventana",
        claim: "El viento primero: sesiones de kite y wingfoil construidas alrededor de la térmica que le da su nombre a La Ventana.",
        meta: ["4 días", "Nivel kite / wingfoil", "Ventana de viento estacional"],
        days: [
          { t: "Vela hacia La Ventana", d: "Navegación matutina por el canal, equipo armado en cubierta antes de que entre la térmica de la tarde." },
          { t: "Sesión de kite o wingfoil", d: "Un día completo en el agua — la tripulación incluye instructor de kite y wingfoil, así que principiantes y expertos tienen su plan." },
          { t: "Atardecer y cena a bordo", d: "El viento afloja al final de la tarde; el barco se mueve a un fondeadero tranquilo para una cena relajada en cubierta." },
          { t: "Regreso a La Paz", d: "Salida temprano para adelantarse a la térmica, de vuelta en la marina antes del mediodía." }
        ],
        quote: "«Cuando entra el viento en La Ventana, todo lo demás deja de importar.»",
        cite: "— Adly, Líder de expedición"
      },
      balandra: {
        name: "Enfoque Balandra",
        claim: "Arrecife y remo primero: agua turquesa y poco profunda, snorkel fácil y un ritmo más lento que las otras dos rutas.",
        meta: ["4 días", "Cualquier nivel", "Agua tranquila y protegida"],
        days: [
          { t: "Vela hacia Balandra", d: "Una travesía corta hasta una de las bahías más fotografiadas del golfo, casi siempre vacía al caer la tarde." },
          { t: "Snorkel en el arrecife", d: "Arrecife poco profundo, agua tibia y un ritmo pensado para niños, abuelos y todos los de en medio." },
          { t: "Paddleboard y exploración", d: "Tablas de paddle al amanecer, una caminata a un mirador y una tarde totalmente libre." },
          { t: "Regreso a La Paz", d: "Vela tranquila de vuelta con la brisa de la tarde, llegada a marina al caer la tarde." }
        ],
        quote: "«El color del agua de Balandra me sigue sorprendiendo, y llevo años navegando el Mar de Cortés.»",
        cite: "— Denise, Capitana"
      }
    },
    showcase: {
      title: "Un día en<br><em>Eagle Ray.</em>",
      cards: [
        { t: "Navegar", d: "Navegamos hacia el objetivo del día, café en mano mientras se levanta el ancla." },
        { t: "Actividad", d: "Buceo, kite, nado — lo que le llame la atención a la tripulación esa mañana." },
        { t: "Comida", d: "La pesca del día, cocinada y compartida a la sombra de la cabina." },
        { t: "Explorar", d: "Costas, acantilados, agua, rincones desconocidos que valen un remo tranquilo." },
        { t: "Atardecer", d: "Una pausa para disfrutarlo — nadar, surfear, o simplemente dejarse llevar." },
        { t: "Cena", d: "De vuelta a bordo. Historias, sal en la piel, y un reinicio antes del día siguiente." }
      ]
    },
    activities: {
      kicker: "Lo que puedes hacer",
      title: "No es un itinerario.<br><em>Es un mundo de opciones.</em>",
      lede: "Cuéntanos qué te llama la atención antes de llegar — el resto se decide a bordo, día a día, según lo que permita el mar.",
      note: "Espíritu Santo es un parque nacional protegido (Reserva de la Biósfera UNESCO). Eagle Ray opera respetando por completo las zonas reguladas.",
      list: ["Buceo con botella", "Apnea", "Pesca submarina", "Kitesurf", "Wingfoil", "Snorkel", "Saltos desde rocas", "Chapuzones en altamar", "Nado nocturno", "Nado al amanecer", "Recorrido de islas", "Exploración de cuevas", "Avistamiento de ballenas", "Encuentros con fauna", "Recolecta silvestre", "Cocina al fuego", "Surf", "Yoga", "Sesiones de estiramiento", "Trabajo de respiración", "Juegos de cartas", "Sesiones de música", "Observación de estrellas"],
      markedOf: "{n} de {total} marcadas",
      interestedIn: "Te interesa:"
    },
    boats: {
      kicker: "Tu expedición",
      title: "Dos barcos. Un mismo estándar:<br><em>completamente privado, completamente tuyo.</em>",
      customizeBtn: "Personalizar mi expedición",
      bali: { name: "Bali 4.4", tagline: "Tu casa sobre el agua", desc: "4 camarotes dobles, 4 baños privados, amplios espacios interiores y exteriores, modelo 2024. Ideal para familias y grupos que quieren el máximo espacio para moverse.",
        length: "13.90 m", cabins: "4 dobles", bathrooms: "4 privados", guests: "hasta 10" },
      astrea: { name: "Fountaine Pajot Astrea 42", tagline: "Elegancia en el mar", desc: "4 camarotes dobles con baño privado, bañera y solárium amplios, acabados refinados y navegación suave. Ideal para quien busca un estilo más de diseño.",
        length: "12.80 m", cabins: "4 dobles", bathrooms: "4 privados", guests: "hasta 8" },
      specLength: "Eslora", specCabins: "Camarotes", specBathrooms: "Baños", specGuests: "Invitados",
      includedHeading: "Siempre incluido",
      included: ["Catamarán privado, listo para vivir a bordo", "Patrón profesional", "Bote auxiliar con motor", "Equipo de snorkel a bordo", "Permisos / brazaletes de acceso a áreas protegidas", "Preparación y limpieza del barco", "Coordinación de ERE antes y durante tu viaje", "Itinerario flexible, adaptado al clima y a tu grupo"],
      notIncludedHeading: "A la carta / no incluido",
      notIncluded: ["Comida y bebidas", "Propina para la tripulación", "WiFi / Starlink", "Equipo extra (kayak, paddle, pesca)", "Combustible consumido durante el viaje", "Buceo, kite y wingfoil, actividades guiadas", "Seguro de viaje personal"]
    },
    crew: {
      kicker: "Con quién navegas",
      title: "Mucho más que personal de servicio —<br><em>navegan, bucean y se mueven contigo.</em>",
      founderLabel: "Fundador",
      founderBody: "Empresario del mar con más de 10 años en México, construyendo desde cero la red de capitanes, chefs y líderes de expedición de Baja. Es quien contesta tu WhatsApp — antes, durante y después de tu viaje.",
      founderSign: "Línea directa, sin call center · +52 55 6809 0942",
      pilotKicker: "La tripulación piloto de Baja",
      members: {
        denise: { role: "Capitana", line: "Años navegando el Mar de Cortés y algunos de los yates privados más exigentes del mundo.", body: "Años navegando el Mar de Cortés y algunos de los yates privados más exigentes del mundo. Seguridad, navegación y asegurarse de que todos disfruten al máximo. Habla español, inglés y portugués." },
        benjamin: { role: "Patrón", line: "Ingeniero de formación con años explorando el Golfo de California.", body: "Ingeniero de formación con años explorando el Golfo de California. Navegación metódica con una pasión real por la aventura — cada expedición se mantiene segura, tranquila y adaptada al mar." },
        adly: { role: "Líder de expedición", line: "Entre el viento de La Ventana y las aguas del Mar de Cortés, el mar es su casa.", body: "Entre el viento de La Ventana y las aguas del Mar de Cortés, el mar es su casa. Instructor de buceo y kite que comparte una pasión real por la exploración auténtica de Baja. Habla español, inglés y árabe." },
        antoine: { role: "Chef Oro", line: "Formación en hospitalidad de lujo, restaurantes y emprendimiento.", body: "Formación en hospitalidad de lujo, restaurantes y emprendimiento. Convierte cada comida en un momento compartido, inspirado en productos locales y el espíritu del viaje." },
        ana: { role: "Chef Plata", line: "Emprendedora y fundadora de su propio negocio de repostería.", body: "Emprendedora y fundadora de su propio negocio de repostería. Cocina generosa y convivial que reúne a los invitados — más cocteles de autor y una verdadera pasión por la pesca y los mariscos." }
      },
      dreamCoupleKicker: "La pareja soñada de ERE · Q4 2026",
      joiningTag: "Se unen en Q4 2026",
      javier: { role: "Capitán y cineasta", line: "Yacht Master 200GT, instructor de buceo PADI, instructor de kitesurf IKO, guía de apnea y pesca submarina, piloto de drones.", body: "Yacht Master 200GT, instructor de buceo PADI, instructor de kitesurf IKO, guía de apnea y pesca submarina, piloto de drones. Actualmente al mando de un catamarán de 51 pies en charters con tripulación en Grecia; se suma a Baja para el Q4 2026." },
      flavia: { role: "Sobrecargo, chef y cineasta", line: "Cocinera, marinera, entrenadora personal y cineasta.", body: "Cocinera, marinera, entrenadora personal y cineasta. Formación en artes culinarias. Junto con Javier, el modelo de la dupla Capitán-Cineasta y Chef-Sobrecargo de Eagle Ray." },
      rolesKicker: "Los tres papeles del líder de expedición",
      roles: [
        { t: "Guía y experto", d: "En el centro de cada viaje: un capitán o primer oficial que conoce bien el mar — buzo, apneísta, instructor de kite/wingfoil." },
        { t: "Anfitrión y generador de energía", d: "Diseñan el ritmo, los momentos, la dinámica del grupo. No es un patrón, ni un guía de tour. Es algo nuevo." },
        { t: "Narrador y marca", d: "Crean el contenido y el recuerdo que hacen que la experiencia siga creciendo mucho después del viaje." }
      ],
      trustLine: "Flexibles por naturaleza. La seguridad va primero. Y una línea directa con Thibault — sin call center, sin chatbot.",
      trust: [
        { t: "Flexibles por naturaleza", d: "Las rutas se adaptan al clima, la marea y tu grupo — nada en tu expedición está escrito en piedra." },
        { t: "La seguridad va primero", d: "Tu patrón tiene la última palabra en el agua. Si las condiciones no son las correctas, cambia el plan — nunca al revés." },
        { t: "Línea directa con Thibault", d: "Sin call center, sin chatbot. Hablas con la persona que de verdad está construyendo tu expedición." }
      ]
    },
    faq: {
      kicker: "Preguntas",
      title: "Antes de<br><em>escribirnos.</em>",
      items: [
        { q: "¿Cuántas personas pueden ir en una expedición?", a: "Desde un grupo íntimo de amigos hasta una reunión familiar completa — las expediciones suelen ir desde unos pocos invitados hasta grupos más grandes, siempre en privado. Es tu barco, tu tripulación, tu ritmo." },
        { q: "¿Es apto para niños o abuelos?", a: "Sí. Las rutas y el ritmo de actividades se adaptan a quien esté a bordo — una familia con niños pequeños y abuelos navega muy distinto a un grupo de buzos, y lo planeamos desde la primera conversación." },
        { q: "¿Quién es responsable de los niños a bordo?", a: "Los padres son responsables de sus hijos en todo momento. Nuestra tripulación está pendiente durante las actividades e informa a cada familia sobre seguridad antes de zarpar." },
        { q: "¿Cuál es la política de clima y seguridad?", a: "Tu patrón tiene la última palabra en el agua. Rutas, fondeaderos y actividades se ajustan al viento, el oleaje y la visibilidad — la seguridad siempre está por encima del plan original." },
        { q: "¿Qué incluye exactamente una expedición?", a: "Tu catamarán privado, patrón profesional, bote auxiliar con motor, equipo de snorkel, permisos del parque, preparación del barco, y toda la coordinación de Thibault antes y durante tu viaje. Comida, bebidas, actividades guiadas de buceo/kite y seguro de viaje se reservan a la carta." },
        { q: "¿Con cuánta anticipación debo reservar?", a: "Recomendamos escribir con 6–8 semanas de anticipación para tener mejor disponibilidad de barco y fecha, aunque siempre hacemos lo posible por acomodar avisos más cortos." },
        { q: "¿Se usarán las fotos de mi viaje en algún lado?", a: "Solo con tu permiso. Si te sientes cómodo apareciendo, nuestro equipo de contenido puede pedirte compartir algunos momentos — de lo contrario, tu viaje se queda completamente privado." },
        { q: "¿Navegan fuera de Baja?", a: "Por ahora, todas las expediciones zarpan desde La Paz, Baja California Sur. Ahí están nuestros barcos, tripulación y permisos." }
      ],
      footText: "¿Todavía tienes una pregunta?",
      footLink: "Escríbele a Thibault directo por WhatsApp →"
    },
    live: {
      kicker: "Ya estamos navegando",
      title: "Las primeras expediciones privadas<br><em>ya navegan desde La Paz.</em>",
      lede: "Esto no es un proyecto en papel. Las salidas de esta temporada ya están operando desde la marina de La Paz, y las fotos que ves en Instagram son de la semana pasada, no de un banco de imágenes.",
      igLabel: "Síguenos en Instagram →"
    },
    funnel: {
      kicker: "Arma tu expedición",
      title: "Personaliza tu primera<br><em>expedición en Baja.</em>",
      lede: "4 preguntas breves. Al final, se abre WhatsApp con tu expedición ya redactada — Thibault recibe el panorama completo y responde con una propuesta real en 48 horas, no un \"gracias por tu interés\".",
      escapeText: "¿Prefieres saltarte esto? Escríbenos directo por WhatsApp →",
      stepOf: "Paso {n} de {total}",
      autosaveRestored: "✓ Continuamos donde lo dejaste",
      autosaveSaved: "✓ Progreso guardado",
      back: "← Atrás",
      cont: "Continuar →",
      submit: "Enviar mi solicitud de expedición",
      sending: "Enviando…",
      submitError: "Algo salió mal al enviar tu solicitud — intenta de nuevo, o usa el enlace de WhatsApp de arriba.",
      successTitle: "Recibido — gracias",
      successBody: "Thibault revisará tu expedición y te responderá en menos de 48 horas.",
      successWaBtn: "Continuar la conversación en WhatsApp",
      recapTitle: "Tu expedición hasta ahora",
      msgIntro: "¡Hola Thibault! Quiero personalizar una expedición con Eagle Ray.",
      msgDuration: "Duración", msgFor: "Para", msgGuests: "Invitados", msgRoute: "Ruta de enfoque", msgPriority: "Prioridad principal", msgDates: "Fechas", msgBoat: "Barco", msgName: "Nombre", msgEmail: "Correo", msgContact: "WhatsApp", msgNotes: "Notas",
      datesFrom: "desde", datesTbd: "por confirmar",
      nameError: "Cuéntanos tu nombre, por favor.",
      emailError: "Ingresa un correo válido.",
      steps: {
        s1: {
          legend: "Lo básico del viaje",
          q1: "¿Cuántos días tienes en mente?", opts: ["3 – 4 días", "5 – 6 días", "7 – 8 días", "10 o más"],
          q2: "¿Para quién es esta expedición?", whoOpts: ["Familia", "Pareja", "Grupo de amigos", "Empresa / equipo"],
          q3: "¿Cuántos irán a bordo?", hint: "Hasta 10 invitados en el Bali 4.4, hasta 8 en el Astrea 42. Si son más, navegamos con los dos barcos.", fewer: "Menos invitados", more: "Más invitados"
        },
        s2: {
          legend: "Ruta y prioridades",
          q1: "¿Qué enfoque te llama más la atención?", opts: ["Espíritu Santo — fauna", "La Ventana — kite y wingfoil", "Balandra — arrecife y remo", "Aún no lo sé"],
          q2: "Si solo pudieras pedir una cosa, ¿cuál sería?", priorityOpts: ["Fauna y snorkel", "Kite y wingfoil", "Ritmo tranquilo y descanso", "Un poco de todo"]
        },
        s3: {
          legend: "Fechas y barco",
          from: "Desde", to: "Hasta", orWrite: "O escríbelo a tu manera", placeholder: "ej. finales de octubre 2026, o flexible",
          q1: "¿Tienes preferencia de barco?", opts: ["Bali 4.4", "Fountaine Pajot Astrea 42", "Sin preferencia"]
        },
        s4: {
          legend: "¿Con quién habla Thibault?",
          name: "Nombre", email: "Correo", namePh: "Tu nombre", emailPh: "tu@correo.com",
          contact: "Número de WhatsApp", contactOptional: "(opcional, para responder más rápido)", contactPh: "+52 55 0000 0000",
          extra: "Algo que debamos saber (opcional)", extraPh: "Alergias, nivel de buceo, si celebran algo, si alguien se marea…",
          privacy: "🔒 Solo usamos esto para preparar tu propuesta. Cero spam."
        }
      }
    },
    finalCta: {
      kicker: "Baja California Sur",
      title: "Tu expedición en Baja empieza con<br><em>una conversación, no un formulario de reserva.</em>",
      cta: "Personaliza tu primera expedición en Baja"
    },
    footer: {
      claim: "El Mar de Cortés<br><em>no se visita. Se navega.</em>",
      base: "Base", baseBody: "Marina de La Paz<br>La Paz, Baja California Sur<br>México",
      coords: "Coordenadas",
      alsoIn: "También en", alsoInBody: "Londres · Barcelona · Lisboa",
      follow: "Síguenos", followInstagram: "Instagram", followWhatsapp: "WhatsApp", followEmail: "Correo",
      rights: "Todos los derechos reservados",
      creditsText: "Fotografía bajo licencia Creative Commons.", creditsLink: "Créditos de fotos →",
      termsLink: "Términos y Condiciones", privacyLink: "Aviso de Privacidad"
    },
    credits: {
      title: "Créditos de fotos",
      lede: "Las fotografías usadas en este sitio están licenciadas bajo Creative Commons vía",
      back: "← Volver a Eagle Ray Expeditions"
    },
    legal: {
      termsTitle: "Términos y Condiciones",
      termsLede: "Los siguientes términos rigen cada expedición privada reservada con Eagle Ray Expeditions. Por favor léelos antes de confirmar un viaje.",
      privacyTitle: "Aviso de Privacidad",
      privacyLede: "Cómo Eagle Ray Expeditions recopila, usa y protege la información que compartes con nosotros.",
      draftNote: "Esta página es un borrador de trabajo. El texto final está pendiente de revisión por Eagle Ray Expeditions antes de publicar el sitio.",
      updated: "Última actualización"
    },
    depth: {
      surface: "Superficie",
      stops: ["Fondeadero", "Canal de San Lorenzo", "Espíritu Santo", "Un día a bordo", "A la carta", "Los barcos", "A bordo", "Antes de reservar", "Ya en el mar", "Trazando tu ruta"]
    }
  },

  fr: {
    meta: {
      title: "Eagle Ray Expeditions — Expéditions privées à la voile · La Paz, Basse-Californie du Sud",
      description: "Expéditions privées en catamaran dans la mer de Cortez — petits groupes, itinéraires adaptés au vent et à la marée, plongée et faune marine. Départs de La Paz, Basse-Californie du Sud.",
      ogTitle: "Eagle Ray Expeditions — L'aquarium du monde, en privé",
      ogDescription: "Voile, plongée et rencontres avec la faune marine dans la mer de Cortez. Expéditions privées pour petits groupes au départ de La Paz, BCS.",
      ogLocale: "fr_FR"
    },
    nav: { difference: "Différence", wildlife: "Faune", routes: "Itinéraires", boats: "Bateaux", crew: "Équipage", faq: "FAQ", customize: "Personnaliser" },
    navm: { difference: "Différence", wildlife: "Où nous naviguons", routes: "Trois itinéraires", day: "Une journée à bord", boats: "Les bateaux", crew: "L'équipage", faq: "FAQ", customize: "Personnalisez votre expédition" },
    hero: {
      title: "Nous menons des expéditions à la voile où<br>c'est la mer qui dessine l'itinéraire.",
      sub: "Des itinéraires privés en catamaran dans la mer de Cortez, pensés pour l'exploration et redessinés selon le vent, la marée et les invités de la semaine.",
      ctaPrimary: "Personnalisez votre première expédition en Basse-Californie",
      ctaSecondary: "Découvrez ce qui nous distingue",
      factDeparture: "Départ", factDepartureV: "Marina de La Paz",
      factGroup: "Groupe", factGroupV: "2 à 10 invités",
      factDuration: "Durée", factDurationV: "3 à 8 jours",
      factItinerary: "Itinéraire", factItineraryV: "Ouvert"
    },
    difference: {
      kicker: "Ce que nous faisons",
      title: "Nous ne vendons pas des locations de bateau.<br><em>Nous concevons des expériences en mer.</em>",
      lede: "Eagle Ray Expeditions conçoit et encadre des expéditions maritimes en petit groupe, mêlant voile, plongée et rencontres avec la faune en Basse-Californie du Sud. Pensé pour ceux qui veulent bien plus qu'un bateau.",
      vsThemTitle: "Location classique",
      vsThem: ["Le bateau d'abord, tout tourne autour du confort.", "Équipage neutre, engagé à la semaine.", "Itinéraires fixes, imprimés avant même de vous connaître.", "L'eau n'est qu'un décor — observée depuis le cockpit.", "Vous écrivez à un bureau, un formulaire vous répond."],
      vsUsTitle: "Eagle Ray Expeditions",
      vsUs: ["L'expérience d'abord, tout tourne autour de l'exploration.", "Toujours le même équipage, qui connaît le chenal par cœur.", "Itinéraires adaptables, redessinés selon le vent et la marée.", "L'eau est le programme — plongée, snorkeling, kayak, chaque jour.", "Vous écrivez au fondateur, et c'est le fondateur qui répond."],
      quoteKicker: "Ils vendent des voyages.<br>Nous concevons des expéditions humaines.",
      quote: "Je ne voulais pas vendre des bateaux. Je voulais construire le genre de voyage où j'aurais moi-même aimé être invité — avec des gens qui connaissent vraiment la mer, pas seulement comment vous remettre un trousseau de clés.",
      quoteCite: "— Thibault Poirson De Cardon, Fondateur"
    },
    wildlife: {
      kicker: "Où nous naviguons",
      title: "L'aquarium<br><em>du monde.</em>",
      lede: "C'est ainsi que Cousteau surnommait la mer de Cortez. Un golfe étroit qui concentre sur quelques milles ce que d'autres océans dispersent sur des milliers — remontées d'eaux froides, îles désertes et une densité de vie qui surprend encore ceux qui la naviguent depuis des années. Nous travaillons la zone entre La Paz, Espíritu Santo et Cerralvo.",
      note: "Espíritu Santo est un parc national protégé et fait partie du site du patrimoine mondial de l'UNESCO « Îles et aires protégées du golfe de Californie ». Nous mouillons uniquement sur des bouées autorisées, et les observations respectent les distances et horaires fixés par la réglementation. La faune n'est jamais garantie — c'est de la vie sauvage."
    },
    fauna: {
      "whale-shark": { name: "Requins-baleines", season: "Oct — Avr", place: "Baie de La Paz", note: "Des juvéniles qui se nourrissent juste dans la baie. Vous nagez à leurs côtés en snorkeling, sans bouteille." },
      "mobula": { name: "Raies mobula", season: "Mai — Juil", place: "Chenal de Cerralvo", note: "Des bancs de centaines de raies jaillissant hors de l'eau. On les entend avant de les voir." },
      "sea-lions": { name: "Otaries — Los Islotes", season: "Toute l'année", place: "colonie de Los Islotes", note: "Une colonie permanente. Ce sont les jeunes otaries qui plongent avec vous, pas l'inverse." },
      "dolphins": { name: "Dauphins", season: "Toute l'année", place: "en navigation", note: "Ils surgissent à l'étrave pendant que vous naviguez à la voile. On ne les cherche pas — ils nous trouvent." },
      "manta": { name: "Raies manta", season: "Mai — Sep", place: "récifs et fonds sableux", note: "Sur les pitons rocheux et les fonds sableux, généralement lors de la plongée du matin." },
      "humpback": { name: "Baleines à bosse", season: "Jan — Mar", place: "migration saisonnière", note: "Migration saisonnière, observée depuis le bateau à la distance imposée par la réglementation." }
    },
    routes: {
      kicker: "Trois itinéraires bien réels",
      title: "Des points de départ,<br><em>pas des itinéraires figés.</em>",
      lede: "Ce ne sont pas des forfaits — ce sont les trois directions que nous prenons habituellement au départ de La Paz, avec un itinéraire indicatif de quatre jours. Tout se réorganise si le vent du nord se lève, ou si quelqu'un veut rester un jour de plus dans une crique.",
      note: "Ces itinéraires sont un point de départ — chaque expédition s'adapte à la météo, à l'état de la mer et aux envies de votre groupe.",
      espirituSanto: {
        name: "Itinéraire Espíritu Santo",
        claim: "La faune avant tout : otaries, mangroves et criques de sable blanc — l'itinéraire que l'on sous-estime le plus souvent.",
        meta: ["4 jours", "Tous niveaux", "Pas de longues traversées"],
        days: [
          { t: "Cap sur Espíritu Santo", d: "Départ en fin de matinée avec la brise thermique, quelques heures de voile jusqu'au premier mouillage, et un snorkeling de reconnaissance avant le déjeuner." },
          { t: "Snorkeling avec les otaries", d: "Deux sessions avec la colonie de Los Islotes. Les jeunes s'approchent à quelques centimètres de votre masque et restent toute la plongée." },
          { t: "Kayak dans les mangroves et plages sauvages", d: "Chenaux de mangrove en kayak le matin, débarquement sur une plage déserte l'après-midi, dîner sur le pont avec l'île en toile de fond." },
          { t: "Retour à La Paz", d: "Route au portant, dernière baignade à Playa Bonanza, arrivée à la marina en milieu d'après-midi." }
        ],
        quote: "« Los Islotes ne lasse jamais — nager avec la colonie d'otaries, c'est le moment que chaque invité retient en premier. »",
        cite: "— Adly, Chef d'expédition"
      },
      laVentana: {
        name: "Itinéraire La Ventana",
        claim: "Le vent avant tout : sessions de kite et de wingfoil organisées autour de la brise thermique qui donne son nom à La Ventana.",
        meta: ["4 jours", "Niveau kite / wingfoil", "Fenêtre de vent saisonnière"],
        days: [
          { t: "Cap sur La Ventana", d: "Navigation matinale le long du chenal, matériel gréé sur le pont avant que la thermique de l'après-midi ne s'installe." },
          { t: "Session kite ou wingfoil", d: "Une journée complète sur l'eau — l'équipage compte un instructeur de kite et de wingfoil, pour que débutants et riders confirmés aient chacun leur programme." },
          { t: "Coucher de soleil et dîner au mouillage", d: "Le vent faiblit en fin d'après-midi ; le bateau rejoint un mouillage tranquille pour un dîner tout en douceur sur le pont." },
          { t: "Retour à La Paz", d: "Départ matinal pour devancer la brise montante, retour à la marina avant midi." }
        ],
        quote: "« Quand le vent se lève à La Ventana, plus rien d'autre n'a d'importance. »",
        cite: "— Adly, Chef d'expédition"
      },
      balandra: {
        name: "Itinéraire Balandra",
        claim: "Le récif et la pagaie avant tout : une eau turquoise peu profonde, du snorkeling facile et un rythme plus tranquille que les deux autres itinéraires.",
        meta: ["4 jours", "Tous niveaux", "Eaux calmes et protégées"],
        days: [
          { t: "Cap sur Balandra", d: "Une courte traversée vers l'une des baies les plus photographiées du golfe, presque toujours déserte en fin de journée." },
          { t: "Snorkeling sur le récif", d: "Récif peu profond, eau chaude, et un rythme pensé pour les enfants, les grands-parents et tous les autres." },
          { t: "Paddle et exploration", d: "Paddle au lever du soleil, marche jusqu'à un point de vue, et un après-midi sans aucun programme." },
          { t: "Retour à La Paz", d: "Retour tranquille avec la brise de l'après-midi, arrivée à la marina en fin de journée." }
        ],
        quote: "« La couleur de l'eau à Balandra me surprend encore, et pourtant je navigue dans la mer de Cortez depuis des années. »",
        cite: "— Denise, Capitaine"
      }
    },
    showcase: {
      title: "Une journée chez<br><em>Eagle Ray.</em>",
      cards: [
        { t: "Naviguer", d: "Cap sur l'objectif du jour, café à la main pendant que l'ancre remonte." },
        { t: "Activité", d: "Plongée, kite, baignade — ce qui inspire l'équipage ce matin-là." },
        { t: "Déjeuner", d: "La pêche du jour, cuisinée et partagée à l'ombre du cockpit." },
        { t: "Explorer", d: "Rivages, falaises, eau, coins secrets qui valent une balade en pagaie." },
        { t: "Coucher de soleil", d: "Une pause pour en profiter — nager, surfer, ou simplement dériver." },
        { t: "Dîner", d: "De retour à bord. Histoires, sel sur la peau, et une pause avant le lendemain." }
      ]
    },
    activities: {
      kicker: "Ce que vous pourriez faire",
      title: "Ce n'est pas un itinéraire.<br><em>C'est un monde de possibilités.</em>",
      lede: "Dites-nous ce qui vous tente avant votre arrivée — le reste se décide à bord, jour après jour, selon ce que la mer permet.",
      note: "Espíritu Santo est un parc national protégé (réserve de biosphère UNESCO). Eagle Ray opère dans le plein respect des zones réglementées.",
      list: ["Plongée bouteille", "Apnée", "Pêche sous-marine", "Kitesurf", "Wingfoil", "Snorkeling", "Saut de falaise", "Baignades en pleine mer", "Baignade nocturne", "Baignade au lever du soleil", "Îles en chapelet", "Exploration de grottes", "Observation des baleines", "Rencontres avec la faune", "Cueillette sauvage", "Cuisine au feu de bois", "Surf", "Yoga", "Séances d'étirement", "Travail respiratoire", "Jeux de cartes", "Sessions musicales", "Observation des étoiles"],
      markedOf: "{n} sur {total} cochées",
      interestedIn: "Intéressé(e) par :"
    },
    boats: {
      kicker: "Votre expédition",
      title: "Deux bateaux. Un seul principe :<br><em>entièrement privé, entièrement à vous.</em>",
      customizeBtn: "Personnaliser mon expédition",
      bali: { name: "Bali 4.4", tagline: "Votre maison sur l'eau", desc: "4 cabines doubles, 4 salles de bain privées, de vastes espaces de vie intérieurs et extérieurs, modèle 2024. Idéal pour les familles et groupes qui veulent un maximum d'espace.",
        length: "13,90 m", cabins: "4 doubles", bathrooms: "4 privées", guests: "jusqu'à 10" },
      astrea: { name: "Fountaine Pajot Astrea 42", tagline: "L'élégance en mer", desc: "4 cabines doubles avec salle de bain privée, cockpit et flybridge spacieux, finitions raffinées, navigation en douceur. Idéal pour une ambiance plus design.",
        length: "12,80 m", cabins: "4 doubles", bathrooms: "4 privées", guests: "jusqu'à 8" },
      specLength: "Longueur", specCabins: "Cabines", specBathrooms: "Salles de bain", specGuests: "Invités",
      includedHeading: "Toujours inclus",
      included: ["Catamaran en location privée, prêt à vivre à bord", "Skipper professionnel", "Annexe avec moteur", "Matériel de snorkeling à bord", "Permis / bracelets d'accès aux zones protégées", "Préparation et nettoyage du bateau", "Coordination ERE avant et pendant votre voyage", "Itinéraire flexible, adapté à la météo et à votre groupe"],
      notIncludedHeading: "À la carte / non inclus",
      notIncluded: ["Nourriture et boissons", "Pourboire pour le skipper", "WiFi / Starlink", "Équipement supplémentaire (kayak, paddle, pêche)", "Carburant consommé pendant le voyage", "Plongée, kite et wingfoil, activités encadrées", "Assurance voyage personnelle"]
    },
    crew: {
      kicker: "Avec qui vous naviguez",
      title: "Bien plus que du personnel de service —<br><em>ils naviguent, plongent et vivent l'expédition avec vous.</em>",
      founderLabel: "Fondateur",
      founderBody: "Entrepreneur de la mer avec plus de 10 ans d'expérience au Mexique, bâtissant depuis le début le réseau de capitaines, chefs et chefs d'expédition de Basse-Californie. C'est lui qui répond à votre WhatsApp — avant, pendant et après votre voyage.",
      founderSign: "Ligne directe, sans centre d'appels · +52 55 6809 0942",
      pilotKicker: "L'équipage pilote de Basse-Californie",
      members: {
        denise: { role: "Capitaine", line: "Des années à naviguer dans la mer de Cortez et sur certains des yachts privés les plus exigeants au monde.", body: "Des années à naviguer dans la mer de Cortez et sur certains des yachts privés les plus exigeants au monde. Sécurité, navigation, et l'assurance que chacun profite pleinement de l'expérience. Parle espagnol, anglais, portugais." },
        benjamin: { role: "Skipper", line: "Ingénieur de formation, avec des années passées à explorer le golfe de Californie.", body: "Ingénieur de formation, avec des années passées à explorer le golfe de Californie. Une navigation méthodique et une vraie passion pour l'aventure — chaque expédition reste sûre, fluide et adaptée à la mer." },
        adly: { role: "Chef d'expédition", line: "Entre le vent de La Ventana et les eaux de la mer de Cortez, la mer est chez lui.", body: "Entre le vent de La Ventana et les eaux de la mer de Cortez, la mer est chez lui. Instructeur de plongée et de kite, il partage une vraie passion pour l'exploration authentique de la Basse-Californie. Parle espagnol, anglais, arabe." },
        antoine: { role: "Chef étoilé", line: "Une formation dans l'hôtellerie de luxe, la restauration et l'entrepreneuriat.", body: "Une formation dans l'hôtellerie de luxe, la restauration et l'entrepreneuriat. Il transforme chaque repas en un moment partagé, inspiré des produits locaux et de l'esprit du voyage." },
        ana: { role: "Chef pâtissière", line: "Entrepreneuse et fondatrice de sa propre pâtisserie.", body: "Entrepreneuse et fondatrice de sa propre pâtisserie. Une cuisine généreuse et conviviale qui rassemble les invités — accompagnée de cocktails signature et d'une vraie passion pour la pêche et les fruits de mer." }
      },
      dreamCoupleKicker: "Le duo de rêve ERE · T4 2026",
      joiningTag: "Nous rejoint au T4 2026",
      javier: { role: "Capitaine et réalisateur", line: "Yacht Master 200GT, instructeur de plongée PADI, instructeur de kitesurf IKO, guide d'apnée et de pêche sous-marine, télépilote de drone.", body: "Yacht Master 200GT, instructeur de plongée PADI, instructeur de kitesurf IKO, guide d'apnée et de pêche sous-marine, télépilote de drone. Commande actuellement un catamaran de 51 pieds en charter avec équipage en Grèce ; rejoint la Basse-Californie au T4 2026." },
      flavia: { role: "Hôtesse, chef et réalisatrice", line: "Cuisinière, matelot, coach personnelle et réalisatrice.", body: "Cuisinière, matelot, coach personnelle et réalisatrice. Formée aux arts culinaires. Avec Javier, elle incarne le modèle du duo Capitaine-Réalisateur et Chef-Hôtesse d'Eagle Ray." },
      rolesKicker: "Les trois rôles du chef d'expédition",
      roles: [
        { t: "Guide et expert", d: "Au cœur de chaque voyage : un capitaine ou second qui connaît bien la mer — plongeur, apnéiste, instructeur de kite/wingfoil." },
        { t: "Hôte et créateur d'énergie", d: "Il façonne le rythme, les moments, la dynamique du groupe. Ni skipper, ni guide touristique. Quelque chose de nouveau." },
        { t: "Conteur et image de marque", d: "Il crée le contenu et les souvenirs qui font vivre l'expérience bien après la fin du voyage." }
      ],
      trustLine: "Flexibles par nature. La sécurité avant tout. Et une ligne directe avec Thibault — pas de centre d'appels, pas de chatbot.",
      trust: [
        { t: "Flexibles par nature", d: "Les itinéraires s'adaptent à la météo, à la marée et à votre groupe — rien dans votre expédition n'est gravé dans le marbre." },
        { t: "La sécurité avant tout", d: "Votre skipper a le dernier mot en mer. Si les conditions ne sont pas réunies, c'est le programme qui change — jamais l'inverse." },
        { t: "Une ligne directe avec Thibault", d: "Pas de centre d'appels, pas de chatbot. Vous parlez à la personne qui construit réellement votre expédition." }
      ]
    },
    faq: {
      kicker: "Questions",
      title: "Avant de nous<br><em>contacter.</em>",
      items: [
        { q: "Combien de personnes peuvent participer à une expédition ?", a: "D'un groupe d'amis intime à une grande réunion de famille — les expéditions accueillent généralement de quelques invités à des groupes plus grands, toujours en privé. C'est votre bateau, votre équipage, votre rythme." },
        { q: "Est-ce adapté aux enfants ou aux grands-parents ?", a: "Oui. Les itinéraires et le rythme des activités s'adaptent à qui est à bord — une famille avec de jeunes enfants et des grands-parents navigue très différemment d'un groupe de plongeurs, et nous en tenons compte dès la première conversation." },
        { q: "Qui est responsable des enfants à bord ?", a: "Les parents restent responsables de leurs enfants à tout moment. Notre équipage reste attentif pendant les activités et informe chaque famille des consignes de sécurité avant le départ." },
        { q: "Quelle est la politique météo et sécurité ?", a: "Votre skipper a le dernier mot en mer. Itinéraires, mouillages et activités s'ajustent au vent, à la houle et à la visibilité — la sécurité prime toujours sur le programme initial." },
        { q: "Qu'est-ce qui est exactement inclus dans une expédition ?", a: "Votre catamaran privé, un skipper professionnel, une annexe avec moteur, le matériel de snorkeling, les permis du parc, la préparation du bateau, et la coordination complète de Thibault avant et pendant votre voyage. Repas, boissons, activités encadrées de plongée/kite et assurance voyage se réservent à la carte." },
        { q: "Avec combien de temps d'avance dois-je réserver ?", a: "Nous recommandons de nous contacter 6 à 8 semaines à l'avance pour une meilleure disponibilité de bateau et de dates, même si nous faisons toujours de notre mieux pour nous adapter à un délai plus court." },
        { q: "Les photos de mon voyage seront-elles utilisées quelque part ?", a: "Uniquement avec votre accord. Si cela ne vous dérange pas d'apparaître, notre équipe éditoriale peut vous demander de partager quelques moments — sinon, votre voyage reste entièrement privé." },
        { q: "Naviguez-vous en dehors de la Basse-Californie ?", a: "Aujourd'hui, toutes les expéditions partent de La Paz, en Basse-Californie du Sud. C'est là que se trouvent nos bateaux, notre équipage et nos permis." }
      ],
      footText: "Une question reste sans réponse ?",
      footLink: "Écrivez directement à Thibault sur WhatsApp →"
    },
    live: {
      kicker: "Déjà en mer",
      title: "Les premières expéditions privées<br><em>naviguent déjà au départ de La Paz.</em>",
      lede: "Ce n'est pas un projet sur papier. Les départs de cette saison sont déjà en cours depuis la marina de La Paz, et les photos que vous voyez sur Instagram datent de la semaine dernière, pas d'une banque d'images.",
      igLabel: "Suivez-nous sur Instagram →"
    },
    funnel: {
      kicker: "Construisez votre expédition",
      title: "Personnalisez votre première<br><em>expédition en Basse-Californie.</em>",
      lede: "4 questions rapides. À la fin, WhatsApp s'ouvre avec votre expédition déjà rédigée — Thibault reçoit le tableau complet et répond avec une vraie proposition sous 48 heures, pas un « merci de votre intérêt ».",
      escapeText: "Vous préférez passer tout ça ? Écrivez-nous directement sur WhatsApp →",
      stepOf: "Étape {n} sur {total}",
      autosaveRestored: "✓ Reprise là où vous en étiez",
      autosaveSaved: "✓ Progression enregistrée",
      back: "← Retour",
      cont: "Continuer →",
      submit: "Envoyer ma demande d'expédition",
      sending: "Envoi…",
      submitError: "Un problème est survenu lors de l'envoi — réessayez, ou utilisez le lien WhatsApp ci-dessus.",
      successTitle: "Reçu — merci",
      successBody: "Thibault examinera votre expédition et vous répondra sous 48 heures.",
      successWaBtn: "Continuer la conversation sur WhatsApp",
      recapTitle: "Votre expédition jusqu'ici",
      msgIntro: "Bonjour Thibault ! J'aimerais personnaliser une expédition Eagle Ray.",
      msgDuration: "Durée", msgFor: "Pour", msgGuests: "Invités", msgRoute: "Itinéraire souhaité", msgPriority: "Priorité principale", msgDates: "Dates", msgBoat: "Bateau", msgName: "Nom", msgEmail: "E-mail", msgContact: "WhatsApp", msgNotes: "Notes",
      datesFrom: "à partir du", datesTbd: "à confirmer",
      nameError: "Merci d'indiquer votre nom.",
      emailError: "Merci d'indiquer un e-mail valide.",
      steps: {
        s1: {
          legend: "Les bases du voyage",
          q1: "Combien de jours envisagez-vous ?", opts: ["3 – 4 jours", "5 – 6 jours", "7 – 8 jours", "10 jours ou plus"],
          q2: "Pour qui est cette expédition ?", whoOpts: ["Famille", "Couple", "Groupe d'amis", "Entreprise / équipe"],
          q3: "Combien serez-vous à bord ?", hint: "Jusqu'à 10 invités sur le Bali 4.4, jusqu'à 8 sur l'Astrea 42. Au-delà, nous naviguons avec les deux bateaux.", fewer: "Moins d'invités", more: "Plus d'invités"
        },
        s2: {
          legend: "Itinéraire et priorités",
          q1: "Quel axe vous attire le plus ?", opts: ["Espíritu Santo — faune", "La Ventana — kite et wingfoil", "Balandra — récif et pagaie", "Pas encore sûr"],
          q2: "Si vous ne pouviez demander qu'une seule chose ?", priorityOpts: ["Faune et snorkeling", "Kite et wingfoil", "Rythme tranquille et détente", "Un peu de tout"]
        },
        s3: {
          legend: "Dates et bateau",
          from: "Du", to: "Au", orWrite: "Ou écrivez-le à votre façon", placeholder: "ex. fin octobre 2026, ou flexible",
          q1: "Une préférence de bateau ?", opts: ["Bali 4.4", "Fountaine Pajot Astrea 42", "Aucune préférence"]
        },
        s4: {
          legend: "À qui Thibault s'adresse-t-il ?",
          name: "Nom", email: "E-mail", namePh: "Votre prénom", emailPh: "vous@email.com",
          contact: "Numéro WhatsApp", contactOptional: "(facultatif, pour une réponse plus rapide)", contactPh: "+52 55 0000 0000",
          extra: "Quelque chose à savoir (facultatif)", extraPh: "Allergies, niveau de plongée, un événement à fêter, mal de mer…",
          privacy: "🔒 Nous utilisons ceci uniquement pour préparer votre proposition. Jamais de spam."
        }
      }
    },
    finalCta: {
      kicker: "Basse-Californie du Sud",
      title: "Votre expédition en Basse-Californie commence par<br><em>une conversation, pas un formulaire de réservation.</em>",
      cta: "Personnalisez votre première expédition en Basse-Californie"
    },
    footer: {
      claim: "La mer de Cortez<br><em>ne se visite pas. Elle se navigue.</em>",
      base: "Base", baseBody: "Marina de La Paz<br>La Paz, Basse-Californie du Sud<br>Mexique",
      coords: "Coordonnées",
      alsoIn: "Également présents à", alsoInBody: "Londres · Barcelone · Lisbonne",
      follow: "Suivez-nous", followInstagram: "Instagram", followWhatsapp: "WhatsApp", followEmail: "E-mail",
      rights: "Tous droits réservés",
      creditsText: "Photographies sous licence Creative Commons.", creditsLink: "Crédits photo →",
      termsLink: "Conditions générales", privacyLink: "Politique de confidentialité"
    },
    credits: {
      title: "Crédits photo",
      lede: "Les photographies utilisées sur ce site sont sous licence Creative Commons via",
      back: "← Retour à Eagle Ray Expeditions"
    },
    legal: {
      termsTitle: "Conditions générales",
      termsLede: "Les conditions ci-dessous régissent chaque expédition privée réservée avec Eagle Ray Expeditions. Merci de les lire avant de confirmer un voyage.",
      privacyTitle: "Politique de confidentialité",
      privacyLede: "Comment Eagle Ray Expeditions collecte, utilise et protège les informations que vous partagez avec nous.",
      draftNote: "Cette page est une version de travail. Le texte final est en attente de validation par Eagle Ray Expeditions avant la mise en ligne du site.",
      updated: "Dernière mise à jour"
    },
    depth: {
      surface: "Surface",
      stops: ["Mouillage", "Chenal de San Lorenzo", "Espíritu Santo", "Une journée à bord", "À la carte", "Les bateaux", "À bord", "Avant de réserver", "Déjà en mer", "Cap sur votre itinéraire"]
    }
  }

  };
})();
