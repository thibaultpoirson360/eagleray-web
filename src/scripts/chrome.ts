/**
 * Page-chrome vanilla JS — ported close to as-is from main.js, per
 * CLAUDE.md's stack section ("Vanilla JS... for page chrome only").
 * Loaded once, globally, via BaseLayout.astro, so it runs on every page
 * regardless of which sections that page uses.
 *
 * Every reveal/tilt/magnetic element built so far (Hero's primary CTA,
 * every section's kicker/title/lede, Boats' has-tilt cards) has been
 * rendering in its static, pre-JS state until this file existed — this
 * is what actually makes them move.
 *
 * Intentionally NOT ported from main.js's boot():
 *   - initI18n/applyLang/detectLang — the old data-i18n client-side
 *     swap is superseded by Astro's per-locale routing (/en/, /es/,
 *     /fr/) and Tina content; there's nothing left for it to do.
 *   - initSplash — no `[data-splash]`/`.splash` element exists in the
 *     current homepage markup (verified by grep); dead code.
 *   - initFauna/initRutas/initManifest/initFaq — sections not on the
 *     current homepage (CLAUDE.md: out of scope for this pass).
 *   - initBoatsDots/initCrewDots — superseded by SliderDots.tsx
 *     (Preact, per CLAUDE.md's "sliders... Preact").
 *   - initFunnel — the funnel section isn't built yet.
 *   - initContact's wa.me/instagram/mailto href-patching — Footer.astro
 *     now renders those hrefs directly from siteSettings.contact at
 *     build time, which is strictly better (no flash of a placeholder
 *     number, works with no JS). Its one piece worth keeping —
 *     refreshing the copyright year — is initYear() below: a
 *     build-time year alone would silently go stale for a site that
 *     isn't rebuilt every January.
 */

const $ = <T extends Element = Element>(sel: string, scope: ParentNode = document): T | null =>
  scope.querySelector<T>(sel);

const $$ = <T extends Element = Element>(sel: string, scope: ParentNode = document): T[] =>
  Array.from(scope.querySelectorAll<T>(sel));

const fineHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

function safe(fn: () => void, name: string) {
  try {
    fn();
  } catch (e) {
    if (window.console) console.warn(`[${name}]`, e);
  }
}

function clamp(v: number, a: number, b: number) {
  return v < a ? a : v > b ? b : v;
}

/* ---------- Single rAF loop shared by canvas painters ---------- */
const painters: Array<(t: number) => void> = [];
let rafRunning = false;
function addPainter(fn: (t: number) => void) {
  painters.push(fn);
  if (!rafRunning) {
    rafRunning = true;
    requestAnimationFrame(tick);
  }
}
function tick(t: number) {
  for (let i = 0; i < painters.length; i++) {
    try {
      painters[i](t);
    } catch (e) {
      if (window.console) console.error("[painter]", e);
      painters.splice(i, 1);
      i--;
    }
  }
  requestAnimationFrame(tick);
}
function fitCanvas(cv: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const r = cv.getBoundingClientRect();
  const w = Math.max(1, Math.round(r.width));
  const h = Math.max(1, Math.round(r.height));
  if (cv.width !== w * dpr || cv.height !== h * dpr) {
    cv.width = w * dpr;
    cv.height = h * dpr;
    const ctx = cv.getContext("2d");
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  return { w, h };
}

/* ---------- Nav: scroll-solidify + mobile menu ---------- */
function initNav() {
  const nav = $("[data-nav]");
  // Solid pages (no hero to float over) render `is-solid` server-side
  // (Nav.astro) so it's correct from first paint / with no JS at all —
  // this only drives the scroll-to-solidify toggle for pages that
  // actually start transparent (data-nav-transparent="true"). Leaving a
  // solid page's class alone here also means the scroll listener never
  // runs at all where it'd have nothing to do.
  if (nav && nav.getAttribute("data-nav-transparent") === "true") {
    const onScroll = () => nav.classList.toggle("is-solid", window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  const toggle = $<HTMLButtonElement>("[data-nav-toggle]");
  const mobile = $<HTMLElement>("[data-nav-mobile]");
  if (!toggle || !mobile) return;

  const setOpen = (open: boolean) => {
    toggle.setAttribute("aria-expanded", String(open));
    mobile.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
  };

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });
  $$("a", mobile).forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
}

/* ---------- Reveal on scroll ---------- */
function initReveals(scope: ParentNode = document) {
  const items = $$<HTMLElement>("[data-reveal], .reveal", scope);
  if (!items.length) return;
  const showAll = () => items.forEach((el) => el.classList.add("is-in"));
  if (!("IntersectionObserver" in window)) {
    showAll();
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.04, rootMargin: "0px 0px -4% 0px" }
  );
  items.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 6, 5) * 55}ms`;
    io.observe(el);
  });
  // Source's own safety net: if something never intersects (broken
  // layout, observer stalls), don't leave content permanently hidden.
  setTimeout(showAll, 6000);
}

/* ---------- Tilt (subtle 3D on hover) ---------- */
function initTilt(scope: ParentNode = document) {
  if (!fineHover) return;
  $$<HTMLElement>(".has-tilt", scope).forEach((card) => {
    const MAX = 6;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let raf: number | null = null;

    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      tx = -py * MAX;
      ty = px * MAX;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    card.addEventListener("mouseleave", () => {
      tx = 0;
      ty = 0;
      if (!raf) raf = requestAnimationFrame(loop);
    });

    function loop() {
      cx += (tx - cx) * 0.15;
      cy += (ty - cy) * 0.15;
      card.style.setProperty("--rx", `${cx.toFixed(2)}deg`);
      card.style.setProperty("--ry", `${cy.toFixed(2)}deg`);
      raf = Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05 ? requestAnimationFrame(loop) : null;
    }
  });
}

/* ---------- Magnetic buttons ---------- */
function initMagnetic(scope: ParentNode = document) {
  if (!fineHover) return;
  $$<HTMLElement>("[data-magnetic]", scope).forEach((el) => {
    const strength = parseFloat(el.dataset.magneticStrength || "0.25");
    const inner = document.createElement("span");
    inner.className = "magnetic-inner";
    while (el.firstChild) inner.appendChild(el.firstChild);
    el.appendChild(inner);
    el.classList.add("has-magnetic");

    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let raf: number | null = null;

    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      tx = (e.clientX - r.left - r.width / 2) * strength;
      ty = (e.clientY - r.top - r.height / 2) * strength;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    el.addEventListener("mouseleave", () => {
      tx = 0;
      ty = 0;
      if (!raf) raf = requestAnimationFrame(loop);
    });

    function loop() {
      cx += (tx - cx) * 0.2;
      cy += (ty - cy) * 0.2;
      inner.style.transform = `translate3d(${cx}px,${cy}px,0)`;
      raf = Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1 ? requestAnimationFrame(loop) : null;
    }
  });
}

/* ---------- Sounder: signature depth-gauge rail ---------- */
function initSounder() {
  const rail = $<HTMLElement>(".sounder");
  const cv = $<HTMLCanvasElement>(".sounder-canvas");
  const out = $("[data-depth]");
  const label = $<HTMLElement>("[data-sounder-label]");
  if (!rail || !cv || !cv.getContext) return;

  const ctx = cv.getContext("2d");
  if (!ctx) return;

  // Passed via data attributes (siteSettings.sounder) rather than a
  // window.__BRAND__ global — see Sounder.astro's comment.
  const maxDepth = Number(rail.dataset.maxDepth) || 140;
  const surfaceLabel = rail.dataset.surfaceLabel || "Surface";
  let shown = 0;
  let target = 0;

  // Procedural seafloor profile — a fixed sum of sines, not real
  // bathymetry. Ported as-is from main.js.
  function bed(d: number) {
    return 0.5 + Math.sin(d * 0.055) * 0.22 + Math.sin(d * 0.017 + 1.7) * 0.16 + Math.sin(d * 0.13 + 0.4) * 0.06;
  }

  // Which section's depth-stop is centred in view right now. Reads the
  // live data-depth-name attribute each section already renders
  // (Tina-editable), not a separate i18n array indexed by position like
  // source did — those sections' names are already the real source of
  // truth here. Queried fresh on every call (cheap; a handful of nodes)
  // rather than cached once, so a section whose DOM gets replaced by
  // TinaCMS's visual editor (see initTinaReinit below) doesn't leave a
  // stale, detached stop permanently un-matchable.
  function currentLabel() {
    const stops = $$<HTMLElement>("[data-depth-stop]");
    let best = -1;
    const y = window.innerHeight * 0.42;
    stops.forEach((s, idx) => {
      const r = s.getBoundingClientRect();
      if (r.top <= y && r.bottom > 0) best = idx;
    });
    if (best > -1) return stops[best].getAttribute("data-depth-name") || surfaceLabel;
    return surfaceLabel;
  }

  addPainter(() => {
    const doc = document.documentElement;
    const span = Math.max(1, doc.scrollHeight - window.innerHeight);
    target = clamp(window.scrollY / span, 0, 1) * maxDepth;
    shown += (target - shown) * 0.09;

    const { w, h } = fitCanvas(cv);
    const pxPerM = 6.2;
    ctx.clearRect(0, 0, w, h);

    const top = shown - h / 2 / pxPerM;
    const startM = Math.floor(top / 5) * 5;

    ctx.font = "9px 'JetBrains Mono', monospace";
    for (let d = startM; d < top + h / pxPerM + 5; d += 5) {
      if (d < 0) continue;
      const y = (d - top) * pxPerM;
      const major = d % 20 === 0;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(major ? 16 : 8, y);
      ctx.strokeStyle = major ? "rgba(14,27,43,0.55)" : "rgba(14,27,43,0.22)";
      ctx.lineWidth = 1;
      ctx.stroke();
      if (major) {
        ctx.fillStyle = "rgba(14,27,43,0.75)";
        ctx.fillText(`${d}`, 20, y + 3);
      }
    }

    ctx.beginPath();
    for (let yy = 0; yy <= h; yy += 4) {
      const dd = top + yy / pxPerM;
      const x = w - 6 - bed(dd) * (w * 0.42);
      if (yy === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    ctx.lineTo(w, h);
    ctx.lineTo(w, 0);
    ctx.closePath();
    ctx.fillStyle = "rgba(14,27,43,0.08)";
    ctx.fill();

    ctx.beginPath();
    for (let y2 = 0; y2 <= h; y2 += 4) {
      const d2 = top + y2 / pxPerM;
      const x2 = w - 6 - bed(d2) * (w * 0.42);
      if (y2 === 0) ctx.moveTo(x2, y2);
      else ctx.lineTo(x2, y2);
    }
    ctx.strokeStyle = "rgba(14,27,43,0.6)";
    ctx.lineWidth = 1;
    ctx.stroke();

    const mid = h / 2;
    ctx.beginPath();
    ctx.moveTo(0, mid);
    ctx.lineTo(w, mid);
    ctx.strokeStyle = "rgba(14,27,43,1)";
    ctx.stroke();

    if (out) out.textContent = String(Math.round(shown));
    if (label) {
      const lbl = currentLabel();
      if (label.textContent !== lbl) label.textContent = lbl;
    }
  });
}

/* ---------- Footer copyright year ---------- */
function initYear() {
  const year = $("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
}

/**
 * TinaCMS's visual editor doesn't patch a changed field in place — its
 * bridge does `island.innerHTML = <freshly rendered HTML>` on the whole
 * `[data-tina-island]` wrapper for every edit (see @tinacms/bridge's
 * `swapIslandHtml`). That silently orphans whatever initReveals/initTilt/
 * initMagnetic attached to the nodes it just threw away: revealed text
 * goes back to its pre-reveal (invisible) state and never recovers (the
 * IntersectionObserver was watching nodes that no longer exist, and the
 * one-shot 6s failsafe already fired once at page load), and tilt/
 * magnetic just stop responding on that section.
 *
 * Only relevant inside the admin's own preview iframe — on the public
 * site nothing ever replaces this DOM, so this is a no-op there. Scoped
 * per-island (not a full document re-run) so unaffected sections' nodes,
 * which already have their listeners, aren't re-initialized a second
 * time.
 */
function initTinaReinit() {
  if (window.self === window.top) return;
  if (!("MutationObserver" in window)) return;
  const islands = $$<HTMLElement>("[data-tina-island]");
  if (!islands.length) return;

  const reinit = (scope: HTMLElement) => {
    safe(() => initReveals(scope), "initReveals(reinit)");
    safe(() => initTilt(scope), "initTilt(reinit)");
    safe(() => initMagnetic(scope), "initMagnetic(reinit)");
  };

  const mo = new MutationObserver((mutations) => {
    const targets = new Set<HTMLElement>();
    for (const m of mutations) {
      if (m.target instanceof HTMLElement && m.target.hasAttribute("data-tina-island")) {
        targets.add(m.target);
      }
    }
    targets.forEach(reinit);
  });
  islands.forEach((island) => mo.observe(island, { childList: true }));
}

function boot() {
  safe(initNav, "initNav");
  safe(initReveals, "initReveals");
  safe(initTilt, "initTilt");
  safe(initMagnetic, "initMagnetic");
  safe(initSounder, "initSounder");
  safe(initYear, "initYear");
  safe(initTinaReinit, "initTinaReinit");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
