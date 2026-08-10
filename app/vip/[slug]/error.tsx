"use client";

import { useEffect } from "react";

/**
 * Distinct from not-found.tsx on purpose: a missing slug is a dead link the
 * guest can act on, whereas this screen means the CMS itself failed and
 * retrying may well work.
 */
export default function VipError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[vip] render failed:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center">
      <p className="mb-5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-mute">
        Private Expedition Portal
      </p>

      <h1 className="max-w-[18ch] text-[clamp(1.9rem,5vw,3rem)]">
        We couldn&apos;t load your expedition just now.
      </h1>

      <p className="mt-5 max-w-[46ch] text-[0.95rem] leading-relaxed text-ink-soft">
        Something on our side didn&apos;t respond. Your page is safe — try
        again, or message Thibault directly and he&apos;ll walk you through it.
      </p>

      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center rounded-sm bg-ink px-7 py-3.5 text-[0.9rem] font-medium text-paper transition-transform hover:-translate-y-0.5"
        >
          Try again
        </button>
        <a
          href="https://wa.me/525568090942"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-sm border border-hairline-strong px-7 py-3.5 text-[0.9rem] font-medium text-ink transition-colors hover:border-ink hover:bg-surface"
        >
          Message Thibault on WhatsApp
        </a>
      </div>
    </main>
  );
}
