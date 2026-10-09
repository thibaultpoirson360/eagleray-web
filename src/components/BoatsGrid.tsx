import { useState } from "preact/hooks";
import BoatModal, { type BoatCard, type BoatModalLabels } from "./BoatModal.tsx";

export type { BoatCard };

/**
 * The Boats page grid, from the Claude Design mockup (Boats.dc.html). Each
 * card opens the shared BoatModal (photos, text, specs, customize button).
 */
interface Props {
  boats: BoatCard[];
  labels: BoatModalLabels;
}

export default function BoatsGrid({ boats, labels }: Props) {
  const [active, setActive] = useState<BoatCard | null>(null);

  return (
    <>
      <div class="grid gap-8 md:grid-cols-2">
        {boats.map((boat) => (
          <button
            type="button"
            onClick={() => setActive(boat)}
            class="group flex flex-col overflow-hidden rounded-lg border border-ink/14 bg-white text-left transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgb(14_27_43/0.12)]"
          >
            <div class="aspect-[4/3] w-full overflow-hidden bg-surface">
              {boat.cover && <img src={boat.cover} alt={boat.coverAlt ?? ""} loading="lazy" decoding="async" class="h-full w-full object-cover" />}
            </div>
            <div class="flex flex-1 flex-col p-6">
              <h3 class="font-display text-[1.35rem]">{boat.name}</h3>
              {boat.tagline && <p class="mt-1 font-mono text-[.72rem] tracking-[.08em] text-ink/64 uppercase">{boat.tagline}</p>}
              {boat.description && <p class="mt-3 text-[.9rem] leading-[1.55] text-ink/64">{boat.description}</p>}
              <dl class="mt-auto grid grid-cols-3 gap-4 border-t border-ink/8 pt-4">
                {[
                  [labels.stats.length, boat.length],
                  [labels.stats.cabins, boat.cabins],
                  [labels.stats.guests, boat.guests],
                ]
                  .filter((pair): pair is [string, string] => !!pair[1])
                  .map(([label, value]) => (
                    <div>
                      <dt class="font-mono text-[.6rem] tracking-[.1em] text-ink/45 uppercase">{label}</dt>
                      <dd class="mt-0.5 text-[.85rem] text-ink">{value}</dd>
                    </div>
                  ))}
              </dl>
            </div>
          </button>
        ))}
      </div>

      <BoatModal boat={active} labels={labels} onClose={() => setActive(null)} />
    </>
  );
}
