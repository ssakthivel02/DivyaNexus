import { japaGoals, mantraRecords } from "../data/mantras";

export const JAPA_STORAGE_KEY = "divyanexus.japa.v1";
export type JapaState = { selectedId: string; goal: number; counts: Record<string, number> };

export function defaultJapaProgress(): JapaState {
  return { selectedId: mantraRecords[0].id, goal: 108, counts: {} };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

/** Only catalogue IDs and bounded integer counts are accepted from storage or backups. */
export function sanitiseJapaProgress(value: unknown): JapaState | null {
  if (!isRecord(value) || !isRecord(value.counts)) return null;
  const selectedId = mantraRecords.find((item) => item.id === value.selectedId)?.id ?? mantraRecords[0].id;
  const goal = japaGoals.find((item) => item === value.goal) ?? 108;
  const counts: Record<string, number> = {};
  for (const item of mantraRecords) {
    if (!Object.prototype.hasOwnProperty.call(value.counts, item.id)) continue;
    const count = value.counts[item.id];
    if (typeof count === "number" && Number.isSafeInteger(count) && count >= 0 && count <= 1008) {
      counts[item.id] = count;
    }
  }
  return { selectedId, goal, counts };
}

/** Explicit restore merges checkpoints by max, never adds them or lowers an existing count.
 * Existing selection and goal win; a fresh browser adopts the backup's preferences.
 * A deliberate restore can recover repetitions that were previously reset.
 */
export function mergeJapaProgress(current: unknown, incoming: unknown): JapaState | null {
  const saved = sanitiseJapaProgress(current);
  const restored = sanitiseJapaProgress(incoming);
  if (!restored) return saved;
  if (!saved) return restored;
  const counts = { ...saved.counts };
  for (const [id, count] of Object.entries(restored.counts)) {
    counts[id] = Math.max(counts[id] ?? 0, count);
  }
  return { selectedId: saved.selectedId, goal: saved.goal, counts };
}

export function readJapaProgress(): JapaState | null {
  try {
    const raw = window.localStorage.getItem(JAPA_STORAGE_KEY);
    return raw ? sanitiseJapaProgress(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

/** Caller handles storage denial; never imply that an unsuccessful write was saved. */
export function writeJapaProgress(progress: JapaState): void {
  const clean = sanitiseJapaProgress(progress);
  if (!clean) throw new Error("Invalid chanting progress");
  window.localStorage.setItem(JAPA_STORAGE_KEY, JSON.stringify(clean));
}
