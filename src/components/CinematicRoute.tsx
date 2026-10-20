import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "preact/hooks";

/**
 * A route told in full-screen scenes (the `cinematicRoute` landing block).
 * The section is tall; inside it a screen-sized stage stays fixed while the
 * visitor scrolls. The scroll position picks the scene: its photo, title and
 * text, and the leg of the route that the map draws (done legs solid, the
 * current one growing with the scroll, the rest dashed). Tabs switch trips.
 * Every scene is also written out in a hidden list, so the content does not
 * depend on the scroll effect.
 */
interface Beat {
  label: string;
  title: string;
  text: string;
  night: string;
  image: string;
  imageAlt: string;
  imageNote: string;
  from: string;
  to: string;
  path: string;
}
interface Stop {
  key: string;
  n: number;
  name: string;
  sub: string;
  x: number;
  y: number;
}
interface Trip {
  tab: string;
  beats: Beat[];
  stops: Stop[];
}
interface Props {
  trips: Trip[];
  land: string[];
  viewBox: number[];
  mapNote: string;
  heading: string;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
// Zero-width space: the red "pending" marker helper of the page does not need to touch this text.
const note = (s: string) => s.replace("[PENDIENTE", "[​PENDIENTE");

export default function CinematicRoute({ trips, land, viewBox, mapNote, heading }: Props) {
  const [tripIndex, setTripIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [reduced, setReduced] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ top: 0, h: 1, vh: 800 });
  const trip = trips[Math.min(tripIndex, trips.length - 1)];
  const beats = trip.beats;
  const N = beats.length;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        // Measured on every scroll: images and fonts above the section can move it after the first measure.
        const el = ref.current;
        if (el) setBox({ top: el.getBoundingClientRect().top + window.scrollY, h: el.offsetHeight, vh: window.innerHeight });
        setScrollY(window.scrollY);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      mq.removeEventListener("change", sync);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useLayoutEffect(() => {
    const measure = () => {
      const el = ref.current;
      if (el) setBox({ top: el.getBoundingClientRect().top + window.scrollY, h: el.offsetHeight, vh: window.innerHeight });
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
    const t = setTimeout(measure, 800);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
      clearTimeout(t);
    };
  }, [tripIndex]);

  const range = Math.max(1, box.h - box.vh);
  const c = clamp((scrollY - box.top) / range, 0, 0.9999);
  const i = Math.min(N - 1, Math.floor(c * N));
  const beat = beats[i];
  const local = c * N - i;
  const target = clamp(0.06 + local * 0.94, 0.06, 1);

  // The drawn part of the current leg eases towards the scroll position.
  const [progress, setProgress] = useState(target);
  const eased = useRef({ v: target, i, raf: 0 });
  useEffect(() => {
    const e = eased.current;
    cancelAnimationFrame(e.raf);
    if (reduced || e.i !== i) {
      e.i = i;
      e.v = target;
      setProgress(target);
      return;
    }
    const step = () => {
      const d = target - e.v;
      e.v = Math.abs(d) < 0.002 ? target : e.v + d * 0.2;
      setProgress(e.v);
      if (e.v !== target) e.raf = requestAnimationFrame(step);
    };
    e.raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(e.raf);
  }, [target, i, reduced]);

  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const [boat, setBoat] = useState<[number, number] | null>(null);
  useLayoutEffect(() => {
    const p = pathRefs.current[i];
    if (!p) return;
    const pt = p.getPointAtLength(p.getTotalLength() * progress);
    setBoat([pt.x, pt.y]);
  }, [i, progress, tripIndex]);

  const stopState = (s: Stop) => {
    if (s.key === beat.to) return progress > 0.97 ? "here" : "next";
    if (s.key === beat.from) return "from";
    const visited = beats.slice(0, i).some((b) => b.from === s.key || b.to === s.key);
    return visited ? "done" : "later";
  };

  const jumpTo = (beatIndex: number) => {
    window.scrollTo({ top: box.top + ((beatIndex + 0.12) / N) * range, behavior: "instant" as ScrollBehavior });
  };
  const jumpToStop = (s: Stop) => {
    const idx = beats.findIndex((b) => b.to === s.key);
    jumpTo(idx >= 0 ? idx : 0);
  };
  const chooseTrip = (t: number) => {
    setTripIndex(t);
    requestAnimationFrame(() => {
      const el = ref.current;
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: "instant" as ScrollBehavior });
    });
  };

  const [vx, vy, vw, vh] = viewBox;
  const near = (n: number) => Math.abs(n - i) <= 1;

  return (
    <div>
      <ol class="sr-only" aria-label={heading}>
        {trips.map((t) => (
          <li>
            {t.tab}
            <ol>
              {t.beats.map((b) => (
                <li>
                  {b.label}. {b.title}. {b.text} {b.night}
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ol>

      <div ref={ref} class="relative" style={{ height: `${N * 85 + 100}svh` }}>
        <div class="sticky top-0 h-svh overflow-hidden bg-ink text-white">
          {beats.map((b, n) => (
            <div key={n} aria-hidden="true" class={`absolute inset-0 transition-opacity duration-1000 motion-reduce:transition-none ${n === i ? "opacity-100" : "opacity-0"}`}>
              {b.image && near(n) ? (
                <img src={b.image} alt="" loading={n === 0 ? "eager" : "lazy"} decoding="async" class="h-full w-full object-cover" />
              ) : !b.image && b.imageNote ? (
                <p class="absolute top-28 left-5 max-w-[40ch] max-md:max-w-[calc(100%-200px)] font-mono text-[.76rem] tracking-[.14em] text-red-400 lg:left-[calc(var(--spacing-pad)+var(--rail))]">{note(b.imageNote)}</p>
              ) : null}
            </div>
          ))}
          <div class="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/20 to-transparent max-md:hidden" />
          <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent max-md:from-ink/90 max-md:via-ink/20" />

          <div key={`${tripIndex}-${i}`} class="absolute right-5 bottom-12 left-5 max-w-none md:right-auto md:bottom-[clamp(56px,12vh,120px)] md:max-w-[min(520px,60vw)] lg:left-[calc(var(--spacing-pad)+var(--rail))]">
            <div aria-hidden="true">
              <p class="font-mono text-[.7rem] tracking-[.2em] text-white/80 uppercase">{beat.label}</p>
              <h3 class="mt-3 mb-3.5 font-display text-[clamp(34px,5vw,68px)] leading-none font-medium tracking-[-.015em] text-white">{beat.title}</h3>
              {beat.text && <p class="max-w-[46ch] text-[clamp(.95rem,1.4vw,1.15rem)] leading-[1.55] text-white/88">{beat.text}</p>}
              {beat.night && (
                <p class="mt-4 inline-flex items-center gap-2.5 text-[.82rem] text-white">
                  <span class="size-2 rounded-full bg-white" />
                  {beat.night}
                </p>
              )}
            </div>
          </div>

          <aside class="absolute top-[88px] right-5 bottom-7 flex w-[clamp(300px,30vw,430px)] flex-col gap-2.5 rounded-2xl border border-white/18 bg-ink/85 p-4 backdrop-blur-md max-md:top-[70px] max-md:right-3 max-md:bottom-auto max-md:w-[170px] max-md:gap-2 max-md:rounded-xl max-md:p-2.5">
            <div class="flex flex-col gap-0.5">
              <span class="font-mono text-[.66rem] tracking-[.2em] text-white/70 uppercase max-md:text-[.56rem]">{trip.tab}</span>
              <strong class="font-display text-[1.35rem] leading-[1.1] font-medium max-md:text-[.9rem]">{beat.title}</strong>
            </div>
            <div class="flex min-h-0 flex-1 items-stretch gap-3.5 max-md:h-[38svh] max-md:flex-none">
              <svg
                class="aspect-[272/800] h-full w-auto max-w-[58%] flex-none rounded-[10px] bg-ink-hover max-md:mx-auto max-md:max-w-full"
                viewBox={`${vx} ${vy} ${vw} ${vh}`}
                role="img"
                aria-label={`${trip.tab}: ${trip.stops.map((s) => s.name).join(", ")}`}
              >
                <rect x="0" y="0" width="1000" height="1100" class="fill-ink-hover" />
                {land.map((d) => (
                  <path d={d} class="fill-surface stroke-white/50" stroke-width=".6" />
                ))}
                {beats.map((b, n) => (
                  <g key={n}>
                    <path d={b.path} fill="none" stroke-linecap="round" class={n < i ? "stroke-white/70" : "stroke-white/35"} stroke-width={n < i ? 2.4 : 1.8} stroke-dasharray={n < i ? undefined : "3 5"} />
                    {n === i && <path d={b.path} fill="none" stroke-linecap="round" class="stroke-white" stroke-width="4.2" pathLength={1} stroke-dasharray="1" stroke-dashoffset={1 - progress} ref={(el) => { pathRefs.current[n] = el; }} />}
                    {n !== i && <path d={b.path} style={{ display: "none" }} ref={(el) => { pathRefs.current[n] = el; }} />}
                  </g>
                ))}
                {trip.stops.map((s) => {
                  const st = stopState(s);
                  const filled = st === "done" || st === "from" || st === "here";
                  return (
                    <g
                      key={s.key}
                      class="cursor-pointer outline-none"
                      role="button"
                      tabIndex={0}
                      aria-label={`${s.name}${s.sub ? `, ${s.sub}` : ""}`}
                      onClick={() => jumpToStop(s)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") jumpToStop(s);
                      }}
                    >
                      {st === "here" && <circle cx={s.x} cy={s.y} r="14" fill="none" class="stroke-white" stroke-width="2" opacity=".6" />}
                      <circle cx={s.x} cy={s.y} r="11" class={`${filled ? "fill-white stroke-white" : "fill-ink-hover stroke-white"}`} stroke-width={st === "next" ? 3 : 2.4} />
                      <text x={s.x} y={s.y + 4.5} text-anchor="middle" class={filled ? "fill-ink" : "fill-white"} font-size="12" font-weight="700">
                        {s.n}
                      </text>
                    </g>
                  );
                })}
                {boat && <circle cx={boat[0]} cy={boat[1]} r="5.5" class="fill-white stroke-ink" stroke-width="3" />}
              </svg>
              <ol class="flex min-w-0 flex-1 list-none flex-col justify-center gap-1.5 max-md:hidden">
                {trip.stops.map((s) => {
                  const st = stopState(s);
                  return (
                    <li>
                      <button
                        type="button"
                        onClick={() => jumpToStop(s)}
                        class={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-white/10 ${st === "here" || st === "next" ? "bg-white/12" : ""}`}
                      >
                        <span class={`flex size-6 flex-none items-center justify-center rounded-full border border-white text-[.7rem] font-bold ${st === "done" || st === "from" || st === "here" ? "bg-white text-ink" : "text-white"}`}>{s.n}</span>
                        <span class="flex min-w-0 flex-col gap-0.5">
                          <strong class="text-[.92rem] leading-tight font-medium">{s.name}</strong>
                          {s.sub && <em class="text-[.75rem] leading-tight text-white/70 not-italic">{s.sub}</em>}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
            {trips.length > 1 && (
              <div class="flex gap-1 rounded-full bg-white/10 p-1" role="tablist">
                {trips.map((t, n) => (
                  <button
                    key={t.tab}
                    type="button"
                    role="tab"
                    aria-selected={n === tripIndex}
                    onClick={() => chooseTrip(n)}
                    class={`min-w-0 flex-1 truncate rounded-full px-1 py-1.5 text-[.72rem] max-md:text-[.56rem] ${n === tripIndex ? "bg-white text-ink" : "text-white/85 hover:bg-white/10"}`}
                  >
                    {t.tab}
                  </button>
                ))}
              </div>
            )}
            {mapNote && <p class="text-[.68rem] leading-[1.4] text-white/70 max-md:hidden">{mapNote}</p>}
          </aside>
        </div>
      </div>
    </div>
  );
}
