/**
 * Celestial Manuscript Atelier: browser-local utilities with explicit sync limits.
 * No account synchronisation is implied by these helpers.
 */

export type LocalNote = {
  id: string;
  recordId: string;
  title: string;
  body: string;
  updatedAt: string;
};

const preferenceKeys = {
  bookmarks: "divyanexus.bookmarks",
  history: "divyanexus.history",
  searches: "divyanexus.searches",
  theme: "divyanexus.theme",
  fontSize: "divyanexus.fontSize",
  audioPosition: "divyanexus.audioPosition",
};

function readJson<T>(key: string, fallback: T): T {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("divyanexus-library-change"));
}

export function getBookmarks() {
  return readJson<string[]>(preferenceKeys.bookmarks, []);
}

export function toggleBookmark(recordId: string) {
  const current = getBookmarks();
  const next = current.includes(recordId) ? current.filter((id) => id !== recordId) : [recordId, ...current];
  writeJson(preferenceKeys.bookmarks, next);
  return next;
}

export function getHistory() {
  return readJson<string[]>(preferenceKeys.history, []);
}

export function recordHistory(recordId: string) {
  const next = [recordId, ...getHistory().filter((id) => id !== recordId)].slice(0, 12);
  writeJson(preferenceKeys.history, next);
}

export function getSavedSearches() {
  return readJson<string[]>(preferenceKeys.searches, []);
}

export function saveSearch(query: string) {
  if (!query.trim()) return;
  const next = [query.trim(), ...getSavedSearches().filter((item) => item !== query.trim())].slice(0, 8);
  writeJson(preferenceKeys.searches, next);
}

export function getPreference(key: keyof typeof preferenceKeys, fallback = "") {
  try {
    return window.localStorage.getItem(preferenceKeys[key]) ?? fallback;
  } catch {
    return fallback;
  }
}

export function setPreference(key: keyof typeof preferenceKeys, value: string) {
  window.localStorage.setItem(preferenceKeys[key], value);
  window.dispatchEvent(new CustomEvent("divyanexus-library-change"));
}

function openNotesDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open("divyanexus-library", 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains("notes")) request.result.createObjectStore("notes", { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function listNotes(): Promise<LocalNote[]> {
  try {
    const db = await openNotesDb();
    return await new Promise((resolve, reject) => {
      const request = db.transaction("notes", "readonly").objectStore("notes").getAll();
      request.onsuccess = () => resolve((request.result as LocalNote[]).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
      request.onerror = () => reject(request.error);
    });
  } catch {
    return [];
  }
}

export async function saveNote(note: Omit<LocalNote, "id" | "updatedAt"> & Partial<Pick<LocalNote, "id">>) {
  const payload: LocalNote = {
    id: note.id ?? crypto.randomUUID(),
    recordId: note.recordId,
    title: note.title,
    body: note.body,
    updatedAt: new Date().toISOString(),
  };
  const db = await openNotesDb();
  await new Promise<void>((resolve, reject) => {
    const request = db.transaction("notes", "readwrite").objectStore("notes").put(payload);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
  window.dispatchEvent(new CustomEvent("divyanexus-library-change"));
  return payload;
}

export async function clearLocalLibrary() {
  Object.values(preferenceKeys).forEach((key) => window.localStorage.removeItem(key));
  try {
    const db = await openNotesDb();
    await new Promise<void>((resolve, reject) => {
      const request = db.transaction("notes", "readwrite").objectStore("notes").clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } finally {
    window.dispatchEvent(new CustomEvent("divyanexus-library-change"));
  }
}

export async function exportLocalLibrary() {
  const payload = {
    exportedAt: new Date().toISOString(),
    notice: "This export contains browser-local DivyaNexus data only. It does not represent synced account data.",
    bookmarks: getBookmarks(),
    history: getHistory(),
    savedSearches: getSavedSearches(),
    notes: await listNotes(),
    preferences: Object.fromEntries(Object.entries(preferenceKeys).map(([key, storageKey]) => [key, window.localStorage.getItem(storageKey)])),
  };
  const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "divyanexus-local-data.json";
  anchor.click();
  URL.revokeObjectURL(url);
}

