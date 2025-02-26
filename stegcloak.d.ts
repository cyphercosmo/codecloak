/**
 * DEPRECATED - NOT CURRENTLY USED
 * 
 * This TypeScript type definition file was for the npm StegCloak package.
 * We have switched to our own custom implementation (see client/src/lib/commentSteg.ts)
 * that doesn't rely on the StegCloak library.
 * 
 * This file is kept for reference in case we want to reintegrate the StegCloak 
 * library in the future.
 */
declare module 'stegcloak' {
  export default class StegCloak {
    constructor(encrypt?: boolean, integrity?: boolean);
    hide(secret: string, password: string, cover: string): string;
    reveal(data: string, password: string): string;
  }
}