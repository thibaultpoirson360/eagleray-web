import { useEffect, useRef, useState } from "preact/hooks";

/**
 * "A day on board" of a private proposal, told full screen. The section is
 * tall; inside it a screen-sized stage stays pinned while the visitor scrolls,
 * and the scroll position picks the moment of the day: its photo fills the
 * screen (slowly zooming), and its time, title and text change. Dots on the
 * side jump to a moment.
 *
 * Without JavaScript, or with "reduce motion" on, nothing is pinned: every
 * moment is a plain full-width photo panel, one under the other, so the
 * content never depends on the scroll effect. The inline styles below are
 * the scroll-driven values (section height, zoom) that have no Tailwind form.
 */
interface Scene {
  time: string;
  title: string;
  text: string;
  image: string;
  imageAlt: string;
  fields: { time?: string; title?: string; text?: string; image?: string };
}
interface Props {
  eyebrow: string;
  title: string;
  note: string;
  scenes: Scene[];
  fields: { eyebrow?: string; title?: string; note?: string };
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const gutter = "px-5 lg:pr-pad lg:pl-[calc(var(--spacing-pad)+var(--rail))]";
const eyebrowCls = "font-mono text-[.62rem] tracking-[.2em] text-white/70 uppercase";
const pad2 = (n: number) => String(n).padStart(2, "0");

export default function ProposalDay({ eyebrow, title, note, scenes, fields }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [pinned, setPinned] = useState(false);
  const [progress, setProgress] = useState(0);
  const N = scenes.length;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPinned(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!pinned) return;
    let raf = 0;
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      setProgress(total > 0 ? clamp(-el.getBoundingClientRect().top / total, 0, 1) : 0);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pinned]);

  if (N === 0) return null;

  if (!pinned) {
    return (
      <section class="bg-ink text-white" aria-label={title}>
        <div class={`mx-auto max-w-site ${gutter} pt-[calc(var(--spacing-section)*2.8)] pb-16`}>
          <p class={eyebrowCls} data-tina-field={fields.eyebrow}>{eyebrow}</p>
          <h2 class="mt-7 text-[clamp(1.35rem,2.8vw,2.2rem)] leading-[1.2] text-white" data-tina-field={fields.title}>{title}</h2>
        </div>
        {scenes.map((s) => (
          <article class="relative isolate flex min-h-[80svh] items-end overflow-hidden">
            <img src={s.image} alt={s.imageAlt} loading="lazy" decoding="async" class="absolute inset-0 z-[-1] h-full w-full object-cover" data-tina-field={s.fields.image} />
            <div class="absolute inset-0 z-[-1] bg-linear-to-b from-ink/10 via-ink/20 via-40% to-ink/85"></div>
            <div class={`mx-auto w-full max-w-site ${gutter} pb-20`}>
              <p class={eyebrowCls} data-tina-field={s.fields.time}>{s.time}</p>
              <h3 class="mt-4 font-display text-[clamp(1.6rem,4vw,3rem)] leading-[1.05] text-white" data-tina-field={s.fields.title}>{s.title}</h3>
              <p class="mt-5 max-w-[40ch] text-[.9rem] leading-relaxed text-white/86" data-tina-field={s.fields.text}>{s.text}</p>
            </div>
          </article>
        ))}
      </section>
    );
  }

  const raw = progress * N;
  const active = Math.min(N - 1, Math.floor(raw));
  const local = raw - active;
  const jump = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + ((i + 0.05) / N) * (el.offsetHeight - window.innerHeight), behavior: "smooth" });
  };

  return (
    <section ref={ref} class="relative bg-ink text-white" style={{ height: `${N * 100}svh` }} aria-label={title}>
      <div class="sticky top-0 h-svh overflow-hidden">
        {scenes.map((s, i) => (
          <img
            src={s.image}
            alt={i === active ? s.imageAlt : ""}
            aria-hidden={i === active ? undefined : "true"}
            decoding="async"
            class={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-soft ${i === active ? "opacity-100" : "opacity-0"}`}
            style={i === active ? { transform: `scale(${1.04 + local * 0.08})` } : undefined}
            data-tina-field={s.fields.image}
          />
        ))}
        <div class="absolute inset-0 bg-linear-to-b from-ink/60 via-ink/10 via-35% to-ink/90"></div>

        <div class={`absolute inset-x-0 top-0 mx-auto max-w-site ${gutter} pt-28`}>
          <div class="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-2">
            <div>
              <p class={eyebrowCls} data-tina-field={fields.eyebrow}>{eyebrow}</p>
              <h2 class="mt-4 text-[clamp(1.2rem,2.2vw,1.7rem)] leading-[1.2] text-white" data-tina-field={fields.title}>{title}</h2>
            </div>
            {note && <p class="max-w-[34ch] text-[.74rem] text-white/70" data-tina-field={fields.note}>{note}</p>}
          </div>
        </div>

        <div class={`absolute inset-x-0 bottom-0 mx-auto max-w-site ${gutter} pb-16 lg:pb-24`}>
          <div class="relative min-h-[15rem]">
            {scenes.map((s, i) => (
              <div
                class={`absolute inset-x-0 bottom-0 transition duration-700 ease-soft ${i === active ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"}`}
                aria-hidden={i === active ? undefined : "true"}
              >
                <p class="font-mono text-[.62rem] tracking-[.2em] text-white/70 uppercase">
                  <span data-tina-field={s.fields.time}>{s.time}</span> · {pad2(i + 1)} / {pad2(N)}
                </p>
                <h3 class="mt-5 max-w-[16ch] font-display text-[clamp(2rem,6vw,4.2rem)] leading-[1.02] text-white" data-tina-field={s.fields.title}>{s.title}</h3>
                <p class="mt-6 max-w-[42ch] text-[.9rem] leading-[1.7] text-white/86" data-tina-field={s.fields.text}>{s.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div class="absolute top-1/2 right-5 flex -translate-y-1/2 flex-col gap-3 lg:right-pad">
          {scenes.map((s, i) => (
            <button
              type="button"
              onClick={() => jump(i)}
              aria-label={`${s.time}: ${s.title}`}
              aria-current={i === active ? "true" : undefined}
              class={`h-8 w-[3px] rounded-full transition duration-500 ease-soft focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${i === active ? "bg-white" : "bg-white/35 hover:bg-white/70"}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
}
