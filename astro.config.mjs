// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import preact from '@astrojs/preact';
import tailwindcss from '@tailwindcss/vite';
import tina from '@tinacms/astro/integration';
import { tinaAdminDevRedirect } from '@tinacms/astro/vite';
import { loadEnv } from 'vite';

/**
 * Dev-only stand-in for the api/media/cloudinary Vercel Function, so the
 * local editor can browse and manage the real Cloudinary library
 * (`npm run tina:dev:cloudinary`). Off unless TINA_PUBLIC_MEDIA=cloudinary,
 * and `apply: 'serve'` keeps it out of every build. No login check: local
 * mode has no login, and this only listens on the local dev server. Reads
 * the CLOUDINARY_* values from the local .env.
 */
function localCloudinaryMedia() {
  return {
    name: 'local-cloudinary-media',
    apply: 'serve',
    configureServer(server) {
      if (process.env.TINA_PUBLIC_MEDIA !== 'cloudinary') return;
      const fileEnv = loadEnv(server.config.mode, server.config.root, 'CLOUDINARY_');
      const env = {
        cloudName: fileEnv.CLOUDINARY_CLOUD_NAME,
        uploadPreset: fileEnv.CLOUDINARY_UPLOAD_PRESET,
        apiKey: fileEnv.CLOUDINARY_API_KEY,
        apiSecret: fileEnv.CLOUDINARY_API_SECRET,
      };
      server.middlewares.use('/api/media/cloudinary', async (req, res) => {
        const send = (status, body) => {
          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(body));
        };
        if (req.method !== 'POST') return send(405, { error: 'Method not allowed' });
        try {
          const { isConfigured, runAction } = await server.ssrLoadModule('/tina/media/cloudinary-actions.ts');
          if (!isConfigured(env)) return send(500, { error: 'Add the four CLOUDINARY_* values to your local .env.' });
          let raw = '';
          for await (const chunk of req) raw += chunk;
          const result = await runAction(raw ? JSON.parse(raw) : {}, env);
          send(result.status, result.body);
        } catch (error) {
          send(500, { error: String(error) });
        }
      });
    },
  };
}

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
    // localCloudinaryMedia: dev-only, see above.
    plugins: [tailwindcss(), tinaAdminDevRedirect(), localCloudinaryMedia()],
  },
});
