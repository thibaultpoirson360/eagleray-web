/**
 * Minimal DeepL v2 client — `fetch` only, zero npm deps (this script runs
 * with no `npm ci` step in CI, see .github/workflows/translate-content.yml).
 *
 * Request/response shape verified against the real `deepl-node` v1.28.0
 * client source (npm/jsDelivr), not memory:
 *   - POST, form-urlencoded body (`text` repeated once per string,
 *     `target_lang`, `source_lang`, `preserve_formatting`).
 *   - Auth header: `Authorization: DeepL-Auth-Key <key>`.
 *   - Free-tier keys end in `:fx` and MUST use api-free.deepl.com — using
 *     api.deepl.com with a free key 403s. Routed automatically from the key
 *     shape so the caller never has to know which tier it's on.
 *   - Response: `{ translations: [{ detected_source_language, text }] }`,
 *     one entry per input `text`, same order.
 */
const FREE_TIER_HOST = "https://api-free.deepl.com/v2/translate";
const PRO_TIER_HOST = "https://api.deepl.com/v2/translate";

function resolveHost(apiKey) {
  return apiKey.trim().endsWith(":fx") ? FREE_TIER_HOST : PRO_TIER_HOST;
}

/**
 * Translates a batch of plain strings in one request (DeepL accepts
 * multiple `text` params per call — batching keeps this well under the
 * free tier's monthly character budget in request overhead, not just
 * character count, and keeps the PR's diff generation fast).
 *
 * @param {string[]} texts
 * @param {"ES"|"FR"} targetLang
 * @param {{ apiKey: string, sourceLang?: string }} options
 * @returns {Promise<string[]>} translated strings, same order/length as `texts`
 */
export async function translateBatch(texts, targetLang, { apiKey, sourceLang = "EN" } = {}) {
  if (!apiKey) {
    throw new Error("translateBatch: no DeepL API key provided (expected DEEPL_API_KEY).");
  }
  if (!Array.isArray(texts) || texts.length === 0) return [];

  const body = new URLSearchParams();
  for (const text of texts) body.append("text", text);
  body.append("target_lang", targetLang);
  if (sourceLang) body.append("source_lang", sourceLang);
  // Keeps DeepL from "fixing" whitespace/line breaks inside a field — we
  // rely on exact newline structure surviving for markdown paragraph splits
  // and multi-line plain-string fields (e.g. founderQuote.kicker).
  body.append("preserve_formatting", "1");

  const host = resolveHost(apiKey);
  const res = await fetch(host, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!res.ok) {
    // Never include the key in an error message — this ends up in Action logs.
    const detail = await res.text().catch(() => "");
    throw new Error(`DeepL API request failed: ${res.status} ${res.statusText}${detail ? ` — ${detail}` : ""}`);
  }

  const data = await res.json();
  if (!data || !Array.isArray(data.translations)) {
    throw new Error("DeepL API response missing `translations` array.");
  }
  return data.translations.map((t) => t.text);
}
