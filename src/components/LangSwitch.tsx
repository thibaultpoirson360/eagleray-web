import { useEffect, useRef, useState } from "preact/hooks";

/**
 * Nav's language switcher. Source (index.html L53-56) had a flat row of
 * `.lang-btn` buttons (ES/FR commented out, not built yet) — this is a
 * deliberate departure from that, a dropdown, per explicit direction since
 * a 3-way button row doesn't read well before ES/FR content exists.
 *
 * Preact per CLAUDE.md's stack section ("component-level interactivity
 * that needs a framework") — open/closed state, outside-click and Escape
 * to close, same category as the funnel wizard or the slider dots, not
 * page chrome.
 *
 * Not Tina-editable: see Nav.astro's comment on `langOptions` — this is
 * routing config (which locales exist, which have real pages), not
 * editorial content.
 */
interface LangOption {
  locale: string;
  /** Short trigger/menu label, e.g. "EN". */
  label: string;
  /** Full name shown in the open menu, e.g. "English". */
  fullLabel: string;
  href: string;
  /** False for a locale with no real pages yet (ES/FR today) — listed but not clickable. */
  isLive: boolean;
}

interface Props {
  current: string;
  options: LangOption[];
}

export default function LangSwitch({ current, options }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const currentOption = options.find((o) => o.locale === current) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div class="lang-switch relative" data-lang-switch ref={rootRef}>
      <button
        type="button"
        ref={triggerRef}
        class="lang-btn is-active inline-flex items-center gap-[.35rem] rounded-sm border border-(--nav-line) px-[.55rem] py-[.35rem] font-mono text-[.66rem] tracking-[.06em] text-(--nav-fg) transition-colors duration-300 ease-out focus-visible:outline-2 focus-visible:outline-(--nav-fg) focus-visible:outline-offset-2"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Language: ${currentOption.fullLabel}`}
        onClick={() => setOpen((v) => !v)}
      >
        {currentOption.label}
        <svg
          class={`h-[.55rem] w-[.55rem] transition-transform duration-300 ease-out ${open ? "rotate-180" : ""}`}
          viewBox="0 0 10 6"
          fill="none"
          aria-hidden="true"
        >
          <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Language"
          class="absolute top-[calc(100%+.5rem)] right-0 z-10 min-w-[8rem] overflow-hidden rounded border border-ink/14 bg-white py-1 text-ink shadow-lg"
        >
          {options.map((option) =>
            option.isLive ? (
              <a
                key={option.locale}
                role="menuitem"
                href={option.href}
                aria-current={option.locale === current ? "true" : undefined}
                class={`flex items-center justify-between gap-3 px-[.9rem] py-[.5rem] font-mono text-[.72rem] tracking-[.04em] transition-colors duration-200 ease-out hover:bg-surface focus-visible:bg-surface focus-visible:outline-none ${
                  option.locale === current ? "text-ink" : "text-ink/74"
                }`}
              >
                <span>{option.fullLabel}</span>
                {option.locale === current && (
                  <svg class="h-[.6rem] w-[.6rem] flex-none" viewBox="0 0 12 9" fill="none" aria-hidden="true">
                    <path
                      d="M1 4.5L4.5 8 11 1"
                      stroke="currentColor"
                      stroke-width="1.4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                )}
              </a>
            ) : (
              <span
                key={option.locale}
                role="menuitem"
                aria-disabled="true"
                class="flex items-center justify-between gap-3 px-[.9rem] py-[.5rem] font-mono text-[.72rem] tracking-[.04em] text-ink/35"
              >
                <span>{option.fullLabel}</span>
                <span class="text-[.6rem] tracking-normal uppercase">Soon</span>
              </span>
            )
          )}
        </div>
      )}
    </div>
  );
}
