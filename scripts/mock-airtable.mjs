/**
 * Minimal stand-in for the Airtable REST API, for local development before the
 * real base exists (and for checking VIP page changes without burning API
 * quota or exposing a live key).
 *
 *   node scripts/mock-airtable.mjs            # listens on :4400
 *
 * Then run Next with:
 *   AIRTABLE_API_KEY=mock \
 *   AIRTABLE_BASE_ID=appMock \
 *   AIRTABLE_ENDPOINT_URL=http://127.0.0.1:4400 \
 *   npm run dev
 *
 * The fixture below intentionally mirrors the field names in
 * lib/airtable-schema.ts — if you rename a field there, rename it here too or
 * this mock stops proving anything.
 */
import { createServer } from "node:http";

const PORT = Number(process.env.MOCK_PORT ?? 4400);

const PEOPLE = {
  recBXCc6cPKlklsII: {
    id: "recBXCc6cPKlklsII",
    fields: {
      Name: "Adly",
      Role: "Expedition Leader",
      Bio: "Between the wind of La Ventana and the water of the Sea of Cortez, this is home for me. I lead the days on the water and I read the group before the group reads itself — when to push for one more dive, and when the best call is to anchor and do nothing at all.",
      Photo: [
        {
          id: "attAdly",
          url: "https://v5.airtableusercontent.com/mock/adly.jpg",
          filename: "adly.jpg",
          size: 128000,
          type: "image/jpeg",
        },
      ],
    },
  },
  recnCvWJH5P0uTU3P: {
    id: "recnCvWJH5P0uTU3P",
    fields: {
      Name: "Denise",
      Role: "Captain",
      Bio: "I have spent years navigating the Sea of Cortez, and before that some of the most demanding private yachts in the world.",
      Photo: [],
    },
  },
};

const BOATS = {
  recEgZoQb0xISJoBm: {
    id: "recEgZoQb0xISJoBm",
    fields: {
      "Boat Name": "Bali 4.4",
      Model: "Bali 4.4 Catamaran",
      "Length m": 13.9,
      Cabins: 4,
      Berths: 10,
      Heads: 4,
      Year: 2024,
      Amenities: [
        "Dinghy with motor",
        "Snorkelling gear",
        "Paddleboards",
        "Solar + generator",
        "Shaded cockpit",
      ],
      Specs:
        "Your home on water. 4 double cabins, 4 private bathrooms, spacious indoor/outdoor living, 2024 model.",
      Photos: [
        {
          id: "attBoat1",
          url: "https://v5.airtableusercontent.com/mock/bali-exterior.jpg",
          filename: "bali-exterior.jpg",
          size: 240000,
          type: "image/jpeg",
        },
      ],
    },
  },
};

const EXPEDITIONS = {
  recngNbkyDiBABWrO: {
    id: "recngNbkyDiBABWrO",
    fields: {
      Title: "Espiritu Santo Focus",
      Destination: "Espiritu Santo · La Paz",
      "Ref Price": 12500,
      "Duration Days": 6,
      Summary:
        "Wildlife-first: sea lions at Los Islotes, mangrove channels by kayak, and the white-sand coves most people underestimate.",
      // Fallback links, used when the journey has no direct Leader/Boat.
      "People (Crew)": ["recnCvWJH5P0uTU3P"],
      Boats: ["recEgZoQb0xISJoBm"],
    },
  },
};

const JOURNEYS = [
  {
    id: "rec0T51HQBF5Q33Zw",
    fields: {
      Slug: "ingrid-baja",
      "Guest Name": "Ingrid",
      "Personalized Message":
        "You said you wanted the diving to lead and the schedule to follow. This is the version of Baja we would build for exactly that — six days out of La Paz, small group, and Adly reading the water each morning.",
      "Stripe Link": "https://buy.stripe.com/test_mock_deposit_link",
      "Deposit Amount USD": 1000,
      Status: "Lead Chaud",
      "Linked Expedition": ["recngNbkyDiBABWrO"],
      // Direct override: Adly, not Denise from the expedition.
      Leader: ["recBXCc6cPKlklsII"],
      Boat: ["recEgZoQb0xISJoBm"],
    },
  },
  {
    id: "recFallbackOnly00",
    fields: {
      Slug: "fallback-test",
      "Guest Name": "Fallback",
      "Personalized Message":
        "No direct Leader or Boat on this journey — both should resolve through the expedition.",
      "Linked Expedition": ["recngNbkyDiBABWrO"],
    },
  },
];

const TABLE_BY_ID = {
  People: PEOPLE,
  Boats: BOATS,
  Expeditions: EXPEDITIONS,
};

/** Pulls the value out of `{Slug} = "some-slug"`. */
function slugFromFormula(formula) {
  const match = /=\s*"((?:[^"\\]|\\.)*)"/.exec(formula ?? "");
  if (!match?.[1]) return null;
  return match[1].replace(/\\"/g, '"').replace(/\\\\/g, "\\");
}

const server = createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://127.0.0.1:${PORT}`);
  // /v0/{baseId}/{table}[/{recordId}]
  const [, , , table, recordId] = url.pathname.split("/");
  const send = (status, body) => {
    res.writeHead(status, { "content-type": "application/json" });
    res.end(JSON.stringify(body));
  };

  const decodedTable = decodeURIComponent(table ?? "");

  if (recordId) {
    const record = TABLE_BY_ID[decodedTable]?.[recordId];
    if (!record) return send(404, { error: { type: "NOT_FOUND" } });
    return send(200, { ...record, createdTime: new Date().toISOString() });
  }

  if (decodedTable === "CustomerJourneys") {
    const wanted = slugFromFormula(url.searchParams.get("filterByFormula"));
    const records = JOURNEYS.filter((j) => j.fields.Slug === wanted).map((r) => ({
      ...r,
      createdTime: new Date().toISOString(),
    }));
    return send(200, { records });
  }

  return send(200, { records: [] });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`mock airtable listening on http://127.0.0.1:${PORT}`);
  console.log(`try slug: ${JOURNEYS[0].fields.Slug}`);
});
