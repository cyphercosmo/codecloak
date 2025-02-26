/**
 * DEPRECATED - NOT CURRENTLY USED
 * 
 * This file provided a minimal polyfill for the stream.Transform class
 * that the npm StegCloak package depended on.
 * 
 * Since we've switched to our own custom implementation that doesn't
 * use Node.js streams, this polyfill is no longer needed. It's no longer
 * imported in main.tsx, but we're keeping it for reference.
 */

// Create a minimal mock of the Transform class
class MockTransform {
  _transform(chunk: any, encoding: string, callback: Function) {
    callback(null, chunk);
  }
  
  _flush(callback: Function) {
    callback();
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

// Add the mock Transform to the global scope
if (typeof window !== 'undefined') {
  (window as any).stream = (window as any).stream || {};
  (window as any).stream.Transform = MockTransform;
}

export {};