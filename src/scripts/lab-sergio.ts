/**
 * Scroll scenes for /<locale>/lab/sergio-torres/ (loaded only by that page).
 *
 *  - Lenis smooth scroll, driven by GSAP's ticker so ScrollTrigger stays in sync.
 *  - GSAP + ScrollTrigger + SplitText own every scroll scene. Motion (the
 *    `motion` package) owns only the button hover/press feel, on a wrapper
 *    (`[data-lab-cta]`) GSAP never touches, so the two never animate the same
 *    property on the same element.
 *  - Pinned "day on board" only on desktop with motion allowed; phones get
 *    simple stacked reveals; reduced motion gets the plain static layout.
 *
 * The day colours below exist only for this page's story scene (the design
 * system's ink/surface/white cannot express a sunrise).
 */
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { animate } from "motion";

gsap.registerPlugin(ScrollTrigger, SplitText);

// Sunrise, morning, midday, afternoon, sunset, night. White text stays readable on all of them.
const DAY_COLORS = ["#5b6b8c", "#12385f", "#0f4c75", "#9a5b12", "#4a2c3a", "#0a1220"];

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const root = document.documentElement;
const $ = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) => scope.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) => Array.from(scope.querySelectorAll<T>(sel));

let lenis: Lenis | null = null;
let ctx: gsap.Context | null = null;

function startSmoothScroll() {
  if (lenis) return;
  lenis = new Lenis({ anchors: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

function stopSmoothScroll() {
  lenis?.destroy();
  lenis = null;
}

/** Masked line-by-line reveal of one text element. */
function splitReveal(el: HTMLElement, scrollTrigger?: ScrollTrigger.Vars) {
  const split = SplitText.create(el, { type: "lines", mask: "lines" });
  gsap.set(el, { autoAlpha: 1 });
  return gsap.from(split.lines, { yPercent: 110, duration: 1, ease: "power3.out", stagger: 0.1, scrollTrigger });
}

function build() {
  ctx?.revert();
  ctx = gsap.context(() => {
    const motionOk = "(prefers-reduced-motion: no-preference)";
    const mm = gsap.matchMedia();

    // ---- Every size, motion allowed ------------------------------------
    mm.add(motionOk, () => {
      // Hero
      const hero = $("[data-lab-hero]");
      if (hero) {
        const title = $("[data-lab-split]", hero);
        if (title) splitReveal(title);
        gsap.fromTo($$("[data-lab-fade]", hero), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1, ease: "power2.out", stagger: 0.12, delay: 0.35 });
        const img = $("[data-lab-parallax]", hero);
        if (img) {
          gsap.fromTo(img, { yPercent: -7 }, { yPercent: 7, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
        }
      }

      // Intro lines and any other scroll-revealed headline
      $$("[data-lab-split-scroll]").forEach((el) => {
        splitReveal(el, { trigger: el, start: "top 85%", once: true });
      });

      // Sergio's photo stack: staggered entrance, then a slow drift at different speeds.
      $$("[data-lab-stack]").forEach((fig, i) => {
        gsap.fromTo(fig, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 1, ease: "power2.out", scrollTrigger: { trigger: fig, start: "top 90%", once: true } });
        const img = $("[data-lab-stack-img]", fig);
        if (img) {
          const drift = [6, 10, 14][i] ?? 8;
          gsap.fromTo(img, { yPercent: -drift }, { yPercent: drift, ease: "none", scrollTrigger: { trigger: fig, start: "top bottom", end: "bottom top", scrub: true } });
        }
      });

      // Route: the line draws, the stops appear as it passes them.
      const routeLine = $<SVGPathElement>("[data-lab-route-line]");
      if (routeLine) {
        const points = $$<SVGGElement>("[data-lab-route-point]");
        gsap.set(routeLine, { strokeDasharray: 1, strokeDashoffset: 1 });
        gsap.set(points, { autoAlpha: 0 });
        const tl = gsap.timeline({ scrollTrigger: { trigger: "[data-lab-route]", start: "top 65%", end: "bottom 80%", scrub: 0.8 } });
        tl.to(routeLine, { strokeDashoffset: 0, duration: 1, ease: "none" }, 0);
        tl.to(points[0], { autoAlpha: 1, duration: 0.08 }, 0);
        tl.to(points[1], { autoAlpha: 1, duration: 0.08 }, 0.4);
        tl.to(points[2], { autoAlpha: 1, duration: 0.08 }, 0.95);
      }
    });

    // ---- Desktop: the pinned day on board ----------------------------------
    mm.add(`(min-width: 768px) and ${motionOk}`, () => {
      const section = $("[data-lab-story]");
      const viewport = $("[data-lab-viewport]");
      const photo = $("[data-lab-photo]");
      const circle = $("[data-lab-circle]");
      const breath = $("[data-lab-breath]");
      const progress = $("[data-lab-progress]");
      const scenes = $$("[data-lab-scene]");
      if (!section || !viewport || !photo || !circle || !progress || scenes.length === 0) return;

      section.dataset.pinned = "";

      gsap.set(viewport, { backgroundColor: DAY_COLORS[0] });
      gsap.set(photo, { clipPath: "circle(0% at 68% 50%)" });
      gsap.set(circle, { autoAlpha: 0 });
      gsap.set(progress, { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(scenes, { autoAlpha: 0 });
      gsap.set(scenes[0], { autoAlpha: 1 });

      // The breathing circle loops on its own; the scroll timeline never touches its scale.
      if (breath) gsap.to(breath, { scale: 1.3, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: viewport, start: "top top", end: "+=500%", pin: true, scrub: 1, anticipatePin: 1 },
      });
      const last = scenes.length - 1;

      tl.to(progress, { strokeDashoffset: 0, duration: last + 1 }, 0);
      for (let i = 1; i <= last; i++) tl.to(viewport, { backgroundColor: DAY_COLORS[i] ?? DAY_COLORS[last], duration: 0.8 }, i - 0.4);

      scenes.forEach((scene, i) => {
        const lines = SplitText.create($$("[data-lab-scene-title], [data-lab-scene-body]", scene), { type: "lines", mask: "lines" }).lines;
        if (i === 0) {
          gsap.from(lines, { yPercent: 110, duration: 1, ease: "power3.out", stagger: 0.08, scrollTrigger: { trigger: viewport, start: "top 70%", once: true } });
        } else {
          tl.to(scene, { autoAlpha: 1, duration: 0.05 }, i);
          tl.from(lines, { yPercent: 110, duration: 0.35, ease: "power3.out", stagger: 0.04 }, i);
        }
        if (i < last) tl.to(scene, { autoAlpha: 0, duration: 0.15 }, i + 0.8);
      });

      // Morning: the circle appears, then opens into the freediving photo.
      tl.to(circle, { autoAlpha: 1, duration: 0.2 }, 0.9);
      tl.to(photo, { clipPath: "circle(130% at 68% 50%)", duration: 1, ease: "power1.in" }, 1);
      tl.to(circle, { autoAlpha: 0, duration: 0.2 }, 1.8);
      tl.to(photo, { autoAlpha: 0, duration: 0.3 }, 2.7);

      return () => {
        delete section.dataset.pinned;
      };
    });

    // ---- Phones: stacked reveals instead of a pin ------------------------------
    mm.add(`(max-width: 767px) and ${motionOk}`, () => {
      $$("[data-lab-scene]").forEach((scene, i) => {
        gsap.set(scene, { backgroundColor: DAY_COLORS[i] ?? DAY_COLORS[DAY_COLORS.length - 1] });
        const lines = $$("[data-lab-scene-title], [data-lab-scene-body]", scene);
        gsap.from(lines, { autoAlpha: 0, y: 32, duration: 0.9, ease: "power2.out", stagger: 0.12, scrollTrigger: { trigger: scene, start: "top 80%", once: true } });
      });
    });
  });
}

function ctaFeel() {
  $$("[data-lab-cta]").forEach((el) => {
    const spring = { type: "spring" as const, stiffness: 320, damping: 22 };
    el.addEventListener("pointerenter", () => animate(el, { scale: 1.04 }, spring));
    el.addEventListener("pointerleave", () => animate(el, { scale: 1 }, spring));
    el.addEventListener("pointerdown", () => animate(el, { scale: 0.97 }, spring));
    el.addEventListener("pointerup", () => animate(el, { scale: 1.04 }, spring));
  });
}

/** Re-measure once images have their real size, so pin lengths and triggers are right. */
function refreshAfterImages() {
  let timer: number | undefined;
  const refresh = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => ScrollTrigger.refresh(), 120);
  };
  $$<HTMLImageElement>("img").forEach((img) => {
    if (!img.complete) img.addEventListener("load", refresh, { once: true });
  });
  window.addEventListener("load", refresh, { once: true });
}

function init() {
  if (reduceMotion.matches) {
    root.classList.remove("js-lab");
    return;
  }
  startSmoothScroll();
  build();
  ctaFeel();
  refreshAfterImages();

  // Lines were split for one width; re-split when the width changes.
  let lastWidth = window.innerWidth;
  let timer: number | undefined;
  window.addEventListener("resize", () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      build();
      ScrollTrigger.refresh();
    }, 250);
  });
}

reduceMotion.addEventListener("change", () => {
  if (reduceMotion.matches) {
    ctx?.revert();
    stopSmoothScroll();
    root.classList.remove("js-lab");
  }
});

// Fonts change line breaks, so split only after they have loaded.
void document.fonts.ready.then(init);
