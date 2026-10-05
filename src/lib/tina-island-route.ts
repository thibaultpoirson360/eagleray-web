/**
 * A drop-in replacement for @tinacms/astro/experimental's
 * `experimental_createIslandRoute`, adding one thing that helper doesn't do:
 * registering this project's framework renderer on the container it uses
 * to re-render islands.
 *
 * Root cause this works around: the library builds its render container
 * with a bare `AstroContainer.create()` (no renderers), so any island whose
 * component tree hydrates a `client:*` Preact child fails with
 * `NoMatchingRenderer` the instant the visual editor tries to prime it —
 * confirmed against Crew/Boats (SliderDots) and Funnel (FunnelForm), all
 * three silently 500ing ("Island render failed") instead of registering
 * any editable fields. Reproduced directly against @tinacms/astro 0.7.0
 * and 0.7.1 (identical file in both) — no public option exists on
 * `experimental_createIslandRoute` to inject renderers, so this vendors
 * the ~90-line handler instead of patching around it. If a future
 * @tinacms/astro version adds renderer support, drop this file and go
 * back to importing the library's version directly.
 *
 * `formsStore`/`requestStore` are @tinacms/astro's own internals (not a
 * public export) — reused here via the same `globalThis[Symbol.for(...)]`
 * slots @tinacms/astro/data itself reads/writes, so every
 * `requestWithMetadata()` call made by the loaders in lib/content.ts keeps
 * recording forms and resolving the live-edit overlay exactly as it does
 * for the islands still using the library's own route (hero, difference,
 * wildlife, navigation, footer). The lookup happens inside
 * `createIslandRoute()` itself, not at this module's own top level, so it
 * doesn't depend on import order between this file and lib/content.ts —
 * by the time a page's [name].ts calls `createIslandRoute(islands)`, every
 * module it needed (including lib/content.ts, which is what actually
 * initializes those slots) has already been evaluated.
 */
import type { APIRoute } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { AstroComponentFactory } from "astro/runtime/server/index.js";
import { PREVIEW_CONTENT_TYPE, PRIME_HEADER } from "@tinacms/bridge/preview";
import preactRenderer from "@astrojs/preact/server.js";

interface CollectedForm {
  id: string;
  query: string;
  variables: object;
  data: object;
  priority?: "primary";
}

interface AsyncLocalStorageLike<T> {
  run<R>(store: T, fn: () => R): R;
}

export interface IslandWrapper {
  tag: string;
  className?: string;
}

export interface IslandConfig {
  fetch: (request: Request, params: URLSearchParams) => Promise<unknown>;
  component: AstroComponentFactory;
  wrapper: IslandWrapper;
  propsFromData: (data: unknown, params: URLSearchParams) => Record<string, unknown>;
}

export type IslandRegistry = Record<string, IslandConfig>;

export function createIslandRoute(islands: IslandRegistry): APIRoute {
  const g = globalThis as unknown as Record<symbol, unknown>;
  const formsStore = g[Symbol.for("@tinacms/astro/forms-store")] as AsyncLocalStorageLike<CollectedForm[]>;
  const requestStore = g[Symbol.for("@tinacms/astro/request-context")] as AsyncLocalStorageLike<Request>;

  return async ({ params, request, url }) => {
    const rejection = rejectIfUnsafe(request);
    if (rejection) return rejection;

    const island = islands[params.name ?? ""];
    if (!island) {
      return new Response(`Unknown island "${params.name}"`, { status: 404 });
    }

    const priming = request.headers.get(PRIME_HEADER) !== null;

    try {
      const forms: CollectedForm[] = [];
      const html = await requestStore.run(request, () =>
        formsStore.run(forms, async () => {
          const data = await island.fetch(request, url.searchParams);
          const container = await AstroContainer.create();
          container.addServerRenderer({ renderer: preactRenderer });
          return container.renderToString(island.component, {
            props: island.propsFromData(data, url.searchParams),
          });
        })
      );
      const body = (priming ? renderFormPayloads(forms) : "") + wrapIsland(html, island.wrapper, url);
      return new Response(body, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store",
        },
      });
    } catch {
      return new Response("Island render failed", { status: 500 });
    }
  };
}

// Bridge issues a same-origin POST with the Tina-preview content-type;
// production traffic can't match all three signals.
function rejectIfUnsafe(request: Request): Response | null {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes(PREVIEW_CONTENT_TYPE)) {
    return new Response("Not Found", { status: 404 });
  }
  if (request.headers.get("sec-fetch-site") === "cross-site") {
    return new Response("Forbidden", { status: 403 });
  }
  return null;
}

function renderFormPayloads(forms: CollectedForm[]): string {
  return [...forms]
    .sort((a, b) => (a.priority === "primary" ? 0 : 1) - (b.priority === "primary" ? 0 : 1))
    .map((form) => renderFormPayloadDiv(form, form.priority === "primary"))
    .join("");
}

function renderFormPayloadDiv(form: CollectedForm, primary: boolean): string {
  return `<div data-tina-form="${escapeAttr(JSON.stringify(form))}"${primary ? " data-tina-primary" : ""} hidden></div>`;
}

function wrapIsland(html: string, wrapper: IslandWrapper, url: URL): string {
  const cls = wrapper.className ? ` class="${escapeAttr(wrapper.className)}"` : "";
  const marker = escapeAttr(`${url.pathname}${url.search}`);
  return `<${wrapper.tag}${cls} data-tina-island="${marker}">${html}</${wrapper.tag}>`;
}

function escapeAttr(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
