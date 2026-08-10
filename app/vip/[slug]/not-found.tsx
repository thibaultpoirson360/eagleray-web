import Link from "next/link";

export default function VipNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center">
      <p className="mb-5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-mute">
        Private Expedition Portal
      </p>

      <h1 className="max-w-[16ch] text-[clamp(1.9rem,5vw,3rem)]">
        This expedition link isn&apos;t active.
      </h1>

      <p className="mt-5 max-w-[46ch] text-[0.95rem] leading-relaxed text-ink-soft">
        The page may have been renamed, or the link copied incompletely. If
        Thibault sent you here, message him and he&apos;ll reissue it in a
        moment.
      </p>

      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <a
          href="https://wa.me/525568090942"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-sm bg-ink px-7 py-3.5 text-[0.9rem] font-medium text-paper transition-transform hover:-translate-y-0.5"
        >
          Message Thibault on WhatsApp
        </a>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-sm border border-hairline-strong px-7 py-3.5 text-[0.9rem] font-medium text-ink transition-colors hover:border-ink hover:bg-surface"
        >
          Go to eaglerayexpeditions.com
        </Link>
      </div>
    </main>
  );
}
