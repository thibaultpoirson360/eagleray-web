import { useEffect, useRef, useState } from "preact/hooks";

/**
 * A horizontal slider of portrait cards: photo, first name and role. Over the
 * photo a navy veil with a text and a quote appears on hover (desktop) or when
 * the photo is tapped (tap again to close). Three cards show at once from `md`
 * up, with arrow buttons; on a phone one card shows and a swipe moves it.
 */
interface Person {
  image?: string;
  alt?: string;
  name: string;
  role?: string;
  text?: string;
  quote?: string;
}

interface Props {
  people: Person[];
  /** Accessible names for the controls and the slider. */
  label: string;
  previousLabel: string;
  nextLabel: string;
}

export default function PeopleSlider({ people, label, previousLabel, nextLabel }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = () => {
    const el = track.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  };
  useEffect(update, [people.length]);

  const move = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  const arrow = "hidden h-11 w-11 items-center justify-center rounded-full border border-ink/26 text-ink transition duration-500 hover:border-ink hover:bg-surface disabled:pointer-events-none disabled:opacity-30 motion-reduce:transition-none md:flex";

  return (
    <div class="relative">
      <div
        ref={track}
        onScroll={update}
        onKeyDown={(e) => e.key === "Escape" && setOpen(null)}
        tabIndex={0}
        role="group"
        aria-label={label}
        class="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] md:gap-8 [&::-webkit-scrollbar]:hidden"
      >
        {people.map((person, i) => {
          const shown = open === i;
          return (
            <div key={i} class="w-full shrink-0 snap-start md:w-[calc((100%-4rem)/3)]">
              <button
                type="button"
                aria-expanded={shown}
                onClick={() => setOpen(shown ? null : i)}
                class="group relative block aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-sm bg-surface text-left"
              >
                {person.image && <img src={person.image} alt={person.alt ?? ""} loading="lazy" decoding="async" class="absolute inset-0 h-full w-full object-cover" />}
                <span
                  class={`absolute inset-0 flex flex-col justify-end gap-5 bg-ink/70 p-6 text-white backdrop-blur-[3px] transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none sm:p-8 ${shown ? "opacity-100" : "opacity-0"}`}
                >
                  {person.text && <span class="text-[.82rem] leading-[1.7] text-white">{person.text}</span>}
                  {person.quote && <span class="font-serif text-[.95rem] leading-[1.65] text-white italic">{person.quote}</span>}
                </span>
              </button>
              <h3 class="mt-5 font-display text-[1.15rem] font-light text-ink">{person.name}</h3>
              {person.role && <p class="mt-1 font-mono text-[.68rem] leading-[1.5] tracking-[.1em] text-ink/64">{person.role}</p>}
            </div>
          );
        })}
      </div>
      <div class="mt-8 flex justify-center gap-3">
        <button type="button" class={arrow} aria-label={previousLabel} disabled={atStart} onClick={() => move(-1)}>←</button>
        <button type="button" class={arrow} aria-label={nextLabel} disabled={atEnd} onClick={() => move(1)}>→</button>
      </div>
    </div>
  );
}
