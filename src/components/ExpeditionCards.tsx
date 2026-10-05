import { useEffect, useRef, useState } from "preact/hooks";

/**
 * The expedition cards on the Sail with Us page (Sail With Us.dc.html): a
 * photo with the name over it and a "+ INFO" button. The button opens a modal
 * with the description, an optional link to the expedition's own page, and
 * the customize button. Native <dialog> like BoatsGrid.tsx.
 */
export interface ExpeditionCard {
  id: string;
  name: string;
  image?: string;
  imageAlt?: string;
  description?: string;
  href?: string;
}

interface Props {
  expeditions: ExpeditionCard[];
  labels: { info: string; close: string; learnMore: string; customize: string; customizeHref: string };
}

export default function ExpeditionCards({ expeditions, labels }: Props) {
  const [active, setActive] = useState<ExpeditionCard | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const unlock = () => {
      document.documentElement.style.overflow = "";
      setActive(null);
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
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {expeditions.map((expedition) => (
          <div class="group relative aspect-[3/4] overflow-hidden rounded-lg bg-ink transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgb(14_27_43/0.14)]">
            {expedition.image && (
              <img
                src={expedition.image}
                alt={expedition.imageAlt ?? ""}
                loading="lazy"
                decoding="async"
                class="absolute inset-0 h-full w-full object-cover"
              />
            )}
            <div class="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/5 to-ink/55" />
            <p class="absolute top-4 left-4 right-4 font-display text-[1.05rem] text-white">{expedition.name}</p>
            <button
              type="button"
              onClick={() => setActive(expedition)}
              class="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-sm bg-white/90 px-6 py-2.5 text-[.82rem] tracking-[.04em] text-ink transition-colors hover:bg-white"
            >
              {labels.info}
            </button>
          </div>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        class="m-auto w-[min(94vw,560px)] overflow-hidden rounded-xl bg-white p-0 text-ink backdrop:bg-ink/58 backdrop:backdrop-blur-sm"
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
      >
        {active && (
          <div class="max-h-[88vh] overflow-y-auto p-8 md:p-10">
            <div class="flex items-start justify-between gap-4">
              <h2 class="text-[clamp(1.4rem,3.4vw,1.75rem)]">{active.name}</h2>
              <button
                type="button"
                onClick={close}
                aria-label={labels.close}
                class="flex size-8 flex-none items-center justify-center rounded-full bg-ink/8 text-ink"
              >
                ✕
              </button>
            </div>
            {active.description && <p class="mt-5 text-[.98rem] leading-[1.7] text-ink/68">{active.description}</p>}
            <div class="mt-7 flex flex-wrap gap-3">
              <a
                href={labels.customizeHref}
                class="inline-flex items-center rounded bg-ink px-6 py-3.5 text-[.88rem] text-white transition-colors hover:bg-ink-hover"
              >
                {labels.customize}
              </a>
              {active.href && (
                <a
                  href={active.href}
                  class="inline-flex items-center rounded border border-ink/26 px-6 py-3.5 text-[.88rem] text-ink transition-colors hover:border-ink hover:bg-surface"
                >
                  {labels.learnMore}
                </a>
              )}
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
