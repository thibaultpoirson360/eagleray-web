# Tailwind Migration Audit: Eagle Ray Expeditions (homepage)

Scope: `styles.css` (2935 lines, the only stylesheet in the repo), `main.js`, `index.html`. Verified against Tailwind CSS 4.3.3 (`node_modules/tailwindcss/theme.css`, `preflight.css`, `dist/lib.mjs`).

Limits of this audit:
- I had no shell or browser. Everything is from reading source. Anything marked "(unverified)" needs a build or browser check.
- Line numbers are `styles.css` unless noted.
- "Homepage-live" means the class appears in `index.html` or is created by `main.js`.
- No `<style>` tags exist in any HTML file. The only inline styles in `index.html` are five `style=` attributes (L333, 363, 415, 424, 596).

---

## 0. Headline findings

1. CLAUDE.md's colour claim is loosely worded. Beyond `#0e1b2b` and `#ffffff` there are two solid colours, not one: `#f7f6f1` (`surface`, L33) and `#1b2f47` (L394). CLAUDE.md's own config lists both, so the prose "exactly one outlier" contradicts it. No other hex or rgb colours exist in the CSS or `index.html`, apart from `<meta theme-color>` (index.html L11) and the sounder canvas (JS, ink rgba only).
2. CLAUDE.md's token block has no `fontFamily`, no layout tokens (`--pad`, `--max`, `--rail`, `--nav-h`), no fluid clamp() sizes, and no keyframes. All are real and used (see §1).
3. CLAUDE.md's "6 sections" is not what `index.html` contains. There is a 7th `<section class="section final-cta">` (index.html L594-603), plus the footer and the `.nav-mobile` overlay (L74-84). `.final-cta` CSS is at L2592-2606.
4. The sounder threshold is confirmed as 1280px (L843). It is not only a visibility toggle. It also sets `--rail: 84px`, which adds left padding to `.container`, `.section`, `.nav`, `.hero` and `.footer` (L218, 311, 448, 861, 2612). Moving to `lg:` must move the rail with it. CLAUDE.md never mentions `--rail`.
5. Preflight and the v4 rename of `rounded` interact badly with the locked token block. Bare `rounded` in v4 resolves from `--radius`, and Tailwind's default is 0.25rem (4px), not 6px. A `DEFAULT` key does not exist in v4. See §2b.
6. Several `main.js` inits are no-ops on this page. The markup does not exist for the splash (`[data-splash]`), fauna, rutas, manifest, or FAQ. Verified by grep of `index.html`.
7. Existing visual bugs in the current CSS are listed in §2c. They need a keep-or-fix decision before porting.

---

## 1. Verified design tokens and `@theme` block

### 1a. Colours (complete list)

Solids:

| Value | Source | Tailwind |
|---|---|---|
| `#0e1b2b` | `--ink` L34 | `ink` |
| `#ffffff` | `--bg` and `--on-ink` L32, L37 | built-in `white` |
| `#f7f6f1` | `--surface` L33 | `surface` |
| `#1b2f47` | `.btn-primary:hover` L394, the only use | `ink-hover` |

Ink alpha variants (`rgba(14,27,43,a)`):

| Old token | Alpha | Utility |
|---|---|---|
| `--ink-2` | .74 | `/74` |
| `--mute` | .52 | `/52` |
| `--line` | .14 | `/14` |
| `--line-2` | .08 | `/8` |
| `--line-strong` | .26 | `/26` |
| hero scrim, L918 | .25 / .42 at 45% / .82 | `from-ink/25 via-ink/42 via-45% to-ink/82` |
| ping keyframes (dead) | .6 / .55 / 0 | n/a |
| tilt shadow (commented out, L2765) | .28 | n/a |
| fauna gradient (dead, L1291) | .85 | n/a |
| sounder canvas (JS, `main.js` L227-258) | .55, .22, .75, .08, .6, 1 | stays in JS |

White alpha variants:

| Alpha | Where |
|---|---|
| .9 | solid nav bg (L463) |
| .72 | nav muted (L455) |
| .7 | `.lang-switch-mobile`, dead (L605) |
| .6 | `.nav-mobile a i` (L676); `.hero-facts dt`, dead |
| .55 | `.nav-mobile-foot`, loses the cascade, see §2c |
| .82 | `.hero-meta` |
| .86 | `.hero-sub` |
| .45 | ghost hero border, scroll-cue border |
| .35 | nav line, `.nav-mobile .nav-cta`, spinner track |
| .28 | `.hero-facts` border, dead |
| .12 | ghost hero hover bg |
| .75 | fauna caption, dead |

Non-alpha uses of the `opacity` property. These are NOT colour alphas and must not be merged with the alphas above:

| Value | Where |
|---|---|
| .92 | `.lede` (L283) and `.section-intro` (L327), on top of the .74 colour |
| .7 | `.sounder-unit` |
| .25 | `.founder-quote-mark` |
| .95 | footer logos |
| .8 | `.footer-legal`, `.field-optional` |
| .35 | `.btn[disabled]` |
| .7 | `[data-funnel-submit][disabled]` (L2485-2488) |
| .4-1 | hero dot pulse |
| .3-1 | splash line (dead) |

### 1b. Fonts

| Var | Stack (L42-45) | Homepage use |
|---|---|---|
| `--display` | "TASA Explorer", "Fraunces", Georgia, serif | h1-h4 base (L148), hero title, card h3, legend, `.step-input`, footer claim/links, `.nav-mobile a` |
| `--serif` | "Fraunces", Georgia, serif | only `.vs-axis` and `.founder-quote-*` |
| `--sans` | "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif | body |
| `--mono` | "JetBrains Mono", ui-monospace, "SFMono-Regular", Menlo, monospace | kickers, labels, meta, small caps text |

- Fonts load from Google Fonts links in `index.html` L22-24. Weights loaded: Fraunces normal 300/500 and italic 400/500, Inter 300-600, JetBrains Mono 400/500, TASA 400-800.
- The `@font-face "TASA Explorer"` at L62-67 has no `src`. Browsers drop it, so it does nothing. TASA actually comes from the Google link (index.html L24).
- Weights used: 500 (headings, `.btn`, strong) and 600 (`.skip-link`, error text).
- `.nav-mobile a` is italic TASA. Whether TASA has an italic face on Google Fonts is unknown to me, so it may be faux-italic (unverified).

### 1c. Radius, layout, z-index, shadows

Radius:

| Var | Value | Default Tailwind |
|---|---|---|
| `--r-sm` | 3px | `sm` = 4px |
| `--r` | 6px | `md` = 6px (matches), bare `rounded` = 4px |
| `--r-lg` | 10px | `lg` = 8px |

Also used: `50%` and `999px` (become `rounded-full`), and a hard-coded `4px` on the global `:focus-visible` (L167).

Layout vars:

| Var | Value |
|---|---|
| `--pad` | `clamp(1.25rem, 5vw, 3.5rem)` |
| `--max` | 1280px (= `80rem` = `max-w-7xl`) |
| `--rail` | 0px, 84px at ≥1280 (L53, L845) |
| `--nav-h` | 84px; solid state is `calc(84px - 12px)` = 72px (L467) |

Other container and size values:

| Value | Where |
|---|---|
| 780px | `.customize-inner` |
| 60rem | `.founder-quote blockquote` |
| 550px / 620px | boat / crew card widths, `min(100vw, …)` |
| 210px | crew photo column |
| 300px | wildlife image height |
| 84px | sounder width |
| ch widths | 20ch (hero title), 50ch (hero sub), 58ch (lede) |

z-index:

| Value | Where |
|---|---|
| -3 | `.hero-bg` |
| 1-2 | fauna caption (dead), crew tag |
| 40 | sounder |
| 99 | nav-mobile |
| 100 | nav |
| 101 | nav-toggle |
| 999 | skip-link |
| 10000 | splash (dead) |

Shadows: no shadow tokens exist. The only live `box-shadow` is `0 1px 0 var(--line)` on the solid nav (L466). The others are ping (dead) and the tilt hover shadow (commented out, L2763-2766).

### 1d. Easings

| Token | Value | Status |
|---|---|---|
| `--ease-out` | `cubic-bezier(.16,1,.3,1)` | live, used ~30 times |
| `--ease-soft` | `cubic-bezier(.25,.46,.45,.94)` | live |
| `--ease-bounce` | `cubic-bezier(.34,1.56,.64,1)` | **dead**: only the declaration at L58, never referenced |

Raw keywords also appear: `ease-in-out` (hero zoom, pulseDot, scrollCue, splashPulse) and `linear` (spin). `.btn` background, colour and border transitions use the default `ease`, not one of the tokens.

### 1e. Fluid clamp() values (live on the homepage)

| Where | Value |
|---|---|
| `--pad` | `clamp(1.25rem, 5vw, 3.5rem)` |
| `.h2` L267 | `clamp(2.1rem, 4.8vw, 3.7rem)` |
| `.lede` L280 | `clamp(1.04rem, 1.6vw, 1.24rem)` |
| `.section` block padding L310 | `clamp(4.5rem, 10vw, 7.5rem)` |
| `.section-head` margin-bottom L316 | `clamp(2.6rem, 6vw, 4.5rem)` |
| `.hero-inner` bottom padding L924 | `clamp(4rem, 10vw, 6rem)` |
| `.hero-title` L970 | `clamp(2.2rem, 5.6vw, 4.6rem)` |
| `.hero-sub` L976 | `clamp(1rem, 1.6vw, 1.2rem)` |
| `.founder-quote` margin-top and padding-block L1199, 1202 | `clamp(3rem, 8vw, 5rem)` |
| `.founder-quote-kicker` L1209 | `clamp(1.4rem, 3vw, 2rem)` |
| `.founder-quote blockquote p` L1231 | `clamp(1.3rem, 3vw, 2rem)` |
| `.nav-mobile a` L665 | `clamp(1.5rem, 7vw, 2rem)` |
| `.funnel` padding L2148 | `clamp(1.6rem, 4vw, 2.8rem)` |
| `.fstep legend` L2218 | `clamp(1.3rem, 3.2vw, 1.9rem)` |
| `.footer` top padding L2611 | `clamp(4rem, 10vh, 6rem)` (uses `vh`, not `vw`) |
| `.footer-claim` L2643 | `clamp(1.4rem, 2.8vw, 2rem)` |
| `.footer-big` L2657 | `clamp(1.3rem, 3vw, 1.8rem)` |

Dead clamps: `.ruta-name`, `.quote-crew`, `.trust-line`, `.faq summary`.

Micro font sizes have no Tailwind scale equivalent. Live sizes in rem:

.58, .62, .66, .68, .72, .76, .78, .8, .82, .84, .85, .86, .88, .92, .95, 1, 1.2, 1.4, 1.5, 1.6, 2.4 and 5.

Recommendation: use arbitrary values such as `text-[.62rem]` for the mono micro-labels rather than tokenising each one.

Letter-spacing values used: -.02, -.01, .01, .04, .06, .1, .12, .13, .14, .16 (em).

### 1f. Keyframes

Live:
- `pulseDot` (L956, hero dot)
- `scrollCue` (L1066)
- `stepIn` (L2204)
- `spin` (L2506)
- `drawCheck` (L2562)
- `heroAmbientZoom` (L902). This one only ever displays under `prefers-reduced-motion`, because the `img` is `display:none` otherwise.

Dead: `ping` (L246, and `.kicker .dot` is not in the markup), `splashSafety`, `splashPulse`, `faqIn`, and the three `@property --mesh-*` at L11-27.

### 1g. Ready-to-paste `@theme` (Tailwind 4.3.3, CSS-first)

```css
@import "tailwindcss";

/* Only needed if the JS state hooks are used as variants (see §3, X-list) */
@custom-variant js (.js &);
@custom-variant no-js (html:not(.js) &);

@theme {
  /* ---- colours (namespace --color-*) ---- */
  --color-ink: #0e1b2b;
  --color-ink-hover: #1b2f47;   /* only outlier: btn-primary hover */
  --color-surface: #f7f6f1;
  /* white = built-in --color-white (#fff). Old --ink-2/--mute/--line* = ink/74, /52, /14, /8, /26 */

  /* ---- fonts (namespace --font-*) ---- */
  --font-display: "TASA Explorer", "Fraunces", Georgia, serif;
  --font-serif: "Fraunces", Georgia, serif;
  --font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, "SFMono-Regular", Menlo, monospace;

  /* ---- radius (namespace --radius-*) ---- */
  --radius-sm: 3px;
  --radius: 6px;        /* REQUIRED: bare `rounded` reads --radius; Tailwind default is 0.25rem (4px) */
  --radius-md: 6px;     /* explicit alias of the same 6px, safer than bare `rounded` */
  --radius-lg: 10px;

  /* ---- easing (namespace --ease-*) ---- */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);   /* NOTE: overrides Tailwind's built-in ease-out (0,0,.2,1) */
  --ease-soft: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  /* --ease-bounce intentionally omitted: dead (never referenced). Add back only if a component needs it. */

  /* ---- layout (spacing / container namespaces) ---- */
  --spacing-pad: clamp(1.25rem, 5vw, 3.5rem);     /* px-pad, -mx-pad, pl-pad */
  --spacing-nav: 84px;                            /* h-nav; solid state = 72px */
  --spacing-section: clamp(4.5rem, 10vw, 7.5rem); /* py-section */
  --spacing-section-head: clamp(2.6rem, 6vw, 4.5rem);
  --spacing-hero-b: clamp(4rem, 10vw, 6rem);
  --spacing-quote: clamp(3rem, 8vw, 5rem);
  --spacing-funnel: clamp(1.6rem, 4vw, 2.8rem);
  --spacing-footer-t: clamp(4rem, 10vh, 6rem);
  --container-site: 80rem;                        /* max-w-site = 1280px */
  --container-form: 780px;                        /* .customize-inner */

  /* ---- fluid type (namespace --text-*) ---- */
  --text-h2: clamp(2.1rem, 4.8vw, 3.7rem);
  --text-hero: clamp(2.2rem, 5.6vw, 4.6rem);
  --text-lede: clamp(1.04rem, 1.6vw, 1.24rem);
  --text-hero-sub: clamp(1rem, 1.6vw, 1.2rem);
  --text-quote-lead: clamp(1.4rem, 3vw, 2rem);    /* founder kicker */
  --text-quote: clamp(1.3rem, 3vw, 2rem);
  --text-legend: clamp(1.3rem, 3.2vw, 1.9rem);
  --text-footer-claim: clamp(1.4rem, 2.8vw, 2rem);
  --text-footer-big: clamp(1.3rem, 3vw, 1.8rem);
  --text-nav-mobile: clamp(1.5rem, 7vw, 2rem);

  /* ---- animations (namespace --animate-*; keyframes inside @theme) ---- */
  --animate-pulse-dot: pulse-dot 2.4s ease-in-out infinite;
  --animate-scroll-cue: scroll-cue 1.8s ease-in-out infinite;
  --animate-step-in: step-in 0.5s var(--ease-soft) both;
  --animate-draw-check: draw-check 0.6s var(--ease-out) 0.1s forwards;
  --animate-hero-zoom: hero-zoom 34s ease-in-out infinite;
  --animate-spin-fast: spin 0.8s linear infinite;   /* reuses Tailwind's built-in `spin` keyframes */

  @keyframes pulse-dot { 0%,100% { opacity: .4 } 50% { opacity: 1 } }
  @keyframes scroll-cue {
    0% { transform: translateY(0); opacity: 1 }
    70% { opacity: 0 }
    100% { transform: translateY(14px); opacity: 0 }
  }
  @keyframes step-in { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
  @keyframes draw-check { to { stroke-dashoffset: 0 } }
  @keyframes hero-zoom {
    0%,100% { transform: scale(1.04) translate3d(0,0,0) }
    50% { transform: scale(1.13) translate3d(-1%,-1%,0) }
  }
}

/* Non-theme runtime vars (JS/media driven, so kept out of @theme) */
:root { --rail: 0px; }
@media (min-width: 64rem) { :root { --rail: 84px; } }  /* was 1280px; see §5. Consider gating on .js */
```

Do not declare `--breakpoint-*`. Tailwind's defaults (sm 40rem, md 48rem, lg 64rem, xl 80rem, 2xl 96rem) are what CLAUDE.md wants.

---

## 2. Discrepancies vs CLAUDE.md

### 2a. Factual

1. **"Every color is ink/white/opacity, one outlier"**: partly wrong, see §0.2. `surface` `#f7f6f1` is a third solid.
2. **"6 sections"**: the file has a 7th (`final-cta`, index.html L594) plus the footer. Human decision in §6.
3. **Mapping of old tokens to opacity modifiers**: CLAUDE.md says "`text-ink/74`, `border-ink/14` etc." That is correct, but the exact table is `--ink-2`=/74, `--mute`=/52, `--line`=/14, `--line-2`=/8, `--line-strong`=/26.
4. **`--mesh-*`** (mentioned in your brief): confirmed dead. The only hits in the whole repo are the three `@property` declarations (L11-27). No `var(--mesh-…)` exists in any HTML, JS or CSS file.
5. **Fauna, rutas, manifest, FAQ, splash**: not just "may be unwired". They are definitely no-ops on this page. `data-fauna-*`, `.fauna-*`, `[data-rutas]`, `.manifest-item`, `[data-faq]` and `[data-splash]` do not appear in `index.html`. The `wildlife` section is now a static three-image `.wildlife-gallery` (index.html L352-362, CSS L2917-2935). The HTML comment "interactive fauna selector" (L338) is stale.
6. **Locked button mapping** (see also §2c):
   - `text-sm` is 14px, but `.btn` is `.92rem` = 14.72px and has `letter-spacing:.01em` (L376-377). The mapping omits both.
   - `px-7` (28px) vs 1.7rem (27.2px): a difference of 0.8px, negligible.
   - `btn-sm` is `.68rem 1.2rem` and `.8rem` (10.9px / 19.2px / 12.8px), not exactly `py-2.5 px-5 text-xs` (10 / 20 / 12px). `btn-sm` is unused on the homepage.
   - Transition is `transform .5s ease-soft` plus `background .3s`, `color .3s`, `border-color .3s` (default `ease`) at L379. `transition duration-500 ease-soft` slows colour changes from 300ms to 500ms and changes their easing. Faithful version: an arbitrary `transition-[…]` with per-property durations, or accept the change (human decision).
   - `.btn[disabled]` is `opacity .35` (L417) but `[data-funnel-submit][disabled]` is `opacity .7` (L2485). Same specificity, later wins. The submit-while-sending state is .7, not .35.
   - `border border-transparent` in the base plus `border-ink/26` in the ghost variant conflict. Tailwind orders them by its own sort, not class order. The `<Button>` must not concatenate conflicting utilities. Build a class map per variant and context (`bg-ink` vs `bg-white` for hero primary too), or use tailwind-merge.
   - Hero context: the mapping matches L989-1006. `.hero .btn-primary:hover` sets only the background (surface). The `translateY(-2px)` still applies from `.btn-primary:hover`.
7. **Sounder**: CLAUDE.md is right that it is 1280 (L843). The main.js painter loop (`initSounder`, `main.js` L180-267) runs at every width. Below 1280 the canvas is `display:none`, so `fitCanvas` sees 0×0 and clamps to 1×1 and keeps painting every frame. Wasteful, not broken. With `lg:` the JS is unchanged.
8. **CSS counters "must stay custom"** (your brief): the only counter in the CSS, `.vs-list li` (`counter-increment` and `::before`, L1149-1176), is **commented out**. `.vs-us .vs-list li::before` (L1174) sets a colour on a pseudo-element with no `content`, so it does nothing. The homepage `<ol>` lists render with no numbers. No counter CSS needs to be ported.
9. **`.container`**: used only on three CTA wrapper `<p>`s (index.html L333, 363, 415), always with inline styles. Its name collides with Tailwind v4's built-in `container` utility. See §2b.
10. **Kicker numerals** (index.html): "01" difference, "02" crew, "03" wildlife, "07" boats, "09" funnel. 04-06 and 08 are missing. `.nav-mobile` numbers "06" twice (L80-81). These are content bugs.

### 2b. Tailwind v3 → v4 pitfalls that affect this port

- **`rounded` / `DEFAULT`**: no `DEFAULT` key in v4. The `rounded` utility uses `themeKeys: ["--radius"]` (verified in `dist/lib.mjs`). Tailwind's built-in reference value is `--radius: 0.25rem`. If the token block only sets `--radius-sm` / `--radius-lg` and copies the v3 shape, every `rounded` (buttons, inputs, `.field input`, `.funnel-escape`, opt spans) silently becomes 4px instead of 6px. Fix: define `--radius: 6px` (done in §1g) or use `rounded-md`.
- **Overriding `--radius-sm` and `--radius-lg`** changes every use of `rounded-sm` / `rounded-lg`. That is intended here.
- **`--ease-out` override**: redefining it replaces Tailwind's built-in `ease-out` curve everywhere. Nothing else in this project uses the built-in, so it is intended, but be aware. Locked by CLAUDE.md. Not a bug.
- **`.container`**: v4 ships `container`. Do not reuse the name. If kept, redefine with `@utility container { … }`. Recommendation: drop it (used only in three accidental CTA wrappers).
- **Keyframe name collisions**: the site's `@keyframes ping` (L246) and `@keyframes spin` (L2506) share names with Tailwind's built-in `animate-ping` / `animate-spin` keyframes. Delete the dead `ping`. For `spin`, use `animate-spin` with a `.8s` duration override (see `--animate-spin-fast`) and delete the custom keyframe.
- **Default border colour** is `currentColor` in v4 (v3 was gray-200). Preflight resets borders to `0 solid` (`preflight.css` L15). Always pair `border` with an explicit colour (`border-ink/14`). The original always sets colour explicitly.
- **Placeholder colour**: preflight sets `color-mix(in oklab, currentcolor 50%, transparent)`. Original is `--mute` (ink/52). Add `placeholder:text-ink/52` (L2397-2400).
- **Buttons**: v4 preflight no longer sets `cursor:pointer`. Original `button {cursor:pointer}` at L117-123. Add `cursor-pointer` in a base layer or on every button/label. `.opt` also sets `cursor:pointer` (L2272).
- **`[hidden]`**: preflight sets `display:none !important` (`preflight.css` L396). That replaces `.btn[hidden]` (L383), `.funnel-spinner[hidden]` (L2502) and `.funnel-success[hidden]` (L2531). Warning: no utility such as `inline-flex` or `block` can override `[hidden]` any more. `main.js` toggles the `hidden` attribute on `next`, `submitBtn`, `submitSpinner`, `submitError`, `successEl` and `autosaveBadge`, which is fine. `.funnel.is-submitted .funnel-success {display:block}` (L2587) is redundant because JS also un-hides it.
- **`hover:` variant** in v4 only applies under `@media (hover:hover)`. Original hover rules also fire on touch (sticky hover). Behaviour change: none of the touch-only hover effects fire on phones now. Probably desirable.
- **`outline-none`** is `outline-style:none` in v4; use `outline-hidden` for the `.field input:focus {outline:none}` case (L2402-2407). Note that the original global `:focus-visible` (L164-168) is outline 2px ink, offset 3px, plus `border-radius:4px`. That last part overrides the element's own radius when focused (see §2c).
- **CSS variable arbitrary syntax**: v4 is `bg-(--nav-fg)`, not `bg-[--nav-fg]`. In v4 `[--x]` alone is not a var() reference.
- **Negative bleeding utilities**: `-mx-pad` works once `--spacing-pad` is defined (§1g). Otherwise `-mx-(--pad)`.
- **`@apply` in Astro scoped `<style>` blocks** needs `@reference "../styles/global.css";` at the top in v4, or the theme is not visible.
- **JS-composed class names**: Tailwind's scanner cannot see classes built at runtime. The following are generated by `main.js` and need literal class strings in a scanned file, or a custom CSS rule:
  - `funnel-recap-chip`, `funnel-recap-title` and `funnel-recap-row` (main.js L594-596)
  - `boats-dot` (L398)
  - `magnetic-inner` (L154)
  - `is-solid`, `is-in`, `is-active`, `is-visible`, `is-submitted`, `has-error`, `has-tilt`, `has-magnetic`
- **Opacity modifiers** such as `text-ink/74`: in v4 the modifier accepts any integer percentage. Every value in this audit is a whole percent (74, 52, 14, 8, 26, 90, 72, 35, 60, 55, 82, 86, 45, 12, 28). I did not run a build to confirm (unverified). If a modifier fails, the fallback is `/[.74]`. v4 generates opacity via `color-mix(in oklab, …)` rather than rgba, giving visually near-identical results.
- **Gradient syntax**: v4 uses `bg-linear-to-b` (not `bg-gradient-to-b`). v4 interpolates in oklab by default, slightly different from the original sRGB ramp. Use `bg-linear-180/srgb` if exactness matters.
- **`translate-*` in v4** writes the `translate` property, not `transform`. This matters for `.reveal` + `.has-tilt` on the same element (§2c).
- **Preflight `font-family` / `line-height`**: html gets `line-height:1.5` and the Tailwind default sans stack. The original body is 1.65 (L92-103) and Inter. Set `--font-sans` in `@theme` (done) and re-apply `body` rules in a base layer (§3, X-list).

### 2c. Existing visual bugs and no-op rules found (keep-or-fix decisions in §6)

1. **Nav CTA hover, transparent state**: `.nav-cta:hover` sets `background: var(--nav-fg)` and `color: var(--bg)` (L567-571). Over the hero `--nav-fg` is white (L454) and `--bg` is white, so the label goes white-on-white. The "solid" override (L573-575) sets `color: var(--on-ink)`, which is also white, so it changes nothing.
2. **`.nav-mobile-foot` colour**: defined twice. L690 sets `rgba(255,255,255,.55)`. L711 (later, same specificity) sets `color: var(--mute)` = ink at 52% over an ink background (`.nav-mobile` bg is `var(--ink)`, L648). The text is effectively invisible.
3. **Boat cards: `.reveal` and `.has-tilt` on the same element** (index.html L380-400):
   - `.has-tilt` (L2755, later, specificity 0,1,0) overrides `.reveal`'s `transform: translateY(30px)` and its `transition`, so the slide-up and opacity fade are lost.
   - Once `.is-in` is added, `.reveal.is-in {transform:none}` (specificity 0,2,0) beats `.has-tilt`'s perspective transform, so the tilt is dead after reveal. The JS still sets `--rx` / `--ry` and nothing consumes them.
   - Unverified in a browser, but this is what the cascade says.
   - Fix hint for the port: reveal via the `translate` property or `opacity` only, tilt via `transform`.
4. **`prefers-reduced-motion` gaps**. Handled: smooth-scroll (L86), kicker dot, hero video/img swap (L892), spinner slowed (L2512), splash line, scroll-cue and hero dot (L2866). **Not** handled:
   - `.reveal` (slides and fades still run)
   - `heroAmbientZoom` (the img is shown under reduced-motion but its 34s zoom animation keeps running, L880-884)
   - `stepIn`, `drawCheck`
   - `.btn` hover lift
   - magnetic and tilt JS (only gated on `fineHover`, `main.js` L125, 150)
   - the sounder rAF
5. **No-JS funnel is a dead end**: with JS off, `js-only` hides Back and Continue (L202-208) and the Submit button has the `hidden` attribute (index.html L570). There is no way to submit. CLAUDE.md says to preserve the no-JS fallback. Preserving it as-is preserves a broken submit.
6. **`.container` on CTA wrappers** (index.html L333, 363): with `--rail: 84px` at ≥1280 the wrapper's `padding-left` is `pad + rail` (L217-219), so the centred CTA sits ~42px right of centre. The boats one overrides `padding-left` (L415).
7. **Global `:focus-visible` `border-radius: 4px`** (L167) changes the shape of focused pills (`.step-btn` 50%, `.btn` 6px → 4px).
8. **`.boats-dot`**: `width/height: 6px` plus `padding:.3rem` under `border-box` yields a ~9.6px dot (padding sum exceeds the width), not 6px. Active is 1.2× of that. Replicate the rendered size.
9. **`.opts` grid at 560** (L2252): every `.opts` in the markup also has `.opts-row` (`display:flex`, L2258), which comes later and wins. The 2-column grid rule is a no-op.
10. **`.fstep .funnel-q:first-of-type {margin-top:0}`** (L2243): `first-of-type` is by element type `p`. In step 3 the `.funnel-q` is the first `<p>` among its siblings (after the `.fields` and `.field-full` label), so it gets margin-top 0, giving 1rem instead of 1.6rem there.
11. **Wildlife gallery** (L2917-2935): three items at `calc(33.333% - 1rem)` at every width, no responsive rule. On phones they are ~100px wide, 300px tall.
12. **`.crew-card-body {align-self: top}`** (L1934): invalid value, ignored.
13. **`.lang-switch-mobile`** (L603-608) and `.nav-mobile-brand/mark/wordmark` (L694-709): no matching markup.
14. **`--accent`**: `creditos.html` and `terms/privacy.html` use `style="color:var(--accent)"`. `--accent` is not defined in `styles.css`. Outside this scope, noted for whoever ports those pages.
15. **`.nav-mobile` links stay tabbable** when `aria-hidden="true"` (only clipped by `clip-path`, L655-661).
16. **`is-ready`** class added to `<html>` and `<body>` (`main.js` L814-815) has no CSS consumer.

---

## 3. Per-section classification

Legend:
- **U** = disappears into utilities (Preflight or plain utilities in the Astro component)
- **C** = becomes a component class (`@apply`) or scoped Astro/Preact styling
- **X** = must stay custom CSS (Tailwind structurally cannot express)
- **D** = dead on the homepage; do not port

### 3.0 Global base (L70-168, L1-10)

- **U (Preflight)**: `*,*::before,*::after {box-sizing; margin:0}` (L71-76), `img,svg,video,canvas {display:block; max-width}` (L105-111), `img {height:auto}`, `button/input/textarea/select {font:inherit; color:inherit}` (L117-130), `button {border:0; background:none}`, `a {color:inherit; text-decoration:none}` (L132-135), `ul,ol {list-style:none; padding:0}` (L153-157), `html {-webkit-text-size-adjust}`.
  - Not covered: `cursor:pointer` on buttons (add to base), `tab-size:2` (Preflight is 4).
- **U**: `text-wrap: pretty/balance` = `text-pretty` / `text-balance`.
  - `-webkit-font-smoothing` = `antialiased`.
  - `overflow-x: clip` = `overflow-x-clip`, `overscroll-behavior-y: none` = `overscroll-y-none`.
  - `scroll-behavior:smooth` = `scroll-smooth`.
  - `scroll-padding-top: 6rem` = `scroll-pt-24`.
- **C / X (base layer)**:
  - h1-h4: display font, `font-weight:500`, colour ink, `line-height:1.05`, `letter-spacing:-.01em` (L141-151). Preflight resets heading sizes and weight, so these must be restated.
  - body: `font-size:16px; line-height:1.65; color: ink/74; background white; text-rendering:optimizeLegibility` (L92-103). `text-rendering` has no utility.
  - `::selection {ink bg, white text}` (L159-162).
  - `:focus-visible {outline:2px solid ink; outline-offset:3px; border-radius:4px}` (L164-168).
- **X (`@media (prefers-reduced-motion)` for `scroll-behavior:auto`, L86-90)**: `motion-reduce:scroll-auto` works as a utility on `html`.
- **D**: `@property --mesh-angle`, `--mesh-x`, `--mesh-y` (L11-27); `@font-face` without `src` (L62-67); `--ease-bounce` (L58).
- **Sec. 3 utilities**:
  - `.sr-only` (L171): Tailwind built-in.
  - `.skip-link` (L182-196): **C**. Tokens: `fixed -top-[100px] left-4 z-[999] px-[1.1rem] py-[.7rem] bg-ink text-white rounded font-semibold focus:top-4`.
  - `.mono` (L198) = `font-mono` (**U**).
  - `.js-only` (L202-208): **X** (uses the `js` custom variant: `hidden js:revert-layout`, or keep the two CSS rules).
  - `.container` (L210-219): **D** (§2b).
  - `.kicker` (L221-231), `.kicker .num` (L233): **C** (`kicker` component; used 5×). `.kicker .dot` + `ping` (L237-264): **D**.
  - `.h2` (L266), `.h2 em` (L270; only role is `font-style:normal`, colour ink is a no-op on an ink heading): **C**. `.h2-plain` (L275): used only by `creditos.html` / `terms.html`, so **D** for the homepage.
  - `.lede` (L279-284): **C** (`text-lede text-ink/74 max-w-[58ch] opacity-92`).
  - `.note` (L286), `.link-arrow` (L295-304), `.compare-heading` (L358): **D**.
  - `.section` (L306-313): **C** (`relative mx-auto max-w-site py-section px-pad pl-[calc(var(--pad)+var(--rail))] border-t border-ink/8`).
  - `.section-head` (L315), `.section-head .lede` (L319), `.section-intro` (L323-328): **C**.
  - `[data-reveal], .reveal` (L330-341), `[data-reveal][data-split]` (L343): **X** (see below).
  - `[data-reveal-mask]` (L349-356): **D**.

**Reveal system (X)**: needs custom CSS. `[data-reveal],.reveal {opacity:0; transform:translateY(30px); transition: opacity .9s soft, transform 1s soft}`, `.is-in {opacity:1; transform:none}`. JS adds `is-in` via IntersectionObserver (threshold .04, rootMargin `-4%` bottom) and sets an inline `transitionDelay` of `min(i%6,5)*55ms` (`main.js` L106-121). A 6-second fallback `showAll` also exists. No-JS override at L2904-2908. Tailwind can express the states with `js:` / `no-js:` variants, but the JS-added `is-in` class means keeping a small CSS block is simpler. Decide about reduced-motion (§2c.4).

### 3.1 Buttons (L367-434)

- **C** (`<Button>` with `variant` = primary|ghost, `size`, `context` = default|hero; see §2a.6 for the class-map rule): `.btn`, `.btn-primary` (+ hover), `.btn-ghost` (+ hover), `.btn-sm` (unused on the homepage), `.btn-wide` (used once, index.html L586), `.btn[disabled]`, `.btn[hidden]` (**U**, Preflight `[hidden]`), `.hero .btn-*` (hero context).
- **X**: `.has-magnetic` / `.magnetic-inner` (L422-434). JS creates `.magnetic-inner` at runtime (`main.js` L153-157) and sets an inline `transform`. Keep as a small custom class. Applied only to the hero primary CTA (`data-magnetic`, index.html L103).
- Usage count of "nearly identical" button CSS: 10 buttons on the homepage, all `btn-primary` or `btn-ghost`. One component handles all. Only difference: hero context (2 buttons) and the `disabled` / `wide` modifiers.

### 3.2 Nav / chrome (L436-717)

- **X / C (nav state)**: `.nav`, `.nav.is-solid` (L437-475). State is swapped by JS toggling `is-solid` at `scrollY > 50` (`main.js` L86). The `--nav-fg`, `--nav-fg-mute`, `--nav-line` var swap (L453-468) is best kept as a tiny custom CSS block, consumed by utilities via `text-(--nav-fg)`, etc. Alternative: `group-[.is-solid]/nav:` variants. Values:
  - light: `#fff` / `white/72` / `white/35`
  - solid: `ink` / `ink/52` / `ink/26`
  - solid also: `bg-white/90 backdrop-blur-[14px] backdrop-saturate-140`, shadow `0 1px 0 ink/14`, height 72px. `@supports not (backdrop-filter…)` fallback bg is solid white (L470-474): `supports-[backdrop-filter]:` variant.
  - Transitions: bg, backdrop-filter, box-shadow, height, all `.45s ease-out`.
- **U**: `.nav-brand` flex row; `.nav-mark` (h 44px), `.nav-wordmark` (h 30px); `.nav-logo-ink/-light` swap (`hidden` / `group-…:block`, L495-505).
- **C**: `.nav-links` (hidden below 960, `flex` above; L507-518), `.nav-link` (L520-549). `::after` underline via `after:` utilities (absolute, bottom -3px, h 1px, `scale-x-0` → `hover:scale-x-100`, `origin-right` → `origin-left`, `.45s ease-out`).
- **C**: `.nav-cta` (L551-575; note bug §2c.1), `.lang-switch`, `.lang-btn` (L577-601; CLAUDE.md says decide when building Nav).
- **C / U**: `.nav-toggle` (L610-642): 3 bars, 22×1.5px, gap 5px. Open state uses `aria-expanded` → `group-aria-expanded:` variants (bar 1 `translate-y-[6.5px] rotate-45`, bar 2 `opacity-0`, bar 3 `-translate-y-[6.5px] -rotate-45`).
- **C / X**: `.nav-mobile` (L644-717). Fullscreen overlay with `clip-path: inset(0 0 100% 0)` → `inset(0)` on `aria-hidden="false"` (L655-661). `aria-[hidden=false]:` variant + arbitrary `[clip-path:…]` works. Body scroll lock is JS (`main.js` L96). Links: display italic, `.nav-mobile a i` mono `.62rem` white/60. Bugs §2c.2 and §2c.15.
- **D**: `.nav-mobile-brand/-mark/-wordmark` (L694-709), `.lang-switch-mobile` (L603-608).
- **X (no-JS)**: `html:not(.js) .nav-toggle {display:none}`, `.nav-mobile {display:none !important}`, `.nav-links {display:flex; flex-wrap:wrap}` (L2876-2887). The no-JS nav shows all links at all widths. Use a `no-js` custom variant.
- **Sounder** (L784-851): `.sounder`, `.sounder-canvas`, `.sounder-read`, `.sounder-depth/-unit/-label`.
  - **X**: the `<canvas>` painter is JS (`main.js` L180-267), with hard-coded ink rgba and a `9px 'JetBrains Mono'` font.
  - **C**: wrapper layout (fixed, left 0, 84px wide, `z-40`, `pointer-events-none`, `border-r border-ink/14`, `bg-white`), and `.sounder-read` (centred text block). Only rendered under `.js` (L790-801). Rail and breakpoint: see §5.
  - `data-depth-stop` / `data-depth-name` on sections (values 12 / 26 / 41 / 96 / 130) are JS-only.
- **D**: `.splash*`, `splashSafety`, `splashPulse` (L719-782), `html:not(.js) .splash` (L2910). No splash markup exists in `index.html`, so `initSplash` returns early. If a splash is reintroduced it will need: `fixed inset-0 z-[10000] bg-white`, `clip-path`/opacity transitions `.8s`/`1s`, `is-out` state, a 4s safety animation.

### 3.3 Hero (L853-1080)

- **U**: `.hero` (`relative min-h-svh flex items-end overflow-hidden isolate pl-(--rail)`), `.hero-bg` (`absolute inset-0 -z-[3]`), `.hero-bg video/img` (`absolute inset-0 size-full object-cover object-[50%_42%]`), `.hero-bg-tint` (gradient), `.hero-inner`, `.hero-meta`, `.hero-meta .dot` (`animate-pulse-dot`), `.hero-title`, `.hero-sub`, `.hero-actions`.
- **U / X (mixed)**:
  - `.hero-bg video {transform: translateZ(0); will-change: transform}`: `transform-gpu will-change-transform`.
  - `.hero-bg img {display:none; animation: heroAmbientZoom 34s; transform-origin: 50% 40%}` and the reduced-motion swap (L892-900): **X** or `motion-reduce:` variants; fix the still-running animation (§2c.4).
  - `.hero-inner` padding switches from a fixed `1.25rem` below 960 to `var(--pad)` above (L924, L930-934). Expect `px-5 lg:px-pad` (§5 risk).
- **C**: `.scroll-cue` (L1043-1064). Pill 22×36px with an inner span animated by `scroll-cue`. `animate-scroll-cue` from `@theme`.
- **D**: `.hero-facts` (L1008-1036, no markup), `.split-word/.split-line` (L1038-1041).
- **X (no-JS / reduced-motion)**: covered in §3.0 and §2c.4.

### 3.4 Difference (L1082-1244; index.html L111-155)

- **C**: `.vs`, `.vs-col`, `.vs-us` / `.vs-them` variants, `.vs-title`, `.vs-list`, `.vs-axis`. One `<VsCard variant="us|them">` covers both columns. `.vs-us`: `bg-surface border-ink/26`; `.vs-them`: `text-ink/52`, transparent bg.
- **C**: `.founder-quote*` (L1198-1244). Serif italic, clamp sizes, `whitespace-pre-line` on the kicker (`<br>` inside).
- **D**: `.concept-grid` (L1083-1093), the commented `.vs-list li` counter block (L1149-1176).
- **X**: none.

### 3.5 Crew (L1865-2033 + slider dots; index.html L157-336)

- **C** (component `<Slider>` shared with boats): `.crew-slider` = `flex overflow-x-auto snap-x snap-mandatory -mx-pad px-pad pb-4` + scrollbar hiding (see below), `gap-[1.6rem]`.
- **X**: scrollbar hiding (`scrollbar-width:none` + `::-webkit-scrollbar {display:none}`, L1873, L1879-1881). Tailwind has no built-in for it. Recommended: `@utility scrollbar-hidden { scrollbar-width: none; &::-webkit-scrollbar { display: none } }`.
- **C**: `.crew-card` (surface card: `relative flex flex-col gap-[1.4rem] border border-ink/14 rounded-lg bg-surface p-[1.6rem]`; at ≥640: `sm:flex-row sm:gap-[1.8rem] sm:p-[1.8rem]`, photo `sm:flex-[0_0_210px]`, body `sm:flex-1`), width `w-[min(100vw,620px)]`, `snap-start shrink-0`.
- **U**: `.crew-card-photo` (`rounded overflow-hidden bg-white max-sm:aspect-[4/5]`), its `img` (`size-full object-cover`), `.crew-card-label/-role/-bio`, `.crew-card h3`, `.crew-card-tag` (`absolute top-4 right-4 z-[2] bg-ink text-white text-[.58rem] tracking-[.1em] uppercase px-[.7rem] py-[.35rem] rounded-sm`).
- **X**: `.boats-dots` / `.boats-dot` (L1784-1809). JS creates the buttons at runtime (`main.js` L388-426, `.is-active` toggled on scroll). Crew reuses the `.boats-*` class names. Keep as one shared small custom block or a Preact component that emits literal classes.
- **D**: `.crew-card-sign` (L1965-1973), `.roles*` (L1989-2021), `.trust-line` (L2023-2033), the invalid `align-self: top`.
- Snap alignment note: `scroll-snap-align: start` with no `scroll-padding` snaps the card flush to the scrollport edge and ignores `padding-inline`. Preserve as-is or add `scroll-pl-pad`.

### 3.6 Wildlife (L2917-2935; index.html L338-367)

- **U**: `.wildlife-gallery` (`flex flex-wrap justify-center gap-4`), `.wildlife-gallery-item` (`flex-[1_1_calc(33.333%-1rem)] max-w-[calc(33.333%-1rem)]`), its `img` (`h-[300px] w-full rounded object-cover`). No responsive variants exist (§2c.11).
- **D**: everything in "10. FAUNA" (L1246-1387): `.fauna*`, `.f-name/-meta/-note`, `.fauna-stage`, `.fauna-caption`, `.fauna-disclaimer`. Plus the JS `initFauna` / `renderFaunaCaption`.

### 3.7 Boats (L1717-1863; index.html L371-418)

- **C**: `.boats-grid` = the same `<Slider>` as crew (identical CSS except `gap 2rem`, card width `min(100vw,550px)`), `.boat-card` (surface card, `p-[1.8rem]`), `.boat-photo` (bleed: `-m-[1.8rem] mb-[1.8rem]`, radius top only `rounded-t-lg`, `aspect-[4/5]`, `bg-white`), `.boat-card h3` (1.4rem).
- **X**: `.has-tilt` (L2755-2761): `--rx/--ry` custom properties written by JS (`main.js` L124-146), `transform: perspective(1000px) rotateX(var(--rx)) rotateY(var(--ry))`. Currently broken by the `.reveal` collision (§2c.3).
- **D**: `.boat-tagline` (html commented out), `.boat-specs`, `.included-*`, `.boat-card p:last-of-type` (no-op, colour already inherited).

### 3.8 Customize / funnel (L2111-2589; index.html L420-591)

- **C**: `.customize-inner` (`max-w-form mx-auto`), `.customize-head`, `.funnel-escape`, `.funnel` (surface card with `p-funnel`), `.funnel-bar` / `.funnel-fill` (fill width is set inline by JS, `transition: width .6s ease-out`), `.funnel-count`, `.funnel-autosave` (opacity toggle via `.is-visible`), `.funnel-q`, `.opts` / `.opts-row`, `.stepper`, `.step-btn`, `.step-input`, `.fhint`, `.fields`, `.field`, `.field-full`, `.field-optional`, `.field-error`, `.funnel-recap*`, `.funnel-privacy`, `.funnel-nav`, `.funnel-submit-error`, `.funnel-success*`.
- **C (pattern)**: `.opt` radio pill (L2269-2310). Input is visually hidden (absolute, 0×0). Span is bordered pill. Use Tailwind `peer` on the input: `peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white`, `peer-focus-visible:outline-2 peer-focus-visible:outline-ink peer-focus-visible:outline-offset-3`. Hover uses `.opt:hover span` (`group-hover` on the label): `translateY(-2px)` in `.opts-row`. The `translateX(3px)` variant (L2292-2295) is unreachable (all `.opts` are `.opts-row`).
- **C**: form controls. `.field input/textarea` (L2385-2395), placeholder (L2397), focus (L2402-2407), `input.has-error` (2px border, so layout shifts 1px each side).
- **X**: `.fstep` step visibility (L2190-2214, L2889-2893):
  - JS-enabled: `.js .fstep {display:none}`, `.js .fstep.is-active {display:block; animation: stepIn}`.
  - No-JS: shows all steps, each with `border-top: ink/8` and `padding-top:1.6rem`.
  - Use `js:` / `no-js:` custom variants, or keep these rules.
- **X**: `.funnel-success-check path` SVG stroke animation (L2551-2560): `stroke-dasharray:1; stroke-dashoffset:1; animation drawCheck`. Depends on `pathLength="1"` in the markup (index.html L581). Tailwind has `stroke-*` for colour and width but the dash setup needs custom CSS. `stroke: ink; stroke-width: 2.5; fill: none; stroke-linecap/-linejoin: round`.
- **C**: `.funnel-spinner` (16px, `animate-spin-fast`, border 2px white/35 with white top). Preserve `ml-2` on top of the button `gap-2`.
- **X**: `.funnel.is-submitted …` (L2580-2589): hides `.fstep`, `.funnel-nav`, `.funnel-bar`, `.funnel-count` when the form has `is-submitted`. Use `group-[.is-submitted]/funnel:hidden`.
- **X**: `.funnel-recap:empty {display:none}` (L2433): `empty:hidden`. Recap contents are JS-generated (§2b).
- **X (no-JS)**: `html:not(.js) .funnel-nav, .funnel-count {display:none}` (L2895-2898). See §2c.5.
- **D**: none apart from the 560px `.opts` grid rule (§2c.9).

### 3.9 Final CTA (L2591-2606; index.html L593-603)

- **C**: `.final-cta` (`text-center`), `.final-cta .btn {margin-top:1.8rem}` (a `mt-[1.8rem]` on the button), `.final-cta-meta`. The inline `style="justify-content:center"` on the kicker (index.html L596, also L424) becomes `justify-center`.

### 3.10 Footer (L2608-2752; index.html L607-654)

- **C**: `.footer` (`border-t border-ink/14 pt-footer-t px-pad pb-[2.4rem] pl-[calc(var(--pad)+var(--rail))] mx-auto max-w-site`), `.footer-top` (`lg:grid-cols-[1.4fr_1fr] items-end` at ≥960), `.footer-brand` (`footer-mark` h 42px, `footer-wordmark` h 30px, opacity .95), `.footer-claim` (note `em` is italic and solid ink, because `.footer-claim` inherits ink/74; §2c is not needed), `.footer-contact`, `.footer-big` (hover `translate-x-1.5`, `.5s ease-out`), `.footer-grid` (4 columns at ≥720; only 3 children exist), `.footer-grid h4` (mono `.62rem`, `tracking-[.16em]`, not italic), `.footer-grid p, ul` (`.88rem`, `ink/52`, `leading-[1.9]`), `.footer-grid a:hover` (`hover:text-ink hover:underline`), `.footer-legal` (flex wrap, `gap-x-8 gap-y-[.6rem]`, `justify-between`, mono `.72rem`, `ink/52`, `opacity-80`).
- **U**: centred mobile variant `@media (max-width:719px)` (L2728-2752): `max-md:` variants (brand `justify-center`, claim/contact `text-center`, grid `text-center justify-items-center`, legal `flex-col items-center text-center`).

### 3.11 Splash

Not in `index.html`. See §3.2 (D). `main.js` `initSplash` (L73-80) is a no-op; the `data-splash` hook it targets is missing.

### 3.12 Consumed by other pages only (do NOT delete `styles.css` until those pages are ported)

`.page-credits`, `.credits-*`, `.page-doc`, `.legal-*` (L2768-2863), and `.h2-plain` (L275). `creditos.html` and `terms.html` also use `.container`, `.h2`, `.lede`.

---

## 4. States per component (nothing to drop)

- **Button**: default, hover (lift -2px, colour changes; hero-context colours), focus-visible (global outline, 4px radius quirk), disabled (opacity .35, `pointer-events:none`), submit-disabled (opacity .7), hidden attr, `btn-wide` (full width), `btn-sm` (unused). Magnetic hero primary: pointer-driven transform, fine-pointer only. Transition durations mixed (§2a.6).
- **Nav**: transparent (light fg), solid after 50px scroll (dark fg, blur, shadow, height 84→72), mobile menu closed / open (`aria-expanded` / `aria-hidden`), `nav-link` hover (colour + underline swap direction), `nav-cta` hover (§2c.1) in both scroll states, `lang-btn` default / hover / `is-active`, no-JS (all links visible, no toggle), breakpoint (`nav-links` and `nav-cta` show ≥960, `nav-toggle` hides ≥960), skip-link focus.
- **Sounder**: hidden by default, shown when `.js` and ≥breakpoint, canvas painted per frame, label updates by section. Rail padding effect on 5 elements.
- **Hero**: video (default) vs img (reduced-motion), tint, dot pulse, scroll-cue animation, hero-inner padding at <960 vs ≥960, `min-h-svh`, buttons in hero context.
- **Difference**: `vs` 1-col below 800, 3-col above; `vs-col` padding 1.8/1.6 → 2.4/2 at 800; `vs-axis` hidden below 800; both `.reveal`.
- **Crew card**: stacked <640 (photo aspect 4/5) vs row ≥640 (photo 210px); tag present on two cards ("Joining Q4 2026"), label present on one ("Founder"); reveal on the slider container; dots default / hover / active (scale 1.2).
- **Wildlife**: static gallery, fixed 3-across at all widths.
- **Boats**: same slider and dots states; card `.reveal` + `.has-tilt` (§2c.3); tilt fine-pointer only.
- **Funnel**: 4 steps, step visible / hidden (`is-active`), progress fill width, count text, autosave badge visible / hidden, Back disabled on step 1 (`disabled`), Continue hidden on last step, Submit hidden until last step, submit sending (label, spinner, disabled .7), submit error (hidden attr), success (`is-submitted`), input focus (border ink), input `has-error` (2px ink border), error `<p>` hidden attr, recap chips (JS), radio opt default / hover (lift) / checked / focus-visible, stepper button hover, `js-only` elements hidden without JS, no-JS (all steps shown; no submit path, §2c.5).
- **Footer**: link hover (colour + underline), `footer-big` hover slide, centred <720 vs left ≥720, 4-col ≥720 with only 3 children.
- **Global**: `prefers-reduced-motion` (§2c.4), `html:not(.js)` fallbacks, `is-in` reveal states.

---

## 5. Breakpoint mapping (original → Tailwind default)

Original breakpoints found: 560, 640, 720, 800, 960, 1280 (min-width), plus max-width 639 and 719.

| Original | Live rules (styles.css) | Nearest TW default | Delta | Visual risk |
|---|---|---|---|---|
| 560 | `.fields` 2-col (L2356). `.opts` grid (L2252) is a no-op, see §2c.9. | `sm` 640 | +80 | Low. Viewports 560-639 get 1-column name/email/date fields instead of 2. |
| 640 | crew card row layout (L1897-1911); hero-facts (dead) | `sm` 640 | 0 | None. |
| max 639 | crew photo `aspect-[4/5]` (L1920) | `max-sm` (below 640) | 0 | None. |
| 720 | footer-grid 4-col (L2675); footer centred `max-width:719` (L2728-2752). Dead: included-grid, roles-strip. | `md` 768 | +48 | Low-medium. 720-767px viewports get the centred stacked footer instead of the 4-column grid. |
| 800 | `.vs` 3-col (L1102), `.vs-col` padding (L1114), `.vs-axis` show (L1182) | `md` 768 | -32 | Low-medium. 768-799px viewports switch to the side-by-side comparison earlier; columns ~300px wide, more text wrap. |
| 960 | nav-links / nav-cta show, toggle hide (L514, 561, 619); `.hero-inner` `padding-inline: var(--pad)` (L930); footer-top 2-col (L2681). Dead: concept-grid, fauna, ruta-panel, day-grid, manifest. | `lg` 1024 (+64) or `md` 768 (-192) | +64 | **Medium.** `lg` is the closer match. There are now 7 nav links (index.html L63-69) plus brand, lang switch and CTA. My rough estimate (not measured, unverified) is that desktop nav content is wider than ~980px at 1024px once the 84px rail is added. Links may wrap or the nav may overflow at 1024-1150px. Check visually at 1024 / 1100 / 1180. `md` would clearly overflow. Also the `.hero-inner` padding step (20px → 5vw) happens at 1024 instead of 960. |
| 1280 | sounder show and `--rail: 84px` (L843-851) | `lg` 1024 (CLAUDE.md) or `xl` 1280 | -256 (lg) | **High.** Between 1024 and 1279 the content area loses 84px on the left, and the nav and hero also shift by the rail. Content width at 1024px is roughly 838px (1024 − 135 left padding − 51 right padding), computed from the formulas, unmeasured. The sounder covers the left 84px of the hero. Keep `--rail` tied to the same breakpoint as the sounder's visibility, and consider gating on `.js`, since without JS the original has an empty 84px gutter at ≥1280 (the rail applies with `.sounder` hidden). |

Notes:
- Tailwind breakpoints are in `rem` (40 / 48 / 64 / 80 / 96); the original used px. Only matters if the user changes the browser's default font size.
- Custom CSS media queries (the rail block, §1g) should use `64rem` to match `lg`.
- `@media (hover:hover) and (pointer:fine)` in `main.js` L26 (JS-only) stays as-is.

---

## 6. Items needing a human decision

1. **Homepage scope**: CLAUDE.md says 6 sections. The file has a 7th (`final-cta`) plus footer. Include the final CTA in the Tina-editable homepage?
2. **Rail breakpoint at `lg`**: accept the 84px rail from 1024px (§5), or use `xl:` for the rail and `lg:` only for the gauge visibility? Should the rail be gated on `.js`?
3. **Nav crowding at 1024px** with 7 links (§5). Options: hamburger until `xl`, shorter labels, or smaller gaps. Needs a browser check.
4. **Keep-or-fix the existing bugs** in §2c: nav CTA hover invisible label, `.nav-mobile-foot` invisible text, `.reveal` / `.has-tilt` collision on boat cards, `prefers-reduced-motion` gaps, no-JS funnel with no submit path, `.container` off-centre CTAs, global focus `border-radius:4px`, wildlife gallery not responsive.
5. **Button transition**: the locked mapping (`transition duration-500 ease-soft`) changes colour timing from 300ms `ease` to 500ms soft. Accept, or use an arbitrary per-property transition for fidelity?
6. **`ease-out` override**: keep the locked name `ease-out` (replaces Tailwind's built-in), or rename it (e.g. `ease-expo`)? Nothing else in the project uses the built-in.
7. **`--radius`**: keep bare `rounded` (needs `--radius: 6px`), or standardise on `rounded-md` in components? `--radius-md: 6px` is already Tailwind's default.
8. **Token granularity**: put the clamp() values and layout sizes in `@theme` (as in §1g) or use arbitrary values inline? The micro font sizes (.58-.95rem) are proposed as arbitrary values, not tokens.
9. **Dead code deletion**: confirm deleting everything marked D. Do the not-yet-built pages (routes, day-in-life, activities, FAQ per CLAUDE.md) need the `.ruta*`, `.day-*`, `.manifest*`, `.faq*` and `.fauna*` CSS kept for later? The mesh `@property` rules and `--ease-bounce` are dead in the whole repo.
10. **Fonts**: keep the Google Fonts `<link>`s or self-host (with `@font-face` + `font-display:swap` in a base layer)? The existing TASA `@font-face` has no `src` and does nothing (L62-67). Confirm whether TASA has an italic face (used by `.nav-mobile a`).
11. **Kicker numerals and nav-mobile numbering**: 01/02/03/07/09 and duplicate "06" (§2a.10). Make the numeral a Tina field or renumber?
12. **`<Button>` class conflicts**: `border-transparent` + `border-ink/26`, `bg-ink` + `bg-white` (hero) must not be concatenated (§2a.6). Use per-variant maps or tailwind-merge.
13. **`.container` wrappers on CTAs**: replace the three `<p class="container" style=…>` with a plain centred `div`? That removes the off-centre quirk (§2c.6).
14. **`.lang-btn`** scroll-state handling (CLAUDE.md defers to Nav build). Only `EN` is visible; ES / FR buttons are commented out (index.html L55-56).
15. **Class names built in JS** (`funnel-recap-*`, `boats-dot`, `magnetic-inner`): keep as small custom CSS, or move that markup into scanned components (Preact) with literal Tailwind strings?
16. **Stale JS**: `initFauna`, `initRutas`, `initManifest`, `initFaq`, `initSplash` and `renderFaunaCaption` are no-ops on the homepage. CLAUDE.md says not to port them. Confirm they stay out.

Files referenced:
- `/Users/kinich.barcelo/Documents/eagle/eagleray-web/styles.css`
- `/Users/kinich.barcelo/Documents/eagle/eagleray-web/main.js`
- `/Users/kinich.barcelo/Documents/eagle/eagleray-web/index.html`
- `/Users/kinich.barcelo/Documents/eagle/eagleray-web/CLAUDE.md`
- `/Users/kinich.barcelo/Documents/eagle/eagleray-web/node_modules/tailwindcss/theme.css`
- `/Users/kinich.barcelo/Documents/eagle/eagleray-web/node_modules/tailwindcss/preflight.css`
