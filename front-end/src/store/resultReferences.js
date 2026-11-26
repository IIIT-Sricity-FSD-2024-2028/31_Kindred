// A server response has one owner in Redux; form selections store references.
export const resultReferences = new WeakMap();
export function registerResult(value, reference, path = []) {
  if (!value || typeof value !== 'object') return value;
  resultReferences.set(value, { ...reference, path });
  for (const [key, item] of Object.entries(value)) registerResult(item, reference, [...path, key]);
  return value;
}
