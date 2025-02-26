/**
 * This file provides a minimal polyfill for the stream.Transform class
 * that StegCloak depends on.
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