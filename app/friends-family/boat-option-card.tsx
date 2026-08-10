"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export type CarouselSlide = { src: string; label: string };
export type BoatOption = {
  id: string;
  name: string;
  spec: string;
  slides: readonly CarouselSlide[];
};

const SWIPE_THRESHOLD_PX = 40;

function Carousel({ slides }: { slides: readonly CarouselSlide[] }) {
  const [index, setIndex] = useState(0);
  const [visited, setVisited] = useState<Set<number>>(() => new Set([0]));
  const touchStartX = useRef<number | null>(null);

  // Functional updater so two rapid clicks/swipes (before React commits the
  // first) each advance from the real current index, not a stale closure.
  function shift(delta: number) {
    setIndex((prev) => {
      const clamped = Math.min(Math.max(prev + delta, 0), slides.length - 1);
      setVisited((v) => (v.has(clamped) ? v : new Set(v).add(clamped)));
      return clamped;
    });
  }

  function goToIndex(i: number) {
    const clamped = Math.min(Math.max(i, 0), slides.length - 1);
    setIndex(clamped);
    setVisited((v) => (v.has(clamped) ? v : new Set(v).add(clamped)));
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current == null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = touchStartX.current - endX;
    if (delta > SWIPE_THRESHOLD_PX) shift(1);
    else if (delta < -SWIPE_THRESHOLD_PX) shift(-1);
    touchStartX.current = null;
  }

  const active = slides[index];
  if (!active) {
    // Rights not cleared yet, or photos not delivered — say so plainly
    // rather than render a broken or fabricated image.
    return (
      <div className="flex aspect-3/2 items-center justify-center bg-surface px-4 text-center font-mono text-[0.6rem] uppercase tracking-[0.1em] text-ink-mute">
        Imagen pendiente de derechos
      </div>
    );
  }

  return (
    <div>
      <div
        className="group/car relative aspect-3/2 overflow-hidden bg-surface"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {slides.map((slide, i) =>
          visited.has(i) ? (
            <div key={slide.src} className={i === index ? "absolute inset-0" : "absolute inset-0 invisible"}>
              <Image
                src={slide.src}
                alt={slide.label}
                fill
                sizes="(max-width: 640px) 100vw, 420px"
                className="object-cover"
                priority={i === 0}
              />
            </div>
          ) : null,
        )}

        <span className="absolute bottom-2 left-2 rounded-xs bg-gradient-to-t from-ink/75 to-transparent px-2 py-1 text-[0.65rem] text-paper">
          {active.label}
        </span>

        {slides.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Foto anterior"
              onClick={(e) => {
                e.stopPropagation();
                shift(-1);
              }}
              disabled={index === 0}
              className="absolute left-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 text-ink opacity-0 transition-opacity focus-visible:opacity-100 group-hover/car:opacity-100 disabled:pointer-events-none disabled:opacity-0"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Foto siguiente"
              onClick={(e) => {
                e.stopPropagation();
                shift(1);
              }}
              disabled={index === slides.length - 1}
              className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 text-ink opacity-0 transition-opacity focus-visible:opacity-100 group-hover/car:opacity-100 disabled:pointer-events-none disabled:opacity-0"
            >
              ›
            </button>
          </>
        ) : null}
      </div>

      {slides.length > 1 ? (
        <div className="flex items-center justify-center gap-1.5 bg-paper py-2">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Ir a la foto ${i + 1}`}
              onClick={() => goToIndex(i)}
              className={["h-1.5 w-1.5 rounded-full transition-colors", i === index ? "bg-ink" : "bg-hairline-strong"].join(" ")}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function BoatOptionCard({
  option,
  selected,
  onToggle,
}: {
  option: BoatOption;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={["overflow-hidden rounded-sm border transition-colors", selected ? "border-ink" : "border-hairline-strong"].join(
        " ",
      )}
    >
      <Carousel slides={option.slides} />
      <div className="p-4">
        <p className="text-[0.95rem] font-medium text-ink">{option.name}</p>
        <p className="mb-3 text-[0.78rem] text-ink-mute">{option.spec}</p>
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={selected}
          className={[
            "flex w-full items-center justify-center gap-1.5 rounded-sm border px-4 py-2.5 text-[0.85rem] font-medium transition-colors",
            selected ? "border-ink bg-ink text-paper" : "border-hairline-strong text-ink hover:border-ink",
          ].join(" ")}
        >
          {selected ? (
            <>
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
                <path
                  d="M4 12.5l5 5L20 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Elegido
            </>
          ) : (
            "Elegir"
          )}
        </button>
      </div>
    </div>
  );
}
