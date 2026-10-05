import { useState } from "preact/hooks";

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
}

export default function ImageSlider({ photos, previousLabel, nextLabel, dotLabel, className = "", dotsAt = "bottom" }: Props) {
  const [index, setIndex] = useState(0);
  if (photos.length === 0) return null;
  const count = photos.length;
  const current = photos[Math.min(index, count - 1)];
  const go = (n: number) => setIndex((n + count) % count);

  return (
    <div class={`group relative overflow-hidden bg-ink ${className}`}>
      <img src={current.src} alt={current.alt} loading="lazy" decoding="async" class="absolute inset-0 h-full w-full object-cover object-top" />
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
