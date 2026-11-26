// Browser preferences must never turn a successful server operation into an error.
let reduxStorage;
export function bindReduxStorage(adapter) { reduxStorage = adapter; }
export function readStored(key, fallback = null, kind = 'sessionStorage') {
  if (reduxStorage?.handles(key)) return reduxStorage.read(key, fallback);
  try {
    const value = JSON.parse(globalThis[kind].getItem(key) || 'null');
    if (Array.isArray(fallback)) return Array.isArray(value) ? value.filter((item) => item && typeof item === 'object' && !Array.isArray(item)) : fallback;
    return value && typeof value === 'object' && !Array.isArray(value) ? value : fallback;
  } catch { return fallback; }
}
export function writeStored(key, value, kind = 'sessionStorage') {
  if (reduxStorage?.handles(key)) return reduxStorage.write(key, value, kind);
  try { globalThis[kind].setItem(key, JSON.stringify(value)); return true; } catch { return false; }
}
