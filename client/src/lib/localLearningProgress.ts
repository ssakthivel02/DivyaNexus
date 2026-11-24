const STORAGE_KEY = "divyanexus.learningJourneys.v1";

export type LocalLearningProgress = Record<string, readonly string[]>;

export function sanitiseLocalLearningProgress(value: unknown): LocalLearningProgress {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).flatMap(([journeyId, stepIds]) => {
      if (!Array.isArray(stepIds)) return [];
      const clean = Array.from(new Set(stepIds.filter((item): item is string => typeof item === "string" && item.trim().length > 0)));
      return [[journeyId, clean]];
    }),
  );
}

/** Restoring a backup adds recorded completion, without discarding newer local steps.
 * Existing order wins, duplicates are suppressed, and a repeated restore is idempotent.
 */
export function mergeLocalLearningProgress(current: unknown, backup: unknown): LocalLearningProgress {
  const saved = sanitiseLocalLearningProgress(current);
  const incoming = sanitiseLocalLearningProgress(backup);
  const byJourney = new Map<string, string[]>(
    Object.entries(saved).map(([journeyId, stepIds]) => [journeyId, [...stepIds]]),
  );
  for (const [journeyId, stepIds] of Object.entries(incoming)) {
    byJourney.set(journeyId, Array.from(new Set([...(byJourney.get(journeyId) ?? []), ...stepIds])));
  }
  return Object.fromEntries(byJourney);
}

export function readLocalLearningProgress(): LocalLearningProgress {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? sanitiseLocalLearningProgress(JSON.parse(raw)) : {};
  } catch {
    return {};
  }
}

export function writeLocalLearningProgress(progress: LocalLearningProgress) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitiseLocalLearningProgress(progress)));
  window.dispatchEvent(new CustomEvent("divyanexus-learning-change"));
}

export function toggleLearningStep(journeyId: string, stepId: string) {
  const current = readLocalLearningProgress();
  const existing = new Set(current[journeyId] ?? []);
  existing.has(stepId) ? existing.delete(stepId) : existing.add(stepId);
  const next = { ...current, [journeyId]: Array.from(existing) };
  writeLocalLearningProgress(next);
  return next;
}

export function resetLearningJourney(journeyId: string) {
  const current = readLocalLearningProgress();
  const next = { ...current };
  delete next[journeyId];
  writeLocalLearningProgress(next);
  return next;
}

export const LOCAL_LEARNING_PROGRESS_STORAGE_KEY = STORAGE_KEY;
