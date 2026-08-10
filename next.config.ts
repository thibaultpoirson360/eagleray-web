import type { NextConfig } from "next";

/**
 * Phase A of the Next.js migration.
 *
 * The marketing site is still the original static build (HTML/CSS/vanilla JS)
 * living untouched in `public/`. The rewrite below keeps it served at `/` with
 * the exact same URLs and relative asset paths it has always used, so nothing
 * about the public site changes while the VIP portal is built alongside it.
 *
 * When the marketing pages are ported to React section by section, each rewrite
 * here gets deleted as the corresponding route appears under `app/`.
 */
const nextConfig: NextConfig = {
  images: {
    // Airtable serves attachments from signed, expiring URLs on these hosts.
    // Without them next/image refuses to optimise and the VIP pages render
    // broken images.
    remotePatterns: [
      { protocol: "https", hostname: "v5.airtableusercontent.com" },
      { protocol: "https", hostname: "dl.airtable.com" },
    ],
  },

  async rewrites() {
    return [
      { source: "/", destination: "/index.html" },
      { source: "/creditos", destination: "/creditos.html" },
      { source: "/privacy", destination: "/privacy.html" },
      { source: "/terms", destination: "/terms.html" },
    ];
  },

  async headers() {
    return [
      {
        // VIP pages carry a prospect's name and personalised pitch — keep them
        // out of search engines even though the link itself stays shareable.
        source: "/vip/:slug*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
