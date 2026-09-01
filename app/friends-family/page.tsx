import type { Metadata } from "next";
import Image from "next/image";

import { getSiteUrl, WHATSAPP_NUMBER } from "@/lib/site";

import FaqAccordion from "./faq-accordion";
import TallyEmbed from "./tally-embed";

/* -------------------------------------------------------------------------- */
/* Metadata                                                                   */
/* -------------------------------------------------------------------------- */

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "ERE Friends & Family — Diseña tu expedición en Baja",
  description:
    "Ya conoces ERE. Cuéntame cuándo quieres estar en el mar, cuántos son, y qué buscan — y en 3 días te presento una propuesta hecha para tu grupo.",
  // Shared by invitation, not meant for organic search.
  robots: { index: false, follow: true },
  openGraph: {
    title: "ERE Friends & Family — Diseña tu expedición en Baja",
    description: "Cuéntame tu viaje. En 3 días tienes una propuesta hecha para tu grupo.",
    type: "website",
    url: `${getSiteUrl()}/friends-family`,
    siteName: "Eagle Ray Expeditions",
    // El preview de WhatsApp es el primer contacto visual — usa el mismo hero
    // que ve el visitante al abrir la página, no una imagen genérica del sitio.
    images: [{ url: `${getSiteUrl()}/assets/hero/hero-baydreamer-desktop.jpg` }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ERE Friends & Family — Diseña tu expedición en Baja",
    description: "Cuéntame tu viaje. En 3 días tienes una propuesta hecha para tu grupo.",
  },
};

/* -------------------------------------------------------------------------- */
/* Presentation pieces — mirrors the numbered-kicker / Section convention     */
/* already established on the VIP portal pages.                              */
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
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={["border-t border-hairline/60 px-5 py-14 sm:px-8 md:py-20 lg:px-12", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="mx-auto w-full max-w-5xl">{children}</div>
    </section>
  );
}

/**
 * Las 3 tarjetas comparten un 4:3 fijo — la retícula se lee como una sola fila,
 * y una altura distinta por tarjeta la rompe. Como los originales no vienen en
 * 4:3, `position` mueve el encuadre dentro del recorte en lugar de aceptar el
 * centro por defecto.
 */
function DreamCard({
  src,
  alt,
  title,
  position = "object-center",
  children,
}: {
  src: string;
  alt: string;
  title: string;
  position?: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-md border border-hairline bg-surface p-5 sm:p-6">
      <div className="relative mb-5 aspect-4/3 overflow-hidden rounded-sm bg-paper">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 860px) 100vw, 33vw"
          className={`object-cover ${position}`}
        />
      </div>
      <h3 className="mb-2 text-[1.25rem]">{title}</h3>
      <p className="text-[0.95rem] leading-relaxed text-ink-soft">{children}</p>
    </article>
  );
}

const HOW_IT_WORKS = [
  { title: "Cuéntame tu viaje", body: "7 preguntas, 2 minutos." },
  {
    title: "Yo diseño tu propuesta",
    body: "3 días, usando el sistema ERE y la red de barcos y tripulación en Baja.",
  },
  { title: "Hablamos y ajustamos", body: "Llamada de 30 minutos, en video." },
  { title: "Reservas con un anticipo", body: "El resto se paga después." },
];

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function FriendsFamilyPage() {
  return (
    <div lang="es-MX">
      <main className="min-h-screen bg-paper">
        {/* ============ HERO ============ */}
        <header className="px-5 pt-16 pb-14 sm:px-8 md:pt-24 md:pb-20 lg:px-12">
          <div className="mx-auto w-full max-w-5xl">
            <p className="mb-6 inline-flex rounded-xs border border-hairline-strong px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink">
              ERE Friends &amp; Family · Acceso Q4 2026
            </p>

            <h1 className="max-w-[20ch] text-[clamp(2.2rem,6.5vw,4rem)]">
              Diseño tu expedición en Baja. Personalmente. Esta semana.
            </h1>

            <p className="mt-6 max-w-[56ch] text-[clamp(1.02rem,2vw,1.2rem)] leading-relaxed text-ink-soft">
              Ya conoces ERE. Cuéntame cuándo quieres estar en el mar, cuántos son,
              y qué buscan — y en 3 días te presento una propuesta hecha para tu grupo,
              no un paquete genérico.
            </p>

            <a
              href="#formulario"
              className="mt-9 inline-flex items-center justify-center rounded-sm bg-ink px-7 py-4 text-[0.95rem] font-medium text-paper transition-transform hover:-translate-y-0.5"
            >
              Diseñar mi expedición →
            </a>
          </div>

          {/* Dos archivos, dos encuadres. Ojo: ocultar una variante con
              `display:none` no evita su descarga — Chrome baja igual la imagen
              lazy sin caja de layout, así que hoy el móvil se trae también el
              hero de escritorio. Solo `<picture>` con `media` descarga una sola;
              está anotado como TODO en CLAUDE.md. Mientras tanto `priority` vive
              en la variante móvil, que es el canal real (WhatsApp). */}
          <div className="relative mx-auto mt-14 w-full max-w-5xl overflow-hidden rounded-md bg-surface">
            <div className="relative aspect-3/4 sm:hidden">
              <Image
                src="/assets/hero/hero-baydreamer-mobile.jpg"
                alt="Mesa a bordo del Bay Dreamer, vista al mar turquesa"
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="relative hidden aspect-16/9 sm:block">
              <Image
                src="/assets/hero/hero-baydreamer-desktop.jpg"
                alt="Mesa a bordo del Bay Dreamer, vista al mar turquesa"
                fill
                sizes="1024px"
                className="object-cover"
              />
            </div>
          </div>
        </header>

        {/* ============ EL SISTEMA ============ */}
        <Section id="sistema">
          <div className="grid gap-8 md:grid-cols-[1fr_260px] md:items-start">
            <div>
              <Kicker index="01">Por qué esto no es un catálogo</Kicker>
              <h2 className="mb-6 max-w-[26ch] text-[clamp(1.6rem,4vw,2.4rem)]">
                Por qué esto no es &ldquo;elige un barco de un catálogo&rdquo;
              </h2>
              <p className="mb-5 max-w-[62ch] text-[0.98rem] leading-relaxed text-ink-soft">
                La mayoría de las agencias te mandan un PDF con barcos y te dicen: &ldquo;elige
                uno.&rdquo; Nosotros trabajamos al revés: primero entendemos a tu grupo — quiénes
                son, qué buscan, cómo se mueven en el mar — y después elegimos el barco correcto
                para ustedes, de una red mapeada de más de 50 embarcaciones en La Paz (Icon
                Charter, Dream Yacht Charter, Moorings, y operadores independientes), con
                capitanes, chefs y expedition leaders que ya operan bajo el sistema ERE.
              </p>
              <p className="max-w-[62ch] text-[1.05rem] font-medium text-ink">
                Tú traes al grupo. Nosotros resolvemos todo lo demás.
              </p>
            </div>
            {/* Original 9:16: en 4:5 se recortaba el 30% de la vertical. En 2:3
                (ratio de sección) se pierde la mitad, y entran velero y acantilado. */}
            <div className="relative order-first aspect-2/3 overflow-hidden rounded-md bg-surface md:order-none">
              <Image
                src="/assets/secciones/sistema-aerea.jpg"
                alt="Vista aérea de un velero fondeado en una bahía turquesa de Baja"
                fill
                sizes="(max-width: 768px) 100vw, 260px"
                className="object-cover"
              />
            </div>
          </div>
        </Section>

        {/* ============ EL SUEÑO ============ */}
        <Section id="sueno">
          <Kicker index="02">Lo que realmente estás comprando</Kicker>
          <h2 className="mb-8 max-w-[26ch] text-[clamp(1.6rem,4vw,2.4rem)]">
            Lo que realmente estás comprando
          </h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {/* Original 3:4 vertical: el centro por defecto se come el horizonte
                y deja agua vacía abajo. Subimos el encuadre. */}
            <DreamCard
              src="/assets/secciones/sueno-tu.jpg"
              alt="Entrando al agua turquesa junto a las rocas de Baja"
              title="Tú"
              position="object-[50%_40%]"
            >
              Tu cuerpo en el agua fría, la mente en blanco. Bucear, nadar, no hacer nada.
              El mar no te pide nada — tú decides qué tanto quieres de él.
            </DreamCard>
            <DreamCard src="/assets/secciones/sueno-ustedes.jpg" alt="Grupo en traje de neopreno riendo en la playa" title="Ustedes">
              El mismo barco, la misma puesta de sol, la misma historia después. Tu grupo
              viviendo exactamente lo mismo, al mismo tiempo, sin que nadie tenga que
              organizar nada.
            </DreamCard>
            <DreamCard src="/assets/secciones/sueno-mar.jpg" alt="Raya águila en el Mar de Cortés" title="El mar">
              Ballenas jorobadas, mantarrayas, un mar que Cousteau llamó &ldquo;el acuario
              del mundo.&rdquo; Todavía salvaje. Todavía real.
            </DreamCard>
          </div>
        </Section>

        {/* ============ CÓMO FUNCIONA ============ */}
        <Section id="como-funciona">
          <Kicker index="03">Cómo funciona</Kicker>
          <h2 className="mb-8 max-w-[26ch] text-[clamp(1.6rem,4vw,2.4rem)]">Cómo funciona</h2>
          <ol className="mb-8 grid gap-6 sm:grid-cols-2">
            {HOW_IT_WORKS.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-hairline-strong font-mono text-[0.85rem] text-ink">
                  {i + 1}
                </span>
                <div>
                  <h3 className="mb-1 text-[1.05rem]">{step.title}</h3>
                  <p className="text-[0.92rem] text-ink-soft">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
          {/* El original es 3:2 y el tema es la mesa puesta, abajo. En 21/9 se
              cortaba justo eso y sobraba techo. Anclando el recorte abajo, el
              16:9 conserva la mesa entera y solo pierde plafón. */}
          <div className="relative aspect-16/9 overflow-hidden rounded-md bg-surface">
            <Image
              src="/assets/secciones/como-funciona-salon.jpg"
              alt="Salón interior de un catamarán ICON"
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover object-bottom"
            />
          </div>
        </Section>

        {/* ============ EARLY BIRD ============ */}
        <Section id="early-bird" className="bg-ink text-paper">
          <p className="mb-4 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-paper/60">
            Early Bird 2026
          </p>
          <h2 className="mb-6 max-w-[24ch] text-[clamp(1.6rem,4vw,2.4rem)] text-paper">
            Reserva antes del 30 de septiembre
          </h2>
          <p className="mb-8 max-w-[60ch] text-[0.98rem] leading-relaxed text-paper/80">
            Reservas confirmadas antes del <strong className="text-paper">30 de septiembre de 2026</strong>,
            para viajar en Q4 2026 (octubre, noviembre o diciembre), acceden a la tarifa
            Early Bird — la mejor del año. Después de esa fecha, aplican tarifas estándar,
            sujetas a disponibilidad de barco y tripulación.
          </p>
          <a
            href="#formulario"
            className="inline-flex items-center justify-center rounded-sm bg-paper px-7 py-4 text-[0.95rem] font-medium text-ink transition-transform hover:-translate-y-0.5"
          >
            Diseñar mi expedición →
          </a>
        </Section>

        {/* ============ PREGUNTAS FRECUENTES ============ */}
        <Section id="preguntas">
          <Kicker index="04">Antes de decidir</Kicker>
          <h2 className="mb-3 max-w-[22ch] text-[clamp(1.6rem,4vw,2.4rem)]">
            Lo que normalmente preguntan
          </h2>
          <p className="mb-10 max-w-[56ch] text-[0.98rem] leading-relaxed text-ink-soft">
            Antes de escribirme, esto es lo que la mayoría quiere saber.
          </p>

          <FaqAccordion />

          <p className="mt-10 text-[0.95rem] text-ink-soft">
            ¿Ya no tienes dudas?{" "}
            <a href="#formulario" className="font-medium text-ink underline underline-offset-2 hover:no-underline">
              Empecemos con tu expedición →
            </a>
          </p>
        </Section>

        {/* ============ FORMULARIO ============ */}
        <Section id="formulario">
          <Kicker index="05">Diseñemos tu expedición</Kicker>
          <h2 className="mb-3 max-w-[24ch] text-[clamp(1.6rem,4vw,2.4rem)]">
            Diseñemos tu expedición
          </h2>
          <p className="mb-10 max-w-[52ch] text-[0.98rem] leading-relaxed text-ink-soft">
            7 preguntas. Menos de 2 minutos. Todo lo que necesito para armar tu propuesta.
          </p>

          <TallyEmbed />
        </Section>

        {/* ============ CIERRE ============ */}
        <Section id="cierre">
          <div className="mb-14 grid gap-8 sm:grid-cols-2">
            <div>
              <p className="mb-2 font-medium text-ink">¿Esto me compromete a algo?</p>
              <p className="text-[0.95rem] text-ink-soft">
                No. Es el punto de partida para tu propuesta. Decides después de la llamada.
              </p>
            </div>
            <div>
              <p className="mb-2 font-medium text-ink">
                ¿Qué pasa con mi anticipo si cambian las fechas?
              </p>
              <p className="text-[0.95rem] italic text-ink-mute">
                Thibault — completa esta respuesta según los términos definidos en el T&amp;C
                general de ERE.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t border-hairline pt-8">
            {/* Plano general 2:3 al timón. El recorte cuadrado baja al 72% para
                soltar cielo muerto arriba, pero la cara sigue ocupando ~15% del
                encuadre: a este tamaño se lee el barco, no la persona. Pendiente
                un recorte cuadrado dedicado — ver TODO en CLAUDE.md. */}
            <div className="relative h-16 w-16 flex-none overflow-hidden rounded-full bg-surface">
              <Image
                src="/assets/secciones/cierre-thibault.jpg"
                alt="Thibault Poirson"
                fill
                sizes="64px"
                className="object-cover object-[50%_72%]"
              />
            </div>
            <div>
              <p className="font-medium text-ink">Thibault Poirson</p>
              <p className="mb-2 text-[0.85rem] text-ink-mute">Founder, Eagle Ray Expeditions</p>
              <div className="flex gap-4 text-[0.85rem]">
                <a href="mailto:thibaultpoirson@gmail.com" className="text-ink underline underline-offset-2 hover:no-underline">
                  Email directo
                </a>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink underline underline-offset-2 hover:no-underline"
                >
                  WhatsApp directo
                </a>
              </div>
            </div>
          </div>
        </Section>

        <footer className="border-t border-hairline px-5 py-10 text-center sm:px-8 lg:px-12">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-mute">
            24°12′37.6″ N · La Paz · B.C.S.
          </p>
        </footer>
      </main>
    </div>
  );
}
