type Container = Record<string, unknown> | unknown[];

/** Immutably sets a nested value on an object/array via a dot-separated path (e.g. "theme.primaryColor", "platforms.0.handle"). */
export function setPath<T>(obj: T, path: string, value: unknown): T {
  const keys = path.split(".");
  const root: Container = Array.isArray(obj) ? [...obj] : { ...(obj as Record<string, unknown>) };
  let cursor: Container = root;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const existing = (cursor as Record<string, unknown>)[key];
    const nextContainer: Container = Array.isArray(existing)
      ? [...existing]
      : { ...((existing as Record<string, unknown>) ?? {}) };
    (cursor as Record<string, unknown>)[key] = nextContainer;
    cursor = nextContainer;
  }

  (cursor as Record<string, unknown>)[keys[keys.length - 1]] = value;
  return root as T;
}
