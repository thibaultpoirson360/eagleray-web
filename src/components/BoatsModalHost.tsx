import { useEffect, useState } from "preact/hooks";
import BoatModal, { type BoatCard, type BoatModalLabels } from "./BoatModal.tsx";

/**
 * Makes the homepage boat cards (Boats.astro, any element with
 * `data-boat-open="<boat id>"`) open the same pop-up as the Boats page.
 */
interface Props {
  boats: BoatCard[];
  labels: BoatModalLabels;
}

export default function BoatsModalHost({ boats, labels }: Props) {
  const [active, setActive] = useState<BoatCard | null>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const trigger = (event.target as Element | null)?.closest<HTMLElement>("[data-boat-open]");
      if (!trigger) return;
      const boat = boats.find((b) => b.id === trigger.dataset.boatOpen);
      if (boat) setActive(boat);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [boats]);

  return <BoatModal boat={active} labels={labels} onClose={() => setActive(null)} />;
}
