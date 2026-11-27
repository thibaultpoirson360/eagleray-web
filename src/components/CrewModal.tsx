import { useEffect, useRef } from "preact/hooks";
import type { ComponentChildren } from "preact";

/**
 * The "Meet <name> →" button on a home-slider crew card, and the modal it
 * opens. The modal's content (the complete crew card) is rendered on the
 * server by Astro and passed in as `children`, so it is real HTML from the
 * first paint — this component only adds open/close behaviour.
 *
 * Preact per CLAUDE.md ("component-level interactivity that needs a
 * framework"), on top of a native <dialog>: showModal() gives the focus
 * trap, Escape-to-close, the top layer and focus return to the button for
 * free. What it doesn't give, and this adds: closing on a backdrop click,
 * the close button, and locking the page's scroll while it's open.
 *
 * Height: the card inside caps itself at 92vh, its photo takes at most 32vh
 * and it squeezes its About text (the scrollable part) to fit, so the whole
 * card — photo, name, text, tags — is visible on a laptop screen. If a very
 * short screen still cannot fit it, the dialog itself scrolls (it must never
 * clip the text with no way to reach it).
 *
 * The trigger is a real link to the same card on the Passionate Sea People
 * page (`fallbackHref`), so with no JavaScript — or before this island has
 * hydrated — the button still takes the visitor to the full profile.
 */
interface Props {
  /** Full button text, e.g. "Meet Adly →". */
  label: string;
  /** Accessible name for the close button. */
  closeLabel: string;
  /** The person's name — names the dialog for screen readers. */
  name: string;
  /** Where the button goes with no JavaScript. */
  fallbackHref: string;
  /** Optional: something else to click instead of the text button (a portrait, for instance). */
  trigger?: ComponentChildren;
  /** Classes for the clickable element when `trigger` is given. */
  triggerClass?: string;
  children?: ComponentChildren;
}

export default function CrewModal({ label, closeLabel, name, fallbackHref, trigger, triggerClass, children }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const unlock = () => {
      document.documentElement.style.overflow = "";
    };
    // Fires for every way of closing: Escape, the close button, the backdrop.
    dialog.addEventListener("close", unlock);
    return () => {
      dialog.removeEventListener("close", unlock);
      unlock();
    };
  }, []);

  const open = (e: Event) => {
    e.preventDefault();
    dialogRef.current?.showModal();
    document.documentElement.style.overflow = "hidden";
  };
  const close = () => dialogRef.current?.close();

  return (
    <>
      <a
        href={fallbackHref}
        onClick={open}
        aria-label={trigger ? label : undefined}
        class={
          trigger
            ? (triggerClass ?? "block") + " focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
            : "inline-flex items-center gap-1 text-[.86rem] font-medium text-ink underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
        }
      >
        {trigger ?? label}
      </a>
      <dialog
        ref={dialogRef}
        aria-label={name}
        // With the card filling the dialog (no padding), a click that lands on
        // the dialog element itself is a click on the backdrop.
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
        class="m-auto max-h-[92vh] w-[min(94vw,650px)] overflow-y-auto overscroll-contain rounded-lg bg-transparent p-0 text-ink backdrop:bg-ink/60 backdrop:backdrop-blur-sm"
      >
        <div class="relative">
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
          {children}
        </div>
      </dialog>
    </>
  );
}
