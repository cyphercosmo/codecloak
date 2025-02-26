/**
 * This file provides a polyfill for the Buffer functionality needed by StegCloak
 * in a browser environment where Buffer is not natively available.
 */

// Check if the global Buffer object exists, otherwise create a polyfill
if (typeof window !== 'undefined' && typeof (window as any).Buffer === 'undefined') {
  // Use the buffer package we installed
  try {
    const bufferPolyfill = require('buffer/');
    (window as any).Buffer = bufferPolyfill.Buffer;
  } catch (e) {
    console.error('Failed to load buffer polyfill:', e);
  }
}

export {};