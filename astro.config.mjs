// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import preact from '@astrojs/preact';
import tailwindcss from '@tailwindcss/vite';
import tina from '@tinacms/astro/integration';
import { tinaAdminDevRedirect } from '@tinacms/astro/vite';

// https://astro.build/config
export default defineConfig({
  // Static output (docs/migration-history.md). The Vercel adapter is still required because
  // @tinacms/astro's island-refresh endpoint (src/pages/tina-island/[name].ts,
  // `prerender = false`) is served on demand — see docs/tina-setup.md section 5.
  output: 'static',
  adapter: vercel(),

  site: 'https://eaglerayexpeditions.com',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'fr'],
    routing: {
      // /en/ is a real, prefixed URL; "/" redirects to it.
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true,
    },
  },

  integrations: [
    // Preact only (docs/migration-history.md): sliders, tabs, FAQ accordion, funnel wizard.
    // No `compat` alias: Tina's admin SPA is a separate React bundle built by
    // `tinacms build` into public/admin/ and never shares a module graph with
    // the site's Preact islands.
    preact(),
    // Auto-wires the visual-editing middleware and stages /admin/bridge.js.
    // Production visitors get HTML identical to a Tina-free build except on
    // pages that use <TinaIsland> (one inline bootstrap script).
    tina(),
  ],

  vite: {
    // tinaAdminDevRedirect: dev-only, makes /admin resolve to /admin/index.html.
    plugins: [tailwindcss(), tinaAdminDevRedirect()],
  },
});
