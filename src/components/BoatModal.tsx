import { useEffect, useRef } from "preact/hooks";
import ImageSlider from "./ImageSlider.tsx";

/**
 * The boat pop-up shared by the Boats page (BoatsGrid) and the homepage boat
 * slider (BoatsModalHost): photos (ImageSlider), full text, features, specs
 * and the customize button. Native <dialog>: closes with the button, Escape or
 * a click on the backdrop.
 */
export interface BoatCard {
  id: string;
  name: string;
  tagline?: string;
  description?: string;
  details?: string;
  features?: string[];
  cover?: string;
  coverAlt?: string;
  length?: string;
  cabins?: string;
  bathrooms?: string;
  guests?: string;
  photos: { src: string; alt: string }[];
}

export interface BoatModalLabels {
  close: string;
  previous: string;
  next: string;
  photo: string;
  customize: string;
  customizeHref: string;
  stats: { length: string; cabins: string; bathrooms: string; guests: string };
}

interface Props {
  boat: BoatCard | null;
  labels: BoatModalLabels;
  onClose: () => void;
}

export default function BoatModal({ boat: active, labels, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const unlock = () => {
      document.documentElement.style.overflow = "";
      onClose();
    };
    dialog.addEventListener("close", unlock);
    return () => dialog.removeEventListener("close", unlock);
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (active && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    }
  }, [active]);

  const close = () => dialogRef.current?.close();

  const stats = (boat: BoatCard) =>
    [
      [labels.stats.length, boat.length],
      [labels.stats.cabins, boat.cabins],
      [labels.stats.bathrooms, boat.bathrooms],
      [labels.stats.guests, boat.guests],
    ].filter((pair): pair is [string, string] => !!pair[1]);

  return (
    <dialog
      ref={dialogRef}
      class="m-auto max-h-[88vh] w-[min(94vw,720px)] overflow-hidden rounded-xl bg-white p-0 text-ink backdrop:bg-ink/58 backdrop:backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === dialogRef.current) close();
      }}
    >
      {active && (
        <div class="max-h-[88vh] overflow-y-auto">
          <div class="relative aspect-[4/3] bg-ink">
            <ImageSlider
              photos={active.photos}
              previousLabel={labels.previous}
              nextLabel={labels.next}
              dotLabel={labels.photo}
              dotsAt="bottom"
              fit="contain"
              className="h-full w-full"
            />
            <button
              type="button"
              onClick={close}
              aria-label={labels.close}
              class="absolute top-3.5 right-3.5 z-[4] flex size-9 items-center justify-center rounded-full bg-ink/65 text-white"
            >
              ✕
            </button>
          </div>
          <div class="px-6 pt-8 pb-9 md:px-10">
            {active.tagline && <p class="font-mono text-[.7rem] tracking-[.1em] text-ink/64 uppercase">{active.tagline}</p>}
            <h2 class="mt-2 mb-4 text-[clamp(1.5rem,4vw,2rem)]">{active.name}</h2>
            {(active.details ?? active.description) && (
              <div class="text-[.98rem] leading-[1.65] text-ink/68">
                {(active.details ?? active.description ?? "").split(/\n\s*\n/).map((paragraph) => (
                  <p class="mb-3 whitespace-pre-line last:mb-0">{paragraph}</p>
                ))}
              </div>
            )}
            {active.features && active.features.length > 0 && (
              <ul class="mt-4 grid grid-cols-1 gap-x-6 gap-y-1.5 text-[.9rem] text-ink/64 sm:grid-cols-2">
                {active.features.map((feature) => (
                  <li class="flex gap-2">
                    <span class="text-ink/35" aria-hidden="true">—</span>
                    {feature}
                  </li>
                ))}
              </ul>
            )}
            <dl class="mt-6 grid grid-cols-2 gap-5 border-t border-ink/10 pt-5 md:grid-cols-4">
              {stats(active).map(([label, value]) => (
                <div>
                  <dt class="mb-1 font-mono text-[.6rem] tracking-[.1em] text-ink/45 uppercase">{label}</dt>
                  <dd class="text-[.95rem] text-ink">{value}</dd>
                </div>
              ))}
            </dl>
            <div class="mt-8">
              <a
                href={labels.customizeHref}
                class="inline-flex items-center rounded bg-ink px-6 py-3.5 text-[.88rem] text-white transition-colors hover:bg-ink-hover"
              >
                {labels.customize}
              </a>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
