/*
 * window.ts
 *
 * Window module to enable easy mocking.
 */

// tslint:disable-next-line
export = typeof(window) !== 'undefined' ? window : {} as Window;
