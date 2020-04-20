/*
 * window.ts
 *
 * Window module to enable easy mocking.
 */

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export = typeof window !== 'undefined' ? window : {} as Window;
