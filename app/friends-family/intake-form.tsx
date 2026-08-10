"use client";

import { useMemo, useState } from "react";

import BoatOptionCard, { type BoatOption } from "./boat-option-card";

/* -------------------------------------------------------------------------- */
/* Config                                                                     */
/* -------------------------------------------------------------------------- */

// ⚠️ Pending: create a form at https://formspree.io/forms and paste its
// endpoint here so completed leads also land in an inbox, not only WhatsApp.
// Mirrors the placeholder in public/main.js — same convention, own form so
// Friends & Family leads don't mix with the general public funnel.
const FORMSPREE_ENDPOINT = "";

const TOTAL_STEPS = 7;

/* -------------------------------------------------------------------------- */
/* Static option data                                                        */
/* -------------------------------------------------------------------------- */

const FECHA_OPTIONS = [
  "Octubre 2026",
  "Noviembre 2026",
  "Diciembre 2026",
  "Soy flexible dentro de Q4",
  "Tengo fechas exactas",
] as const;

const GRUPO_OPTIONS = ["Amigos", "Familia", "Pareja + amigos", "Grupo corporativo o celebración"] as const;

// Source photos land in /public/assets/barcos/ (11 files, normalized to
// 1200×800 WebP) — see the brief. Until they're delivered here the carousels
// render with no slides for that boat; the component tolerates that.
const BOAT_OPTIONS: readonly BoatOption[] = [
  {
    id: "icon",
    name: "Monocasco ICON",
    spec: "Beneteau Sense 55 · 3 cabinas · 6 personas · carácter clásico",
    slides: [
      { src: "/assets/barcos/icon-1-exterior.jpg", label: "Exterior" },
      { src: "/assets/barcos/icon-2-cubierta.jpg", label: "Cubierta" },
      { src: "/assets/barcos/icon-3-camarote.jpg", label: "Camarote" },
    ],
  },
  {
    id: "bay-dreamer",
    name: "Catamarán ERE Signature",
    spec: "Bay Dreamer · Lagoon 450F · 4 cabinas · 8 personas · A/C y Starlink",
    slides: [
      { src: "/assets/barcos/bd-1-exterior.jpg", label: "Exterior" },
      { src: "/assets/barcos/bd-2-cubierta.jpg", label: "Cubierta" },
      { src: "/assets/barcos/bd-3-camarote.jpg", label: "Camarote" },
    ],
  },
  {
    id: "bali",
    name: "Gran catamarán",
    spec: "Bali · 5–6 cabinas · hasta 12 personas",
    // Rights still "Kit chantier - non verifie" in Airtable, but
    // Cleared_By_Thibault is now checked on all 3 rows (decision 10/08/2026,
    // see Rights_Note) — publishable per the updated CLAUDE.md rule.
    slides: [
      { src: "/assets/barcos/bali-1-exterior.jpg", label: "Exterior" },
      { src: "/assets/barcos/bali-2-cubierta.jpg", label: "Cubierta" },
      { src: "/assets/barcos/bali-3-interior.jpg", label: "Interior" },
    ],
  },
  {
    id: "astrea",
    name: "Catamarán compacto",
    spec: "Astréa 42 · 3–4 cabinas · 6–8 personas",
    // Same Cleared_By_Thibault override as Bali. Only 2 slides exist —
    // astrea-3-camarote is still genuinely missing, not a rights issue.
    slides: [
      { src: "/assets/barcos/astrea-1-exterior.jpg", label: "Exterior" },
      { src: "/assets/barcos/astrea-2-cubierta.jpg", label: "Cubierta" },
    ],
  },
];

const ACTIVIDAD_OPTIONS = [
  "Buceo",
  "Apnea (freediving)",
  "Kite",
  "Wing",
  "Pesca",
  "Vela y relajación pura",
  "Snorkel y fotografía submarina",
] as const;

// Level options, conditional on the #1-ranked activity from step 4. The
// brief specified the "Buceo" example explicitly; the rest extend the same
// certification / competence / novice / not-applicable pattern.
const EXPERIENCIA_OPTIONS: Record<string, readonly string[]> = {
  "Buceo": ["Certificación Open Water", "Advanced o superior", "Ninguna, quiero probar", "No aplica"],
  "Apnea (freediving)": [
    "Certificación de freediving (AIDA/Molchanovs)",
    "Experiencia informal, sin certificación",
    "Ninguna, quiero probar",
    "No aplica",
  ],
  "Kite": [
    "Navego solo, con waterstart",
    "Nivel intermedio, necesito apoyo",
    "Nunca lo he hecho, quiero aprender",
    "No aplica",
  ],
  "Wing": [
    "Navego solo",
    "Nivel intermedio, necesito apoyo",
    "Nunca lo he hecho, quiero aprender",
    "No aplica",
  ],
  "Pesca": ["Pesco regularmente", "Algo de experiencia", "Nunca he pescado, quiero probar", "No aplica"],
  "Vela y relajación pura": [
    "Tengo experiencia navegando",
    "Poca o ninguna — solo quiero relajarme",
    "No aplica",
  ],
  "Snorkel y fotografía submarina": [
    "Nado con soltura en mar abierto",
    "Nado bien pero prefiero aguas tranquilas",
    "Principiante",
    "No aplica",
  ],
};
const EXPERIENCIA_FALLBACK = ["Con experiencia", "Poca experiencia", "Ninguna, quiero probar", "No aplica"];

const PRESUPUESTO_OPTIONS = [
  "$500–700 USD",
  "$700–900 USD",
  "$900+ USD",
  "Prefiero platicarlo en la llamada",
] as const;

/* -------------------------------------------------------------------------- */
/* State                                                                      */
/* -------------------------------------------------------------------------- */

type FormData = {
  fechas: string | null;
  fechasExactas: string;
  numPersonas: number;
  tipoGrupo: string | null;
  barcos: string[];
  actividades: string[];
  experiencia: string | null;
  presupuesto: string | null;
  nombre: string;
  contacto: string;
  nota: string;
};

const INITIAL_DATA: FormData = {
  fechas: null,
  fechasExactas: "",
  numPersonas: 4,
  tipoGrupo: null,
  barcos: [],
  actividades: [],
  experiencia: null,
  presupuesto: null,
  nombre: "",
  contacto: "",
  nota: "",
};

function buildMessage(d: FormData): string {
  const fechaLabel =
    d.fechas === "Tengo fechas exactas" && d.fechasExactas.trim() ? d.fechasExactas.trim() : d.fechas ?? "—";
  const lines = [
    `Hola Thibault, soy ${d.nombre.trim() || "un amigo de ERE"}.`,
    "",
    "Quiero diseñar mi expedición Friends & Family:",
    `• Fechas: ${fechaLabel}`,
    `• Grupo: ${d.numPersonas}${d.numPersonas >= 8 ? "+" : ""} personas — ${d.tipoGrupo ?? "—"}`,
    `• Barco: ${
      d.barcos.length
        ? d.barcos.map((id) => BOAT_OPTIONS.find((b) => b.id === id)?.name ?? id).join(", ")
        : "—"
    }`,
    `• Actividades (en orden): ${d.actividades.length ? d.actividades.join(" > ") : "—"}`,
    `• Experiencia: ${d.experiencia ?? "—"}`,
    `• Presupuesto: ${d.presupuesto ?? "—"}`,
  ];
  if (d.nota.trim()) lines.push(`• Nota: ${d.nota.trim()}`);
  lines.push("", `Contacto: ${d.contacto.trim()}`);
  return lines.join("\n");
}

/* -------------------------------------------------------------------------- */
/* Small building blocks — same card language as the VIP intake selector     */
/* -------------------------------------------------------------------------- */

function OptionCard({
  label,
  selected,
  rank,
  onClick,
}: {
  label: string;
  selected: boolean;
  rank?: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex w-full items-center justify-between gap-3 rounded-sm border px-4 py-3.5 text-left text-[0.95rem] transition-colors",
        selected ? "border-ink bg-ink text-paper" : "border-hairline-strong bg-paper text-ink hover:border-ink",
      ].join(" ")}
    >
      <span>{label}</span>
      {rank ? (
        <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-paper font-mono text-[0.7rem] font-medium text-ink">
          {rank}
        </span>
      ) : null}
    </button>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-mute">{children}</p>;
}

function StepNav({
  step,
  canGoBack,
  onBack,
  onNext,
  nextLabel,
}: {
  step: number;
  canGoBack: boolean;
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
}) {
  return (
    <div className="mt-8 flex items-center justify-between border-t border-hairline pt-6">
      {canGoBack ? (
        <button
          type="button"
          onClick={onBack}
          className="rounded-sm border border-hairline-strong px-5 py-3 text-[0.9rem] text-ink transition-colors hover:border-ink hover:bg-surface"
        >
          ← Atrás
        </button>
      ) : (
        <span />
      )}
      <button
        type="button"
        onClick={onNext}
        className="rounded-sm bg-ink px-6 py-3 text-[0.9rem] font-medium text-paper transition-transform hover:-translate-y-0.5"
      >
        {nextLabel}
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main component                                                             */
/* -------------------------------------------------------------------------- */

export default function IntakeForm({ whatsappNumber }: { whatsappNumber: string }) {
  const [step, setStep] = useState<number | "confirm">(1);
  const [data, setData] = useState<FormData>(INITIAL_DATA);
  const [showErrors, setShowErrors] = useState(false);

  const topActivity = data.actividades[0] ?? null;
  const experienciaOptions = topActivity ? EXPERIENCIA_OPTIONS[topActivity] ?? EXPERIENCIA_FALLBACK : EXPERIENCIA_FALLBACK;

  function patch(partial: Partial<FormData>) {
    setData((prev) => ({ ...prev, ...partial }));
  }

  function toggleInArray(field: "barcos", value: string) {
    setData((prev) => {
      const arr = prev[field];
      const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
      return { ...prev, [field]: next };
    });
  }

  function toggleRanked(value: string, max: number) {
    setData((prev) => {
      const arr = prev.actividades;
      if (arr.includes(value)) {
        return { ...prev, actividades: arr.filter((v) => v !== value) };
      }
      if (arr.length >= max) return prev;
      return { ...prev, actividades: [...arr, value] };
    });
  }

  function goNext() {
    if (step === "confirm" || step >= TOTAL_STEPS) return;
    setStep(step + 1);
  }
  function goBack() {
    if (step === "confirm" || step <= 1) return;
    setStep(step - 1);
  }

  const whatsappHref = useMemo(() => {
    const digits = whatsappNumber.replace(/\D/g, "");
    return `https://wa.me/${digits}?text=${encodeURIComponent(buildMessage(data))}`;
  }, [data, whatsappNumber]);

  function handleSubmit() {
    if (!data.nombre.trim() || !data.contacto.trim()) {
      setShowErrors(true);
      return;
    }

    if (FORMSPREE_ENDPOINT) {
      fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, message: buildMessage(data) }),
      }).catch(() => {
        // WhatsApp remains the reliable channel below — a failed background
        // POST shouldn't block the guest's confirmation.
      });
    }

    setStep("confirm");
  }

  if (step === "confirm") {
    return (
      <div className="mx-auto max-w-lg rounded-md border border-hairline bg-surface px-6 py-12 text-center sm:px-10">
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-ink text-paper">
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path d="M4 12.5l5 5L20 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" pathLength={1} />
          </svg>
        </div>
        <h3 className="mb-4 text-[1.5rem]">Listo. Ya tengo lo que necesito.</h3>
        <p className="mb-6 text-[0.98rem] leading-relaxed text-ink-soft">
          En los próximos 3 días te voy a mandar tu propuesta — pensada específicamente para
          tu grupo. Después la agendamos en una llamada para ajustar los últimos detalles.
        </p>
        <p className="mb-8 font-medium text-ink">— Thibault</p>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-sm border border-hairline-strong px-6 py-3.5 text-[0.9rem] font-medium text-ink transition-colors hover:border-ink hover:bg-paper"
        >
          Seguir la conversación por WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      {/* progress */}
      <div className="mb-8">
        <div className="h-[3px] w-full overflow-hidden rounded-full bg-hairline">
          <div
            className="h-full bg-ink transition-[width] duration-300"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
        <p className="mt-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-mute">
          Paso {step} de {TOTAL_STEPS}
        </p>
      </div>

      <div className="rounded-md border border-hairline bg-paper p-6 sm:p-8">
        {/* STEP 1 — Fechas */}
        {step === 1 ? (
          <div>
            <h3 className="mb-6 text-[1.3rem]">¿Cuándo sueñas con estar en el mar?</h3>
            <div className="grid gap-2.5">
              {FECHA_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt}
                  label={opt}
                  selected={data.fechas === opt}
                  onClick={() => patch({ fechas: opt, fechasExactas: opt === "Tengo fechas exactas" ? data.fechasExactas : "" })}
                />
              ))}
            </div>
            {data.fechas === "Tengo fechas exactas" ? (
              <input
                type="text"
                value={data.fechasExactas}
                onChange={(e) => patch({ fechasExactas: e.target.value })}
                placeholder="Ej. 12–18 de noviembre"
                className="mt-3 w-full rounded-sm border border-hairline-strong bg-paper px-4 py-3 text-[0.95rem] text-ink outline-none focus:border-ink"
              />
            ) : null}
            <StepNav step={step} canGoBack={false} onBack={goBack} onNext={goNext} nextLabel="Siguiente →" />
          </div>
        ) : null}

        {/* STEP 2 — Grupo */}
        {step === 2 ? (
          <div>
            <h3 className="mb-6 text-[1.3rem]">¿Cuántos son, y quiénes viajan contigo?</h3>
            <FieldLabel>Personas en el grupo</FieldLabel>
            <div className="mb-7 flex items-center gap-5">
              <button
                type="button"
                aria-label="Menos personas"
                onClick={() => patch({ numPersonas: Math.max(2, data.numPersonas - 1) })}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline-strong text-[1.2rem] text-ink hover:border-ink"
              >
                −
              </button>
              <span className="min-w-[3rem] text-center text-[1.6rem] text-ink">
                {data.numPersonas >= 8 ? "8+" : data.numPersonas}
              </span>
              <button
                type="button"
                aria-label="Más personas"
                onClick={() => patch({ numPersonas: Math.min(12, data.numPersonas + 1) })}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline-strong text-[1.2rem] text-ink hover:border-ink"
              >
                +
              </button>
            </div>
            <FieldLabel>Tipo de grupo</FieldLabel>
            <div className="grid gap-2.5">
              {GRUPO_OPTIONS.map((opt) => (
                <OptionCard key={opt} label={opt} selected={data.tipoGrupo === opt} onClick={() => patch({ tipoGrupo: opt })} />
              ))}
            </div>
            <StepNav step={step} canGoBack onBack={goBack} onNext={goNext} nextLabel="Siguiente →" />
          </div>
        ) : null}

        {/* STEP 3 — Barco */}
        {step === 3 ? (
          <div>
            <h3 className="mb-2 text-[1.3rem]">¿Qué barco te imaginas?</h3>
            <p className="mb-6 text-[0.85rem] text-ink-mute">Puedes elegir más de uno.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {BOAT_OPTIONS.map((option) => (
                <BoatOptionCard
                  key={option.id}
                  option={option}
                  selected={data.barcos.includes(option.id)}
                  onToggle={() => toggleInArray("barcos", option.id)}
                />
              ))}
            </div>
            <StepNav step={step} canGoBack onBack={goBack} onNext={goNext} nextLabel="Siguiente →" />
          </div>
        ) : null}

        {/* STEP 4 — Actividades */}
        {step === 4 ? (
          <div>
            <h3 className="mb-2 text-[1.3rem]">¿Qué te hace vibrar en el agua?</h3>
            <p className="mb-6 text-[0.85rem] text-ink-mute">Elige y ordena tus 3 favoritas — toca en orden de preferencia.</p>
            <div className="grid gap-2.5">
              {ACTIVIDAD_OPTIONS.map((opt) => {
                const idx = data.actividades.indexOf(opt);
                return (
                  <OptionCard
                    key={opt}
                    label={opt}
                    selected={idx > -1}
                    rank={idx > -1 ? idx + 1 : undefined}
                    onClick={() => toggleRanked(opt, 3)}
                  />
                );
              })}
            </div>
            <StepNav step={step} canGoBack onBack={goBack} onNext={goNext} nextLabel="Siguiente →" />
          </div>
        ) : null}

        {/* STEP 5 — Experiencia (condicional) */}
        {step === 5 ? (
          <div>
            <h3 className="mb-6 text-[1.3rem]">
              {topActivity ? `¿Cuál es tu nivel en ${topActivity.toLowerCase()}?` : "¿Cuál es tu nivel en actividades acuáticas, en general?"}
            </h3>
            <div className="grid gap-2.5">
              {experienciaOptions.map((opt) => (
                <OptionCard key={opt} label={opt} selected={data.experiencia === opt} onClick={() => patch({ experiencia: opt })} />
              ))}
            </div>
            <StepNav step={step} canGoBack onBack={goBack} onNext={goNext} nextLabel="Siguiente →" />
          </div>
        ) : null}

        {/* STEP 6 — Presupuesto */}
        {step === 6 ? (
          <div>
            <h3 className="mb-6 text-[1.3rem]">¿Qué rango de inversión por persona, por día, tienes en mente?</h3>
            <div className="grid gap-2.5">
              {PRESUPUESTO_OPTIONS.map((opt) => (
                <OptionCard key={opt} label={opt} selected={data.presupuesto === opt} onClick={() => patch({ presupuesto: opt })} />
              ))}
            </div>
            <StepNav step={step} canGoBack onBack={goBack} onNext={goNext} nextLabel="Siguiente →" />
          </div>
        ) : null}

        {/* STEP 7 — Contacto */}
        {step === 7 ? (
          <div>
            <h3 className="mb-6 text-[1.3rem]">¿Cómo te contacto, y hay algo más que deba saber?</h3>

            <FieldLabel>Nombre</FieldLabel>
            <input
              type="text"
              value={data.nombre}
              onChange={(e) => patch({ nombre: e.target.value })}
              className={[
                "mb-1 w-full rounded-sm border bg-paper px-4 py-3 text-[0.95rem] text-ink outline-none",
                showErrors && !data.nombre.trim() ? "border-ink" : "border-hairline-strong focus:border-ink",
              ].join(" ")}
            />
            {showErrors && !data.nombre.trim() ? (
              <p className="mb-3 text-[0.78rem] text-ink-mute">Cuéntame tu nombre.</p>
            ) : (
              <div className="mb-5" />
            )}

            <FieldLabel>WhatsApp o email</FieldLabel>
            <input
              type="text"
              value={data.contacto}
              onChange={(e) => patch({ contacto: e.target.value })}
              className={[
                "mb-1 w-full rounded-sm border bg-paper px-4 py-3 text-[0.95rem] text-ink outline-none",
                showErrors && !data.contacto.trim() ? "border-ink" : "border-hairline-strong focus:border-ink",
              ].join(" ")}
            />
            {showErrors && !data.contacto.trim() ? (
              <p className="mb-3 text-[0.78rem] text-ink-mute">Necesito cómo contactarte.</p>
            ) : (
              <div className="mb-5" />
            )}

            <FieldLabel>Ocasión especial, algo que no pueda faltar, algo que definitivamente no quieres — lo que sea.</FieldLabel>
            <textarea
              rows={3}
              value={data.nota}
              onChange={(e) => patch({ nota: e.target.value })}
              className="w-full rounded-sm border border-hairline-strong bg-paper px-4 py-3 text-[0.95rem] text-ink outline-none focus:border-ink"
            />

            <StepNav step={step} canGoBack onBack={goBack} onNext={handleSubmit} nextLabel="Enviar →" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
