# Airtable setup — VIP expedition portal

The VIP pages at `/vip/[slug]` read from Airtable base **`appBul975ladoNceX`**
("Untitled Base" in *My First Workspace*).

Field names are matched as **exact, case-sensitive strings**, and Airtable
returns `undefined` for a name that doesn't exist rather than raising an error —
so a renamed column shows up as a blank section on a client's page, never as a
crash.

Every name the app relies on is declared in one place:
**`lib/airtable-schema.ts`**. If you rename a field in Airtable, rename it there
too. Run `npm run airtable:inspect` to print the base's real field names and
compare.

---

## 1. Current schema

The base is already built and populated with real Eagle Ray data (8 crew,
2 catamarans, 3 routes). This is what the app reads.

### `People`

| Field | Type | Used for |
|---|---|---|
| `Name` | Single line text | Hero badge and leader card |
| `Role` | Single select | Shown under the name |
| `Bio` | Long text | Leader card body — written in the first person |
| `Photo` | Attachment | Leader portrait (4:5 crops best) |
| `WhatsApp` | Phone | Not shown on the page; internal |

### `Boats`

| Field | Type | Used for |
|---|---|---|
| `Boat Name` | Single line text | Section heading |
| `Model` | Single line text | Spec grid |
| `Length m` | Number (2dp) | Spec grid |
| `Cabins` / `Berths` / `Heads` / `Year` | Number (0dp) | Spec grid |
| `Amenities` | Multiple select | Rendered as tags |
| `Photos` | Attachment | First is the section hero, the rest a grid |
| `Specs` | Long text | Free-text paragraph above the grid |

### `Expeditions`

| Field | Type | Used for |
|---|---|---|
| `Title` | Single line text | Internal reference |
| `Destination` | Single line text | Hero fact row |
| `Ref Price` | Currency | Hero fact row ("From") |
| `Duration Days` | Number (0dp) | Hero fact row |
| `Summary` | Long text | Paragraph under the hero |
| `People (Crew)` | Link → People | **Fallback** leader if the journey has none |
| `Boats` | Link → Boats | **Fallback** vessel if the journey has none |

### `CustomerJourneys`

One row per prospect. This is the table you add to.

| Field | Type | Used for |
|---|---|---|
| `Slug` | Single line text | **The URL.** See slug rules below |
| `Guest Name` | Single line text | Page title and WhatsApp preview |
| `Personalized Message` | Long text | The personal pitch under the hero |
| `Stripe Link` | URL | Deposit link. **Must be `https://`** or it is ignored |
| `Deposit Amount USD` | Number | Optional — defaults to 1000 |
| `Leader` | Link → People | Optional override |
| `Boat` | Link → Boats | Optional override |
| `Linked Expedition` | Link → Expeditions | Supplies destination, price, duration |
| `Status` | Single select | Your pipeline only; not rendered |

**Only `Slug` is strictly required.** Everything else degrades gracefully: a
journey with no boat renders without the vessel section rather than erroring.

### How leader and boat are resolved

The journey's own `Leader` / `Boat` links win. When they are empty, the app
falls back to the crew and vessel on the `Linked Expedition`. That is what lets
two guests on the same route see different leaders — set the override on the
journey when it matters, leave it blank to inherit the route's default.

---

## 2. Slug rules

The slug is the whole URL: `eaglerayexpeditions.com/vip/<slug>`.

These pages carry a named prospect and a personalised pitch. They are served
with `noindex, nofollow` so search engines never list them, but **anyone with
the link can open it** — there is no login. Treat the slug as the secret.

- Use something unguessable: `ingrid-baja-a7f3`, not `ingrid`.
- Never reuse a slug between clients.
- Changing the slug immediately invalidates the old link.

---

## 3. Create the API token

The MCP connector in Claude Code authenticates *you*; the deployed site needs
its own token.

1. Go to <https://airtable.com/create/tokens>.
2. Scopes: `data.records:read`. Add `schema.bases:read` if you want
   `npm run airtable:inspect` to print full field types.
3. Access: grant **this base only** — not "all current and future bases".
4. Copy the token (`pat...`). It is shown once.

Read-only by design: the site never writes to Airtable, so a leaked key cannot
corrupt your pipeline.

---

## 4. Environment variables

**Locally:**

```bash
cp .env.example .env.local
```

then fill it in. `.env.local` is gitignored — never commit it.

**On Vercel:** Settings → Environment Variables, for _Production_, _Preview_
and _Development_:

| Name | Value | Notes |
|---|---|---|
| `AIRTABLE_API_KEY` | `pat...` | **Secret.** Server-only, never reaches the browser |
| `AIRTABLE_BASE_ID` | `appBul975ladoNceX` | |
| `NEXT_PUBLIC_SITE_URL` | `https://eaglerayexpeditions.com` | Required — WhatsApp cannot resolve a relative OG image URL |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `525568090942` | Optional; this is the default |

`NEXT_PUBLIC_*` values are embedded in the client bundle and visible to anyone.
**Never** put the Airtable key behind that prefix.

After adding or changing any of these, **redeploy** — Next.js inlines
`NEXT_PUBLIC_*` at build time, so an existing deployment won't pick them up.

---

## 5. Verify

```bash
npm run airtable:inspect
```

Then, with the dev server running, open `/vip/ingrid-baja`.

To develop without touching the real base, use the mock — it mirrors the real
field names and data, including the expedition-fallback path:

```bash
node scripts/mock-airtable.mjs
```

and in another terminal:

```bash
AIRTABLE_API_KEY=mock AIRTABLE_BASE_ID=appMock AIRTABLE_ENDPOINT_URL=http://127.0.0.1:4400 npm run dev
```

Two fixture slugs: `ingrid-baja` (direct leader override) and `fallback-test`
(leader and boat inherited from the expedition).

---

## Outstanding

- **Photos are not uploaded yet.** `People.Photo` and `Boats.Photos` are empty,
  so the leader portrait and vessel gallery don't render. The crew and boat
  images already exist in `public/assets/img/` — upload them to Airtable, or
  see the note below.
- **Airtable attachment URLs expire.** Airtable serves attachments from signed
  `v5.airtableusercontent.com` URLs that stop working a couple of hours after
  they are issued.
  - *The WhatsApp preview is unaffected* — the Open Graph card is generated by
    `app/vip/[slug]/opengraph-image.tsx` and served from our own domain, so a
    link shared today still previews correctly next month.
  - *In-page photos* go through Next's image optimiser, which caches them. A
    cold cache after a URL expires can produce a missing image. If that shows up
    in practice, reference the images already in `public/assets/img/` by
    filename instead of hosting them on Airtable.
