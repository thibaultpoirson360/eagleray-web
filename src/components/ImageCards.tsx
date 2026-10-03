import { useEffect, useRef, useState } from "preact/hooks";

/**
 * A grid of cards that each open their photo larger in a modal. Used for the
 * La Paz wildlife cards and the "Where we go" places.
 *
 * Each card is a real link to the full-size photo, so with no JavaScript (or
 * before this island hydrates) it still works — it just opens the image. With
 * JavaScript, a click opens the modal instead, and the modal closes with the
 * close button, Escape or a click on the backdrop. Same native <dialog>
 * approach as CrewModal.tsx.
 */
export interface CardItem {
  name: string;
  /** Small line above the name, e.g. "Oct — Apr · Bahía de La Paz". Optional. */
  meta?: string;
  text?: string;
  src: string;
  alt: string;
}

interface Props {
  items: CardItem[];
  /** Accessible name for the modal's close button. */
  closeLabel: string;
}

export default function ImageCards({ items, closeLabel }: Props) {
  const [active, setActive] = useState<CardItem | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const unlock = () => {
      document.documentElement.style.overflow = "";
    };
    dialog.addEventListener("close", unlock);
    return () => dialog.removeEventListener("close", unlock);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (active && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    }
  }, [active]);

  const close = () => dialogRef.current?.close();

  return (
    <>
      <div class="grid gap-x-7 gap-y-10 [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))]">
        {items.map((item) => (
          <a
            href={item.src}
            target="_blank"
            rel="noopener"
            onClick={(e: MouseEvent) => {
              // Let modified clicks (new tab, etc.) behave as normal links.
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
              e.preventDefault();
              setActive(item);
            }}
            class="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
          >
            <div class="relative aspect-[4/3] overflow-hidden rounded-[10px] bg-surface">
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                class="h-full w-full object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.03]"
              />
            </div>
            {item.meta && <p class="mt-4 font-mono text-[.62rem] tracking-[.1em] text-ink/64 uppercase">{item.meta}</p>}
            <h3 class="mt-2 font-display text-[1.3rem] text-ink">{item.name}</h3>
            {item.text && <p class="mt-2 text-[.92rem] leading-[1.55] text-ink/64">{item.text}</p>}
          </a>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        onClose={() => setActive(null)}
        onClick={(e: MouseEvent) => {
          if (e.target === dialogRef.current) close();
        }}
        class="m-auto max-h-[92vh] w-[min(94vw,62rem)] overflow-hidden rounded-lg bg-transparent p-0 text-ink backdrop:bg-ink/70 backdrop:backdrop-blur-sm"
      >
        {active && (
          <figure class="relative bg-white">
            <button
              type="button"
              aria-label={closeLabel}
              onClick={close}
              class="absolute top-3 right-3 z-10 inline-flex size-9 items-center justify-center rounded-full bg-white/90 text-ink shadow transition-colors duration-200 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              <svg class="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
              </svg>
            </button>
            <img src={active.src} alt={active.alt} class="block max-h-[78vh] w-full object-contain bg-ink" />
            <figcaption class="px-6 py-5">
              {active.meta && <p class="font-mono text-[.62rem] tracking-[.1em] text-ink/64 uppercase">{active.meta}</p>}
              <h3 class="mt-1 font-display text-[1.4rem]">{active.name}</h3>
              {active.text && <p class="mt-2 text-[.95rem] leading-[1.6] text-ink/74">{active.text}</p>}
            </figcaption>
          </figure>
        )}
      </dialog>
    </>
  );
}
