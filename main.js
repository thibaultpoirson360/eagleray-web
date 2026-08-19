/* =============================================================
   EAGLE RAY EXPEDITIONS — v3 — main.js
   Vanilla JS, single IIFE, no build step, no external dependency.
   ============================================================= */
(function () {
  "use strict";

  var DATA = window.__BRAND__ || {};
  var CONTACT = DATA.contact || {};
  var WA = String(CONTACT.whatsapp || "525568090942").replace(/\D/g, "");
  var MAX_DEPTH = (DATA.sounder && DATA.sounder.maxDepth) || 140;

  // ⚠️ Pending: create a form at https://formspree.io/forms and paste its endpoint
  // here so the funnel's lead capture (partial + complete) actually reaches an inbox.
  // Until this is a real endpoint, the WhatsApp handoff still works, but no lead is
  // ever recorded server-side if a visitor doesn't finish or open WhatsApp.
  var FORMSPREE_ENDPOINT = "https://formspree.io/f/xwlearnw";
  var FUNNEL_DRAFT_KEY = "eagleRayFunnelDraft";

  var I18N = window.__I18N__ || {};
  var LANGS = ["en", "es", "fr"];
  var lang = "en";

  var $ = function (sel, scope) { return (scope || document).querySelector(sel); };
  var $$ = function (sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); };
  var fineHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function safe(fn, name) {
    try { fn(); } catch (e) { if (window.console) console.warn("[" + name + "]", e); }
  }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  /* ---------- i18n: path lookup + dictionary of current language ---------- */
  function t(path) {
    var dict = I18N[lang] || I18N.en || {};
    var parts = path.split(".");
    var cur = dict;
    for (var i = 0; i < parts.length; i++) {
      if (cur == null) return undefined;
      cur = cur[parts[i]];
    }
    return cur;
  }

  /* ---------- single rAF loop shared by canvas painters ---------- */
  var painters = [];
  var rafRunning = false;
  function addPainter(fn) {
    painters.push(fn);
    if (!rafRunning) { rafRunning = true; requestAnimationFrame(tick); }
  }
  function tick(t) {
    for (var i = 0; i < painters.length; i++) {
      try { painters[i](t); } catch (e) { if (window.console) console.error("[painter]", e); painters.splice(i, 1); i--; }
    }
    requestAnimationFrame(tick);
  }
  function fitCanvas(cv) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var r = cv.getBoundingClientRect();
    var w = Math.max(1, Math.round(r.width));
    var h = Math.max(1, Math.round(r.height));
    if (cv.width !== w * dpr || cv.height !== h * dpr) {
      cv.width = w * dpr; cv.height = h * dpr;
      var ctx = cv.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    return { w: w, h: h };
  }

  /* ---------- Splash ---------- */
  function initSplash() {
    var splash = $("[data-splash]");
    if (!splash) return;
    var hide = function () { splash.classList.add("is-out"); };
    if (document.readyState === "complete") setTimeout(hide, 450);
    else window.addEventListener("load", function () { setTimeout(hide, 350); });
    setTimeout(hide, 3500);
  }

  /* ---------- Nav (solid on scroll + mobile menu) ---------- */
  function initNav() {
    var nav = $("[data-nav]");
    if (nav) {
      var onScroll = function () { nav.classList.toggle("is-solid", window.scrollY > 50); };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    var toggle = $("[data-nav-toggle]");
    var mobile = $("[data-nav-mobile]");
    if (!toggle || !mobile) return;
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      mobile.setAttribute("aria-hidden", String(!open));
      document.body.style.overflow = open ? "hidden" : "";
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    $$("a", mobile).forEach(function (a) { a.addEventListener("click", function () { setOpen(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveals() {
    var items = $$("[data-reveal], .reveal");
    if (!items.length) return;
    var showAll = function () { items.forEach(function (el) { el.classList.add("is-in"); }); };
    if (!("IntersectionObserver" in window)) { showAll(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.04, rootMargin: "0px 0px -4% 0px" });
    items.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i % 6, 5) * 55) + "ms";
      io.observe(el);
    });
    setTimeout(showAll, 6000);
  }

  /* ---------- Tilt (subtle 3D on hover) ---------- */
  function initTilt() {
    if (!fineHover) return;
    $$(".has-tilt").forEach(function (card) {
      var MAX = 6, tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        tx = -py * MAX; ty = px * MAX;
        if (!raf) raf = requestAnimationFrame(loop);
      });
      card.addEventListener("mouseleave", function () {
        tx = 0; ty = 0;
        if (!raf) raf = requestAnimationFrame(loop);
      });
      function loop() {
        cx += (tx - cx) * 0.15; cy += (ty - cy) * 0.15;
        card.style.setProperty("--rx", cx.toFixed(2) + "deg");
        card.style.setProperty("--ry", cy.toFixed(2) + "deg");
        raf = (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) ? requestAnimationFrame(loop) : null;
      }
    });
  }

  /* ---------- Magnetic buttons ---------- */
  function initMagnetic() {
    if (!fineHover) return;
    $$("[data-magnetic]").forEach(function (el) {
      var strength = parseFloat(el.dataset.magneticStrength || "0.25");
      var inner = document.createElement("span");
      inner.className = "magnetic-inner";
      while (el.firstChild) inner.appendChild(el.firstChild);
      el.appendChild(inner);
      el.classList.add("has-magnetic");
      var tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        tx = ((e.clientX - r.left) - r.width / 2) * strength;
        ty = ((e.clientY - r.top) - r.height / 2) * strength;
        if (!raf) raf = requestAnimationFrame(loop);
      });
      el.addEventListener("mouseleave", function () {
        tx = 0; ty = 0;
        if (!raf) raf = requestAnimationFrame(loop);
      });
      function loop() {
        cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
        inner.style.transform = "translate3d(" + cx + "px," + cy + "px,0)";
        raf = (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) ? requestAnimationFrame(loop) : null;
      }
    });
  }

  /* =========================================================
     SOUNDER — signature depth-gauge rail
     ========================================================= */
  function initSounder() {
    var rail = $(".sounder");
    var cv = $(".sounder-canvas");
    var out = $("[data-depth]");
    var label = $("[data-sounder-label]");
    if (!rail || !cv || !cv.getContext) return;

    var ctx = cv.getContext("2d");
    var stops = $$("[data-depth-stop]");
    var shown = 0, target = 0;

    function bed(d) {
      return 0.5 + Math.sin(d * 0.055) * 0.22 + Math.sin(d * 0.017 + 1.7) * 0.16 + Math.sin(d * 0.13 + 0.4) * 0.06;
    }
    function currentLabel() {
      var best = -1, y = window.innerHeight * 0.42;
      stops.forEach(function (s, idx) {
        var r = s.getBoundingClientRect();
        if (r.top <= y && r.bottom > 0) best = idx;
      });
      var depthStops = t("depth.stops");
      if (best > -1 && depthStops && depthStops[best]) return depthStops[best];
      if (best > -1) return stops[best].getAttribute("data-depth-name");
      return t("depth.surface") || "Surface";
    }

    addPainter(function () {
      var doc = document.documentElement;
      var span = Math.max(1, doc.scrollHeight - window.innerHeight);
      target = clamp(window.scrollY / span, 0, 1) * MAX_DEPTH;
      shown += (target - shown) * 0.09;

      var s = fitCanvas(cv), w = s.w, h = s.h;
      var pxPerM = 6.2;
      ctx.clearRect(0, 0, w, h);

      var top = shown - (h / 2) / pxPerM;
      var startM = Math.floor(top / 5) * 5;

      ctx.font = "9px 'JetBrains Mono', monospace";
      for (var d = startM; d < top + h / pxPerM + 5; d += 5) {
        if (d < 0) continue;
        var y = (d - top) * pxPerM;
        var major = d % 20 === 0;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(major ? 16 : 8, y);
        ctx.strokeStyle = major ? "rgba(245,239,225,0.22)" : "rgba(245,239,225,0.09)";
        ctx.lineWidth = 1;
        ctx.stroke();
        if (major) {
          ctx.fillStyle = "rgba(143,168,159,0.55)";
          ctx.fillText(d + "", 20, y + 3);
        }
      }

      ctx.beginPath();
      for (var yy = 0; yy <= h; yy += 4) {
        var dd = top + yy / pxPerM;
        var x = w - 6 - bed(dd) * (w * 0.42);
        if (yy === 0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
      }
      ctx.lineTo(w, h); ctx.lineTo(w, 0); ctx.closePath();
      ctx.fillStyle = "rgba(111,208,192,0.07)";
      ctx.fill();
      ctx.beginPath();
      for (var y2 = 0; y2 <= h; y2 += 4) {
        var d2 = top + y2 / pxPerM;
        var x2 = w - 6 - bed(d2) * (w * 0.42);
        if (y2 === 0) ctx.moveTo(x2, y2); else ctx.lineTo(x2, y2);
      }
      ctx.strokeStyle = "rgba(111,208,192,0.5)";
      ctx.lineWidth = 1;
      ctx.stroke();

      var mid = h / 2;
      ctx.beginPath();
      ctx.moveTo(0, mid); ctx.lineTo(w, mid);
      ctx.strokeStyle = "rgba(224,134,63,0.75)";
      ctx.stroke();

      if (out) out.textContent = Math.round(shown);
      if (label) {
        var lbl = currentLabel();
        if (label.textContent !== lbl) label.textContent = lbl;
      }
    });
  }

  /* =========================================================
     FAUNA — interactive species selector (real photo stage)
     ========================================================= */
  var faunaActiveSpecies = "whale-shark";
  function renderFaunaCaption() {
    var caption = $("[data-fauna-caption]");
    if (!caption) return;
    var f = t("fauna." + faunaActiveSpecies);
    if (!f) return;
    caption.innerHTML = f.name + '<span class="mono">' + f.season + " · " + f.place + "</span>";
  }
  function initFauna() {
    var list = $("[data-fauna-list]");
    var stage = $("[data-fauna-stage]");
    if (!list || !stage) return;

    var items = $$(".fauna-item", list);
    var arts = $$("img[data-art]", stage);

    function select(btn) {
      var key = btn.getAttribute("data-species");
      faunaActiveSpecies = key;
      items.forEach(function (b) { b.classList.toggle("is-active", b === btn); });
      arts.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("data-art") === key); });
      renderFaunaCaption();
    }

    items.forEach(function (btn) {
      btn.addEventListener("click", function () { select(btn); });
      btn.addEventListener("focus", function () { select(btn); });
      if (fineHover) {
        btn.addEventListener("mouseover", function (e) {
          if (btn.contains(e.relatedTarget)) return;
          select(btn);
        });
      }
    });
    renderFaunaCaption();
  }

  /* =========================================================
     RUTAS / ROUTES — accessible tabs
     ========================================================= */
  function initRutas() {
    var wrap = $("[data-rutas]");
    if (!wrap) return;
    var tabs = $$(".ruta-tab", wrap);
    var panels = $$(".ruta-panel", wrap);
    if (!tabs.length) return;

    function activate(i, focus) {
      tabs.forEach(function (t, n) {
        var on = n === i;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.setAttribute("tabindex", on ? "0" : "-1");
      });
      panels.forEach(function (p, n) {
        var on = n === i;
        p.classList.toggle("is-active", on);
        if (on) p.removeAttribute("hidden"); else p.setAttribute("hidden", "");
      });
      if (focus) tabs[i].focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { activate(i); });
      t.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") { e.preventDefault(); activate((i + 1) % tabs.length, true); }
        if (e.key === "ArrowLeft") { e.preventDefault(); activate((i - 1 + tabs.length) % tabs.length, true); }
      });
    });
    activate(0);
  }

  /* =========================================================
     DAY IN THE LIFE — interactive catamaran deck plan
     ========================================================= */
  var DAY_ORDER = ["sail", "activity", "lunch", "explore", "sunset", "dinner"];
  var dayActive = "sail";
  function renderDayCaption() {
    var capN = $("[data-day-caption-n]");
    var capT = $("[data-day-caption-t]");
    if (!capT) return;
    var idx = DAY_ORDER.indexOf(dayActive);
    var title = t("showcase.cards." + idx + ".t");
    if (capN) capN.textContent = (idx + 1 < 10 ? "0" : "") + (idx + 1);
    if (title != null) capT.innerHTML = title;
  }
  function initDayBoat() {
    var items = $$(".day-item");
    var imgs = $$("[data-day-img]");
    if (!items.length) return;

    function select(day) {
      dayActive = day;
      items.forEach(function (it) { it.classList.toggle("is-active", it.getAttribute("data-day") === day); });
      imgs.forEach(function (im) { im.classList.toggle("is-active", im.getAttribute("data-day-img") === day); });
      renderDayCaption();
    }
    items.forEach(function (it) {
      it.addEventListener("click", function () { select(it.getAttribute("data-day")); });
      if (fineHover) {
        it.addEventListener("mouseenter", function () { select(it.getAttribute("data-day")); });
      }
    });
    renderDayCaption();
  }

  /* =========================================================
     ACTIVITIES — ship's manifest (click to mark, live counter)
     ========================================================= */
  function renderManifestCount() {
    var out = $("[data-manifest-count]");
    if (!out) return;
    var total = $$(".manifest-item").length;
    var marked = $$(".manifest-item.is-marked").length;
    var tmpl = t("activities.markedOf") || "{n} of {total} marked";
    out.textContent = tmpl.replace("{n}", marked).replace("{total}", total);
  }
  function initManifest() {
    var items = $$(".manifest-item");
    var cta = $("[data-manifest-cta]");
    if (!items.length) return;
    items.forEach(function (it) {
      it.addEventListener("click", function () {
        it.classList.toggle("is-marked");
        renderManifestCount();
      });
    });
    if (cta) {
      cta.addEventListener("click", function () {
        var marked = $$(".manifest-item.is-marked .manifest-name").map(function (el) { return el.textContent.trim(); });
        if (!marked.length) return;
        var extra = document.querySelector('textarea[name="extra"]');
        if (extra && !extra.value.trim()) {
          var label = t("activities.interestedIn") || "Interested in:";
          extra.value = label + " " + marked.join(", ");
        }
      });
    }
    renderManifestCount();
  }

  /* =========================================================
     BOAT GALLERIES — per-card photo carousel (touch + arrows)
     ========================================================= */
  function initBoatGalleries() {
    $$("[data-gallery]").forEach(function (gal) {
      var track = $("[data-gallery-track]", gal);
      var prevBtn = $("[data-gallery-prev]", gal);
      var nextBtn = $("[data-gallery-next]", gal);
      var dotsWrap = $("[data-gallery-dots]", gal);
      if (!track) return;
      var slides = $$("img", track);
      if (!slides.length) return;

      if (dotsWrap && !dotsWrap.children.length) {
        dotsWrap.innerHTML = slides.map(function () { return "<span></span>"; }).join("");
      }
      var dots = dotsWrap ? $$("span", dotsWrap) : [];

      function step() { return track.clientWidth; }
      function update() {
        var maxScroll = track.scrollWidth - track.clientWidth - 2;
        if (prevBtn) prevBtn.disabled = track.scrollLeft <= 2;
        if (nextBtn) nextBtn.disabled = track.scrollLeft >= maxScroll;
        if (dots.length) {
          var idx = Math.round(track.scrollLeft / step());
          idx = Math.max(0, Math.min(dots.length - 1, idx));
          dots.forEach(function (d, i) { d.classList.toggle("is-active", i === idx); });
        }
      }
      if (prevBtn) prevBtn.addEventListener("click", function () { track.scrollBy({ left: -step(), behavior: reduced ? "auto" : "smooth" }); });
      if (nextBtn) nextBtn.addEventListener("click", function () { track.scrollBy({ left: step(), behavior: reduced ? "auto" : "smooth" }); });
      if (dots.length) {
        dots.forEach(function (dot, i) {
          dot.addEventListener("click", function () { track.scrollTo({ left: i * step(), behavior: reduced ? "auto" : "smooth" }); });
        });
      }
      var raf = null;
      track.addEventListener("scroll", function () {
        if (raf) return;
        raf = requestAnimationFrame(function () { update(); raf = null; });
      }, { passive: true });
      window.addEventListener("resize", update);
      update();
    });
  }

  /* =========================================================
     CREW — tap/click to flip a Polaroid and read the bio line
     ========================================================= */
  function initCrewFlip() {
    $$(".polaroid").forEach(function (card) {
      card.addEventListener("click", function () { card.classList.toggle("is-flipped"); });
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); card.classList.toggle("is-flipped"); }
      });
    });
  }

  /* =========================================================
     FAQ — one-at-a-time accordion over native <details>
     ========================================================= */
  function initFaq() {
    var wrap = $("[data-faq]");
    if (!wrap) return;
    var items = $$(".faq-item", wrap);
    items.forEach(function (d) {
      d.addEventListener("toggle", function () {
        if (!d.open) return;
        items.forEach(function (o) { if (o !== d) o.open = false; });
      });
    });
  }

  /* =========================================================
     FUNNEL — 4 steps → captures the lead (Formspree) and hands
     off to a pre-drafted WhatsApp message. Autosaves as you go.
     ========================================================= */
  function initFunnel() {
    var form = $("[data-funnel]");
    if (!form) return;

    var steps = $$(".fstep", form);
    var fill = $("[data-funnel-fill]", form);
    var count = $("[data-funnel-count]", form);
    var prev = $("[data-prev]", form);
    var next = $("[data-next]", form);
    var submitBtn = $("[data-funnel-submit]", form);
    var submitLabel = $("[data-submit-label]", form);
    var submitSpinner = $("[data-submit-spinner]", form);
    var submitError = $("[data-submit-error]", form);
    var recapEl = $("[data-funnel-recap]", form);
    var autosaveBadge = $("[data-autosave-badge]", form);
    var successEl = $("[data-funnel-success]", form);
    if (!steps.length || !next) return;

    var i = 0;
    var partialSent = false;
    var FIELD_NAMES = ["dias", "quien", "invitados", "foco", "prioridad", "desde", "hasta", "fechas_libres", "barco", "nombre", "email", "contacto", "extra"];

    function labelOf(el) {
      var span = el.nextElementSibling;
      return span ? span.textContent.trim() : (el.value || "").trim();
    }

    function val(name) {
      var el = form.elements[name];
      if (!el) return "";
      if (el.length && el[0] && el[0].type === "radio") {
        for (var k = 0; k < el.length; k++) if (el[k].checked) return labelOf(el[k]);
        return "";
      }
      return (el.value || "").trim();
    }

    function fechas() {
      var a = val("desde"), b = val("hasta"), libre = val("fechas_libres");
      var from = t("funnel.datesFrom") || "from";
      var tbd = t("funnel.datesTbd") || "to be confirmed";
      if (a && b) return a + " → " + b + (libre ? " (" + libre + ")" : "");
      if (a) return from + " " + a + (libre ? " (" + libre + ")" : "");
      return libre || tbd;
    }

    function message() {
      var L = [];
      L.push(t("funnel.msgIntro") || "Hi Thibault! I'd like to customize an Eagle Ray expedition.");
      L.push("");
      L.push("• " + (t("funnel.msgDuration") || "Duration") + ": " + (val("dias") || "—"));
      L.push("• " + (t("funnel.msgFor") || "For") + ": " + (val("quien") || "—"));
      L.push("• " + (t("funnel.msgGuests") || "Guests") + ": " + (val("invitados") || "—"));
      L.push("• " + (t("funnel.msgRoute") || "Route focus") + ": " + (val("foco") || "—"));
      L.push("• " + (t("funnel.msgPriority") || "Top priority") + ": " + (val("prioridad") || "—"));
      L.push("• " + (t("funnel.msgDates") || "Dates") + ": " + fechas());
      L.push("• " + (t("funnel.msgBoat") || "Boat") + ": " + (val("barco") || "—"));
      L.push("");
      L.push("• " + (t("funnel.msgName") || "Name") + ": " + (val("nombre") || "—"));
      L.push("• " + (t("funnel.msgEmail") || "Email") + ": " + (val("email") || "—"));
      var contacto = val("contacto");
      if (contacto) L.push("• " + (t("funnel.msgContact") || "WhatsApp") + ": " + contacto);
      var extra = val("extra");
      if (extra) L.push("• " + (t("funnel.msgNotes") || "Notes") + ": " + extra);
      return L.join("\n");
    }

    function payloadAnswers() {
      return {
        days: val("dias"), who: val("quien"), guests: val("invitados"),
        route: val("foco"), priority: val("prioridad"), dates: fechas(), boat: val("barco"),
        name: val("nombre"), email: val("email"), whatsapp: val("contacto"), notes: val("extra")
      };
    }

    /* ---------- Draft autosave/restore (raw form values, language-independent) ---------- */
    function rawValues() {
      var out = {};
      FIELD_NAMES.forEach(function (name) {
        var el = form.elements[name];
        if (!el) return;
        if (el.length && el[0] && el[0].type === "radio") {
          for (var k = 0; k < el.length; k++) if (el[k].checked) { out[name] = el[k].value; return; }
        } else {
          out[name] = el.value;
        }
      });
      return out;
    }

    function saveDraft() {
      try {
        localStorage.setItem(FUNNEL_DRAFT_KEY, JSON.stringify({ step: i, values: rawValues() }));
        if (autosaveBadge) {
          autosaveBadge.hidden = false;
          autosaveBadge.textContent = t("funnel.autosaveSaved") || "";
          autosaveBadge.classList.add("is-visible");
          clearTimeout(saveDraft._t);
          saveDraft._t = setTimeout(function () { autosaveBadge.classList.remove("is-visible"); }, 1800);
        }
      } catch (e) { /* storage unavailable — fail silently */ }
    }

    function clearDraft() { try { localStorage.removeItem(FUNNEL_DRAFT_KEY); } catch (e) {} }

    function restoreDraft() {
      try {
        var raw = localStorage.getItem(FUNNEL_DRAFT_KEY);
        if (!raw) return;
        var draft = JSON.parse(raw);
        if (!draft || !draft.values) return;
        Object.keys(draft.values).forEach(function (name) {
          var el = form.elements[name];
          if (!el) return;
          if (el.length && el[0] && el[0].type === "radio") {
            for (var k = 0; k < el.length; k++) el[k].checked = (el[k].value === draft.values[name]);
          } else if (draft.values[name]) {
            el.value = draft.values[name];
          }
        });
        if (typeof draft.step === "number") i = clamp(draft.step, 0, steps.length - 1);
        if (autosaveBadge) {
          autosaveBadge.hidden = false;
          autosaveBadge.textContent = t("funnel.autosaveRestored") || "";
          autosaveBadge.classList.add("is-visible");
        }
      } catch (e) { /* ignore corrupt draft */ }
    }

    /* ---------- Recap (shown on the last step) ---------- */
    function renderRecap() {
      if (!recapEl) return;
      var rows = [
        { label: t("funnel.msgDuration"), value: val("dias") },
        { label: t("funnel.msgFor"), value: val("quien") },
        { label: t("funnel.msgGuests"), value: val("invitados") },
        { label: t("funnel.msgRoute"), value: val("foco") },
        { label: t("funnel.msgPriority"), value: val("prioridad") },
        { label: t("funnel.msgDates"), value: fechas() },
        { label: t("funnel.msgBoat"), value: val("barco") }
      ];
      var items = rows.filter(function (r) { return r.value && String(r.value).trim(); })
        .map(function (r) { return '<span class="funnel-recap-chip">' + r.label + ': <strong>' + r.value + "</strong></span>"; });
      if (!items.length) { recapEl.innerHTML = ""; return; }
      recapEl.innerHTML = '<p class="funnel-recap-title">' + (t("funnel.recapTitle") || "") + '</p><div class="funnel-recap-row">' + items.join("") + "</div>";
    }

    /* ---------- Step rendering ---------- */
    function show(n) {
      i = clamp(n, 0, steps.length - 1);
      steps.forEach(function (s, k) { s.classList.toggle("is-active", k === i); });
      if (fill) fill.style.width = ((i + 1) / steps.length * 100) + "%";
      if (count) count.textContent = (t("funnel.stepOf") || "Step {n} of {total}").replace("{n}", i + 1).replace("{total}", steps.length);
      if (prev) prev.disabled = i === 0;
      var isLast = i === steps.length - 1;
      next.hidden = isLast;
      if (submitBtn) submitBtn.hidden = !isLast;
      if (isLast) renderRecap();
      var first = steps[i].querySelector("input:not([type=radio]), textarea, input[type=radio]:checked");
      if (first && i > 0) { try { first.focus({ preventScroll: true }); } catch (e) {} }
    }

    /* ---------- Validation ---------- */
    function isValidEmail(value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((value || "").trim()); }

    function validateField(input) {
      var errorEl = form.querySelector('[data-error-for="' + input.name + '"]');
      var valid = true;
      if (input.hasAttribute("data-required") && !input.value.trim()) valid = false;
      if (valid && input.type === "email" && input.value.trim()) valid = isValidEmail(input.value);
      input.classList.toggle("has-error", !valid);
      if (errorEl) errorEl.hidden = valid;
      return valid;
    }

    function validateRequired() {
      var ok = true;
      $$("[data-required]", form).forEach(function (input) { if (!validateField(input)) ok = false; });
      return ok;
    }

    /* ---------- Partial capture: fires once, silently, the moment a valid
       email is entered — so a lead is captured even if the visitor never
       reaches the final submit. Does not touch the UI. ---------- */
    function maybeSendPartial() {
      if (partialSent) return;
      if (!isValidEmail(val("email"))) return;
      partialSent = true;
      var payload = Object.assign({}, payloadAnswers(), { _status: "partial — reached contact step, did not submit" });
      fetch(FORMSPREE_ENDPOINT, {
        method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" }, body: JSON.stringify(payload)
      }).catch(function () { partialSent = false; });
    }

    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState !== "hidden") return;
      if (partialSent || !isValidEmail(val("email"))) return;
      partialSent = true;
      var payload = Object.assign({}, payloadAnswers(), { _status: "partial — tab closed after entering email" });
      try {
        navigator.sendBeacon(FORMSPREE_ENDPOINT, new Blob([JSON.stringify(payload)], { type: "application/json" }));
      } catch (e) { partialSent = false; }
    });

    /* ---------- Submit ---------- */
    function handleSubmit(e) {
      e.preventDefault();
      if (i !== steps.length - 1 || !validateRequired()) return;

      partialSent = true; // prevent a race with the blur/visibility partial-capture
      if (submitBtn) submitBtn.disabled = true;
      if (submitLabel) submitLabel.textContent = t("funnel.sending") || "Sending…";
      if (submitSpinner) submitSpinner.hidden = false;
      if (submitError) submitError.hidden = true;

      var payload = Object.assign({}, payloadAnswers(), { _status: "complete" });
      fetch(FORMSPREE_ENDPOINT, {
        method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" }, body: JSON.stringify(payload)
      }).then(function (res) {
        if (!res.ok) throw new Error("Formspree error " + res.status);
        return res.json();
      }).then(function () {
        clearDraft();
        var name = val("nombre");
        var nameEl = $("[data-success-name]", form);
        if (nameEl) nameEl.textContent = name ? ", " + name : "";
        var waBtn = $("[data-success-whatsapp]", form);
        if (waBtn) waBtn.href = "https://wa.me/" + WA + "?text=" + encodeURIComponent(message());
        form.classList.add("is-submitted");
        if (successEl) successEl.hidden = false;
        if (successEl) successEl.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
      }).catch(function () {
        if (submitBtn) submitBtn.disabled = false;
        if (submitLabel) submitLabel.textContent = t("funnel.submit") || "Send my expedition request";
        if (submitSpinner) submitSpinner.hidden = true;
        if (submitError) submitError.hidden = false;
      });
    }

    next.addEventListener("click", function () { if (i < steps.length - 1) { show(i + 1); saveDraft(); } });
    if (prev) prev.addEventListener("click", function () { show(i - 1); saveDraft(); });

    $$("[data-count]", form).forEach(function (b) {
      b.addEventListener("click", function () {
        var input = form.elements["invitados"];
        if (!input) return;
        var v = parseInt(input.value, 10);
        if (isNaN(v)) v = 4;
        input.value = clamp(v + parseInt(b.getAttribute("data-count"), 10), 2, 10);
        saveDraft();
      });
    });

    $$(".opt input", form).forEach(function (input) {
      input.addEventListener("change", saveDraft);
    });

    $$("input:not([type=radio]), textarea", form).forEach(function (input) {
      if (!input.name) return;
      input.addEventListener("input", function () {
        if (input.hasAttribute("data-required")) validateField(input);
        saveDraft();
      });
    });
    var emailInput = form.elements["email"];
    if (emailInput) emailInput.addEventListener("blur", maybeSendPartial);

    form.addEventListener("submit", handleSubmit);
    form.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" || e.target.tagName === "TEXTAREA") return;
      if (!next.hidden) { e.preventDefault(); next.click(); }
    });

    restoreDraft();
    show(i);
    window.__ERE_FUNNEL_REFRESH__ = function () { show(i); };
  }

  /* ---------- Contact info: WhatsApp number, Instagram, year ---------- */
  function initContact() {
    var year = $("[data-year]");
    if (year) year.textContent = new Date().getFullYear();
    if (WA) {
      $$('a[href*="wa.me/"]').forEach(function (a) { a.href = a.href.replace(/wa\.me\/\d+/, "wa.me/" + WA); });
    }
    if (CONTACT.instagram) {
      $$('a[href*="instagram.com"]').forEach(function (a) { a.href = CONTACT.instagram; });
    }
    if (CONTACT.email) {
      $$('a[href^="mailto:"]').forEach(function (a) { a.href = "mailto:" + CONTACT.email; });
    }
  }

  /* =========================================================
     I18N — apply translations + language switcher
     ========================================================= */
  function detectLang() {
    try {
      var saved = window.localStorage.getItem("ere_lang");
      if (saved && LANGS.indexOf(saved) > -1) return saved;
    } catch (e) {}
    var nav = ((navigator.language || navigator.userLanguage || "en") + "").slice(0, 2).toLowerCase();
    return LANGS.indexOf(nav) > -1 ? nav : "en";
  }

  function applyLang(next) {
    lang = LANGS.indexOf(next) > -1 ? next : "en";
    document.documentElement.setAttribute("lang", lang);

    $$("[data-i18n]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n"));
      if (v != null) el.innerHTML = v;
    });
    $$("[data-i18n-content]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n-content"));
      if (v != null) el.setAttribute("content", v);
    });
    $$("[data-i18n-placeholder]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n-placeholder"));
      if (v != null) el.setAttribute("placeholder", v);
    });
    $$("[data-i18n-aria-label]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n-aria-label"));
      if (v != null) el.setAttribute("aria-label", v);
    });

    $$("[data-lang-switch] .lang-btn").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-lang") === lang);
    });

    try { window.localStorage.setItem("ere_lang", lang); } catch (e) {}

    renderFaunaCaption();
    renderDayCaption();
    renderManifestCount();
    if (typeof window.__ERE_FUNNEL_REFRESH__ === "function") window.__ERE_FUNNEL_REFRESH__();
  }

  function initI18n() {
    lang = detectLang();
    applyLang(lang);
    $$("[data-lang-switch] .lang-btn").forEach(function (btn) {
      btn.addEventListener("click", function () { applyLang(btn.getAttribute("data-lang")); });
    });
  }

  /* ---------- Boot ---------- */
  function boot() {
    safe(initI18n, "initI18n");
    safe(initSplash, "initSplash");
    safe(initNav, "initNav");
    safe(initReveals, "initReveals");
    safe(initTilt, "initTilt");
    safe(initMagnetic, "initMagnetic");
    safe(initSounder, "initSounder");
    safe(initFauna, "initFauna");
    safe(initRutas, "initRutas");
    safe(initDayBoat, "initDayBoat");
    safe(initManifest, "initManifest");
    safe(initBoatGalleries, "initBoatGalleries");
    safe(initCrewFlip, "initCrewFlip");
    safe(initFaq, "initFaq");
    safe(initFunnel, "initFunnel");
    safe(initContact, "initContact");
    document.documentElement.classList.add("is-ready");
    document.body.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
