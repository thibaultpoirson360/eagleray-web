import { useRef, useState } from "preact/hooks";

/**
 * "What every expedition stands on": a row of photo cards. On a desktop with
 * a mouse, a card widens on hover (and on keyboard focus) and shows its text
 * over a darkened photo. On touch, tapping a card opens it and closes the
 * others. Scroll-snap row with previous/next arrows on desktop. A semantic
 * ordered list; the text is always in the page, only visually hidden until a
 * card opens.
 */
export interface ExperienceCard {
  title: string;
  /** Shown instead of the 01, 02… number. */
  label?: string;
  text?: string;
  image?: string;
  imageAlt?: string;
  /** Shown in the photo space while there is no photo. */
  imageNote?: string;
  linkLabel?: string;
  linkHref?: string;
}

interface Props {
  title: string;
  cards: ExperienceCard[];
  previousLabel: string;
  nextLabel: string;
}

export default function ExperienceSlider({ title, cards, previousLabel, nextLabel }: Props) {
  const [open, setOpen] = useState<number | null>(null);
  const listRef = useRef<HTMLOListElement>(null);

  const scrollByCard = (direction: 1 | -1) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    listRef.current?.scrollBy({ left: direction * 440, behavior: reduce ? "auto" : "smooth" });
  };

  const arrow =
    "absolute top-1/2 z-[3] hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow transition-colors hover:bg-white md:flex";

  return (
    <div class="relative">
      <ol
        ref={listRef}
        aria-label={title}
        class="scrollbar-none -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] lg:-mx-pad lg:px-pad [&::-webkit-scrollbar]:hidden"
      >
        {cards.map((card, i) => {
          const isOpen = open === i;
          return (
            <li
              key={i}
              data-open={isOpen ? "true" : undefined}
              class="group/card w-[86%] flex-none snap-start transition-[width] duration-500 ease-soft motion-reduce:transition-none sm:w-[60%] md:w-[260px] md:focus-within:w-[420px] md:hover:w-[420px] md:data-[open=true]:w-[420px]"
            >
              <article
                tabindex={0}
                onClick={(event) => {
                  // A mouse already opens the card by hovering; taps and pens toggle it.
                  if ((event as unknown as PointerEvent).pointerType === "mouse") return;
                  setOpen(isOpen ? null : i);
                }}
                class="relative h-[26rem] cursor-pointer overflow-hidden rounded-lg bg-ink text-white outline-offset-4 focus-visible:outline-2 focus-visible:outline-ink"
              >
                {card.image ? (
                  <img src={card.image} alt={card.imageAlt ?? ""} loading="lazy" decoding="async" class="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <p class="absolute inset-0 flex items-center justify-center font-mono text-[.76rem] tracking-[.14em] text-white/60">
                    {card.imageNote}
                  </p>
                )}
                <div
                  class={`pointer-events-none absolute inset-0 bg-ink/10 bg-gradient-to-b from-ink/5 to-ink/55 transition-colors duration-500 motion-reduce:transition-none group-hover/card:bg-ink/60 group-focus-within/card:bg-ink/60 ${isOpen ? "bg-ink/60" : ""}`}
                />
                <div class="absolute top-5 right-5 left-5">
                  <p class="mb-2 font-mono text-[.76rem] tracking-[.14em] text-white/82 uppercase">
                    {card.label ?? String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 class="font-display text-[1.35rem] text-white">{card.title}</h3>
                </div>
                {card.text && (
                  <div
                    class={`absolute right-5 bottom-5 left-5 translate-y-2 text-[.95rem] leading-[1.6] text-white/92 opacity-0 transition duration-500 motion-reduce:translate-y-0 motion-reduce:transition-none group-hover/card:translate-y-0 group-hover/card:opacity-100 group-focus-within/card:translate-y-0 group-focus-within/card:opacity-100 ${isOpen ? "translate-y-0 opacity-100" : ""}`}
                  >
                    <p>{card.text}</p>
                    {card.linkLabel && card.linkHref && (
                      <p class="mt-3">
                        <a
                          href={card.linkHref}
                          onClick={(event) => event.stopPropagation()}
                          class="underline underline-offset-4 hover:text-white"
                        >
                          {card.linkLabel}
                        </a>
                      </p>
                    )}
                  </div>
                )}
              </article>
            </li>
          );
        })}
      </ol>
      <button type="button" aria-label={previousLabel} onClick={() => scrollByCard(-1)} class={`${arrow} left-2`}>
        <svg class="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <button type="button" aria-label={nextLabel} onClick={() => scrollByCard(1)} class={`${arrow} right-2`}>
        <svg class="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>
  );
}
