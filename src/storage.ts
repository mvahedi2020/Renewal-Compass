import { fresh, parse, type State } from "./domain";
export const key = "renewal-compass-v1";
export type Read =
  | { readable: true; raw: string | null }
  | { readable: false; raw: null };
export type Store = Pick<Storage, "getItem" | "setItem">;
export function read(store: Store): Read {
  try {
    return { readable: true, raw: store.getItem(key) };
  } catch {
    return { readable: false, raw: null };
  }
}
export function same(a: Read, b: Read) {
  return a.readable === b.readable && a.raw === b.raw;
}
export function load(store: Store) {
  const token = read(store);
  const parsed = token.readable && token.raw !== null ? parse(token.raw) : null;
  return {
    token,
    state: parsed ?? fresh(),
    invalid: token.readable && token.raw !== null && !parsed,
  };
}
export function save(
  store: Store,
  token: Read,
  next: State,
): { token: Read; saved: boolean } {
  const now = read(store);
  if (!same(token, now))
    throw Error(
      "Saved data changed during review. Refresh to inspect it before continuing.",
    );
  if (!token.readable) return { token, saved: false };
  if (token.raw !== null && !parse(token.raw))
    throw Error("Unreadable saved content is preserved. Review a reset first.");
  try {
    const raw = JSON.stringify(next);
    store.setItem(key, raw);
    return { token: { readable: true, raw }, saved: true };
  } catch {
    return { token, saved: false };
  }
}
export function reset(
  store: Store,
  reviewed: Read,
): { token: Read; saved: boolean; state: State } {
  const now = read(store);
  if (!same(reviewed, now))
    throw Error("Saved data changed during reset review. Review reset again.");
  const state = fresh();
  if (!reviewed.readable) return { token: reviewed, saved: false, state };
  try {
    const raw = JSON.stringify(state);
    store.setItem(key, raw);
    return { token: { readable: true, raw }, saved: true, state };
  } catch {
    return { token: reviewed, saved: false, state };
  }
}
