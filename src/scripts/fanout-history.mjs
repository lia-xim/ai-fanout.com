export const HISTORY_TTL_MS = 30 * 24 * 60 * 60 * 1000;
export const HISTORY_LIMIT = 20;

const DB_NAME = "ai-fanout-local-history";
const STORE_NAME = "saved-runs";

export async function historyStorageState(storageManager = globalThis.navigator?.storage) {
  if (typeof storageManager?.persisted !== "function") return { supported: false, persistent: false };
  try {
    return { supported: true, persistent: Boolean(await storageManager.persisted()) };
  } catch {
    return { supported: true, persistent: false };
  }
}

export async function requestPersistentHistoryStorage(storageManager = globalThis.navigator?.storage) {
  const current = await historyStorageState(storageManager);
  if (current.persistent || typeof storageManager?.persist !== "function") return current;
  try {
    return { supported: true, persistent: Boolean(await storageManager.persist()) };
  } catch {
    return current;
  }
}

export function pruneHistory(entries, now = Date.now()) {
  return entries
    .filter((entry) => Number(entry.expiresAt) > now)
    .sort((a, b) => Number(b.savedAt) - Number(a.savedAt))
    .slice(0, HISTORY_LIMIT);
}

export function prepareResultForLocalStorage(result) {
  if (result?.providerId !== "gemini") return structuredClone(result);
  return {
    ...structuredClone(result),
    sources: [],
    searchActions: (result.searchActions ?? []).map((action) => ({ ...action, sources: [], sourceScope: "not_stored" })),
    sourceEvidenceScope: "not_stored_google_grounded_results",
    storageNotice: "Gemini Grounded Results and Search Suggestions are not stored. Only provider-exposed query strings and run metadata remain on this device.",
  };
}

function openHistoryDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onerror = () => reject(request.error);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME, { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
  });
}

async function transaction(mode, operation) {
  const db = await openHistoryDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode);
    const store = tx.objectStore(STORE_NAME);
    const request = operation(store);
    let result;
    request.onerror = () => reject(request.error);
    request.onsuccess = () => { result = request.result; };
    tx.oncomplete = () => { db.close(); resolve(result); };
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

export async function loadSavedRuns(now = Date.now()) {
  const all = await transaction("readonly", (store) => store.getAll());
  const kept = pruneHistory(all, now);
  const keptIds = new Set(kept.map((entry) => entry.id));
  await Promise.all(all.filter((entry) => !keptIds.has(entry.id)).map((entry) => deleteSavedRun(entry.id)));
  return kept;
}

export async function saveRun(result, now = Date.now()) {
  const storedResult = prepareResultForLocalStorage(result);
  const entry = {
    id: `${result.generatedAt}:${result.modelId}`,
    savedAt: now,
    expiresAt: now + HISTORY_TTL_MS,
    result: storedResult,
  };
  await transaction("readwrite", (store) => store.put(entry));
  const entries = await loadSavedRuns(now);
  return { entry, entries };
}

export function deleteSavedRun(id) {
  return transaction("readwrite", (store) => store.delete(id));
}

export function clearSavedRuns() {
  return transaction("readwrite", (store) => store.clear());
}
