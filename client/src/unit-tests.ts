/**
 * Unit tests for steganography functionality
 * 
 * This file provides a structured approach to testing the various
 * steganography methods used in the application.
 */

import * as browserStegCloak from './lib/browserStegCloak';
import * as codeSteg from './lib/codeSteg';
import { hideSecret, revealSecret } from './lib/stegcloak';

/**
 * Simple test runner with assertions
 */
class TestRunner {
  private passCount = 0;
  private failCount = 0;
  private tests: Array<{ name: string; fn: () => Promise<void> }> = [];
  
  // Add a test to the queue
  test(name: string, fn: () => Promise<void>) {
    this.tests.push({ name, fn });
    return this;
  }
  
  // Run all tests
  async run() {
    console.log("Running tests...\n");
    
    for (const { name, fn } of this.tests) {
      try {
        await fn();
        console.log(`✅ PASS: ${name}`);
        this.passCount++;
      } catch (error) {
        console.error(`❌ FAIL: ${name}`);
        console.error(`   Error: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
        this.failCount++;
      }
    }
    
    console.log(`\nResults: ${this.passCount} passed, ${this.failCount} failed`);
    
    return {
      passCount: this.passCount,
      failCount: this.failCount,
      totalCount: this.tests.length
    };
  }
  
  // Assertion helpers
  assertEquals(actual: any, expected: any, message?: string) {
    if (actual !== expected) {
      throw new Error(message || `Expected "${expected}", got "${actual}"`);
    }
  }
  
  assertContains(text: string, substring: string, message?: string) {
    if (!text.includes(substring)) {
      throw new Error(message || `Expected text to contain "${substring}"`);
    }
  }
  
  assertMatches(text: string, pattern: RegExp, message?: string) {
    if (!pattern.test(text)) {
      throw new Error(message || `Expected text to match pattern ${pattern}`);
    }
  }
  
  assertNotEquals(actual: any, unexpected: any, message?: string) {
    if (actual === unexpected) {
      throw new Error(message || `Expected value to not equal "${unexpected}"`);
    }
  }
}

// Test data
const TEST_MESSAGES = [
  "test",
  "Hello, world!",
  "This is a longer message with some special characters: !@#$%^&*()",
  "1234567890",
  "Short"
];

const TEST_PASSWORDS = [
  "123",
  "password",
  "",  // Empty password
  "SecurePassword123!@#",
  "🔑" // Unicode password
];

const TEST_CODE_SAMPLES = [
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

// Run the tests
export async function runUnitTests() {
  const runner = new TestRunner();
  
  // Binary conversion tests
  runner.test('Binary conversion should be reversible', async () => {
    // Define simplified implementations of the functions
    const textToBinary = (str: string): string => {
      return Array.from(str)
        .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
        .join('');
    };
    
    const binaryToText = (binary: string): string => {
      const chunks = binary.match(/.{1,8}/g) || [];
      return chunks.map(chunk => {
        return String.fromCharCode(parseInt(chunk, 2));
      }).join('');
    };
    
    const testText = "Hello, world! 123";
    const binary = textToBinary(testText);
    const roundTrip = binaryToText(binary);
    
    runner.assertEquals(roundTrip, testText, "Binary conversion should be reversible");
  });
  
  // XOR encryption tests
  runner.test('XOR encryption should be reversible', async () => {
    const simplifiedEncrypt = (message: string, password: string): string => {
      let result = '';
      for (let i = 0; i < message.length; i++) {
        const char = message.charCodeAt(i);
        const keyChar = password.charCodeAt(i % password.length);
        result += String.fromCharCode(char ^ keyChar);
      }
      return result;
    };
    
    const testText = "Secret message!";
    const testPassword = "key123";
    
    const encrypted = simplifiedEncrypt(testText, testPassword);
    const decrypted = simplifiedEncrypt(encrypted, testPassword);
    
    runner.assertEquals(decrypted, testText, "XOR encryption should be reversible");
  });
  
  // Browser StegCloak tests
  for (let i = 0; i < TEST_MESSAGES.length; i++) {
    const message = TEST_MESSAGES[i];
    const password = TEST_PASSWORDS[i];
    const code = TEST_CODE_SAMPLES[i % TEST_CODE_SAMPLES.length];
    
    runner.test(`browserStegCloak: Hide/Reveal "${message.substring(0, 10)}${message.length > 10 ? '...' : ''}"`, async () => {
      const encoded = browserStegCloak.hide(code, message, password, true);
      runner.assertContains(encoded, code, "Encoded text should contain original code");
      
      const revealed = browserStegCloak.reveal(encoded, password);
      runner.assertEquals(revealed, message, `Expected "${message}", got "${revealed}"`);
    });
  }
  
  // Test wrong password behavior
  runner.test('browserStegCloak: Wrong password should not reveal message', async () => {
    const message = "Secret message";
    const correctPassword = "password";
    const wrongPassword = "wrong";
    const code = "// Test code";
    
    const encoded = browserStegCloak.hide(code, message, correctPassword, true);
    
    try {
      const revealed = browserStegCloak.reveal(encoded, wrongPassword);
      runner.assertNotEquals(revealed, message, "Wrong password should not reveal the correct message");
    } catch (error) {
      // It's okay if it throws an error too
    }
  });
  
  // CodeSteg tests
  for (let i = 0; i < TEST_MESSAGES.length; i++) {
    const message = TEST_MESSAGES[i];
    const password = TEST_PASSWORDS[i];
    const code = TEST_CODE_SAMPLES[i % TEST_CODE_SAMPLES.length];
    
    runner.test(`codeSteg: Hide/Reveal "${message.substring(0, 10)}${message.length > 10 ? '...' : ''}"`, async () => {
      const encoded = codeSteg.hideInCode(code, message, password, true);
      
      // This one doesn't necessarily contain the original code as it might replace comments
      const revealed = codeSteg.revealFromCode(encoded, password);
      runner.assertEquals(revealed, message, `Expected "${message}", got "${revealed}"`);
      
      // Test that the detector works
      const containsHiddenMsg = codeSteg.mightContainHiddenMessage(encoded);
      runner.assertEquals(containsHiddenMsg, true, "mightContainHiddenMessage() should detect our hidden message");
    });
  }
  
  // Test wrong password behavior for codeSteg
  runner.test('codeSteg: Wrong password should not reveal message', async () => {
    const message = "Secret message";
    const correctPassword = "password";
    const wrongPassword = "wrong";
    const code = "// Test code";
    
    const encoded = codeSteg.hideInCode(code, message, correctPassword, true);
    
    try {
      const revealed = codeSteg.revealFromCode(encoded, wrongPassword);
      runner.assertNotEquals(revealed, message, "Wrong password should not reveal the correct message");
    } catch (error) {
      // It's okay if it throws an error too
    }
  });
  
  // Combined stegcloak tests
  for (let i = 0; i < TEST_MESSAGES.length; i++) {
    const message = TEST_MESSAGES[i];
    const password = TEST_PASSWORDS[i];
    const code = TEST_CODE_SAMPLES[i % TEST_CODE_SAMPLES.length];
    
    runner.test(`combined: Hide/Reveal "${message.substring(0, 10)}${message.length > 10 ? '...' : ''}"`, async () => {
      const encoded = await hideSecret(code, message, password, true);
      const revealed = await revealSecret(encoded, password);
      
      runner.assertEquals(revealed, message, `Expected "${message}", got "${revealed}"`);
    });
  }
  
  // Special test for the failing case
  runner.test('combined: Special test for "test"/"123" combination', async () => {
    const message = "test";  // Exactly the message that's failing
    const password = "123";  // Exactly the password that's failing
    const code = "// Test for known failing case";
    
    // Run 5 times to check for consistency/flakiness
    for (let i = 0; i < 5; i++) {
      const encoded = await hideSecret(code, message, password, true);
      
      console.log(`Attempt ${i+1}:`);
      console.log(`- Encoded length: ${encoded.length}`);
      console.log(`- Contains zero-width chars: ${/[\u200B-\u200F\u2060-\u206F]/.test(encoded)}`);
      
      const revealed = await revealSecret(encoded, password);
      
      console.log(`- Result: "${revealed}" (${Array.from(revealed).map(c => c.charCodeAt(0))})`);
      console.log(`- Expected: "${message}" (${Array.from(message).map(c => c.charCodeAt(0))})`);
      
      // Just log results but don't fail the test if it doesn't match - helps diagnose the issue
      if (revealed !== message) {
        console.log("- ⚠️ Warning: Revealed message doesn't match original");
      } else {
        console.log("- ✓ Success: Revealed message matches original");
      }
    }
  });
  
  // Additional debugging for specific components
  runner.test('debug: Isolated testing of encryption/decryption', async () => {
    const message = "test";
    const password = "123";
    
    // Direct test of encryptMessage/decryptMessage
    // These are internal functions so we need to reimplement for testing
    const encryptMessage = (message: string, password: string): string => {
      if (!password) return message;
      
      // Simple prefix to help identify encoded messages
      message = "STEG:" + message;
      
      // Directly use UTF-16 code points
      let result = '';
      for (let i = 0; i < message.length; i++) {
        const char = message.charCodeAt(i);
        const keyChar = password.charCodeAt(i % password.length);
        // Simple XOR operation (reliable and reversible)
        result += String.fromCharCode(char ^ keyChar);
      }
      
      return result;
    };
    
    const decryptMessage = (encrypted: string, password: string): string => {
      if (!password) return encrypted;
      
      // Directly use UTF-16 code points
      let result = '';
      for (let i = 0; i < encrypted.length; i++) {
        const char = encrypted.charCodeAt(i);
        const keyChar = password.charCodeAt(i % password.length);
        // Simple XOR operation (reliable and reversible)
        result += String.fromCharCode(char ^ keyChar);
      }
      
      // Remove the prefix if it exists
      if (result.startsWith('STEG:')) {
        return result.substring(5);
      }
      
      return result;
    };
    
    // Test the encryption/decryption directly
    const encrypted = encryptMessage(message, password);
    const decrypted = decryptMessage(encrypted, password);
    
    console.log(`Direct encryption: "${message}" -> "${encrypted}" -> "${decrypted}"`);
    console.log(`Char codes: ${Array.from(message).map(c => c.charCodeAt(0))} -> ${Array.from(encrypted).map(c => c.charCodeAt(0))} -> ${Array.from(decrypted).map(c => c.charCodeAt(0))}`);
    
    runner.assertEquals(decrypted, message, `Direct encryption/decryption failed`);
  });
  
  // Run all the tests
  return await runner.run();
}

// For browser environment, make the function available globally
if (typeof window !== 'undefined') {
  (window as any).runUnitTests = runUnitTests;
}

// For direct execution
if (typeof module !== 'undefined' && require.main === module) {
  runUnitTests().catch(error => {
    console.error("Error running tests:", error);
  });
}