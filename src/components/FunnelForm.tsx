import { useEffect, useRef, useState } from "preact/hooks";
import type { FunnelQuery } from "../../tina/__generated__/types";

/**
 * The customize funnel — a single Preact island (client:visible, mounted
 * by Funnel.astro) replacing main.js's initFunnel() (main.js L452-728)
 * wholesale. CLAUDE.md names "the funnel wizard" as needing Preact
 * specifically, and nearly everything here (step, every field, live
 * validation, autosave) is genuine component state rather than a small
 * bolt-on control, so the whole `<form>` is the island.
 *
 * Field names follow CLAUDE.md's rename table exactly — these are the
 * `name`s Tina's schema, the localStorage draft, and the lead payload's
 * shape below all key on:
 *   dias -> tripDuration        quien -> travelingAs      invitados -> guestCount
 *   foco -> routeFocus          prioridad -> topPriority  desde/hasta -> dateFrom/dateTo
 *   fechas_libres -> flexibleDates   barco -> boatPreference
 *   nombre -> fullName          contacto -> whatsappNumber   extra -> notes
 *
 * One deliberate exception: the Formspree PAYLOAD keys (days/who/guests/
 * route/priority/dates/boat/name/email/whatsapp/notes — see
 * payloadAnswers()) keep source's original short keys, not the renamed
 * field names. That payload is externally facing — it's what actually
 * lands in Thibault's inbox — and CLAUDE.md's rename table is about this
 * codebase's own field names, not a reason to silently change the shape
 * of an external contract he may already have email rules/automation
 * built against.
 *
 * source's val() returns radios' visible LABEL text (via the sibling
 * <span>), not the `value` attribute — the WhatsApp message and recap
 * chips are meant to read like prose. Since Tina content only gives us
 * {label, value} pairs, labelFor() below does that same lookup; every
 * other field (dates, name, email, notes, guest count) uses its raw
 * value directly, matching source.
 */

type Nullable<T> = T | null | undefined;
interface Option {
  label?: Nullable<string>;
  value?: Nullable<string>;
}
interface Question {
  question?: Nullable<string>;
  options?: Nullable<Nullable<Option>[]>;
}

type FunnelData = NonNullable<FunnelQuery["funnel"]>;

interface Props {
  funnel: FunnelData;
  leadEndpoint: string;
  whatsappNumber: string;
}

const DRAFT_KEY = "eagleRayFunnelDraft";
const TOTAL_STEPS = 4;

function clamp(v: number, a: number, b: number) {
  return v < a ? a : v > b ? b : v;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function labelFor(options: Question["options"], value: string): string {
  return options?.find((o) => o?.value === value)?.label ?? value;
}

interface Values {
  tripDuration: string;
  travelingAs: string;
  guestCount: string;
  routeFocus: string;
  topPriority: string;
  dateFrom: string;
  dateTo: string;
  flexibleDates: string;
  boatPreference: string;
  fullName: string;
  email: string;
  whatsappNumber: string;
  notes: string;
}

export default function FunnelForm({ funnel, leadEndpoint, whatsappNumber }: Props) {
  // Tina types every object field as nullable, but the schema and every
  // funnel document (content/funnel/<locale>.json) always populate these
  // four — asserted here so the rest of the component can dot-access them
  // directly, same as every other section built so far does for its own
  // top-level content object.
  const step1 = funnel.step1!;
  const step2 = funnel.step2!;
  const step3 = funnel.step3!;
  const step4 = funnel.step4!;
  const { ui, whatsappMessage: wm } = funnel;
  const guestMin = step1.guestCount?.min ?? 2;
  const guestMax = step1.guestCount?.max ?? 10;
  const guestDefault = step1.guestCount?.defaultValue ?? 4;

  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>(() => ({
    tripDuration: step1.tripDuration?.options?.[0]?.value ?? "",
    travelingAs: step1.travelingAs?.options?.[0]?.value ?? "",
    guestCount: String(guestDefault),
    routeFocus: step2.routeFocus?.options?.[0]?.value ?? "",
    topPriority: step2.topPriority?.options?.[0]?.value ?? "",
    dateFrom: "",
    dateTo: "",
    flexibleDates: "",
    // "No preference" is index 2 in source, not index 0 like every other
    // radio group's default — hardcoded to match, since Tina's option
    // list has no explicit "default" flag to derive this from.
    boatPreference: step3.boatPreference?.options?.[2]?.value ?? "",
    fullName: "",
    email: "",
    whatsappNumber: "",
    notes: "",
  }));
  const [errors, setErrors] = useState<{ fullName?: boolean; email?: boolean }>({});
  const [autosave, setAutosave] = useState<{ revealed: boolean; visible: boolean; text: string }>({
    revealed: false,
    visible: false,
    text: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [successName, setSuccessName] = useState("");
  const [successWaHref, setSuccessWaHref] = useState("");

  const partialSentRef = useRef(false);
  const valuesRef = useRef(values);
  const autosaveTimerRef = useRef<number | undefined>(undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    valuesRef.current = values;
  }, [values]);

  /* ---------- derived: dates line + WhatsApp message + payload ---------- */
  function fechas(v: Values) {
    const a = v.dateFrom;
    const b = v.dateTo;
    const libre = v.flexibleDates;
    const from = wm?.datesFrom || "from";
    const tbd = wm?.datesToBeConfirmed || "to be confirmed";
    if (a && b) return `${a} → ${b}${libre ? ` (${libre})` : ""}`;
    if (a) return `${from} ${a}${libre ? ` (${libre})` : ""}`;
    return libre || tbd;
  }

  function message(v: Values) {
    const L: string[] = [];
    L.push(wm?.intro || "Hi Thibault! I'd like to customize an Eagle Ray expedition.");
    L.push("");
    L.push(`• ${wm?.tripDurationLabel || "Duration"}: ${labelFor(step1.tripDuration?.options, v.tripDuration) || ":"}`);
    L.push(`• ${wm?.travelingAsLabel || "For"}: ${labelFor(step1.travelingAs?.options, v.travelingAs) || ":"}`);
    L.push(`• ${wm?.guestCountLabel || "Guests"}: ${v.guestCount || ":"}`);
    L.push(`• ${wm?.routeFocusLabel || "Route focus"}: ${labelFor(step2.routeFocus?.options, v.routeFocus) || ":"}`);
    L.push(`• ${wm?.topPriorityLabel || "Top priority"}: ${labelFor(step2.topPriority?.options, v.topPriority) || ":"}`);
    L.push(`• ${wm?.datesLabel || "Dates"}: ${fechas(v)}`);
    L.push(`• ${wm?.boatPreferenceLabel || "Boat"}: ${labelFor(step3.boatPreference?.options, v.boatPreference) || ":"}`);
    L.push("");
    L.push(`• ${wm?.fullNameLabel || "Name"}: ${v.fullName || ":"}`);
    L.push(`• ${wm?.emailLabel || "Email"}: ${v.email || ":"}`);
    if (v.whatsappNumber) L.push(`• ${wm?.whatsappNumberLabel || "WhatsApp"}: ${v.whatsappNumber}`);
    if (v.notes) L.push(`• ${wm?.notesLabel || "Notes"}: ${v.notes}`);
    return L.join("\n");
  }

  // External payload contract — see file header for why these keys stay
  // short/untranslated rather than following the rename table.
  function payloadAnswers(v: Values) {
    return {
      days: labelFor(step1.tripDuration?.options, v.tripDuration),
      who: labelFor(step1.travelingAs?.options, v.travelingAs),
      guests: v.guestCount,
      route: labelFor(step2.routeFocus?.options, v.routeFocus),
      priority: labelFor(step2.topPriority?.options, v.topPriority),
      dates: fechas(v),
      boat: labelFor(step3.boatPreference?.options, v.boatPreference),
      name: v.fullName,
      email: v.email,
      whatsapp: v.whatsappNumber,
      notes: v.notes,
    };
  }

  const recapRows = [
    { label: wm?.tripDurationLabel, value: labelFor(step1.tripDuration?.options, values.tripDuration) },
    { label: wm?.travelingAsLabel, value: labelFor(step1.travelingAs?.options, values.travelingAs) },
    { label: wm?.guestCountLabel, value: values.guestCount },
    { label: wm?.routeFocusLabel, value: labelFor(step2.routeFocus?.options, values.routeFocus) },
    { label: wm?.topPriorityLabel, value: labelFor(step2.topPriority?.options, values.topPriority) },
    { label: wm?.datesLabel, value: fechas(values) },
    { label: wm?.boatPreferenceLabel, value: labelFor(step3.boatPreference?.options, values.boatPreference) },
  ].filter((r) => r.value && String(r.value).trim());

  /* ---------- draft autosave / restore ---------- */
  function flashAutosave(text: string) {
    window.clearTimeout(autosaveTimerRef.current);
    setAutosave({ revealed: true, visible: true, text });
    autosaveTimerRef.current = window.setTimeout(() => setAutosave((a) => ({ ...a, visible: false })), 1800);
  }

  function saveDraft(nextStep: number, nextValues: Values) {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ step: nextStep, values: nextValues }));
      flashAutosave(ui?.autosaveSaved || "");
    } catch {
      /* storage unavailable : fail silently */
    }
  }

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw);
      if (!draft?.values) return;
      setValues((v) => ({ ...v, ...draft.values }));
      if (typeof draft.step === "number") setStep(clamp(draft.step, 0, TOTAL_STEPS - 1));
      flashAutosave(ui?.autosaveRestored || "");
    } catch {
      /* ignore corrupt draft */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount only, matches source's one-time restoreDraft()
  }, []);

  /* ---------- field updates ---------- */
  function updateField(name: keyof Values, value: string) {
    const next = { ...valuesRef.current, [name]: value };
    setValues(next);
    if (name === "fullName" || name === "email") validate(name, next);
    saveDraft(step, next);
  }

  function stepGuestCount(delta: number) {
    const current = parseInt(valuesRef.current.guestCount, 10) || guestDefault;
    updateField("guestCount", String(clamp(current + delta, guestMin, guestMax)));
  }

  /* ---------- validation ---------- */
  function validate(name: "fullName" | "email", v: Values): boolean {
    let valid = !!v[name].trim();
    if (valid && name === "email" && v.email.trim()) valid = isValidEmail(v.email);
    setErrors((e) => ({ ...e, [name]: !valid }));
    return valid;
  }

  function validateRequired(v: Values): boolean {
    const a = validate("fullName", v);
    const b = validate("email", v);
    return a && b;
  }

  /* ---------- partial-lead capture ---------- */
  function maybeSendPartial() {
    if (partialSentRef.current) return;
    if (!isValidEmail(valuesRef.current.email)) return;
    partialSentRef.current = true;
    const payload = { ...payloadAnswers(valuesRef.current), _status: "partial : reached contact step, did not submit" };
    fetch(leadEndpoint, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {
      partialSentRef.current = false;
    });
  }

  useEffect(() => {
    function onVisibilityChange() {
      if (document.visibilityState !== "hidden") return;
      if (partialSentRef.current || !isValidEmail(valuesRef.current.email)) return;
      partialSentRef.current = true;
      const payload = {
        ...payloadAnswers(valuesRef.current),
        _status: "partial : tab closed after entering email",
      };
      try {
        navigator.sendBeacon(leadEndpoint, new Blob([JSON.stringify(payload)], { type: "application/json" }));
      } catch {
        partialSentRef.current = false;
      }
    }
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- registered once; reads valuesRef, not values, to stay fresh
  }, []);

  /* ---------- step navigation ---------- */
  function goTo(n: number) {
    const next = clamp(n, 0, TOTAL_STEPS - 1);
    setStep(next);
    saveDraft(next, valuesRef.current);
  }

  useEffect(() => {
    if (step === 0) return;
    const fieldset = formRef.current?.querySelector<HTMLElement>(`[data-step="${step + 1}"]`);
    const first = fieldset?.querySelector<HTMLElement>(
      "input:not([type=radio]), textarea, input[type=radio]:checked"
    );
    first?.focus({ preventScroll: true });
  }, [step]);

  useEffect(() => {
    if (submitted) successRef.current?.scrollIntoView({ behavior: reducedRef.current ? "auto" : "smooth", block: "center" });
  }, [submitted]);

  /* ---------- submit ---------- */
  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (step !== TOTAL_STEPS - 1 || !validateRequired(valuesRef.current)) return;

    partialSentRef.current = true; // prevent a race with the blur/visibility partial-capture
    setSubmitting(true);
    setSubmitError(false);

    try {
      const res = await fetch(leadEndpoint, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ ...payloadAnswers(valuesRef.current), _status: "complete" }),
      });
      if (!res.ok) throw new Error(`Formspree error ${res.status}`);
      await res.json();
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        /* ignore */
      }
      setSuccessName(valuesRef.current.fullName ? `, ${valuesRef.current.fullName}` : "");
      setSuccessWaHref(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message(valuesRef.current))}`);
      setSubmitted(true);
    } catch {
      setSubmitting(false);
      setSubmitError(true);
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key !== "Enter") return;
    if ((e.target as HTMLElement)?.tagName === "TEXTAREA") return;
    if (step < TOTAL_STEPS - 1) {
      e.preventDefault();
      goTo(step + 1);
    }
  }

  function radioGroup(name: keyof Values, q: Question | null | undefined) {
    return (
      <div class="opts opts-row flex flex-wrap gap-[.6rem]">
        {q?.options?.map(
          (opt, idx) =>
            opt && (
              <label key={idx} class="opt relative block cursor-pointer">
                <input
                  type="radio"
                  name={name}
                  class="peer absolute h-0 w-0 opacity-0"
                  checked={values[name] === opt.value}
                  onChange={() => updateField(name, opt.value ?? "")}
                />
                <span
                  class={
                    "block rounded border px-[1.1rem] py-[.7rem] text-[.88rem] transition-[border-color,background-color,color,transform] duration-500 ease-out peer-focus-visible:outline-2 peer-focus-visible:outline-ink peer-focus-visible:outline-offset-[3px] hover:-translate-y-0.5 " +
                    (values[name] === opt.value
                      ? "border-ink bg-ink text-white"
                      : "border-ink/26 text-ink/74 hover:border-ink")
                  }
                >
                  {opt.label}
                </span>
              </label>
            )
        )}
      </div>
    );
  }

  const isLast = step === TOTAL_STEPS - 1;

  return (
    <form
      ref={formRef}
      class={"funnel rounded-lg border border-ink/14 bg-surface p-funnel " + (submitted ? "is-submitted" : "")}
      data-funnel
      novalidate
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
    >
      <div class="funnel-bar mb-[.8rem] h-0.75 overflow-hidden rounded-full bg-ink/14" aria-hidden="true">
        <span
          class="funnel-fill block h-full bg-ink transition-[width] duration-600 ease-out"
          style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
        />
      </div>
      <p class="funnel-count mb-[1.8rem] font-mono text-[.76rem] tracking-widest text-ink/52 uppercase">
        <span>{(ui?.stepCounter || "Step {n} of {total}").replace("{n}", String(step + 1)).replace("{total}", String(TOTAL_STEPS))}</span>{" "}
        {autosave.revealed && (
          <span
            class={
              "funnel-autosave font-mono text-[.72rem] tracking-[.04em] text-ink normal-case transition-opacity duration-400 ease-out " +
              (autosave.visible ? "opacity-100" : "opacity-0")
            }
          >
            {autosave.text}
          </span>
        )}
      </p>

      <fieldset class={"fstep border-0 p-0 " + (step === 0 ? "is-active" : "")} data-step="1">
        <legend class="mb-6 font-display text-legend text-ink">
          <span class="mb-[.6rem] block font-mono text-[.68rem] tracking-[.16em]">01</span>
          {step1.legend}
        </legend>

        <p class="funnel-q mt-0 mb-[.7rem] font-mono text-[.68rem] tracking-widest text-ink/52 uppercase">
          {step1.tripDuration?.question}
        </p>
        {radioGroup("tripDuration", step1.tripDuration)}

        <p class="funnel-q mt-[1.6rem] mb-[.7rem] font-mono text-[.68rem] tracking-widest text-ink/52 uppercase">
          {step1.travelingAs?.question}
        </p>
        {radioGroup("travelingAs", step1.travelingAs)}

        <p class="funnel-q mt-[1.6rem] mb-[.7rem] font-mono text-[.68rem] tracking-widest text-ink/52 uppercase">
          {step1.guestCount?.question}
        </p>
        <div class="stepper flex items-center gap-4">
          <button
            type="button"
            class="step-btn size-11.5 rounded-full border border-ink/26 text-[1.2rem] text-ink transition-colors duration-500 ease-out hover:border-ink"
            aria-label={step1.guestCount?.fewerLabel || "Fewer guests"}
            onClick={() => stepGuestCount(-1)}
          >
            −
          </button>
          <input
            class="step-input w-25 border-0 border-b border-ink/26 bg-transparent pb-[.3rem] text-center font-display text-[2.4rem] text-ink"
            type="number"
            name="guestCount"
            min={guestMin}
            max={guestMax}
            inputmode="numeric"
            value={values.guestCount}
            onInput={(e) => updateField("guestCount", (e.target as HTMLInputElement).value)}
          />
          <button
            type="button"
            class="step-btn size-11.5 rounded-full border border-ink/26 text-[1.2rem] text-ink transition-colors duration-500 ease-out hover:border-ink"
            aria-label={step1.guestCount?.moreLabel || "More guests"}
            onClick={() => stepGuestCount(1)}
          >
            +
          </button>
        </div>
        {step1.guestCount?.hint && <p class="fhint mt-[1.1rem] text-[.86rem] text-ink/52">{step1.guestCount.hint}</p>}
      </fieldset>

      <fieldset class={"fstep border-0 p-0 " + (step === 1 ? "is-active" : "")} data-step="2">
        <legend class="mb-6 font-display text-legend text-ink">
          <span class="mb-[.6rem] block font-mono text-[.68rem] tracking-[.16em]">02</span>
          {step2.legend}
        </legend>

        <p class="funnel-q mt-0 mb-[.7rem] font-mono text-[.68rem] tracking-widest text-ink/52 uppercase">
          {step2.routeFocus?.question}
        </p>
        {radioGroup("routeFocus", step2.routeFocus)}

        <p class="funnel-q mt-[1.6rem] mb-[.7rem] font-mono text-[.68rem] tracking-widest text-ink/52 uppercase">
          {step2.topPriority?.question}
        </p>
        {radioGroup("topPriority", step2.topPriority)}
      </fieldset>

      <fieldset class={"fstep border-0 p-0 " + (step === 2 ? "is-active" : "")} data-step="3">
        <legend class="mb-6 font-display text-legend text-ink">
          <span class="mb-[.6rem] block font-mono text-[.68rem] tracking-[.16em]">03</span>
          {step3.legend}
        </legend>

          <div class="fields grid gap-4 sm:grid-cols-2">
            <label class="field block">
              <span class="mb-2 block font-mono text-[.62rem] tracking-[.14em] text-ink/52 uppercase">{step3.dateFromLabel}</span>
              <input
                class="w-full rounded border border-ink/26 bg-white px-4 py-[.9rem] text-[.95rem] text-ink transition-colors duration-500 ease-out placeholder:text-ink/52 focus:border-ink focus:outline-hidden"
                type="date"
                name="dateFrom"
                value={values.dateFrom}
                onInput={(e) => updateField("dateFrom", (e.target as HTMLInputElement).value)}
              />
            </label>
            <label class="field block">
              <span class="mb-2 block font-mono text-[.62rem] tracking-[.14em] text-ink/52 uppercase">{step3.dateToLabel}</span>
              <input
                class="w-full rounded border border-ink/26 bg-white px-4 py-[.9rem] text-[.95rem] text-ink transition-colors duration-500 ease-out placeholder:text-ink/52 focus:border-ink focus:outline-hidden"
                type="date"
                name="dateTo"
                value={values.dateTo}
                onInput={(e) => updateField("dateTo", (e.target as HTMLInputElement).value)}
              />
            </label>
          </div>
          <label class="field field-full mt-4 block">
            <span class="mb-2 block font-mono text-[.62rem] tracking-[.14em] text-ink/52 uppercase">{step3.flexibleDates?.label}</span>
            <input
              class="w-full rounded border border-ink/26 bg-white px-4 py-[.9rem] text-[.95rem] text-ink transition-colors duration-500 ease-out placeholder:text-ink/52 focus:border-ink focus:outline-hidden"
              type="text"
              name="flexibleDates"
              placeholder={step3.flexibleDates?.placeholder ?? undefined}
              value={values.flexibleDates}
              onInput={(e) => updateField("flexibleDates", (e.target as HTMLInputElement).value)}
            />
          </label>

          <p class="funnel-q mt-[1.6rem] mb-[.7rem] font-mono text-[.68rem] tracking-widest text-ink/52 uppercase">
            {step3.boatPreference?.question}
          </p>
          {radioGroup("boatPreference", step3.boatPreference)}
      </fieldset>

      <fieldset class={"fstep border-0 p-0 " + (step === 3 ? "is-active" : "")} data-step="4">
        <legend class="mb-6 font-display text-legend text-ink">
          <span class="mb-[.6rem] block font-mono text-[.68rem] tracking-[.16em]">04</span>
          {step4.legend}
        </legend>

          {recapRows.length > 0 && (
            <div class="funnel-recap mb-[1.6rem] rounded border border-ink/26 bg-white p-[1.1rem_1.3rem]">
              <p class="funnel-recap-title mb-[.7rem] font-mono text-[.68rem] tracking-widest text-ink/52 uppercase">{ui?.recapTitle}</p>
              <div class="funnel-recap-row flex flex-wrap gap-2">
                {recapRows.map((r, idx) => (
                  <span key={idx} class="funnel-recap-chip rounded-sm border border-ink/14 px-3 py-[.3rem] text-[.82rem] text-ink/74">
                    {r.label}: <strong class="font-medium text-ink">{r.value}</strong>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div class="fields grid gap-4 sm:grid-cols-2">
            <label class="field block">
              <span class="mb-2 block font-mono text-[.62rem] tracking-[.14em] text-ink/52 uppercase">{step4.fullName?.label}</span>
              <input
                class={
                  "w-full rounded border bg-white px-4 py-[.9rem] text-[.95rem] text-ink transition-colors duration-500 ease-out placeholder:text-ink/52 focus:border-ink focus:outline-hidden " +
                  (errors.fullName ? "border-2 border-ink" : "border-ink/26")
                }
                type="text"
                name="fullName"
                autocomplete="name"
                placeholder={step4.fullName?.placeholder ?? undefined}
                value={values.fullName}
                onInput={(e) => updateField("fullName", (e.target as HTMLInputElement).value)}
              />
            </label>
            <label class="field block">
              <span class="mb-2 block font-mono text-[.62rem] tracking-[.14em] text-ink/52 uppercase">{step4.email?.label}</span>
              <input
                class={
                  "w-full rounded border bg-white px-4 py-[.9rem] text-[.95rem] text-ink transition-colors duration-500 ease-out placeholder:text-ink/52 focus:border-ink focus:outline-hidden " +
                  (errors.email ? "border-2 border-ink" : "border-ink/26")
                }
                type="email"
                name="email"
                autocomplete="email"
                placeholder={step4.email?.placeholder ?? undefined}
                value={values.email}
                onInput={(e) => updateField("email", (e.target as HTMLInputElement).value)}
                onBlur={maybeSendPartial}
              />
            </label>
          </div>
          {errors.fullName && <p class="field-error mt-2 text-[.8rem] font-semibold text-ink">{step4.fullName?.error}</p>}
          {errors.email && <p class="field-error mt-2 text-[.8rem] font-semibold text-ink">{step4.email?.error}</p>}

          <label class="field field-full mt-4 block">
            <span class="mb-2 inline font-mono text-[.62rem] tracking-[.14em] text-ink/52 uppercase">{step4.whatsappNumber?.label}</span>{" "}
            <span class="field-optional text-[.78rem] text-ink/52 opacity-80">{step4.whatsappNumber?.optionalHint}</span>
            <input
              class="mt-2 w-full rounded border border-ink/26 bg-white px-4 py-[.9rem] text-[.95rem] text-ink transition-colors duration-500 ease-out placeholder:text-ink/52 focus:border-ink focus:outline-hidden"
              type="tel"
              name="whatsappNumber"
              inputmode="tel"
              autocomplete="tel"
              placeholder={step4.whatsappNumber?.placeholder ?? undefined}
              value={values.whatsappNumber}
              onInput={(e) => updateField("whatsappNumber", (e.target as HTMLInputElement).value)}
            />
          </label>
          <label class="field field-full mt-4 block">
            <span class="mb-2 block font-mono text-[.62rem] tracking-[.14em] text-ink/52 uppercase">{step4.notes?.label}</span>
            <textarea
              class="w-full rounded border border-ink/26 bg-white px-4 py-[.9rem] text-[.95rem] text-ink transition-colors duration-500 ease-out placeholder:text-ink/52 focus:border-ink focus:outline-hidden"
              name="notes"
              rows={3}
              placeholder={step4.notes?.placeholder ?? undefined}
              value={values.notes}
              onInput={(e) => updateField("notes", (e.target as HTMLTextAreaElement).value)}
            />
          </label>

        {step4.privacy && <p class="funnel-privacy mt-[1.4rem] text-[.8rem] text-ink/52">{step4.privacy}</p>}
      </fieldset>

      <div class="funnel-nav mt-[2.2rem] flex justify-between gap-4 border-t border-ink/8 pt-[1.6rem]">
        <button
          type="button"
          class="inline-flex items-center justify-center gap-2 rounded border border-ink/26 px-7 py-4 text-sm font-medium text-ink transition duration-500 ease-soft hover:-translate-y-0.5 hover:border-ink hover:bg-surface disabled:pointer-events-none disabled:opacity-35"
          disabled={step === 0}
          onClick={() => goTo(step - 1)}
        >
          {ui?.back}
        </button>
        {!isLast && (
          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 rounded border border-transparent bg-ink px-7 py-4 text-sm font-medium text-white transition duration-500 ease-soft hover:-translate-y-0.5 hover:bg-ink-hover"
            onClick={() => goTo(step + 1)}
          >
            {ui?.continue}
          </button>
        )}
        {isLast && (
          <button
            type="submit"
            class="inline-flex items-center justify-center gap-2 rounded border border-transparent bg-ink px-7 py-4 text-sm font-medium text-white transition duration-500 ease-soft hover:-translate-y-0.5 hover:bg-ink-hover disabled:pointer-events-none disabled:opacity-70"
            disabled={submitting}
          >
            <span>{submitting ? ui?.sending : ui?.submit}</span>
            {submitting && (
              <span class="ml-2 inline-block size-4 animate-spin-fast rounded-full border-2 border-white/35 border-t-white align-[-3px]" />
            )}
          </button>
        )}
      </div>
      {submitError && <p class="funnel-submit-error mt-4 text-center text-[.85rem] font-semibold text-ink">{ui?.submitError}</p>}

      <div class="funnel-success px-0 py-6 text-center" data-funnel-success ref={successRef}>
        <div class="funnel-success-check mx-auto mb-[1.4rem] grid size-16 place-items-center rounded-full border border-ink bg-white" aria-hidden="true">
          <svg viewBox="0 0 24 24" class="size-7">
            <path
              d="M4 12.5l5 5L20 6"
              pathLength="1"
              class={submitted ? "animate-draw-check" : ""}
              style={{ fill: "none", stroke: "var(--color-ink)", strokeWidth: 2.5, strokeLinecap: "round", strokeLinejoin: "round", strokeDasharray: 1, strokeDashoffset: 1 }}
            />
          </svg>
        </div>
        <h3 class="mb-[.6rem] font-display text-2xl text-ink">
          {funnel.success?.title}
          <span>{successName}</span>.
        </h3>
        {funnel.success?.body && <p class="mb-[1.6rem] text-ink/74">{funnel.success.body}</p>}
        <a
          class="btn-wide inline-flex w-full items-center justify-center gap-2 rounded border border-transparent bg-ink px-7 py-4 text-sm font-medium text-white transition duration-500 ease-soft hover:-translate-y-0.5 hover:bg-ink-hover"
          href={successWaHref}
          target="_blank"
          rel="noopener"
        >
          {funnel.success?.whatsappButton}
        </a>
      </div>
    </form>
  );
}
