import { useState } from "preact/hooks";

/**
 * The "Become a partner" form. Posts to the same Formspree endpoint as the
 * contact and trip-planning forms (siteSettings.leadEndpoint), so entries land
 * in the same inbox and sheet. `leadType: "Partner"` tells them apart.
 */
interface FormCopy {
  name: string;
  company: string;
  role: string;
  roleOptions: string[];
  location: string;
  email: string;
  whatsapp: string;
  audience: string;
  source: string;
  sourceOptions: string[];
  selectPlaceholder: string;
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
  "w-full rounded border border-ink/14 bg-white px-4 py-3 text-base text-ink placeholder:text-ink/45 transition-colors duration-200 ease-out focus:border-ink focus:outline-none";
const labelClass = "mb-2 block text-sm text-ink/74";

export default function PartnerForm({ copy, leadEndpoint }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    const data = new FormData(e.currentTarget as HTMLFormElement);
    const get = (key: string) => String(data.get(key) ?? "").trim();
    setSubmitting(true);
    setSubmitError(false);
    try {
      const res = await fetch(leadEndpoint, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          leadType: "Partner",
          name: get("name"),
          company: get("company"),
          role: get("role"),
          location: get("location"),
          email: get("email"),
          whatsapp: get("whatsapp"),
          audience: get("audience"),
          source: get("source"),
          _subject: "New partner enquiry",
        }),
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
    return (
      <p role="status" class="rounded border border-ink/14 bg-surface p-6 text-ink/80">
        {copy.successMessage}
      </p>
    );
  }

  return (
    <form class="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div>
        <label class={labelClass} for="partner-name">{copy.name}</label>
        <input id="partner-name" name="name" type="text" required autocomplete="name" class={inputClass} />
      </div>
      <div>
        <label class={labelClass} for="partner-company">{copy.company}</label>
        <input id="partner-company" name="company" type="text" required autocomplete="organization" class={inputClass} />
      </div>
      <div>
        <label class={labelClass} for="partner-role">{copy.role}</label>
        <select id="partner-role" name="role" required class={inputClass}>
          <option value="">{copy.selectPlaceholder}</option>
          {copy.roleOptions.map((o) => (
            <option value={o}>{o}</option>
          ))}
        </select>
      </div>
      <div>
        <label class={labelClass} for="partner-location">{copy.location}</label>
        <input id="partner-location" name="location" type="text" required autocomplete="address-level2" class={inputClass} />
      </div>
      <div>
        <label class={labelClass} for="partner-email">{copy.email}</label>
        <input id="partner-email" name="email" type="email" required autocomplete="email" class={inputClass} />
      </div>
      <div>
        <label class={labelClass} for="partner-whatsapp">{copy.whatsapp}</label>
        <input id="partner-whatsapp" name="whatsapp" type="tel" autocomplete="tel" class={inputClass} />
      </div>
      <div>
        <label class={labelClass} for="partner-audience">{copy.audience}</label>
        <textarea id="partner-audience" name="audience" rows={3} class={`${inputClass} resize-y`} />
      </div>
      <div>
        <label class={labelClass} for="partner-source">{copy.source}</label>
        <select id="partner-source" name="source" class={inputClass}>
          <option value="">{copy.selectPlaceholder}</option>
          {copy.sourceOptions.map((o) => (
            <option value={o}>{o}</option>
          ))}
        </select>
      </div>
      {submitError && (
        <p role="alert" class="text-sm text-ink/70">
          {copy.errorMessage}
        </p>
      )}
      <button
        type="submit"
        disabled={submitting}
        class="inline-flex w-full items-center justify-center gap-2 rounded border border-transparent bg-ink px-7 py-4 text-sm font-medium whitespace-nowrap text-white transition duration-500 ease-soft hover:-translate-y-0.5 hover:bg-ink-hover disabled:pointer-events-none disabled:opacity-35 sm:w-auto sm:self-start"
      >
        {submitting ? copy.sendingLabel : copy.submitLabel}
      </button>
    </form>
  );
}
