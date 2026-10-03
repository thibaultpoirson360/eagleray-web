import { useState } from "preact/hooks";

/**
 * Mobile nav dropdown: tapping the main item expands its sub-links
 * underneath, in place — per explicit direction, not a navigation. A
 * `<button>` trigger (not `<a>`), deliberately: chrome.ts's initNav()
 * closes the whole mobile menu on any `<a>` click inside `.nav-mobile`,
 * which is exactly right for the sub-links themselves (tapping one should
 * navigate AND close the menu) but wrong for the trigger (tapping it
 * should only expand/collapse, never close the menu).
 *
 * The sub-links are always in the HTML (hidden while collapsed) so they can
 * be crawled — same reasoning as NavDesktopDropdown.
 *
 * Independent per instance, same as NavDesktopDropdown — expanding one
 * doesn't collapse the other.
 */
interface SubLink {
  label: string;
  href: string;
  tinaField: string;
}

interface Props {
  index: number;
  label: string;
  tinaField: string;
  items: SubLink[];
}

export default function NavMobileDropdown({ index, label, tinaField, items }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        class="flex w-full cursor-pointer items-baseline gap-4 border-0 bg-transparent font-display text-nav-mobile italic"
        aria-expanded={open}
        data-tina-field={tinaField}
        onClick={() => setOpen((v) => !v)}
      >
        <i class="font-mono text-[.62rem] tracking-widest text-white/60 not-italic">
          {String(index + 1).padStart(2, "0")}
        </i>
        <span class="flex-1 text-left">{label}</span>
        <svg
          class={`h-[.6rem] w-[.6rem] flex-none self-center transition-transform duration-300 ease-out ${open ? "rotate-180" : ""}`}
          viewBox="0 0 10 6"
          fill="none"
          aria-hidden="true"
        >
          <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <div class={`mt-[.8rem] mb-[.4rem] ml-[2.6rem] flex-col gap-[.7rem] ${open ? "flex" : "hidden"}`}>
        {items.map((item) => (
          <a key={item.label} href={item.href} data-tina-field={item.tinaField} class="text-[.85rem] tracking-[.02em] text-white/74">
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
}
