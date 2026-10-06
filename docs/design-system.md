# Eagle Ray design system (Layer 1: tokens and rules)

This is the look of the Eagle Ray site, written down so new designs and new pages match it. It covers the colours, type, spacing, buttons and heroes. It does not include components. Those come in a later layer (see "What is not here").

Who reads this: Claude Design, when it builds a new design, and anyone building a new page with the AI assistant (see `AGENTS.md`).

## Files

| File | What it is | Edit it? |
| --- | --- | --- |
| `design-system/styles.css` | Plain CSS: every token as a `--variable` on `:root`, the keyframes, and the base rules. Works without Tailwind. | No. It is generated. |
| `design-system/base.css` | The hand-written base rules and the Google Fonts import. | Yes |
| `scripts/build-design-system.mjs` | Builds `styles.css` from the site's Tailwind theme. | Only to fix the build |
| `src/styles/global.css` | The Tailwind theme. This is where tokens are defined. | Yes, this is the source |

To change a token: edit `src/styles/global.css`, then run `npm run design-system`. The site itself is unchanged by this step.

## Colours

The palette has three colours. Every other colour is one of these, at some opacity.

| Token | Value | Use |
| --- | --- | --- |
| `--color-ink` | `#0e1b2b` | Text, dark buttons, dark sections |
| `--color-ink-hover` | `#1b2f47` | Hover on a dark button, the only other solid colour |
| `--color-surface` | `#f7f6f1` | Light panels, card backgrounds, hover on ghost buttons |
| white | `#ffffff` | Page background, text on dark |

Opacity variants of ink are used for secondary text and borders:

| Use | Class | Value |
| --- | --- | --- |
| Body text | `text-ink/74` | ink at 74% |
| Muted text and labels | `text-ink/64` or `text-ink/52` | ink at 64% or 52% |
| Hairline borders | `border-ink/14` | ink at 14% |
| Stronger borders (ghost buttons) | `border-ink/26` | ink at 26% |
| Overlay on photos | `bg-ink/25`, `bg-ink/82` | see "Heroes" |

On dark photos and dark sections, use white at an opacity: `text-white/86` for the subheadline, `text-white/82` for kickers, `border-white/45` for outline buttons.

Do not add a new colour. If a design needs one, it is a token change in `global.css`, not a one-off value.

## Type

| Role | Family | Token | Size token |
| --- | --- | --- | --- |
| Headings (h1 to h4) | TASA Explorer, fallback Fraunces | `--font-display` | `--text-hero` (h1 on heroes), `--text-h2` (section titles) |
| Body | Inter | `--font-sans` | 16px, line-height 1.6 |
| Quotes and founder lines | Fraunces, italic | `--font-serif` | `--text-quote`, `--text-quote-lead` |
| Labels, kickers, data | JetBrains Mono, uppercase, tracked | `--font-mono` | 0.76rem, letter-spacing 0.14em |

Headings are weight 500, letter-spacing -0.01em, line-height 1.05, with balanced line wrapping. Mono labels are always uppercase.

Fluid sizes (`--text-*`) grow with the screen. Use them rather than fixed sizes:

- `--text-hero`: clamp from 2.2rem to 4.6rem
- `--text-h2`: clamp from 1.8rem to 3.1rem
- `--text-hero-sub`: clamp from 1rem to 1.2rem
- `--text-lede`: clamp from 0.96rem to 1.1rem

## Spacing and layout

| Token | Use |
| --- | --- |
| `--spacing-pad` | Side padding. Tailwind class `px-pad`, `pr-pad` |
| `--spacing-section` | Space above and below a section. Class `py-section` |
| `--spacing-section-head` | Space under a section heading |
| `--spacing-nav` (76px) | Height of the header on heroes. Class `h-nav` |
| `--spacing-nav-solid` | Height of the header once solid, and the top offset for pages with no hero |
| `--container-site` (1280px) | Maximum content width. Class `max-w-site` |
| `--rail` | Left rail on desktop, 84px from 1024px wide, 0 below. Set on `:root` |

The standard page gutter, which keeps content clear of the depth rail on desktop:

```
mx-auto max-w-site px-5 lg:pr-pad lg:pl-[calc(var(--spacing-pad)+var(--rail))]
```

Breakpoints are Tailwind's defaults only: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px, `2xl` 1536px. Do not add other breakpoints.

## Radius and motion

- Radius: `rounded-sm` 3px for tags and small labels, `rounded` 6px for buttons and inputs, `rounded-lg` 10px for cards.
- Easing: `ease-out` for entrances, `ease-soft` for hover and transitions, `ease-bounce` for playful moments. Buttons transition over `duration-500`.
- Scroll reveal: elements with `data-reveal` slide up 30px and fade in. They are visible with JavaScript off.
- Respect `prefers-reduced-motion`. Remove transforms and infinite animations for those users.

## Buttons

Two variants, and two contexts: `default` on light backgrounds, `hero` on photos and dark sections. The base is the same for every button:

```
inline-flex items-center justify-center gap-2 rounded px-7 py-4 text-sm font-medium
whitespace-normal text-center sm:whitespace-nowrap border border-transparent
transition duration-500 ease-soft disabled:opacity-35 disabled:pointer-events-none
```

| Variant | Context | Classes (added to the base) |
| --- | --- | --- |
| Primary | default | `bg-ink text-white hover:bg-ink-hover hover:-translate-y-0.5` |
| Primary | hero | `bg-white text-ink hover:bg-surface hover:-translate-y-0.5` |
| Ghost | default | `border-ink/26 text-ink hover:bg-surface hover:border-ink hover:-translate-y-0.5` |
| Ghost | hero | `border-white/45 text-white hover:bg-white/12 hover:border-white hover:-translate-y-0.5` |

Size: the default is `px-7 py-4 text-sm`. The small size is `px-5 py-2.5 text-xs`. Full width is `w-full`.

The site's button is `src/components/ui/Button.astro`. Use the same classes when building a design, so the look matches.

## Heroes

Every hero is a full-width photo with a dark gradient, the text in white at the bottom left, and the transparent header on top.

- Gradient over the photo: `bg-linear-to-b from-ink/25 via-ink/42 via-45% to-ink/82`
- Kicker: mono, uppercase, `text-white/82`
- Title: `font-display text-hero text-white`, `max-w-[20ch]`
- Subheadline: `text-hero-sub text-white/86`, `max-w-[50ch]`
- Text starts at the standard page gutter (see "Spacing and layout")

The shared hero is `src/components/ui/PageHero.astro`. Use it for any page that opens with a photo.

A page with no photo uses the light surface (`bg-surface`) with ink text, not a dark block with dark text. Dark text on a dark background is invisible.

## Cards and photos

- Cards: `rounded-lg border border-ink/14 bg-white`, hover lifts 3px with a soft shadow (`hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgb(14_27_43/0.14)]`).
- Photo ratios: 4:3 for a boat or a wide image, 3:2 for a crew card, square for an expedition tile, 4:5 for a tall portrait.
- Always `object-cover`. Every photo has alt text.
- Mono kicker above a card title, serif or display type for the title, and body text in `text-ink/64`.

## Writing rules

- Sentences are short. Headings say what the section is. Lists are for parallel items only.
- Labels are uppercase mono. Titles are sentence case.
- No emoji in the site copy.
- Spanish and French copy is longer than English. Leave room in buttons and headings; the button wraps on phones.

## Rules for the design agent and the assistant

1. Use the tokens. Never a raw hex value or a pixel size where a token exists.
2. Use the three colours and their ink opacities. Nothing else.
3. Use Tailwind's breakpoints only.
4. Buttons and heroes come from the recipes above. Do not invent a new button style.
5. A dark photo gets white text. A light background gets ink text.
6. Every visible text and photo is editable in the admin. Designs should show where the content comes from.

## What is not here (later layers)

- **Layer 2, components:** React or Preact versions of Button, PageHero, Card, SectionHeading, the modal and the slider, so designs can use the real parts. Not built yet.
- **Icons:** the site uses a few inline SVGs (arrows, the close mark, the sounder). There is no icon set yet.
- **Forms:** the funnel form is built from the site's own fieldsets. Its styles are in the site, not in this layer.
