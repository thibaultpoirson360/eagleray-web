import { useRef, useState } from "preact/hooks";

/**
 * A photo slider for a crew member: dots to pick a photo, and arrows on
 * either side on desktop. With one photo it is just the photo (no dots, no
 * arrows). Each dot and arrow is a real button with a label.
 */
interface Props {
  photos: { src: string; alt: string }[];
  /** Accessible names for the controls. */
  previousLabel: string;
  nextLabel: string;
  /** Prefix for each dot's label, e.g. "Photo" -> "Photo 2". */
  dotLabel: string;
  /** Tailwind classes for the frame (aspect ratio, rounding). */
  className?: string;
  /** Where the dots sit: over the bottom edge (default) or the top edge. */
  dotsAt?: "top" | "bottom";
  /**
   * "cover" (default) fills the frame and crops — right for a fixed-size card
   * photo. "contain" shows the whole photo letterboxed on the frame's
   * background colour — right for a gallery of photos with mixed aspect
   * ratios, like the Boats modal, where cropping would cut off part of some.
   */
  fit?: "cover" | "contain";
}

export default function ImageSlider({ photos, previousLabel, nextLabel, dotLabel, className = "", dotsAt = "bottom", fit = "cover" }: Props) {
  const [index, setIndex] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  if (photos.length === 0) return null;
  const count = photos.length;
  const current = photos[Math.min(index, count - 1)];
  const go = (n: number) => setIndex((n + count) % count);

  // Swipe left/right on touch devices — the arrow buttons are desktop-only
  // (md:flex below), so touch has no other way to move through the photos.
  // touch-pan-y tells the browser this element handles horizontal gestures
  // itself, so a swipe doesn't also try to scroll the page sideways while
  // vertical scrolling over the slider still works normally.
  const onTouchStart = (e: TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || count < 2) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
    go(index + (dx < 0 ? 1 : -1));
  };

  return (
    <div class={`group relative touch-pan-y overflow-hidden bg-ink ${className}`} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <img
        src={current.src}
        alt={current.alt}
        loading="lazy"
        decoding="async"
        class={`absolute inset-0 h-full w-full ${fit === "contain" ? "object-contain" : "object-cover object-top"}`}
      />
      {count > 1 && (
        <>
          <button
            type="button"
            aria-label={previousLabel}
            onClick={() => go(index - 1)}
            class="absolute top-1/2 left-2 z-[3] hidden size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow transition-colors hover:bg-white md:flex"
          >
            <svg class="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label={nextLabel}
            onClick={() => go(index + 1)}
            class="absolute top-1/2 right-2 z-[3] hidden size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow transition-colors hover:bg-white md:flex"
          >
            <svg class="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <div class={`absolute left-1/2 z-[3] flex -translate-x-1/2 gap-2 ${dotsAt === "top" ? "top-3" : "bottom-3"}`}>
            {photos.map((_, i) => (
              <button
                type="button"
                aria-label={`${dotLabel} ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => setIndex(i)}
                class={`size-2 rounded-full transition-colors ${i === index ? "bg-white" : "bg-white/50 hover:bg-white/80"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
