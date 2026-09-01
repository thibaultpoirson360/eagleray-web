"use client";

import Script from "next/script";

const TALLY_SRC = "https://tally.so/widgets/embed.js";

function loadTallyEmbeds() {
  if (typeof window === "undefined") return;
  if (window.Tally) {
    window.Tally.loadEmbeds();
    return;
  }
  document.querySelectorAll<HTMLIFrameElement>("iframe[data-tally-src]:not([src])").forEach((el) => {
    el.src = el.dataset.tallySrc ?? "";
  });
}

export default function TallyEmbed() {
  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-md border border-hairline bg-paper p-6 sm:p-8">
        <iframe
          data-tally-src="https://tally.so/embed/LZ45yz?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
          loading="lazy"
          width="100%"
          height="174"
          title="Diseñemos tu expedición"
        />
      </div>
      <Script src={TALLY_SRC} strategy="afterInteractive" onLoad={loadTallyEmbeds} onReady={loadTallyEmbeds} />
    </div>
  );
}

declare global {
  interface Window {
    Tally?: { loadEmbeds: () => void };
  }
}
