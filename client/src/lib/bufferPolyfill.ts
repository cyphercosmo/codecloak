/**
 * This file provides a polyfill for the Buffer functionality needed by StegCloak
 * in a browser environment where Buffer is not natively available.
 * 
 * Instead of trying to use the actual buffer module which causes issues in the browser,
 * we'll define a simple class with the minimal functionality needed.
 */

class BufferPolyfill {
  private data: Uint8Array;

  constructor(input?: string | number | ArrayBuffer | Uint8Array, encoding?: string) {
    if (typeof input === 'number') {
      this.data = new Uint8Array(input);
    } else if (typeof input === 'string') {
      this.data = this.stringToUint8Array(input);
    } else if (input instanceof ArrayBuffer) {
      this.data = new Uint8Array(input);
    } else if (input instanceof Uint8Array) {
      this.data = input;
    } else {
      this.data = new Uint8Array(0);
    }
  }

  private stringToUint8Array(str: string): Uint8Array {
    const encoder = new TextEncoder();
    return encoder.encode(str);
  }

  private uint8ArrayToString(array: Uint8Array): string {
    const decoder = new TextDecoder();
    return decoder.decode(array);
  }

  toString(encoding?: string): string {
    return this.uint8ArrayToString(this.data);
  }

  slice(start?: number, end?: number): BufferPolyfill {
    return new BufferPolyfill(this.data.slice(start, end));
  }

  readUInt8(offset: number): number {
    return this.data[offset];
  }

  writeUInt8(value: number, offset: number): number {
    this.data[offset] = value;
    return offset + 1;
  }

  get length(): number {
    return this.data.length;
  }

  // Static methods
  static from(input: string | ArrayBuffer | Uint8Array, encoding?: string): BufferPolyfill {
    return new BufferPolyfill(input, encoding);
  }

  static alloc(size: number, fill?: number): BufferPolyfill {
    const buffer = new BufferPolyfill(size);
    if (fill !== undefined) {
      for (let i = 0; i < size; i++) {
        buffer.writeUInt8(fill, i);
      }
    }
    return buffer;
  }
}

// Make the Buffer polyfill available globally
if (typeof window !== 'undefined') {
  (window as any).Buffer = BufferPolyfill;
}

export {};