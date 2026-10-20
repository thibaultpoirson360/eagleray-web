/**
 * Sea routes for the cinematic route block: finds a path through the water
 * between two points of the map (never across land), so a leg between two
 * places follows the coast and the channel instead of a straight line.
 * Runs at build time on the server; the result is passed to the page as data.
 */
import { LAND } from "./espiritu-santo-map";

type Pt = [number, number];

const polys: Pt[][] = LAND.map((d) => [...d.matchAll(/[ML]([\d.]+),([\d.]+)/g)].map((m) => [Number(m[1]), Number(m[2])] as Pt));

function inPoly(x: number, y: number, poly: Pt[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

// The map region the routes live in (x 440 to 760, y 80 to 960), as a grid of 6 px cells.
const STEP = 6;
const X0 = 440;
const Y0 = 80;
const COLS = Math.ceil((760 - X0) / STEP);
const ROWS = Math.ceil((960 - Y0) / STEP);
const landCell = new Uint8Array(COLS * ROWS);
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const x = X0 + c * STEP + STEP / 2;
    const y = Y0 + r * STEP + STEP / 2;
    if (polys.some((p) => inPoly(x, y, p))) landCell[r * COLS + c] = 1;
  }
}
// Cells next to the coast cost a little more, so routes keep off the shore when there is room.
const blocked = landCell;
const nearCoast = new Uint8Array(COLS * ROWS);
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      const rr = r + dr;
      const cc = c + dc;
      if (rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS && landCell[rr * COLS + cc]) nearCoast[r * COLS + c] = 1;
    }
  }
}

const cellOf = (p: Pt): [number, number] => [Math.max(0, Math.min(COLS - 1, Math.floor((p[0] - X0) / STEP))), Math.max(0, Math.min(ROWS - 1, Math.floor((p[1] - Y0) / STEP)))];
const centre = (c: number, r: number): Pt => [X0 + c * STEP + STEP / 2, Y0 + r * STEP + STEP / 2];

function nearestFree(c: number, r: number): [number, number] {
  for (let rad = 0; rad < 40; rad++) {
    let best: [number, number] | null = null;
    let bestD = Infinity;
    for (let dr = -rad; dr <= rad; dr++) for (let dc = -rad; dc <= rad; dc++) {
      const rr = r + dr;
      const cc = c + dc;
      if (rr < 0 || rr >= ROWS || cc < 0 || cc >= COLS || blocked[rr * COLS + cc]) continue;
      const d = dr * dr + dc * dc;
      if (d < bestD) { bestD = d; best = [cc, rr]; }
    }
    if (best) return best;
  }
  return [c, r];
}

function clearLine(a: Pt, b: Pt): boolean {
  const n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 2);
  for (let i = 0; i <= n; i++) {
    const x = a[0] + ((b[0] - a[0]) * i) / n;
    const y = a[1] + ((b[1] - a[1]) * i) / n;
    const [c, r] = cellOf([x, y]);
    if (blocked[r * COLS + c]) return false;
  }
  return true;
}

/** Water path between two map points, as a list of points (the two ends included). */
export function seaPath(from: Pt, to: Pt): Pt[] {
  const [sc, sr] = nearestFree(...cellOf(from));
  const [ec, er] = nearestFree(...cellOf(to));
  const key = (c: number, r: number) => r * COLS + c;
  const gScore = new Map<number, number>([[key(sc, sr), 0]]);
  const came = new Map<number, number>();
  const open: [number, number, number][] = [[Math.hypot(ec - sc, er - sr), sc, sr]];
  const closed = new Set<number>();
  while (open.length) {
    open.sort((a, b) => a[0] - b[0]);
    const [, c, r] = open.shift()!;
    const k = key(c, r);
    if (closed.has(k)) continue;
    closed.add(k);
    if (c === ec && r === er) break;
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      if (!dr && !dc) continue;
      const cc = c + dc;
      const rr = r + dr;
      if (cc < 0 || cc >= COLS || rr < 0 || rr >= ROWS || blocked[key(cc, rr)]) continue;
      const nk = key(cc, rr);
      const g = (gScore.get(k) ?? 0) + Math.hypot(dc, dr) + (nearCoast[nk] ? 0.9 : 0);
      if (g < (gScore.get(nk) ?? Infinity)) {
        gScore.set(nk, g);
        came.set(nk, k);
        open.push([g + Math.hypot(ec - cc, er - rr), cc, rr]);
      }
    }
  }
  const cells: Pt[] = [];
  let k: number | undefined = key(ec, er);
  if (!came.has(k) && k !== key(sc, sr)) return [from, to];
  while (k !== undefined) {
    cells.push(centre(k % COLS, Math.floor(k / COLS)));
    k = came.get(k);
  }
  cells.reverse();
  // Pull the string tight: keep only the corners that are needed.
  const pts: Pt[] = [from, ...cells, to];
  const out: Pt[] = [pts[0]];
  let i = 0;
  while (i < pts.length - 1) {
    let j = pts.length - 1;
    while (j > i + 1 && !clearLine(pts[i], pts[j])) j--;
    out.push(pts[j]);
    i = j;
  }
  return out;
}

/** A smooth SVG curve through the points. */
export function smoothPath(p: Pt[]): string {
  if (p.length < 2) return "";
  if (p.length === 2) return `M${p[0][0]},${p[0][1]}L${p[1][0]},${p[1][1]}`;
  let d = `M${p[0][0]},${p[0][1]}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0]},${p2[1]}`;
  }
  return d;
}
