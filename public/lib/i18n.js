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
    nav: { difference: "Difference", wildlife: "Wildlife", routes: "Routes", boats: "Boats", crew: "Crew", faq: "FAQ", customize: "Go Sailing" },
    navm: { difference: "Difference", wildlife: "Where we sail", routes: "Three routes", day: "A day aboard", boats: "The boats", crew: "The crew", faq: "FAQ", customize: "Customize your expedition" },
    hero: {
      sub: "Small groups. Real crew. Private catamaran. No fixed schedule.",
      ctaPrimary: "Customize your expedition",
      ctaSecondary: "What makes us unique",
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
      vsThem: ["Boat-first, comfort-driven.", "Neutral crew, hired by the week.", "Fixed routes, printed before you meet them.", "The water is scenery — watched from the cockpit."],
      vsUsTitle: "Eagle Ray Expeditions",
      vsUs: ["Experience-first, exploration-driven.", "The same crew, who know the channel by memory.", "Adaptive routes, redrawn by weather and tide.", "The water is the plan — dive, snorkel, kayak, every day."],
      quoteKicker: "They sell trips.<br>We design human expeditions.",
      quote: "I didn't want to sell boats. I wanted to build the kind of trip I'd actually want to be on — with people who know the ocean, not just how to hand you a set of keys.",
      quoteCite: "— Thibault Poirson De Cardon, Founder"
    },
    wildlife: {
      kicker: "Where we sail",
      title: "The aquarium<br><em>of the world.</em>",
      lede: "Cousteau's name for the Sea of Cortez. A narrow gulf that concentrates what other oceans spread across thousands of miles — cold upwellings, deserted islands, and a density of life that still surprises people who've sailed it for years. We work the stretch between La Paz, Espíritu Santo, and Cerralvo.",
      disclaimer: "Sightings are never guaranteed. These are wild animals in open water — what we can offer is the season, the place, and the odds.",
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
      lede: "Not packages — the three directions we tend to sail out of La Paz. All of it reshuffles if the north wind picks up, or if someone wants one more day in a cove.",
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
      lede: "Tell us what appeals to you before you arrive — we will prepare a proposal and the rest will get decided onboard, day by day, by what the sea and your mood allows.",
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
      title: "Far more than service staff —<br><em>we sail, dive, and move with you.</em>",
      founderLabel: "Founder",
      founderSign: "Direct line, no call center · +52 55 6809 0942",
      members: {
        thibault: { role: "Founder &amp; Expedition Host", bio: "I have spent more than ten years building things around the ocean in Mexico, and Eagle Ray is the one I care about most. I built the Baja network myself — the captains, the chefs, the expedition leaders — one conversation at a time. I am the one who answers your WhatsApp, before, during and after your trip, because I would rather you talk to the person who is accountable for the trip than to an office." },
        alexis: { role: "Expedition Leader — Scuba", bio: "I spent years running guest experience at the Ritz-Carlton and the Mandarin Oriental before I became a dive instructor and a surfer. I bring that five-star, guest-first instinct to every dive briefing — the one who turns a boat full of strangers into a crew within a day." },
        denise: { role: "Captain", bio: "I have spent years navigating the Sea of Cortez, and before that some of the most demanding private yachts in the world. I know this water in every season — where the wind bends around the islands, which anchorage holds when the north wind comes through, and how a week reshapes itself when the sea decides otherwise." },
        benji: { role: "Captain", bio: "I'm a civil engineer who became a freelance captain, splitting my time between La Paz and Mexico City. Eight years running industrial and energy operations before I moved to the helm — I'm the one who reads the weather routing and keeps the boat itself ready, trip after trip." },
        adly: { role: "Expedition Leader", bio: "Between the wind of La Ventana and the water of the Sea of Cortez, this is home for me. I lead the days on the water and I read the group before the group reads itself — when to push for one more dive, and when the best call is to anchor and do nothing at all." },
        antoine: { role: "Gold Chef", bio: "I've spent 15+ years cooking aboard boats and superyachts, including private-chef work for senior executives. Tested and confirmed on the July Baja pilot — restaurant technique, in a galley kitchen." },
        ana: { role: "Silver Chef", bio: "I am an entrepreneur and I founded my own pastry business. I cook on board the way I built that: from scratch, with attention, and with the small extra thing nobody asked for but everybody remembers." },
        monique: { role: "Expedition Leader", bio: "I'm a Brazilian dive instructor with six years in Baja California. Before this I worked in corporate marketing, which turned out to be the perfect training for reading a boat full of guests. Tested and confirmed on the July Baja pilot." },
        juancarlos: { role: "Expedition Leader", bio: "I've been a dive instructor since I was 20, with liveaboard crew experience in the Revillagigedo Islands. I once delivered a sailboat solo from Loreto to La Paz — 30 hours, no autopilot, no sleep. I split my time between La Paz and Los Cabos." },
        lou: { role: "Captain &amp; Expedition Leader", bio: "I'm a captain and expedition leader who specializes in kite and freediving, based in Baja California. I bring a calm, grounded presence on board — even the most wound-up first-timer settles down within a day at sea with me." }
      },
      joiningTag: "Joining Q4 2026",
      javier: { role: "Captain &amp; Filmmaker", bio: "I am a Yacht Master 200GT, PADI Dive Instructor, IKO Kitesurf Instructor, freediving and spearfishing guide, and a drone pilot. It means I can take you under the water, across it, and film the part you will want to keep." },
      flavia: { role: "Stewardess, Chef &amp; Filmmaker", bio: "I cook, I work the deck, I train people, and I film. On a small boat that mix is the point — the same person who plans dinner is the one who gets you moving in the morning and captures the day as it happens." },
      rolesKicker: "The roles of the Expedition Leader",
      roles: [
        { t: "Guides &amp; Experts", d: "At the center of every trip: a captain or first officer who has spent years reading this ocean, its wind, its currents, what changes month to month. Someone who was diving and freediving this water long before it was a job." },
        { t: "Hosts &amp; Energy Creators", d: "Eagle Ray's expedition leaders know how to read the group before the group reads itself — when to push, when to disappear, when to plan nothing at all. And they notice the moments that actually stay with people: the dive nobody expected to do, a conversation at 2am, the morning the wind never came." }
      ],
      trustLine: "Flexible by nature. Safety always comes first. And a direct line to Thibault — no call center, no chatbot."
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
      footLink: "Contact us directly →"
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
      title: "Your Baja expedition starts with a conversation.<br><em>You bring the idea. We turn it into an expedition.</em>",
      cta: "Customize your expedition"
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
    nav: { difference: "Diferencia", wildlife: "Fauna", routes: "Rutas", boats: "Barcos", crew: "Tripulación", faq: "Preguntas", customize: "Go Sailing" },
    navm: { difference: "Diferencia", wildlife: "Dónde navegamos", routes: "Tres rutas", day: "Un día a bordo", boats: "Los barcos", crew: "La tripulación", faq: "Preguntas", customize: "Personaliza tu expedición" },
    hero: {
      sub: "Grupos pequeños. Tripulación de verdad. Catamarán privado. Sin horarios fijos.",
      ctaPrimary: "Personaliza tu expedición",
      ctaSecondary: "Qué nos hace únicos",
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
      vsThem: ["El barco es lo primero, todo gira en torno a la comodidad.", "Tripulación neutral, contratada por semana.", "Rutas fijas, definidas antes de conocerte.", "El agua es paisaje — se mira desde la cabina."],
      vsUsTitle: "Eagle Ray Expeditions",
      vsUs: ["La experiencia es lo primero, todo gira en torno a explorar.", "Siempre la misma tripulación, que conoce el canal de memoria.", "Rutas que se adaptan, redibujadas por el viento y la marea.", "El agua es el plan — buceo, snorkel, kayak, todos los días."],
      quoteKicker: "Ellos venden viajes.<br>Nosotros diseñamos expediciones humanas.",
      quote: "No quería vender barcos. Quería construir el tipo de viaje en el que yo mismo querría estar — con gente que conoce el mar de verdad, no solo cómo entregarte unas llaves.",
      quoteCite: "— Thibault Poirson De Cardon, Fundador"
    },
    wildlife: {
      kicker: "Dónde navegamos",
      title: "El acuario<br><em>del mundo.</em>",
      lede: "Así llamó Cousteau al Mar de Cortés. Un golfo angosto que concentra en pocas millas lo que otros océanos reparten en miles — corrientes frías que suben del fondo, islas desiertas y una densidad de vida que sigue sorprendiendo a quien lleva años navegándolo. Trabajamos el tramo entre La Paz, Espíritu Santo y Cerralvo.",
      disclaimer: "Los avistamientos nunca están garantizados. Son animales salvajes en mar abierto — lo que sí podemos darte es la temporada, el lugar y la probabilidad.",
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
      lede: "No son paquetes — son las tres direcciones en las que solemos zarpar desde La Paz. Todo se reordena si se levanta el viento del norte, o si alguien quiere quedarse un día más en una ensenada.",
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
      lede: "Cuéntanos qué te llama la atención antes de llegar — prepararemos una propuesta y el resto se decidirá a bordo, día a día, según lo que permitan el mar y tus ganas.",
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
      title: "Mucho más que personal de servicio —<br><em>navegamos, buceamos y nos movemos contigo.</em>",
      founderLabel: "Fundador",
      founderSign: "Línea directa, sin call center · +52 55 6809 0942",
      members: {
        thibault: { role: "Fundador y anfitrión de expediciones", bio: "Llevo más de diez años construyendo proyectos alrededor del mar en México, y Eagle Ray es el que más me importa. La red de Baja la armé yo mismo — los capitanes, los chefs, los líderes de expedición — conversación a conversación. Soy quien responde tu WhatsApp, antes, durante y después del viaje, porque prefiero que hables con la persona que responde del viaje y no con una oficina." },
        alexis: { role: "Líder de expedición — Buceo", bio: "Pasé años liderando la experiencia de huéspedes en el Ritz-Carlton y el Mandarin Oriental antes de convertirme en instructor de buceo y surfista. Traigo ese instinto de servicio cinco estrellas a cada briefing de buceo — soy quien convierte a un grupo de desconocidos en tripulación en un solo día." },
        denise: { role: "Capitana", bio: "Llevo años navegando el Mar de Cortés, y antes de eso algunos de los yates privados más exigentes del mundo. Conozco esta agua en todas sus temporadas — dónde se quiebra el viento entre las islas, qué fondeadero aguanta cuando entra el norte, y cómo se reordena una semana entera cuando el mar decide otra cosa." },
        benji: { role: "Capitán", bio: "Soy ingeniero civil y me convertí en capitán freelance, dividiendo mi tiempo entre La Paz y Ciudad de México. Ocho años operando proyectos industriales y energéticos antes de pasarme al timón — soy quien lee la ruta meteorológica y mantiene el barco listo, viaje tras viaje." },
        adly: { role: "Líder de expedición", bio: "Entre el viento de La Ventana y el agua del Mar de Cortés, esto es mi casa. Dirijo los días en el agua y leo al grupo antes de que el grupo se lea a sí mismo — cuándo empujar para una inmersión más, y cuándo lo mejor es fondear y no hacer absolutamente nada." },
        antoine: { role: "Chef Gold", bio: "Llevo más de 15 años cocinando a bordo de barcos y superyates, incluyendo trabajo como chef privado para altos ejecutivos. Probado y confirmado en el piloto de Baja de julio — técnica de restaurante, en la cocina de un barco." },
        ana: { role: "Chef Silver", bio: "Soy emprendedora y fundé mi propio negocio de repostería. Cocino a bordo como construí aquello: desde cero, con atención, y con ese detalle de más que nadie pidió pero todos recuerdan." },
        monique: { role: "Líder de expedición", bio: "Soy instructora de buceo brasileña, con seis años en Baja California. Antes de esto trabajé en marketing corporativo, que resultó ser el entrenamiento perfecto para leer a un grupo de huéspedes. Probada y confirmada en el piloto de Baja de julio." },
        juancarlos: { role: "Líder de expedición", bio: "Soy instructor de buceo desde los 20 años, con experiencia de tripulación en liveaboards en las Islas Revillagigedo. Una vez entregué un velero en solitario de Loreto a La Paz — 30 horas, sin piloto automático, sin dormir. Divido mi tiempo entre La Paz y Los Cabos." },
        lou: { role: "Capitán y líder de expedición", bio: "Soy capitán y líder de expedición especializado en kite y apnea, con base en Baja California. Aporto una presencia tranquila y estable a bordo — hasta el huésped primerizo más inquieto se relaja en un día de mar conmigo." }
      },
      joiningTag: "Se incorporan en Q4 2026",
      javier: { role: "Capitán y realizador", bio: "Soy Yacht Master 200GT, instructor de buceo PADI, instructor de kitesurf IKO, guía de apnea y pesca submarina, y piloto de dron. Significa que puedo llevarte bajo el agua, sobre ella, y filmar la parte que vas a querer guardar." },
      flavia: { role: "Azafata, chef y realizadora", bio: "Cocino, trabajo en cubierta, entreno a la gente y filmo. En un barco pequeño esa mezcla es justo el punto — la misma persona que planea la cena es la que te pone en marcha por la mañana y captura el día mientras pasa." },
      rolesKicker: "Los roles del líder de expedición",
      roles: [
        { t: "Guías y expertos", d: "En el centro de cada viaje: un capitán o primer oficial que lleva años leyendo este mar, su viento, sus corrientes, lo que cambia de un mes a otro. Alguien que buceaba y hacía apnea en esta agua mucho antes de que fuera un trabajo." },
        { t: "Anfitriones y creadores de energía", d: "Los líderes de expedición de Eagle Ray saben leer al grupo antes de que el grupo se lea a sí mismo — cuándo empujar, cuándo desaparecer, cuándo no planear nada. Y detectan los momentos que de verdad se quedan con la gente: la inmersión que nadie esperaba hacer, una conversación a las 2 de la mañana, la mañana en que el viento no llegó nunca." }
      ],
      trustLine: "Flexibles por naturaleza. La seguridad siempre va primero. Y línea directa con Thibault — sin call center, sin chatbot."
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
      footLink: "Contáctanos directamente →"
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
      title: "Tu expedición en Baja empieza con una conversación.<br><em>Tú traes la idea. Nosotros la convertimos en expedición.</em>",
      cta: "Personaliza tu expedición"
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
    nav: { difference: "Différence", wildlife: "Faune", routes: "Itinéraires", boats: "Bateaux", crew: "Équipage", faq: "FAQ", customize: "Go Sailing" },
    navm: { difference: "Différence", wildlife: "Où nous naviguons", routes: "Trois itinéraires", day: "Une journée à bord", boats: "Les bateaux", crew: "L'équipage", faq: "FAQ", customize: "Personnalisez votre expédition" },
    hero: {
      sub: "Petits groupes. Un vrai équipage. Catamaran privé. Aucun horaire fixe.",
      ctaPrimary: "Personnalisez votre expédition",
      ctaSecondary: "Ce qui nous rend uniques",
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
      vsThem: ["Le bateau d'abord, tout tourne autour du confort.", "Équipage neutre, engagé à la semaine.", "Itinéraires fixes, imprimés avant même de vous connaître.", "L'eau n'est qu'un décor — observée depuis le cockpit."],
      vsUsTitle: "Eagle Ray Expeditions",
      vsUs: ["L'expérience d'abord, tout tourne autour de l'exploration.", "Toujours le même équipage, qui connaît le chenal par cœur.", "Itinéraires adaptables, redessinés selon le vent et la marée.", "L'eau est le programme — plongée, snorkeling, kayak, chaque jour."],
      quoteKicker: "Ils vendent des voyages.<br>Nous concevons des expéditions humaines.",
      quote: "Je ne voulais pas vendre des bateaux. Je voulais construire le genre de voyage où j'aurais moi-même aimé être invité — avec des gens qui connaissent vraiment la mer, pas seulement comment vous remettre un trousseau de clés.",
      quoteCite: "— Thibault Poirson De Cardon, Fondateur"
    },
    wildlife: {
      kicker: "Où nous naviguons",
      title: "L'aquarium<br><em>du monde.</em>",
      lede: "C'est ainsi que Cousteau surnommait la mer de Cortez. Un golfe étroit qui concentre sur quelques milles ce que d'autres océans dispersent sur des milliers — remontées d'eaux froides, îles désertes et une densité de vie qui surprend encore ceux qui la naviguent depuis des années. Nous travaillons la zone entre La Paz, Espíritu Santo et Cerralvo.",
      disclaimer: "Les observations ne sont jamais garanties. Ce sont des animaux sauvages en pleine mer — ce que nous pouvons vous donner, c'est la saison, le lieu et la probabilité.",
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
      lede: "Ce ne sont pas des forfaits — ce sont les trois directions que nous prenons habituellement au départ de La Paz. Tout se réorganise si le vent du nord se lève, ou si quelqu'un veut rester un jour de plus dans une crique.",
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
      lede: "Dites-nous ce qui vous tente avant votre arrivée — nous préparerons une proposition, et le reste se décidera à bord, jour après jour, selon ce que la mer et votre humeur permettent.",
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
      title: "Bien plus qu'un personnel de service —<br><em>nous naviguons, plongeons et bougeons avec vous.</em>",
      founderLabel: "Fondateur",
      founderSign: "Ligne directe, sans call center · +52 55 6809 0942",
      members: {
        thibault: { role: "Fondateur et hôte d'expédition", bio: "Cela fait plus de dix ans que je construis des projets autour de l'océan au Mexique, et Eagle Ray est celui qui compte le plus pour moi. J'ai bâti le réseau de Basse-Californie moi-même — les capitaines, les chefs, les leaders d'expédition — une conversation à la fois. C'est moi qui réponds à votre WhatsApp, avant, pendant et après votre voyage, parce que je préfère que vous parliez à la personne responsable du voyage plutôt qu'à un bureau." },
        alexis: { role: "Leader d'expédition — Plongée", bio: "J'ai passé des années à diriger l'expérience client au Ritz-Carlton et au Mandarin Oriental avant de devenir instructeur de plongée et surfeur. J'apporte ce réflexe cinq étoiles, centré sur l'invité, à chaque briefing de plongée — celui qui transforme un bateau d'inconnus en équipage en une seule journée." },
        denise: { role: "Capitaine", bio: "J'ai passé des années à naviguer la mer de Cortez, et avant cela sur certains des yachts privés les plus exigeants au monde. Je connais cette eau à chaque saison — où le vent se plie autour des îles, quel mouillage tient quand le vent du nord se lève, et comment une semaine entière se réorganise quand la mer en décide autrement." },
        benji: { role: "Capitaine", bio: "Je suis ingénieur civil devenu capitaine freelance, partagé entre La Paz et Mexico. Huit ans à gérer des opérations industrielles et énergétiques avant de passer à la barre — je suis celui qui lit le routage météo et garde le bateau prêt, voyage après voyage." },
        adly: { role: "Leader d'expédition", bio: "Entre le vent de La Ventana et l'eau de la mer de Cortez, je suis chez moi. Je mène les journées sur l'eau et je lis le groupe avant que le groupe ne se lise lui-même — quand pousser pour une plongée de plus, et quand le meilleur choix est de mouiller et de ne rien faire du tout." },
        antoine: { role: "Chef Gold", bio: "Je cuisine depuis plus de 15 ans à bord de bateaux et de superyachts, y compris comme chef privé pour des cadres dirigeants. Testé et confirmé lors du pilote de Baja en juillet — une technique de restaurant, dans une cuisine de bateau." },
        ana: { role: "Chef Silver", bio: "Je suis entrepreneuse et j'ai fondé ma propre pâtisserie. Je cuisine à bord comme je l'ai construite : à partir de rien, avec attention, et avec ce petit supplément que personne n'a demandé mais dont tout le monde se souvient." },
        monique: { role: "Leader d'expédition", bio: "Je suis instructrice de plongée brésilienne, avec six ans d'expérience en Basse-Californie. Avant cela, je travaillais dans le marketing d'entreprise — la formation parfaite, en fait, pour lire un bateau plein d'invités. Testée et confirmée lors du pilote de Baja en juillet." },
        juancarlos: { role: "Leader d'expédition", bio: "Instructeur de plongée depuis mes 20 ans, avec une expérience d'équipage en liveaboard aux îles Revillagigedo. J'ai un jour convoyé un voilier en solitaire de Loreto à La Paz — 30 heures, sans pilote automatique, sans sommeil. Je partage mon temps entre La Paz et Los Cabos." },
        lou: { role: "Capitaine et leader d'expédition", bio: "Je suis capitaine et leader d'expédition, spécialisé en kite et apnée, basé en Basse-Californie. J'apporte une présence calme et posée à bord — même l'invité le plus tendu se détend en une journée en mer avec moi." }
      },
      joiningTag: "Rejoignent l'équipe au Q4 2026",
      javier: { role: "Capitaine et réalisateur", bio: "Je suis Yacht Master 200GT, moniteur de plongée PADI, moniteur de kitesurf IKO, guide d'apnée et de chasse sous-marine, et pilote de drone. Cela veut dire que je peux vous emmener sous l'eau, dessus, et filmer la partie que vous voudrez garder." },
      flavia: { role: "Hôtesse, chef et réalisatrice", bio: "Je cuisine, je travaille sur le pont, j'entraîne les gens et je filme. Sur un petit bateau, ce mélange est précisément l'intérêt — la même personne qui prépare le dîner est celle qui vous met en mouvement le matin et capte la journée telle qu'elle se déroule." },
      rolesKicker: "Les rôles du leader d'expédition",
      roles: [
        { t: "Guides et experts", d: "Au cœur de chaque voyage : un capitaine ou un second qui a passé des années à lire cet océan, son vent, ses courants, ce qui change d'un mois à l'autre. Quelqu'un qui plongeait et faisait de l'apnée dans cette eau bien avant que ce soit un métier." },
        { t: "Hôtes et créateurs d'énergie", d: "Les leaders d'expédition d'Eagle Ray savent lire le groupe avant que le groupe ne se lise lui-même — quand pousser, quand s'effacer, quand ne rien prévoir du tout. Et ils repèrent les moments qui restent vraiment : la plongée que personne n'avait prévue, une conversation à 2h du matin, le matin où le vent n'est jamais venu." }
      ],
      trustLine: "Flexibles par nature. La sécurité passe toujours en premier. Et une ligne directe avec Thibault — sans call center, sans chatbot."
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
      footLink: "Contactez-nous directement →"
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
      title: "Votre expédition en Basse-Californie commence par une conversation.<br><em>Vous apportez l'idée. Nous en faisons une expédition.</em>",
      cta: "Personnalisez votre expédition"
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
