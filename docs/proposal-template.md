# Private proposals: the one template

Every proposal for a client (a family, an agency's group, a special trip) is a document in **Private proposals** in the editor (`/admin/index.html`). One template, one design: full-screen opening photo, navy and off-white, Open Sans, big photos, a lot of air. It is opened from WhatsApp, so it is built for the phone first.

## Where it lives

- Content: `content/groupProposal/<language>/<name>.json` (one file per proposal, in the client's language: `en`, `es` or `fr`).
- Page: `/<language>/proposals/<name>/`, for example `/es/proposals/antoine-hurel-dic-2026-54c2a2b8ce58/`.
- Private: `noindex`, not in the menu, not in the sitemap. **The long random end of the file name is the only key.** Always add one (for example `-54c2a2b8ce58`). Anyone with the link can open it.

## How to make a new one

Tina cannot duplicate a document. Ask the assistant: give the client, the dates, the boat or boats with prices, who goes, the language, and the booking link. It copies an existing proposal and changes only those things. Or create a new document in the editor and fill in the sections you need.

## Every section is optional

Leave a section empty and it does not appear. The order on the page is fixed: opening photo, notice (limited places, expiry), the brief with key facts, who we are, a full-screen day, the days, day by day, the route map, extra activities, the boats with the price and how to book, food, what is aboard, the crew, good to know, questions, the closing with the booking button, small print.

## Boats

- One boat: a single panel, with the boat's name as the title.
- Two or more: tabs above the panels. Put the recommended boat first and give it a tag (for example "Recommended").
- Each boat has its own photos (the first is the big photo), key facts, features, cabin plan and price box.
- "How to book" is shared and sits right under the price. Write each term as `Label: details`; the label is the dropdown's title.

## The booking button

At the bottom. If you write a link in **Button link** (for example the Mogu checkout page), the button goes there; if you leave it empty, it opens WhatsApp with the message you wrote. The opening-photo button can go to the same link, or to `#boat` to scroll to the boats.

## Photos

Photo lists keep their empty slots: an empty slot shows as a grey box you can click in the editor to add a photo. Rows are always full (5 photos are 3 on top and 2 below). Do not use photos that show another operator's name or logo.

## Language

All texts come from the document, so a French or Spanish proposal needs no code. The small labels from the site (for example "Meet Alexis") come from the Crew section of the site in that language. Proposals are not part of `/translate`: do not run it expecting proposals to be translated.

## Careful when editing

After the site is updated, **reload the editor (F5) before editing**. A tab opened before an update does not know the new fields, and saving from it can delete them.
