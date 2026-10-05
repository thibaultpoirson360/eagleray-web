import { useEffect, useRef, useState } from "preact/hooks";

/**
 * The dot-navigation control shared by the crew and boats sliders (the
 * source's own CSS already shares the `.boats-dot` class between both,
 * and main.js's initCrewDots()/initBoatsDots() were two thin wrappers
 * around the same initSliderDots() helper — one component here, same
 * idea). CLAUDE.md: "sliders (boats, crew)... Preact."
 *
 * The scroll-snap card row itself needs no framework (plain CSS
 * overflow-x + scroll-snap works with zero JS, matching the original
 * site's no-JS behaviour: the row still scrolls by touch/trackpad, it
 * just has no dots to click) — only the dot-navigation layer is
 * genuinely stateful (which card is centred, click-to-scroll).
 */
interface Props {
  /** DOM selector for the scrollable card row this control drives. */
  sliderSelector: string;
  /** DOM selector (relative to the slider) for one card. */
  cardSelector: string;
  count: number;
  labelPrefix?: string;
}

export default function SliderDots({
  sliderSelector,
  cardSelector,
  count,
  labelPrefix = "Go to item",
}: Props) {
  const [active, setActive] = useState(0);
  const sliderRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const slider = document.querySelector<HTMLElement>(sliderSelector);
    sliderRef.current = slider;
    if (!slider) return;

    const cards = Array.from(slider.querySelectorAll<HTMLElement>(cardSelector));

    function updateActive() {
      if (!slider || !cards.length) return;
      const mid = slider.scrollLeft + slider.clientWidth / 2;
      let closest = 0;
      let closestDist = Infinity;
      cards.forEach((card, i) => {
        const dist = Math.abs(card.offsetLeft - slider.offsetLeft + card.offsetWidth / 2 - mid);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });
      setActive(closest);
    }

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateActive();
        ticking = false;
      });
    };

    slider.addEventListener("scroll", onScroll);
    window.addEventListener("resize", updateActive);
    updateActive();
    return () => {
      slider.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateActive);
    };
  }, [sliderSelector, cardSelector]);

  function goTo(index: number) {
    const slider = sliderRef.current;
    const card = slider?.querySelectorAll<HTMLElement>(cardSelector)[index];
    if (!slider || !card) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    slider.scrollTo({ left: card.offsetLeft - slider.offsetLeft, behavior: reduced ? "auto" : "smooth" });
  }

  return (
    <div class="boats-dots mt-[1.6rem] flex items-center justify-center gap-[.6rem]">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          class={
            "boats-dot size-1.5 rounded-full transition-[background-color,transform] duration-300 ease-out " +
            (i === active ? "scale-[1.2] bg-ink" : "bg-ink/26 hover:bg-ink/52")
          }
          aria-label={`${labelPrefix} ${i + 1}`}
          onClick={() => goTo(i)}
        />
      ))}
    </div>
  );
}
