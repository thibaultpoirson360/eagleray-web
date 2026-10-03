import { useEffect, useRef, useState } from "preact/hooks";

/**
 * Desktop nav dropdown: a trigger styled identically to a plain `.nav-link`
 * (see Nav.astro, which renders plain links as static `<a>` — only items
 * with sub-links get this island) plus a floating panel of sub-links.
 * Preact per CLAUDE.md's stack rules — open/close state, outside-click and
 * Escape to close mirrors LangSwitch.tsx exactly.
 *
 * The sub-link panel is ALWAYS rendered (hidden with a class while closed),
 * not mounted on click: the links have to exist in the page's HTML so search
 * engines can follow them and so they can be used without JavaScript. With
 * JS off (`html:not(.js)`) the panel opens on hover / keyboard focus instead
 * of on a click.
 *
 * Deliberately independent per instance — opening one dropdown doesn't
 * close another (there are only two today; flag back if you want the
 * usual "only one open at a time" nav behavior instead).
 */
interface SubLink {
  label: string;
  href: string;
  tinaField: string;
}

interface Props {
  label: string;
  tinaField: string;
  items: SubLink[];
}

export default function NavDesktopDropdown({ label, tinaField, items }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

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
    <div class="group relative" ref={rootRef}>
      <button
        type="button"
        ref={triggerRef}
        class="nav-link relative flex cursor-pointer items-center gap-[.3rem] border-0 bg-transparent py-1 text-[.84rem] tracking-[.04em] text-(--nav-fg-mute) transition-colors duration-[400ms] ease-out after:absolute after:inset-x-0 after:bottom-[-3px] after:h-px after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-[450ms] after:ease-out after:content-[''] hover:text-(--nav-fg) hover:after:origin-left hover:after:scale-x-100 focus-visible:outline-2 focus-visible:outline-(--nav-fg) focus-visible:outline-offset-4"
        aria-haspopup="true"
        aria-expanded={open}
        data-tina-field={tinaField}
        onClick={() => setOpen((v) => !v)}
      >
        {label}
        <svg
          class={`h-[.5rem] w-[.5rem] transition-transform duration-300 ease-out ${open ? "rotate-180" : ""}`}
          viewBox="0 0 10 6"
          fill="none"
          aria-hidden="true"
        >
          <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <div
        role="menu"
        aria-label={label}
        class={`absolute top-[calc(100%+.9rem)] left-1/2 z-10 min-w-[13rem] -translate-x-1/2 overflow-hidden rounded border border-ink/14 bg-white py-1 text-ink shadow-lg no-js:group-focus-within:block no-js:group-hover:block ${open ? "" : "hidden"}`}
      >
        {items.map((item) => (
          <a
            key={item.label}
            role="menuitem"
            href={item.href}
            data-tina-field={item.tinaField}
            class="block px-[1.1rem] py-[.6rem] text-[.82rem] tracking-[.02em] text-ink/74 transition-colors duration-200 ease-out hover:bg-surface hover:text-ink focus-visible:bg-surface focus-visible:text-ink focus-visible:outline-none"
          >
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
}
