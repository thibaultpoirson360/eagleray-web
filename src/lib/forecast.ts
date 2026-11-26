/**
 * The weather widget of a private proposal (GroupProposalView.astro). The
 * forecast is fetched once, when the page is built, from MET Norway
 * (api.met.no, free for commercial use with credit), so a visitor's browser
 * never talks to a third party. The page shows the forecast as of the last
 * deploy: redeploy the day before the trip to refresh it. If the request
 * fails, or the date is outside the forecast, the widget simply does not show.
 */

export type Sky = "sun" | "partly" | "cloud" | "rain";

export interface ForecastHour {
  hour: string;
  temp: number;
  wind: number;
  rain: number;
  sky: Sky;
}

export interface Forecast {
  hours: ForecastHour[];
  updated: string;
}

const KNOTS_PER_MS = 1.94384;
const cache = new Map<string, Promise<Forecast | null>>();

const skyOf = (code: string): Sky => {
  if (/rain|shower|sleet|snow|thunder/.test(code)) return "rain";
  if (/^(clearsky|fair)/.test(code)) return "sun";
  if (/^partlycloudy/.test(code)) return "partly";
  return "cloud";
};

async function fetchForecast(lat: number, lon: number, date: string, timeZone: string, hours: number[]): Promise<Forecast | null> {
  try {
    const res = await fetch(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat.toFixed(3)}&lon=${lon.toFixed(3)}`, {
      headers: { "User-Agent": "eagleray-web-build https://www.eaglerayexpeditions.com" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const json: any = await res.json();
    const parts = new Intl.DateTimeFormat("en-CA", { timeZone, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit" });
    const found: ForecastHour[] = [];
    for (const entry of json.properties?.timeseries ?? []) {
      const p = Object.fromEntries(parts.formatToParts(new Date(entry.time)).map((x) => [x.type, x.value]));
      const hour = Number(p.hour);
      if (`${p.year}-${p.month}-${p.day}` !== date || !hours.includes(hour)) continue;
      const now = entry.data?.instant?.details;
      const next = entry.data?.next_1_hours ?? entry.data?.next_6_hours;
      if (!now || typeof now.air_temperature !== "number") continue;
      found.push({
        hour: `${String(hour).padStart(2, "0")}:00`,
        temp: Math.round(now.air_temperature),
        wind: Math.round((now.wind_speed ?? 0) * KNOTS_PER_MS),
        rain: Math.round((next?.details?.precipitation_amount ?? 0) * 10) / 10,
        sky: skyOf(next?.summary?.symbol_code ?? ""),
      });
    }
    if (found.length === 0) return null;
    const updated = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(json.properties?.meta?.updated_at ?? Date.now()));
    return { hours: found, updated };
  } catch {
    return null;
  }
}

/** Forecast for one local date at a place, at the given hours (local time). Cached per build. */
export function loadForecast(opts: { lat: number; lon: number; date: string; timeZone?: string; hours?: number[] }): Promise<Forecast | null> {
  const timeZone = opts.timeZone || "America/Mazatlan";
  const hours = opts.hours ?? [9, 12, 15, 18];
  const key = `${opts.lat}|${opts.lon}|${opts.date}|${timeZone}|${hours.join(",")}`;
  if (!cache.has(key)) cache.set(key, fetchForecast(opts.lat, opts.lon, opts.date, timeZone, hours));
  return cache.get(key)!;
}
