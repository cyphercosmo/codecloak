/**
 * This file provides browser polyfills for Node.js-specific globals
 * that StegCloak depends on.
 */

// StegCloak expects a global object, which exists in Node.js but not in browsers
if (typeof window !== 'undefined' && typeof (window as any).global === 'undefined') {
  (window as any).global = window;
}

// Add other Node.js globals that StegCloak might depend on
if (typeof window !== 'undefined') {
  (window as any).process = (window as any).process || {};
  (window as any).process.env = (window as any).process.env || {};
  (window as any).Buffer = (window as any).Buffer || require('buffer').Buffer;
}

export {};