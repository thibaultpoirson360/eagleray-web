"use client";

import { useState } from "react";

/**
 * Sourced and adapted from the team's ES-MX FAQ master
 * ("EAGLE RAY EXPEDITIONS — FAQ — español de México"). Two adaptations for
 * this page specifically:
 *  - Dropped the general funnel's "propuesta en 24 horas" promise — this
 *    page commits to 3 days (Thibault designs each F&F proposal personally),
 *    stated repeatedly above. Repeating a different number here would read
 *    as a contradiction on the same page.
 *  - Trimmed the "cuándo ir" answer to Q4 (Oct–Dec) since that's the window
 *    this page is actually selling; Jan–Mar isn't part of this offer.
 */
const FAQS: { q: string; a: string }[] = [
  {
    q: "¿Qué es exactamente una expedición ERE? ¿No es rentar un barco?",
    a: "No rentamos barcos. Diseñamos expediciones a la medida para tu grupo en el Mar de Cortés.\n\nEn una renta clásica reservas un barco y organizas tú todo lo demás: la comida, los guías, el buceo, la logística en tierra. Con nosotros eliges las fechas y juntas a tu gente — nosotros diseñamos el resto alrededor de lo que ese grupo en particular quiere vivir.\n\nEl barco es la plataforma. La expedición es el producto.",
  },
  {
    q: "¿Qué se puede personalizar de verdad?",
    a: "Prácticamente todo:\n\n· El barco — catamarán o monocasco, según el tamaño del grupo y el confort que busquen.\n· La tripulación — capitán, expedition leader, instructor de buceo o de kite, chef. Se arma en función de lo que van a hacer.\n· La ruta — islas, fondeos, ritmo. Hay grupos que quieren navegar ocho horas al día y grupos que quieren fondear y no moverse.\n· El menú — alergias, vegetarianos, el que solo come pescado, el que quiere ceviche todos los días.\n· Las actividades — buceo, apnea, pesca, kite, wing, paddle, yoga. O nada.\n\nLo único que no se negocia es la decisión del capitán sobre el mar. Si el pronóstico dice que no se sale, no se sale.",
  },
  {
    q: "¿Cuánto cuesta?",
    a: "Depende del barco, la temporada, la duración y lo que quieran hacer. Publicar una tarifa única sería mentirte, porque no sería la de tu grupo.\n\nTrabajamos por barco completo, no por persona. Un precio único y transparente que cubre renta del barco y tripulación, combustible del itinerario, cuotas de parques nacionales, equipo de snorkel y paddle, chef y las comidas, e internet Starlink a bordo si lo quieren. Actividades como buceo, kite o apnea se cobran por persona.\n\nFuera del precio: vuelos, seguro de viaje y propinas.\n\nCon tus 7 respuestas te armo una cifra en firme y desglosada — sin costos que aparecen después.",
  },
  {
    q: "Soy yo quien está juntando al grupo. ¿Cuánto trabajo me va a tocar?",
    a: "Mucho menos del que te imaginas.\n\nTú juntas a tu gente y eliges unas fechas. De ahí en adelante no te pido que lo decidas todo: te doy opciones claras — este barco o este otro, esta ruta o esta otra — para que el grupo pueda avanzar sin cincuenta mensajes en el chat.\n\nY una vez pagado el anticipo, dejas de ser el intermediario. Cada invitado puede darme sus propios detalles — alergias, nivel de buceo, talla de neopreno — y tratar directo conmigo.\n\nTú juntas al grupo. Yo me hago cargo de la expedición.",
  },
  {
    q: "Es su primera temporada. ¿Por qué debería confiar en ustedes?",
    a: "Es la pregunta correcta.\n\nERE arranca oficialmente el 1 de septiembre de 2026. Ya hicimos tres expediciones piloto — Islas Vírgenes en junio, Mar de Cortés en julio, Grecia en agosto — pagadas y evaluadas, para probar el sistema completo antes de cobrarlo.\n\nLos barcos son de operadores con años de actividad en la zona. La tripulación tiene certificación profesional — Yachtmaster, instructores PADI e IKO — y temporadas reales en Baja California Sur.\n\nLo nuevo aquí es la marca. No la gente, ni los barcos, ni el terreno.\n\nY si algo no sale como te lo prometí, hablas directo conmigo.\n— Thibault",
  },
  {
    q: "Mi grupo tiene niveles muy distintos. ¿Funciona igual?",
    a: "Es el caso normal, no la excepción. En un grupo de ocho casi siempre hay dos que bucean, uno avanzado, uno que nunca lo ha intentado y uno al que el mar abierto le da respeto.\n\nPor eso te pregunto el nivel de cada actividad antes de salir: el itinerario se construye alrededor del grupo real. Mientras unos bucean, otros hacen snorkel, pescan, o se quedan leyendo en el trampolín.\n\nPara navegar no hace falta ninguna experiencia. Para bucear con tanque sí se necesita certificación, pero si no la tienes puedes hacer un buceo de descubrimiento.\n\nNadie se queda fuera de nada.",
  },
  {
    q: "¿Cuál es el mejor mes para ir?",
    a: "Depende de lo que busques — el Mar de Cortés cambia mucho de un mes a otro.\n\nOctubre — el mejor mes de mar. Agua tibia, poco viento, la mejor visibilidad del año. Buceo, apnea, pesca y vela tranquila.\n\nNoviembre — transición. Apnea y pesca como protagonistas. Empieza a entrar el viento.\n\nDiciembre — la ventana de viento. Kite y wing en su mejor momento.\n\nSi me escribes para venir en octubre a hacer kite, te voy a decir que cambies de fecha. Prefiero perder una reservación antes que venderte el mes equivocado.",
  },
  {
    q: "¿Es seguro? ¿Quién está a bordo?",
    a: "A bordo siempre hay un capitán con certificación profesional y un expedition leader. Los barcos están certificados y equipados conforme a la normativa mexicana.\n\nAntes de cada salida revisamos el pronóstico. Esa decisión es del capitán: no se vota ni se negocia.\n\nNavegamos dentro del Mar de Cortés, en aguas protegidas, con puertos y evacuación médica a pocas horas.\n\nTe pedimos que cada participante viaje con seguro que cubra actividades acuáticas.",
  },
  {
    q: "¿Cómo es la vida a bordo?",
    a: "Duermen en camarotes dobles con baño propio. Se come a bordo: comida de verdad, hecha por el chef, pescado del día cuando hay suerte.\n\nUn día típico: café al amanecer, actividad de la mañana, comida y siesta en el fondeo, actividad de la tarde, cena y sobremesa larga bajo las estrellas.\n\nHay agua caliente y electricidad; el agua dulce se raciona, como en cualquier barco. Hay Starlink a bordo si lo quieren — y también está perfectamente bien apagarlo.\n\nEs cómodo, pero es un barco, no un hotel. Y ahí está justamente la gracia.",
  },
];

// Opens with the trust question — the one a not-yet-launched brand needs to
// answer first, per the sheet's own logic of leading with what converts.
const DEFAULT_OPEN_INDEX = 4;

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={["h-4 w-4 flex-none text-ink-mute transition-transform", open ? "rotate-180" : ""].join(" ")}
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(DEFAULT_OPEN_INDEX);

  return (
    <div className="divide-y divide-hairline border-y border-hairline">
      {FAQS.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
            >
              <span className="text-[0.98rem] font-medium text-ink">{item.q}</span>
              <Chevron open={open} />
            </button>
            {open ? (
              <div className="pb-6 pr-8">
                {item.a.split("\n\n").map((para, pi) => (
                  <p key={pi} className="mb-3 whitespace-pre-line text-[0.92rem] leading-relaxed text-ink-soft last:mb-0">
                    {para}
                  </p>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
