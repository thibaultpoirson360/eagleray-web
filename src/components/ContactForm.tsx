import { useEffect, useState } from "preact/hooks";

/**
 * The "Talk with us" contact form (src/pages/en/contact.astro). No source
 * to port — this page doesn't exist in index.html/styles.css/main.js at
 * all, built from a wireframe. Posts straight to the same Formspree
 * endpoint the funnel uses (siteSettings.leadEndpoint) — one inbox, same
 * pattern (fetch + Accept/Content-Type headers) FunnelForm.tsx already
 * established, just a single simple submit instead of a multi-step
 * wizard: no autosave, no partial-lead capture (nothing here to abandon
 * mid-way through the way a 4-step funnel has).
 *
 * Preact per CLAUDE.md's stack rules (form state + async submission).
 * Astro's <Button> component can't be used here — it only renders
 * server-side — so the submit button's classes are copied verbatim from
 * CLAUDE.md's locked button mapping (primary, default context), matching
 * how FunnelForm.tsx's own submit button already does the same.
 */
interface FormCopy {
  namePlaceholder: string;
  emailPlaceholder: string;
  howFoundPlaceholder: string;
  interestPlaceholder?: string;
  interestOptions?: string[];
  partnerOption?: string;
  partnerRolePlaceholder?: string;
  partnerCompanyPlaceholder?: string;
  workOption?: string;
  workPositionPlaceholder?: string;
  workPositionOptions?: string[];
  messagePlaceholder: string;
  submitLabel: string;
  sendingLabel: string;
  successMessage: string;
  errorMessage: string;
}

interface Props {
  copy: FormCopy;
  leadEndpoint: string;
}

const inputClass =
  "w-full rounded border border-ink/14 px-4 py-3 text-sm text-ink placeholder:text-ink/45 transition-colors duration-200 ease-out focus:border-ink focus:outline-none";

// The partner and work options sit just before the last two entries
// ("Not sure yet", "Other") so those stay at the bottom of the menu.
function withExtraOptions(copy: FormCopy): string[] {
  const base = copy.interestOptions ?? [];
  const extras = [copy.partnerOption, copy.workOption].filter((o): o is string => !!o);
  const at = Math.max(base.length - 2, 0);
  return [...base.slice(0, at), ...extras, ...base.slice(at)];
}

export default function ContactForm({ copy, leadEndpoint }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [howFound, setHowFound] = useState("");
  const [interest, setInterest] = useState("");
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");

  // A link such as /en/contact/?message=… (the activity buttons on Sail with
  // us) arrives with the message box already written. Only fills an empty box.
  useEffect(() => {
    const preset = new URLSearchParams(window.location.search).get("message");
    if (preset) setMessage((current) => current || preset);
  }, []);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const isPartner = !!copy.partnerOption && interest === copy.partnerOption;
  const isWork = !!copy.workOption && interest === copy.workOption;
  const menuOptions = withExtraOptions(copy);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!name || !email || !message) return;

    setSubmitting(true);
    setSubmitError(false);
    try {
      const res = await fetch(leadEndpoint, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, howFound, ...(interest ? { interest } : {}), ...(isPartner ? { role, company } : {}), ...(isWork ? { position } : {}), message, _subject: "New contact form message" }),
      });
      if (!res.ok) throw new Error(`Formspree error ${res.status}`);
      await res.json();
      setSubmitted(true);
    } catch {
      setSubmitting(false);
      setSubmitError(true);
    }
  }

  if (submitted) {
    return <p class="rounded border border-ink/14 bg-surface p-6 text-ink/80">{copy.successMessage}</p>;
  }

  return (
    <form class="flex flex-col gap-4" onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        required
        autocomplete="name"
        placeholder={copy.namePlaceholder}
        value={name}
        onInput={(e) => setName((e.target as HTMLInputElement).value)}
        class={inputClass}
      />
      <input
        type="email"
        name="email"
        required
        autocomplete="email"
        placeholder={copy.emailPlaceholder}
        value={email}
        onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
        class={inputClass}
      />
      {menuOptions.length > 0 && (
        <select
          name="interest"
          value={interest}
          onChange={(e) => setInterest((e.target as HTMLSelectElement).value)}
          class={`${inputClass} ${interest ? "" : "text-ink/45"}`}
        >
          <option value="">{copy.interestPlaceholder}</option>
          {menuOptions.map((option) => (
            <option value={option}>{option}</option>
          ))}
        </select>
      )}
      {isPartner && (
        <>
          <input
            type="text"
            name="role"
            required
            placeholder={copy.partnerRolePlaceholder}
            value={role}
            onInput={(e) => setRole((e.target as HTMLInputElement).value)}
            class={inputClass}
          />
          <input
            type="text"
            name="company"
            required
            placeholder={copy.partnerCompanyPlaceholder}
            value={company}
            onInput={(e) => setCompany((e.target as HTMLInputElement).value)}
            class={inputClass}
          />
        </>
      )}
      {isWork && (copy.workPositionOptions ?? []).length > 0 && (
        <select
          name="position"
          required
          value={position}
          onChange={(e) => setPosition((e.target as HTMLSelectElement).value)}
          class={`${inputClass} ${position ? "" : "text-ink/45"}`}
        >
          <option value="">{copy.workPositionPlaceholder}</option>
          {(copy.workPositionOptions ?? []).map((option) => (
            <option value={option}>{option}</option>
          ))}
        </select>
      )}
      <input
        type="text"
        name="howFound"
        placeholder={copy.howFoundPlaceholder}
        value={howFound}
        onInput={(e) => setHowFound((e.target as HTMLInputElement).value)}
        class={inputClass}
      />
      <textarea
        name="message"
        required
        rows={5}
        placeholder={copy.messagePlaceholder}
        value={message}
        onInput={(e) => setMessage((e.target as HTMLTextAreaElement).value)}
        class={`${inputClass} resize-y`}
      />
      {submitError && <p class="text-sm text-ink/70">{copy.errorMessage}</p>}
      <div class="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          class="inline-flex items-center justify-center gap-2 rounded border border-transparent bg-ink px-7 py-4 text-sm font-medium whitespace-nowrap text-white transition duration-500 ease-soft hover:-translate-y-0.5 hover:bg-ink-hover disabled:pointer-events-none disabled:opacity-35"
        >
          {submitting ? copy.sendingLabel : copy.submitLabel}
        </button>
      </div>
    </form>
  );
}
