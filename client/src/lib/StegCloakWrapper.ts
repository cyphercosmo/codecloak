// This file has been deprecated in favor of using the actual StegCloak library
// Do not use this file for steganography operations - use stegcloak.ts instead

console.warn('StegCloakWrapper is deprecated');

// This file is kept as a placeholder to avoid import errors but should not be used
export default class DeprecatedStegCloakWrapper {
  constructor() {
    throw new Error('This implementation is not allowed. Use the official StegCloak library instead.');
  }
  
  hide(message: string, password: string, cover: string): string {
    throw new Error('This implementation is not allowed. Use the official StegCloak library instead.');
  }
  
  reveal(stegoText: string, password: string): string {
    throw new Error('This implementation is not allowed. Use the official StegCloak library instead.');
  }
}