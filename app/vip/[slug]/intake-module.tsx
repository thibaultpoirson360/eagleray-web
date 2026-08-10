"use client";

import { useMemo, useState } from "react";

/* -------------------------------------------------------------------------- */
/* Options                                                                    */
/* -------------------------------------------------------------------------- */

type Option<T extends string> = {
  readonly id: T;
  readonly label: string;
  readonly detail: string;
};

const SEASONS = [
  {
    id: "october",
    label: "October",
    detail: "Warm water · best diving visibility",
  },
  {
    id: "november",
    label: "November",
    detail: "Freediving season · calm mornings",
  },
  {
    id: "december-february",
    label: "December – February",
    detail: "Kite & wing season · steady north wind",
  },
] as const satisfies readonly Option<string>[];

const DIVE_LEVELS = [
  { id: "none", label: "Not a diver", detail: "Snorkelling and swimming only" },
  { id: "discover", label: "First time", detail: "Discover dive with an instructor" },
  { id: "certified", label: "Certified", detail: "Open Water or equivalent" },
  { id: "advanced", label: "Advanced", detail: "Advanced / Rescue, comfortable at depth" },
] as const satisfies readonly Option<string>[];

const GEAR = [
  { id: "full-rental", label: "Rent everything", detail: "Full kit provided on board" },
  { id: "partial", label: "Partial rental", detail: "I bring mask, fins and wetsuit" },
  { id: "own-gear", label: "I bring my own", detail: "Only tanks and weights needed" },
] as const satisfies readonly Option<string>[];

const CABINS = [
  { id: "double-ensuite", label: "Double en-suite", detail: "Private cabin and bathroom" },
  { id: "double-shared", label: "Double, shared head", detail: "Private cabin, shared bathroom" },
  { id: "twin", label: "Twin cabin", detail: "Two single berths" },
  { id: "full-boat", label: "Whole boat", detail: "Full private charter for my group" },
] as const satisfies readonly Option<string>[];

type SeasonId = (typeof SEASONS)[number]["id"];
type DiveLevelId = (typeof DIVE_LEVELS)[number]["id"];
type GearId = (typeof GEAR)[number]["id"];
type CabinId = (typeof CABINS)[number]["id"];

/* -------------------------------------------------------------------------- */
/* Selector                                                                   */
/* -------------------------------------------------------------------------- */

function Selector<T extends string>({
  legend,
  options,
  value,
  onChange,
  name,
}: {
  legend: string;
  options: readonly Option<T>[];
  value: T;
  onChange: (next: T) => void;
  name: string;
}) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-3 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-mute">
        {legend}
      </legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const selected = option.id === value;
          return (
            <label
              key={option.id}
              className={[
                "flex cursor-pointer flex-col gap-1 rounded-sm border p-4 transition-colors",
                selected
                  ? "border-ink bg-ink text-paper"
                  : "border-hairline-strong bg-paper text-ink hover:border-ink",
              ].join(" ")}
            >
              <input
                type="radio"
                name={name}
                value={option.id}
                checked={selected}
                onChange={() => onChange(option.id)}
                className="sr-only"
              />
              <span className="text-[0.95rem] font-medium">{option.label}</span>
              <span
                className={selected ? "text-[0.78rem] text-paper/70" : "text-[0.78rem] text-ink-mute"}
              >
                {option.detail}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/* -------------------------------------------------------------------------- */
/* Module                                                                     */
/* -------------------------------------------------------------------------- */

function labelOf<T extends string>(options: readonly Option<T>[], id: T): string {
  return options.find((option) => option.id === id)?.label ?? id;
}

export type IntakeModuleProps = {
  readonly clientName: string;
  readonly slug: string;
  readonly stripeLink: string | null;
  readonly depositUsd: number;
  readonly whatsappNumber: string;
  readonly boatName: string | null;
  readonly leaderName: string | null;
};

export default function IntakeModule({
  clientName,
  slug,
  stripeLink,
  depositUsd,
  whatsappNumber,
  boatName,
  leaderName,
}: IntakeModuleProps) {
  const [season, setSeason] = useState<SeasonId>("october");
  const [diveLevel, setDiveLevel] = useState<DiveLevelId>("certified");
  const [gear, setGear] = useState<GearId>("full-rental");
  const [cabin, setCabin] = useState<CabinId>("double-ensuite");

  const depositLabel = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(depositUsd),
    [depositUsd],
  );

  /**
   * The WhatsApp handoff carries the selections in the message body: Thibault
   * gets the full picture in the first message instead of re-asking, and the
   * choices survive even though nothing has been written to Airtable yet.
   */
  const whatsappHref = useMemo(() => {
    const lines = [
      `Hi Thibault, it's ${clientName || "a guest"}.`,
      "",
      "I've been through my Eagle Ray page and here's what I'm leaning towards:",
      `• Season: ${labelOf(SEASONS, season)}`,
      `• Diving: ${labelOf(DIVE_LEVELS, diveLevel)}`,
      `• Gear: ${labelOf(GEAR, gear)}`,
      `• Cabin: ${labelOf(CABINS, cabin)}`,
    ];

    if (boatName) lines.push(`• Boat: ${boatName}`);
    if (leaderName) lines.push(`• Leader: ${leaderName}`);

    lines.push("", `(ref: ${slug})`);

    const digits = whatsappNumber.replace(/\D/g, "");
    return `https://wa.me/${digits}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [clientName, season, diveLevel, gear, cabin, boatName, leaderName, slug, whatsappNumber]);

  return (
    <div className="grid gap-8">
      <div className="grid gap-7">
        <Selector
          name="season"
          legend="Season window"
          options={SEASONS}
          value={season}
          onChange={setSeason}
        />
        <Selector
          name="dive-level"
          legend="Diving level"
          options={DIVE_LEVELS}
          value={diveLevel}
          onChange={setDiveLevel}
        />
        <Selector
          name="gear"
          legend="Equipment"
          options={GEAR}
          value={gear}
          onChange={setGear}
        />
        <Selector
          name="cabin"
          legend="Cabin preference"
          options={CABINS}
          value={cabin}
          onChange={setCabin}
        />
      </div>

      <div className="grid gap-3 border-t border-hairline pt-7">
        {stripeLink ? (
          <a
            href={stripeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-sm bg-ink px-7 py-4 text-center text-[0.95rem] font-medium text-paper transition-transform hover:-translate-y-0.5"
          >
            Hold my dates for Baja ({depositLabel} deposit)
          </a>
        ) : (
          /* No Stripe link on the record yet — say so plainly rather than
             rendering a dead button the client will click. */
          <p className="rounded-sm border border-dashed border-hairline-strong px-5 py-4 text-center text-[0.85rem] text-ink-mute">
            The deposit link is being prepared. Message Thibault below and he
            will send it straight over.
          </p>
        )}

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-sm border border-hairline-strong px-7 py-4 text-center text-[0.95rem] font-medium text-ink transition-colors hover:border-ink hover:bg-surface"
        >
          Talk the details through with Thibault on WhatsApp
        </a>

        <p className="text-center text-[0.78rem] text-ink-mute">
          The deposit holds your dates and is credited against the final
          balance. Your selections travel with the WhatsApp message.
        </p>
      </div>
    </div>
  );
}
