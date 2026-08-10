import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import {
  getCustomerJourneyBySlug,
  type Boat,
  type CustomerJourney,
  type Person,
} from "@/lib/airtable";
import { getSiteUrl, WHATSAPP_NUMBER } from "@/lib/site";

import IntakeModule from "./intake-module";

/**
 * VIP pages are personalised per prospect and edited in Airtable between
 * conversations, so they render on demand and hold a short cache rather than
 * being baked at build time.
 */
export const revalidate = 300;

type PageProps = {
  // Next 15+ delivers route params asynchronously.
  params: Promise<{ slug: string }>;
};

/* -------------------------------------------------------------------------- */
/* Metadata — this is what WhatsApp renders in the link preview               */
/* -------------------------------------------------------------------------- */

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const journey = await getCustomerJourneyBySlug(slug);

  if (!journey) {
    return {
      title: "Private expedition portal — Eagle Ray Expeditions",
      robots: { index: false, follow: false },
    };
  }

  const title = journey.clientName
    ? `Welcome to Baja, ${journey.clientName}`
    : "Welcome to Baja";

  const description =
    journey.hook ||
    "Your private Sea of Cortez expedition, prepared by Eagle Ray Expeditions.";

  // Note: `images` is deliberately not set here. Leaving it out lets the
  // sibling opengraph-image.tsx supply a card served from our own domain,
  // which Airtable's expiring attachment URLs cannot do.
  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    // These pages carry a named prospect — never let them into an index.
    robots: { index: false, follow: false, nocache: true },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${getSiteUrl()}/vip/${journey.slug}`,
      siteName: "Eagle Ray Expeditions",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/* -------------------------------------------------------------------------- */
/* Presentation pieces                                                        */
/* -------------------------------------------------------------------------- */

function Kicker({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <p className="mb-4 flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-mute">
      <span className="text-ink">{index}</span>
      <span>{children}</span>
    </p>
  );
}

function Section({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="border-t border-hairline/60 px-5 py-14 sm:px-8 md:py-20 lg:px-12"
    >
      <div className="mx-auto w-full max-w-5xl">{children}</div>
    </section>
  );
}

function LeaderSection({ leader }: { leader: Person }) {
  return (
    <Section id="leader">
      <Kicker index="01">Your expedition leader</Kicker>
      <h2 className="mb-8 text-[clamp(1.8rem,4vw,2.8rem)]">
        People first. The boat is the platform.
      </h2>

      <div className="grid gap-7 rounded-md border border-hairline bg-surface p-5 sm:p-7 md:grid-cols-[220px_1fr] md:gap-9">
        {leader.photo ? (
          <div className="relative aspect-4/5 overflow-hidden rounded-sm bg-paper">
            <Image
              src={leader.photo.url}
              alt={leader.name || "Expedition leader"}
              fill
              sizes="(max-width: 768px) 100vw, 220px"
              className="object-cover"
            />
          </div>
        ) : null}

        <div className="self-center">
          <h3 className="text-[1.6rem]">{leader.name}</h3>
          {leader.role ? (
            <p className="mt-1 mb-4 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-mute">
              {leader.role}
            </p>
          ) : null}
          {leader.bio ? (
            <p className="text-[0.95rem] leading-relaxed text-ink-soft">{leader.bio}</p>
          ) : null}
          <p className="mt-5 border-t border-hairline pt-4 text-[0.85rem] text-ink-mute">
            You sail with the same crew all week — someone who has read this
            water for years, and whose first job is that everyone comes home
            safe.
          </p>
        </div>
      </div>
    </Section>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-ink-mute">
        {label}
      </dt>
      <dd className="mt-1 text-[0.9rem] text-ink">{value}</dd>
    </div>
  );
}

function BoatSection({ boat }: { boat: Boat }) {
  const specs: readonly { label: string; value: string }[] = [
    boat.model ? { label: "Model", value: boat.model } : null,
    boat.lengthMeters ? { label: "Length", value: `${boat.lengthMeters} m` } : null,
    boat.cabins ? { label: "Cabins", value: String(boat.cabins) } : null,
    boat.berths ? { label: "Guests", value: `up to ${boat.berths}` } : null,
    boat.heads ? { label: "Bathrooms", value: String(boat.heads) } : null,
    boat.year ? { label: "Year", value: String(boat.year) } : null,
  ].filter((spec): spec is { label: string; value: string } => spec !== null);

  const [hero, ...rest] = boat.photos;

  return (
    <Section id="boat">
      <Kicker index="02">Your vessel platform</Kicker>
      <h2 className="mb-8 text-[clamp(1.8rem,4vw,2.8rem)]">{boat.name}</h2>

      {hero ? (
        <div className="relative mb-7 aspect-4/3 overflow-hidden rounded-md bg-surface sm:aspect-16/9">
          <Image
            src={hero.url}
            alt={hero.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
            priority
          />
        </div>
      ) : null}

      {boat.specs ? (
        <p className="mb-7 max-w-[60ch] text-[0.95rem] leading-relaxed text-ink-soft">
          {boat.specs}
        </p>
      ) : null}

      {specs.length > 0 ? (
        <dl className="grid grid-cols-2 gap-5 border-t border-hairline pt-6 sm:grid-cols-3 md:grid-cols-6">
          {specs.map((spec) => (
            <Spec key={spec.label} label={spec.label} value={spec.value} />
          ))}
        </dl>
      ) : null}

      {boat.amenities.length > 0 ? (
        <ul className="mt-7 flex flex-wrap gap-2">
          {boat.amenities.map((amenity) => (
            <li
              key={amenity}
              className="rounded-xs border border-hairline px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-ink-mute"
            >
              {amenity}
            </li>
          ))}
        </ul>
      ) : null}

      {rest.length > 0 ? (
        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {rest.map((photo) => (
            <div
              key={photo.url}
              className="relative aspect-4/3 overflow-hidden rounded-sm bg-surface"
            >
              <Image
                src={photo.url}
                alt={photo.alt}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      ) : null}
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default async function VipPage({ params }: PageProps) {
  const { slug } = await params;
  const journey: CustomerJourney | null = await getCustomerJourneyBySlug(slug);

  if (!journey) notFound();

  const { clientName, hook, leader, boat, expedition } = journey;
  const greeting = clientName ? `Welcome to Baja, ${clientName}` : "Welcome to Baja";

  return (
    <main className="min-h-screen bg-paper">
      {/* Top banner */}
      <div className="border-b border-hairline bg-ink px-5 py-2.5 text-center sm:px-8">
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-paper/80">
          Private Expedition Portal
          {clientName ? ` • Prepared for ${clientName}` : null}
        </p>
      </div>

      {/* Hero */}
      <header className="px-5 pt-14 pb-12 sm:px-8 md:pt-20 md:pb-16 lg:px-12">
        <div className="mx-auto w-full max-w-5xl">
          {leader?.name ? (
            <p className="mb-6 inline-flex rounded-xs border border-hairline-strong px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink">
              Eagle Ray Expeditions × {leader.name}
            </p>
          ) : null}

          <h1 className="max-w-[18ch] text-[clamp(2.2rem,6.5vw,4.2rem)]">{greeting}</h1>

          {hook ? (
            <p className="mt-6 max-w-[52ch] text-[clamp(1.02rem,2vw,1.2rem)] leading-relaxed text-ink-soft">
              {hook}
            </p>
          ) : null}

          {expedition ? (
            <dl className="mt-10 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-5 border-t border-hairline pt-6 sm:grid-cols-4">
              {expedition.destination ? (
                <Spec label="Destination" value={expedition.destination} />
              ) : null}
              {expedition.durationDays ? (
                <Spec label="Duration" value={`${expedition.durationDays} days`} />
              ) : null}
              {boat?.name ? <Spec label="Vessel" value={boat.name} /> : null}
              {expedition.referencePriceUsd ? (
                <Spec
                  label="From"
                  value={new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  }).format(expedition.referencePriceUsd)}
                />
              ) : null}
            </dl>
          ) : null}

          {expedition?.summary ? (
            <p className="mt-8 max-w-[60ch] text-[0.95rem] leading-relaxed text-ink-mute">
              {expedition.summary}
            </p>
          ) : null}
        </div>
      </header>

      {leader ? <LeaderSection leader={leader} /> : null}
      {boat ? <BoatSection boat={boat} /> : null}

      {/* Intake & hold */}
      <Section id="hold">
        <Kicker index="03">Hold your dates</Kicker>
        <h2 className="mb-3 text-[clamp(1.8rem,4vw,2.8rem)]">
          Tell us how you want to sail.
        </h2>
        <p className="mb-9 max-w-[52ch] text-[0.98rem] leading-relaxed text-ink-soft">
          Four quick choices. They travel with you to WhatsApp so Thibault can
          come back with a real proposal rather than a form reply.
        </p>

        <IntakeModule
          clientName={clientName}
          slug={journey.slug}
          stripeLink={journey.stripeLink}
          depositUsd={journey.depositUsd}
          whatsappNumber={WHATSAPP_NUMBER}
          boatName={boat?.name ?? null}
          leaderName={leader?.name ?? null}
        />
      </Section>

      <footer className="border-t border-hairline px-5 py-10 text-center sm:px-8 lg:px-12">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-mute">
          24°12′37.6″ N · La Paz · B.C.S.
        </p>
        <p className="mt-3 text-[0.8rem] text-ink-mute">
          © {new Date().getFullYear()} Eagle Ray Expeditions · This page was
          prepared privately{clientName ? ` for ${clientName}` : ""}.
        </p>
      </footer>
    </main>
  );
}
