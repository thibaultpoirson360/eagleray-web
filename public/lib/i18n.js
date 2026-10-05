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
        ]
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
      title: "Our fleet. One standard:<br><em>fully private, fully yours.</em>",
      customizeBtn: "Customize my expedition",
      baydreamer: { name: "Bay Dreamer", tagline: "Icon Charter — Lagoon 450F", desc: "4 cabins, 8 berths, 4 heads. Flybridge, Starlink, watermaker — built for groups who want space and comfort in equal measure.",
        length: "13.72 m", cabins: "4 double", bathrooms: "4 private", guests: "up to 8" },
      goodmedicine: { name: "Good Medicine", tagline: "Good Medicine La Paz — Lagoon 42", desc: "3 cabins, 6 berths, 3 heads. Owner's suite, solar power, onboard chef service. A boutique feel for smaller groups.",
        length: "12.80 m", cabins: "3 double", bathrooms: "3 private", guests: "up to 6" },
      starofbaja: { name: "Star of Baja", tagline: "West Coast Multihulls — Fountaine Pajot Astrea 42", desc: "4 cabins, 8 berths, 4 heads. Elevated helm station, double sun pad — refined design for a design-forward feel.",
        length: "12.80 m", cabins: "4 double", bathrooms: "4 private", guests: "up to 8" },
      moorings4500l: { name: "Moorings 4500L", tagline: "The Moorings — Leopard 45, sail catamaran", desc: "4 cabins, 8 berths, 4 heads. Flybridge lounge, solar power, watermaker — built for groups who want a classic sailing feel with room to spread out.",
        length: "13.72 m", cabins: "4 double", bathrooms: "4 private", guests: "up to 10" },
      moorings464pc: { name: "Moorings 464PC", tagline: "The Moorings — Leopard 46, power catamaran", desc: "4 cabins, 8 berths, 4 heads. Flybridge helm and wet bar, underwater lights — for groups who want to cover more ground without giving up comfort.",
        length: "14.02 m", cabins: "4 double", bathrooms: "4 private", guests: "up to 10" },
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
        thibault: { role: "Founder &amp; Expedition Host", bio: "Thibault has called Mexico home since 2016. After seven years scaling tech ventures in Mexico City, he turned his energy toward what always mattered most: adventure, human connection and the power of the sea. He is building Eagle Ray one trusted relationship at a time, bringing together sea people who share the same warmth, curiosity and instinct for life at sea." },
        alexis: { role: "Expedition Leader — Scuba", bio: "Thibault met Alexis in Chile when they were five years old. Today, Alexis leads Eagle Ray underwater — an international scuba instructor with five-star hospitality in his reflexes, honed at Ritz-Carlton and Mandarin Oriental. He reads a table the way he reads a dive site: quickly, quietly, before anyone else notices. They call him the Pirate, and he earned it. He knows which hidden cove to choose, which story belongs at dinner, and when silence says more. With Alexis aboard, exceptional dives tend to end in long French dinners, good wine and the kind of moments that become crew legend." },
        benji: { role: "Captain", bio: "Benji spent eight years running industrial and energy operations before trading project sites for the helm. The civil engineer never disappeared: he reads weather routing like a systems map and notices what the boat needs before it asks. While everyone watches the horizon, Benji has already cleared the way for the next adventure." },
        adly: { role: "Expedition Leader — Kite &amp; Scuba", bio: "Thibault met Adly while learning to kite in La Ventana, Mexico's legendary wind playground. Originally from Egypt, Adly soon invited him to return the favor on the Red Sea. An engineer by training, he is now an IKO kite instructor and PADI scuba instructor with 1,500+ dives, 80+ students and boat-crew experience across four continents. Adly reads wind, current and group energy in the same glance. He knows when to push for one more dive — and when doing absolutely nothing at anchor is exactly the adventure everyone needs." },
        antoine: { role: "Gold Chef", bio: "Antoine has spent 15+ years cooking aboard boats and superyachts, including as a private chef for senior executives. He knows exacting standards, tiny galleys and saltwater appetites. His magic is restaurant technique made for the sea: precise without stiffness, generous without spectacle and served when the whole crew is ready to remember it." },
        ana: { role: "Silver Chef", bio: "Ana built her own pastry business from scratch, so she knows magic rarely arrives by accident. It lives in timing, texture and the extra detail nobody thought to request. On board, she cooks the same way: attentive, inventive and quietly generous — turning a simple breakfast into a ritual and dessert into the story told back on shore." },
        monique: { role: "Expedition Leader", bio: "Before she learned to read a boat full of divers, Monique spent years reading rooms in corporate marketing. Then the Brazilian dive instructor traded the office for Baja, where she has spent six years learning its water and people. She catches the current, hesitation and group mood early — without ever making guests feel managed." },
        juancarlos: { role: "Expedition Leader", bio: "Juan Carlos has been a dive instructor since he was 20, worked on liveaboards in the Revillagigedo Islands and sailed solo from Loreto to La Paz. He carries experience that never needs to announce itself. He knows when the water deserves respect and when a group is ready to go deeper. Around him, courage becomes contagious — never reckless." },
        lou: { role: "Captain &amp; Expedition Leader", bio: "Lou is a captain, kite specialist and freediver who has made Baja her home. She does not take over a boat's atmosphere; she changes it. Shoulders drop, breathing slows and nervous first-timers begin to belong. Lou reads the sea and people with the same grounded instinct, knowing when to add energy and when to make space." }
      },
      joiningTag: "Joining Q4 2026",
      javier: { role: "Captain &amp; Expedition Leader", bio: "Javier makes the ocean feel bigger. Yacht Master 200GT, PADI dive instructor, IKO kite instructor, freediving and spearfishing guide, and drone pilot — he can captain the boat, open the underwater world, find the wind and film it all. His real gift is confidence: guests stop watching adventure and start asking what comes next." },
      flavia: { role: "Chef, Hostess &amp; Stewardess", bio: "Flavia cooks, works the deck, trains people and films the day as it happens. On a small boat, that is not four jobs; it is one rare instinct for keeping life in motion. She knows what a hungry swimmer needs, how to lift the group at sunrise and when the camera should disappear. With Flavia aboard, everything flows." },
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
        ]
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
      title: "Nuestra flota. Un mismo estándar:<br><em>completamente privado, completamente tuyo.</em>",
      customizeBtn: "Personalizar mi expedición",
      baydreamer: { name: "Bay Dreamer", tagline: "Icon Charter — Lagoon 450F", desc: "4 camarotes, 8 plazas, 4 baños. Flybridge, Starlink, planta potabilizadora — pensado para grupos que quieren espacio y comodidad a partes iguales.",
        length: "13.72 m", cabins: "4 dobles", bathrooms: "4 privados", guests: "hasta 8" },
      goodmedicine: { name: "Good Medicine", tagline: "Good Medicine La Paz — Lagoon 42", desc: "3 camarotes, 6 plazas, 3 baños. Suite del propietario, energía solar, servicio de chef a bordo. Un estilo boutique para grupos más pequeños.",
        length: "12.80 m", cabins: "3 dobles", bathrooms: "3 privados", guests: "hasta 6" },
      starofbaja: { name: "Star of Baja", tagline: "West Coast Multihulls — Fountaine Pajot Astrea 42", desc: "4 camarotes, 8 plazas, 4 baños. Timón elevado, doble solárium — un diseño refinado para quien busca un estilo más de diseño.",
        length: "12.80 m", cabins: "4 dobles", bathrooms: "4 privados", guests: "hasta 8" },
      moorings4500l: { name: "Moorings 4500L", tagline: "The Moorings — Leopard 45, catamarán de vela", desc: "4 camarotes, 8 plazas, 4 baños. Salón en el flybridge, energía solar, planta potabilizadora — pensado para grupos que quieren la sensación clásica de navegar a vela con espacio de sobra.",
        length: "13.72 m", cabins: "4 dobles", bathrooms: "4 privados", guests: "hasta 10" },
      moorings464pc: { name: "Moorings 464PC", tagline: "The Moorings — Leopard 46, catamarán a motor", desc: "4 camarotes, 8 plazas, 4 baños. Timón en el flybridge con barra, luces subacuáticas — para grupos que quieren cubrir más distancia sin renunciar a la comodidad.",
        length: "14.02 m", cabins: "4 dobles", bathrooms: "4 privados", guests: "hasta 10" },
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
        thibault: { role: "Fundador y Expedition Host", bio: "Thibault vive en México desde 2016. Después de siete años impulsando empresas tecnológicas en Ciudad de México, decidió dedicar su energía a lo que siempre fue más importante: la aventura, las conexiones humanas y el poder del mar. Construye Eagle Ray relación a relación, reuniendo a gente de mar que comparte la misma calidez, curiosidad e instinto." },
        alexis: { role: "Líder de Expedición — Buceo", bio: "Thibault conoció a Alexis en Chile cuando ambos tenían cinco años. Hoy, Alexis dirige Eagle Ray bajo la superficie — un instructor internacional de buceo con la hospitalidad de cinco estrellas en los reflejos, perfeccionada en Ritz-Carlton y Mandarin Oriental. Lee una mesa como lee un punto de inmersión: rápido, en silencio y antes de que los demás lo noten. Lo llaman el Pirata, y se ha ganado el apodo. Sabe qué cala escondida elegir, qué historia merece contarse durante la cena y cuándo el silencio dice más. Con Alexis a bordo, las inmersiones excepcionales suelen terminar en largas cenas francesas, buen vino y momentos que se convierten en leyenda de la tripulación." },
        benji: { role: "Capitán", bio: "Benji pasó ocho años dirigiendo operaciones industriales y energéticas antes de cambiar los proyectos por el timón. El ingeniero civil nunca desapareció: lee las rutas meteorológicas como un mapa de sistemas y detecta lo que necesita el barco antes de que lo pida. Mientras los demás miran el horizonte, Benji ya ha despejado el camino." },
        adly: { role: "Líder de Expedición — Kite y Buceo", bio: "Thibault conoció a Adly mientras aprendía kite en La Ventana, el legendario patio de juegos del viento en México. Originario de Egipto, Adly pronto lo invitó a devolverle la visita en el Mar Rojo. Ingeniero de formación, hoy es instructor IKO y PADI, con más de 1.500 inmersiones, más de 80 alumnos y experiencia como tripulante en cuatro continentes. Adly lee el viento, la corriente y la energía del grupo de una sola mirada. Sabe cuándo impulsar una inmersión más — y cuándo no hacer nada fondeados es justo la aventura que todos necesitan." },
        antoine: { role: "Chef Gold", bio: "Antoine lleva más de quince años cocinando en barcos y superyates, incluso como chef privado para altos ejecutivos. Conoce los estándares exigentes, las cocinas diminutas y el apetito del mar. Su magia es técnica gastronómica hecha para navegar: precisa sin rigidez, generosa sin espectáculo y servida cuando toda la tripulación está lista para recordarla." },
        ana: { role: "Chef Silver", bio: "Ana creó su propio negocio de repostería desde cero, así que sabe que la magia rara vez aparece por accidente. Vive en el punto exacto, la textura y el detalle que nadie pensó en pedir. A bordo cocina con la misma atención, convirtiendo un desayuno en ritual y un postre en la historia que se cuenta al volver a tierra." },
        monique: { role: "Líder de Expedición", bio: "Antes de leer un barco lleno de buceadores, Monique pasó años leyendo salas en marketing corporativo. Después, esta instructora brasileña cambió la oficina por Baja, donde lleva seis años conociendo sus aguas y su gente. Detecta pronto la corriente, la duda y el ánimo del grupo, sin hacer que los invitados se sientan dirigidos." },
        juancarlos: { role: "Líder de Expedición", bio: "Juan Carlos es instructor de buceo desde los veinte años, trabajó en liveaboards de las islas Revillagigedo y navegó solo de Loreto a La Paz. Lleva una experiencia que nunca necesita anunciarse. Sabe cuándo el agua exige respeto y cuándo un grupo está preparado para bajar más profundo. Cerca de él, el valor se vuelve contagioso — nunca temerario." },
        lou: { role: "Capitana y Líder de Expedición", bio: "Lou es capitana, especialista en kite y apneísta, y ha hecho de Baja su hogar. No se adueña del ambiente del barco: lo transforma. Los hombros se relajan, la respiración se calma y los novatos encuentran su lugar. Lou lee el mar y a las personas con el mismo instinto, sabiendo cuándo aportar energía y cuándo dejar espacio." }
      },
      joiningTag: "Se incorporan en Q4 2026",
      javier: { role: "Capitán y Líder de Expedición", bio: "Javier hace que el océano parezca aún más grande. Yacht Master 200GT, instructor PADI e IKO, guía de apnea y pesca submarina, y piloto de dron — puede capitanear el barco, abrir el mundo submarino, encontrar el viento y filmarlo todo. Su verdadero don es transmitir confianza: los invitados dejan de mirar y preguntan qué viene después." },
      flavia: { role: "Chef, Anfitriona y Camarera", bio: "Flavia cocina, trabaja en cubierta, entrena a los demás y filma el día mientras sucede. En un barco pequeño no son cuatro trabajos: es un instinto poco común para mantener la vida en movimiento. Sabe lo que necesita un nadador hambriento, cómo despertar al grupo al amanecer y cuándo debe desaparecer la cámara. Con ella, todo fluye." },
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
        ]
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
      title: "Notre flotte. Un seul principe :<br><em>entièrement privé, entièrement à vous.</em>",
      customizeBtn: "Personnaliser mon expédition",
      baydreamer: { name: "Bay Dreamer", tagline: "Icon Charter — Lagoon 450F", desc: "4 cabines, 8 couchages, 4 salles de bain. Flybridge, Starlink, dessalinisateur — pensé pour les groupes qui veulent autant d'espace que de confort.",
        length: "13,72 m", cabins: "4 doubles", bathrooms: "4 privées", guests: "jusqu'à 8" },
      goodmedicine: { name: "Good Medicine", tagline: "Good Medicine La Paz — Lagoon 42", desc: "3 cabines, 6 couchages, 3 salles de bain. Suite armateur, énergie solaire, service de chef à bord. Un esprit boutique pour les groupes plus restreints.",
        length: "12,80 m", cabins: "3 doubles", bathrooms: "3 privées", guests: "jusqu'à 6" },
      starofbaja: { name: "Star of Baja", tagline: "West Coast Multihulls — Fountaine Pajot Astrea 42", desc: "4 cabines, 8 couchages, 4 salles de bain. Poste de barre surélevé, double bain de soleil — un design raffiné pour une ambiance plus design.",
        length: "12,80 m", cabins: "4 doubles", bathrooms: "4 privées", guests: "jusqu'à 8" },
      moorings4500l: { name: "Moorings 4500L", tagline: "The Moorings — Leopard 45, catamaran à voile", desc: "4 cabines, 8 couchages, 4 salles de bain. Salon sur le flybridge, énergie solaire, dessalinisateur — pensé pour les groupes qui veulent une vraie sensation de voile avec de la place pour respirer.",
        length: "13,72 m", cabins: "4 doubles", bathrooms: "4 privées", guests: "jusqu'à 10" },
      moorings464pc: { name: "Moorings 464PC", tagline: "The Moorings — Leopard 46, catamaran à moteur", desc: "4 cabines, 8 couchages, 4 salles de bain. Poste de barre sur le flybridge avec bar, éclairage sous-marin — pour les groupes qui veulent couvrir plus de distance sans sacrifier le confort.",
        length: "14,02 m", cabins: "4 doubles", bathrooms: "4 privées", guests: "jusqu'à 10" },
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
        thibault: { role: "Fondateur &amp; Expedition Host", bio: "Thibault vit au Mexique depuis 2016. Après sept années passées à développer des entreprises technologiques à Mexico, il a choisi de consacrer son énergie à ce qui a toujours compté le plus : l'aventure, les rencontres humaines et la puissance de la mer. Il construit Eagle Ray relation après relation, en réunissant des gens de mer qui partagent la même chaleur, la même curiosité et le même instinct." },
        alexis: { role: "Leader d'expédition — Plongée", bio: "Thibault a rencontré Alexis au Chili alors qu'ils n'avaient que cinq ans. Aujourd'hui, Alexis mène Eagle Ray sous la surface — un instructeur de plongée international dont les réflexes d'hospitalité cinq étoiles se sont affûtés au Ritz-Carlton et au Mandarin Oriental. Il lit une table comme il lit un site de plongée : vite, sans bruit, avant que les autres ne s'en aperçoivent. On l'appelle le Pirate, et il a mérité ce surnom. Il sait quelle crique secrète choisir, quelle histoire mérite d'être racontée à dîner et quand le silence en dit davantage. Avec Alexis à bord, les plongées d'exception finissent souvent en longs dîners à la française, autour d'un bon vin, et en moments qui entrent dans la légende de l'équipage." },
        benji: { role: "Capitaine", bio: "Benji a dirigé pendant huit ans des opérations industrielles et énergétiques avant de troquer les chantiers pour la barre. L'ingénieur civil n'a jamais disparu : il lit les routages météo comme un système et remarque les besoins du bateau avant même qu'il ne les exprime. Pendant que les autres regardent l'horizon, Benji a déjà ouvert la voie." },
        adly: { role: "Leader d'expédition — Kite &amp; Plongée", bio: "Thibault a rencontré Adly en apprenant le kite à La Ventana, terrain de jeu légendaire du vent au Mexique. Originaire d'Égypte, Adly l'a bientôt invité à lui rendre la pareille sur la mer Rouge. Ingénieur de formation, il est aujourd'hui instructeur IKO et PADI, avec plus de 1 500 plongées, plus de 80 élèves et une expérience d'équipage sur quatre continents. Adly lit le vent, le courant et l'énergie du groupe d'un même regard. Il sait quand pousser pour une plongée de plus — et quand ne rien faire au mouillage est exactement l'aventure dont tout le monde a besoin." },
        antoine: { role: "Chef Gold", bio: "Antoine cuisine depuis plus de quinze ans à bord de bateaux et de superyachts, notamment comme chef privé pour de grands dirigeants. Il connaît les standards exigeants, les cuisines minuscules et l'appétit creusé par la mer. Sa magie : une technique gastronomique faite pour le large, précise sans raideur et généreuse sans spectacle." },
        ana: { role: "Chef Silver", bio: "Ana a créé sa propre pâtisserie à partir de rien ; elle sait donc que la magie arrive rarement par hasard. Elle vit dans le timing, la texture et le détail que personne n'avait pensé à demander. À bord, elle cuisine avec la même attention, transformant un petit-déjeuner en rituel et un dessert en histoire racontée à terre." },
        monique: { role: "Leader d'expédition", bio: "Avant de lire un bateau rempli de plongeurs, Monique a passé des années à décoder les salles de réunion du marketing. Puis cette instructrice brésilienne a troqué le bureau pour la Baja, où elle apprend depuis six ans à connaître ses eaux et ses habitants. Elle repère très tôt le courant, l'hésitation et l'humeur du groupe, sans jamais donner l'impression de diriger." },
        juancarlos: { role: "Leader d'expédition", bio: "Juan Carlos est instructeur de plongée depuis ses vingt ans, a travaillé sur des liveaboards aux îles Revillagigedo et navigué seul de Loreto à La Paz. Il porte une expérience qui n'a jamais besoin de s'annoncer. Il sait quand l'eau exige du respect et quand un groupe est prêt à aller plus profond. Près de lui, le courage devient contagieux — jamais téméraire." },
        lou: { role: "Capitaine &amp; Leader d'expédition", bio: "Lou est capitaine, spécialiste du kite et apnéiste ; elle a fait de la Baja sa maison. Elle ne prend pas le contrôle de l'atmosphère d'un bateau : elle la transforme. Les épaules se détendent, le souffle ralentit et les novices trouvent leur place. Lou lit la mer et les gens avec le même instinct, sachant quand apporter de l'énergie ou laisser de l'espace." }
      },
      joiningTag: "Rejoignent l'équipe au Q4 2026",
      javier: { role: "Capitaine &amp; Leader d'expédition", bio: "Javier agrandit encore l'océan. Yacht Master 200GT, instructeur PADI et IKO, guide d'apnée et de chasse sous-marine, et pilote de drone — il peut mener le bateau, ouvrir le monde sous-marin, trouver le vent et tout filmer. Son vrai talent est de donner confiance : les invités cessent de regarder l'aventure et demandent ce qui vient ensuite." },
      flavia: { role: "Chef, Hôtesse &amp; Stewardess", bio: "Flavia cuisine, travaille sur le pont, entraîne les autres et filme la journée au fil de l'eau. Sur un petit bateau, ce ne sont pas quatre métiers : c'est un instinct rare pour maintenir la vie en mouvement. Elle sait ce dont un nageur affamé a besoin, comment réveiller le groupe au lever du soleil et quand la caméra doit disparaître. Avec elle, tout devient fluide." },
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
