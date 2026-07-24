// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// jsdom does not provide a working Web Storage here, so install a minimal
// in-memory localStorage for tests that exercise persistence.
if (typeof localStorage === "undefined" || typeof localStorage.setItem !== "function") {
  const createMemoryStorage = (): Storage => {
    let store: Record<string, string> = {};
    return {
      get length() {
        return Object.keys(store).length;
      },
      clear() {
        store = {};
      },
      getItem(key: string) {
        return key in store ? store[key] : null;
      },
      key(index: number) {
        return Object.keys(store)[index] ?? null;
      },
      removeItem(key: string) {
        delete store[key];
      },
      setItem(key: string, value: string) {
        store[key] = String(value);
      },
    } as Storage;
  };
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: createMemoryStorage(),
  });
}
