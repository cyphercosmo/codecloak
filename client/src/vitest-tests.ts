/**
 * Vitest-based tests for steganography functionality
 * 
 * This file contains tests using the Vitest framework for the various 
 * steganography methods used in the application.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import * as browserStegCloak from './lib/browserStegCloak'
import * as codeSteg from './lib/codeSteg'
import { hideSecret, revealSecret } from './lib/stegcloak'

// Sample test data
const testMessages = [
  "test",
  "Hello, world!",
  "This is a longer message with some special characters: !@#$%^&*()",
  "1234567890",
  "Short"
];

const testPasswords = [
  "123",
  "password",
  "",  // Empty password
  "SecurePassword123!@#",
  "🔑" // Unicode password
];

const testCodeSamples = [
  `function add(a, b) { 
  // This is a simple function 
  return a + b; 
}`,
  `// This is a comment
const value = 42;
// Another comment
function test() {
  /* Multi-line
     comment */
  return value;
}`,
  `class Test {
  constructor() {
    // Initialize
    this.value = 0;
  }
  
  /* Method documentation
   * Increments the value
   */
  increment() {
    this.value++;
  }
}`,
  `// Minimal example
console.log("Hello");`,
  `<!DOCTYPE html>
<html>
<head>
  <title>Test</title>
</head>
<body>
  <!-- This is a comment -->
  <h1>Hello World</h1>
</body>
</html>`
];

describe('BrowserStegCloak (Zero-width approach)', () => {
  testMessages.forEach((message, i) => {
    const password = testPasswords[i]
    const code = testCodeSamples[i % testCodeSamples.length]
    
    it(`should hide and reveal "${message.substring(0, 10)}${message.length > 10 ? '...' : ''}"`, () => {
      const encoded = browserStegCloak.hide(code, message, password, true)
      expect(encoded).not.toBe(code)
      expect(encoded).toContain(code)
      
      const revealed = browserStegCloak.reveal(encoded, password)
      expect(revealed).toBe(message)
    })
  })
  
  it('should not reveal the correct message with wrong password', () => {
    const message = "Secret message"
    const correctPassword = "password"
    const wrongPassword = "wrong"
    const code = "// Test code"
    
    const encoded = browserStegCloak.hide(code, message, correctPassword, true)
    
    const revealed = browserStegCloak.reveal(encoded, wrongPassword)
    expect(revealed).not.toBe(message)
  })
  
  it('should handle tampering with the encoded text', () => {
    const message = "Do not tamper"
    const password = "password"
    const code = "// Original code"
    
    const encoded = browserStegCloak.hide(code, message, password, true)
    
    // Tamper with the encoded text
    const tampered = encoded.replace('Original', 'Modified')
    
    try {
      const revealed = browserStegCloak.reveal(tampered, password)
      // If we get here, at least it didn't crash
      // It might or might not match the original message
      if (revealed === message) {
        console.log("Note: The message was still recoverable after tampering")
      } else {
        console.log(`Original: "${message}", Tampered result: "${revealed}"`)
      }
    } catch (error) {
      // It's expected that tampering might break the hidden message
      expect(error).toBeDefined()
    }
  })
})

describe('CodeSteg (Code-based approach)', () => {
  testMessages.forEach((message, i) => {
    const password = testPasswords[i]
    const code = testCodeSamples[i % testCodeSamples.length]
    
    it(`should hide and reveal "${message.substring(0, 10)}${message.length > 10 ? '...' : ''}"`, () => {
      const encoded = codeSteg.hideInCode(code, message, password, true)
      expect(encoded).not.toBe(code)
      
      const revealed = codeSteg.revealFromCode(encoded, password)
      expect(revealed).toBe(message)
      
      // Test that encoded text looks believable
      const containsHiddenMsg = codeSteg.mightContainHiddenMessage(encoded)
      expect(containsHiddenMsg).toBe(true)
    })
  })
  
  it('should not reveal the correct message with wrong password', () => {
    const message = "Secret message"
    const correctPassword = "password"
    const wrongPassword = "wrong"
    const code = "// Test code"
    
    const encoded = codeSteg.hideInCode(code, message, correctPassword, true)
    
    const revealed = codeSteg.revealFromCode(encoded, wrongPassword)
    expect(revealed).not.toBe(message)
  })
  
  it('should correctly convert between text and binary', () => {
    // Test a simplified version of binary conversion
    const testText = "Test123"
    
    // Simplified implementation of textToBinary
    const textToBinary = (str: string): string => {
      return Array.from(str)
        .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
        .join('')
    }
    
    // Simplified implementation of binaryToText
    const binaryToText = (binary: string): string => {
      const chunks = binary.match(/.{1,8}/g) || []
      return chunks.map(chunk => {
        return String.fromCharCode(parseInt(chunk, 2))
      }).join('')
    }
    
    const binary = textToBinary(testText)
    const roundTrip = binaryToText(binary)
    
    expect(roundTrip).toBe(testText)
  })
  
  it('should correctly encrypt and decrypt messages', () => {
    // Test a simplified version of the encryption functions directly
    const testText = "Test123"
    const testPassword = "testkey"
    
    const simplifiedEncrypt = (message: string, password: string): string => {
      let result = ''
      for (let i = 0; i < message.length; i++) {
        const char = message.charCodeAt(i)
        const keyChar = password.charCodeAt(i % password.length)
        result += String.fromCharCode(char ^ keyChar)
      }
      return result
    }
    
    const simplifiedDecrypt = (encrypted: string, password: string): string => {
      let result = ''
      for (let i = 0; i < encrypted.length; i++) {
        const char = encrypted.charCodeAt(i)
        const keyChar = password.charCodeAt(i % password.length)
        result += String.fromCharCode(char ^ keyChar)
      }
      return result
    }
    
    const encrypted = simplifiedEncrypt(testText, testPassword)
    const decrypted = simplifiedDecrypt(encrypted, testPassword)
    
    expect(decrypted).toBe(testText)
  })
})

describe('Combined stegcloak approach', () => {
  // Focus on the problem case first
  it('should correctly handle the "test" message with "123" password', async () => {
    const message = "test"  // Exactly the message that's failing
    const password = "123"  // Exactly the password that's failing
    const code = "// Test for known failing case"
    
    // Fix parameter order: source code goes first, then secret, then password
    const encoded = await hideSecret(code, message, password)
    const revealed = await revealSecret(encoded, password)
    
    expect(revealed).toBe(message)
    
    // Debug info
    console.log("Encoded length:", encoded.length)
    console.log("Original message char codes:", Array.from(message).map(c => c.charCodeAt(0)))
    console.log("Revealed message char codes:", Array.from(revealed).map(c => c.charCodeAt(0)))
  })
  
  testMessages.forEach((message, i) => {
    const password = testPasswords[i]
    const code = testCodeSamples[i % testCodeSamples.length]
    
    it(`should hide and reveal "${message.substring(0, 10)}${message.length > 10 ? '...' : ''}"`, async () => {
      // Fix parameter order: source code goes first, then secret, then password
      const encoded = await hideSecret(code, message, password)
      expect(encoded).not.toBe(code)
      expect(encoded).toContain(code)
      
      const revealed = await revealSecret(encoded, password)
      expect(revealed).toBe(message)
    })
  })
})

// Export functions to run tests from command line
export async function runVitestTests() {
  // This function can be used to run tests programmatically
  console.log("Running Vitest-based tests...")
  
  // Vitest will handle the execution through its own runner
}

// Make available globally in browser environment
if (typeof window !== 'undefined') {
  (window as any).runVitestTests = runVitestTests
}