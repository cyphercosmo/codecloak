/**
 * This file provides browser polyfills for Node.js-specific globals
 * that StegCloak depends on.
 */

// Import Buffer from the 'buffer' package that's already installed
import { Buffer } from 'buffer';

// Create a minimal Transform stream mock
class MockTransform {
  constructor() {
    // Empty constructor
  }
  
  _transform(chunk: any, encoding: string, callback: Function) {
    callback(null, chunk);
  }
  
  pipe() {
    return this;
  }
  
  on() {
    return this;
  }
  
  write() {
    return true;
  }
  
  end() {
    return this;
  }
}

// StegCloak expects a global object, which exists in Node.js but not in browsers
if (typeof window !== 'undefined' && typeof (window as any).global === 'undefined') {
  (window as any).global = window;
}

// Add other Node.js globals that StegCloak might depend on
if (typeof window !== 'undefined') {
  (window as any).process = (window as any).process || {};
  (window as any).process.env = (window as any).process.env || {};
  (window as any).Buffer = Buffer;
  
  // Add stream and Transform
  (window as any).stream = (window as any).stream || {};
  (window as any).stream.Transform = MockTransform;
  
  // Make Transform directly accessible
  try {
    (window as any).Transform = MockTransform;
  } catch (e) {
    console.warn("Could not define global Transform", e);
  }
}

export {};