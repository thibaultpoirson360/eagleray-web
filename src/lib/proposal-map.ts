/**
 * The route map of a private proposal (GroupProposalView.astro). The land
 * outlines come from espiritu-santo-map.ts; the sailing line is the same
 * curve the original proposal page drew from La Paz north to Espíritu Santo.
 * Each stop is placed on the curve at its nearest point, and the line is
 * drawn up to the farthest stop. All of it is worked out here, at build time,
 * so the map needs no script and reads the same without JavaScript.
 */
import { project } from "./espiritu-santo-map";

type Pt = [number, number];

/** Points the sailing line passes through, La Paz first. */
const ROUTE: Pt[] = [
  [659.2, 917.6], [668, 890], [680, 858], [676, 822], [650, 795], [626, 760], [618, 710], [616, 660], [620, 600],
  [608, 540], [586, 490], [566, 440], [548, 395], [514, 348], [500, 300], [506, 250], [508, 212], [522.5, 178.4],
];

/** One smooth cubic curve through the points (Catmull-Rom turned into Béziers). */
function segments(): [Pt, Pt, Pt, Pt][] {
  const out: [Pt, Pt, Pt, Pt][] = [];
  for (let n = 0; n < ROUTE.length - 1; n++) {
    const prev = ROUTE[n - 1] ?? ROUTE[n];
    const a = ROUTE[n];
    const b = ROUTE[n + 1];
    const next = ROUTE[n + 2] ?? b;
    out.push([a, [a[0] + (b[0] - prev[0]) / 6, a[1] + (b[1] - prev[1]) / 6], [b[0] - (next[0] - a[0]) / 6, b[1] - (next[1] - a[1]) / 6], b]);
  }
  return out;
}

const f = (n: number) => n.toFixed(1);
export const ROUTE_D =
  `M${ROUTE[0][0]},${ROUTE[0][1]}` + segments().map(([, c1, c2, b]) => `C${f(c1[0])},${f(c1[1])} ${f(c2[0])},${f(c2[1])} ${b[0]},${b[1]}`).join("");

/** The curve as many short steps, with the distance travelled at each (0 to 1). */
const SAMPLES = (() => {
  const pts: Pt[] = [];
  for (const [a, c1, c2, b] of segments()) {
    for (let i = 0; i < 40; i++) {
      const t = i / 40;
      const u = 1 - t;
      pts.push([
        u * u * u * a[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * b[0],
        u * u * u * a[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * b[1],
      ]);
    }
  }
  pts.push(ROUTE[ROUTE.length - 1]);
  let run = 0;
  const dist = pts.map((p, i) => (i === 0 ? 0 : (run += Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]))));
  return pts.map((p, i) => ({ x: p[0], y: p[1], f: dist[i] / run }));
})();

export interface MapStop {
  n: number;
  name: string;
  sub: string;
  x: number;
  y: number;
  f: number;
}

/** Stops (latitude/longitude) placed on the curve, plus how much of the line to draw. */
export function placeStops(stops: { name: string; sub?: string | null; lat: number; lon: number }[]): { stops: MapStop[]; drawn: number } {
  const placed = stops.map((s, i) => {
    const [px, py] = project(s.lat, s.lon);
    let best = SAMPLES[0];
    let bestD = Infinity;
    for (const p of SAMPLES) {
      const d = (p.x - px) ** 2 + (p.y - py) ** 2;
      if (d < bestD) {
        bestD = d;
        best = p;
      }
    }
    return { n: i + 1, name: s.name, sub: s.sub ?? "", x: best.x, y: best.y, f: best.f };
  });
  return { stops: placed, drawn: Math.max(0, ...placed.map((s) => s.f)) };
}
