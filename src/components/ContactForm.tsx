import { useState } from "preact/hooks";

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

export default function ContactForm({ copy, leadEndpoint }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [howFound, setHowFound] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!name || !email || !message) return;

    setSubmitting(true);
    setSubmitError(false);
    try {
      const res = await fetch(leadEndpoint, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, howFound, message, _subject: "New contact form message" }),
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
