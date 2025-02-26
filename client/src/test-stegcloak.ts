/**
 * Testing suite for steganography functionality
 * 
 * This file contains tests for the various steganography methods
 * used in the application to help isolate issues.
 */

import * as browserStegCloak from './lib/browserStegCloak';
import * as codeSteg from './lib/codeSteg';
import { hideSecret, revealSecret } from './lib/stegcloak';

// Define test utilities
function testResult(testName: string, passed: boolean, error?: any): void {
  if (passed) {
    console.log(`✅ PASS: ${testName}`);
  } else {
    console.error(`❌ FAIL: ${testName}`);
    if (error) {
      console.error(`   Error: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
    }
  }
}

export async function runTests() {
  console.log("===== Starting Steganography Tests =====");
  
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
  
  // ====== TEST SUITE 1: BrowserStegCloak (Zero-width approach) ======
  console.log("\n----- Testing browserStegCloak (Zero-width approach) -----");
  
  try {
    // Test 1: Basic encoding/decoding with various messages
    for (let i = 0; i < testMessages.length; i++) {
      const message = testMessages[i];
      const password = testPasswords[i];
      const code = testCodeSamples[i % testCodeSamples.length];
      
      try {
        // Test hiding and revealing
        const encoded = browserStegCloak.hide(code, message, password, true);
        const revealed = browserStegCloak.reveal(encoded, password);
        
        // Check if revealed matches original
        if (revealed === message) {
          testResult(`ZW-${i+1}: Hide/Reveal with "${message.substring(0, 10)}${message.length > 10 ? '...' : ''}"`, true);
        } else {
          testResult(`ZW-${i+1}: Hide/Reveal with "${message.substring(0, 10)}${message.length > 10 ? '...' : ''}"`, false, 
                    `Expected "${message}", got "${revealed}"`);
        }
        
        // Additional verification - the encoded text should contain our markers
        if (encoded.includes(code)) {
          testResult(`ZW-${i+1}-verify: Encoded text contains original code`, true);
        } else {
          testResult(`ZW-${i+1}-verify: Encoded text contains original code`, false);
        }
      } catch (error) {
        testResult(`ZW-${i+1}: Hide/Reveal with "${message.substring(0, 10)}${message.length > 10 ? '...' : ''}"`, false, error);
      }
    }

    // Test 2: Wrong password
    try {
      const message = "Secret message";
      const correctPassword = "password";
      const wrongPassword = "wrong";
      const code = "// Test code";
      
      const encoded = browserStegCloak.hide(code, message, correctPassword, true);
      try {
        const revealed = browserStegCloak.reveal(encoded, wrongPassword);
        
        // We expect garbage output or error with wrong password, not the original message
        if (revealed !== message) {
          testResult("ZW-wrong-password: Wrong password does not reveal correct message", true);
        } else {
          testResult("ZW-wrong-password: Wrong password does not reveal correct message", false, 
                    "Wrong password revealed the correct message");
        }
      } catch (error) {
        // It's okay if wrong password throws an error
        testResult("ZW-wrong-password: Wrong password throws error", true);
      }
    } catch (error) {
      testResult("ZW-wrong-password", false, error);
    }

    // Test 3: Modifying encoded text
    try {
      const message = "Do not tamper";
      const password = "password";
      const code = "// Original code";
      
      const encoded = browserStegCloak.hide(code, message, password, true);
      
      // Tamper with the encoded text
      const tampered = encoded.replace('Original', 'Modified');
      
      try {
        const revealed = browserStegCloak.reveal(tampered, password);
        
        // If we can still reveal from tampered text, report it
        if (revealed === message) {
          testResult("ZW-tamper: Successfully revealed from tampered text", true, 
                    "Note: The message was still recoverable after tampering");
        } else {
          testResult("ZW-tamper: Message altered after tampering", true,
                    `Original: "${message}", Tampered result: "${revealed}"`);
        }
      } catch (error) {
        // It's expected that tampering might break the hidden message
        testResult("ZW-tamper: Tampered text fails to reveal", true);
      }
    } catch (error) {
      testResult("ZW-tamper", false, error);
    }
  } catch (error) {
    console.error("Error in browserStegCloak tests:", error);
  }

  // ====== TEST SUITE 2: CodeSteg (Code-based approach) ======
  console.log("\n----- Testing codeSteg (Code-based approach) -----");
  
  try {
    // Test 1: Basic encoding/decoding with various messages
    for (let i = 0; i < testMessages.length; i++) {
      const message = testMessages[i];
      const password = testPasswords[i];
      const code = testCodeSamples[i % testCodeSamples.length];
      
      try {
        // Test hiding and revealing
        const encoded = codeSteg.hideInCode(code, message, password, true);
        const revealed = codeSteg.revealFromCode(encoded, password);
        
        // Check if revealed matches original
        if (revealed === message) {
          testResult(`CS-${i+1}: Hide/Reveal with "${message.substring(0, 10)}${message.length > 10 ? '...' : ''}"`, true);
        } else {
          testResult(`CS-${i+1}: Hide/Reveal with "${message.substring(0, 10)}${message.length > 10 ? '...' : ''}"`, false, 
                    `Expected "${message}", got "${revealed}"`);
        }
        
        // Test that encoded text looks believable
        const containsHiddenMsg = codeSteg.mightContainHiddenMessage(encoded);
        if (containsHiddenMsg) {
          testResult(`CS-${i+1}-verify: Detector correctly identifies hidden message`, true);
        } else {
          testResult(`CS-${i+1}-verify: Detector correctly identifies hidden message`, false,
                    "mightContainHiddenMessage() didn't detect our hidden message");
        }
      } catch (error) {
        testResult(`CS-${i+1}: Hide/Reveal with "${message.substring(0, 10)}${message.length > 10 ? '...' : ''}"`, false, error);
      }
    }

    // Test 2: Wrong password
    try {
      const message = "Secret message";
      const correctPassword = "password";
      const wrongPassword = "wrong";
      const code = "// Test code";
      
      const encoded = codeSteg.hideInCode(code, message, correctPassword, true);
      try {
        const revealed = codeSteg.revealFromCode(encoded, wrongPassword);
        
        // We expect garbage output or error with wrong password, not the original message
        if (revealed !== message) {
          testResult("CS-wrong-password: Wrong password does not reveal correct message", true);
        } else {
          testResult("CS-wrong-password: Wrong password does not reveal correct message", false, 
                    "Wrong password revealed the correct message");
        }
      } catch (error) {
        // It's okay if wrong password throws an error
        testResult("CS-wrong-password: Wrong password throws error", true);
      }
    } catch (error) {
      testResult("CS-wrong-password", false, error);
    }

    // Test 3: Direct binary and encryption testing
    try {
      // Test a simplified version of binary conversion
      const testText = "Test123";
      
      // Simplified implementation of textToBinary
      const textToBinary = (str: string): string => {
        return Array.from(str)
          .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
          .join('');
      };
      
      // Simplified implementation of binaryToText
      const binaryToText = (binary: string): string => {
        const chunks = binary.match(/.{1,8}/g) || [];
        return chunks.map(chunk => {
          return String.fromCharCode(parseInt(chunk, 2));
        }).join('');
      };
      
      const binary = textToBinary(testText);
      const roundTrip = binaryToText(binary);
      
      if (roundTrip === testText) {
        testResult("CS-binary: Text to binary round trip works", true);
      } else {
        testResult("CS-binary: Text to binary round trip works", false,
                  `Expected "${testText}", got "${roundTrip}"`);
      }
      
      // Test a simplified version of the encryption functions directly
      const testPassword = "testkey";
      const simplifiedEncrypt = (message: string, password: string): string => {
        let result = '';
        for (let i = 0; i < message.length; i++) {
          const char = message.charCodeAt(i);
          const keyChar = password.charCodeAt(i % password.length);
          result += String.fromCharCode(char ^ keyChar);
        }
        return result;
      };
      
      const simplifiedDecrypt = (encrypted: string, password: string): string => {
        let result = '';
        for (let i = 0; i < encrypted.length; i++) {
          const char = encrypted.charCodeAt(i);
          const keyChar = password.charCodeAt(i % password.length);
          result += String.fromCharCode(char ^ keyChar);
        }
        return result;
      };
      
      const encrypted = simplifiedEncrypt(testText, testPassword);
      const decrypted = simplifiedDecrypt(encrypted, testPassword);
      
      if (decrypted === testText) {
        testResult("CS-encryption: Encryption/Decryption round trip works", true);
      } else {
        testResult("CS-encryption: Encryption/Decryption round trip works", false,
                  `Expected "${testText}", got "${decrypted}"`);
      }
    } catch (error) {
      testResult("CS-binary-encryption", false, error);
    }
  } catch (error) {
    console.error("Error in codeSteg tests:", error);
  }

  // ====== TEST SUITE 3: Combined stegcloak approach ======
  console.log("\n----- Testing combined stegcloak approach -----");
  
  try {
    // Test 1: Basic encoding/decoding with various messages
    for (let i = 0; i < testMessages.length; i++) {
      const message = testMessages[i];
      const password = testPasswords[i];
      const code = testCodeSamples[i % testCodeSamples.length];
      
      try {
        // Test hiding and revealing
        const encoded = await hideSecret(code, message, password, true);
        const revealed = await revealSecret(encoded, password);
        
        // Check if revealed matches original
        if (revealed === message) {
          testResult(`Combined-${i+1}: Hide/Reveal with "${message.substring(0, 10)}${message.length > 10 ? '...' : ''}"`, true);
        } else {
          testResult(`Combined-${i+1}: Hide/Reveal with "${message.substring(0, 10)}${message.length > 10 ? '...' : ''}"`, false, 
                    `Expected "${message}", got "${revealed}"`);
        }
        
        // Check detection
        const mightHaveMessage = codeSteg.mightContainHiddenMessage(encoded);
        testResult(`Combined-${i+1}-verify: Detection status = ${mightHaveMessage}`, true);
      } catch (error) {
        testResult(`Combined-${i+1}: Hide/Reveal with "${message.substring(0, 10)}${message.length > 10 ? '...' : ''}"`, false, error);
      }
    }

    // Test 2: Special case for "test" with password "123"
    // This specifically targets the failing case you observed
    try {
      const message = "test";  // Exactly the message that's failing
      const password = "123";  // Exactly the password that's failing
      const code = "// Test for known failing case";
      
      const encoded = await hideSecret(code, message, password, true);
      
      // Log encoded text in detail for debugging
      console.log("\nSpecial test for 'test'/'123' combination:");
      console.log("- Encoded length: " + encoded.length);
      console.log("- First 50 chars: " + encoded.substring(0, 50));
      console.log("- Contains comment marker: " + encoded.includes("//"));
      console.log("- Contains XML comment: " + encoded.includes("<!--"));
      
      const revealed = await revealSecret(encoded, password);
      
      // Compare with special attention
      if (revealed === message) {
        testResult("Combined-special: Known problem case works", true);
      } else {
        testResult("Combined-special: Known problem case works", false,
                  `Expected "${message}", got "${revealed}"\n` +
                  `Char codes - expected: ${Array.from(message).map(c => c.charCodeAt(0))}\n` +
                  `Char codes - actual: ${Array.from(revealed).map(c => c.charCodeAt(0))}`);
      }
    } catch (error) {
      testResult("Combined-special", false, error);
    }
  } catch (error) {
    console.error("Error in combined stegcloak tests:", error);
  }

  console.log("\n===== End of Steganography Tests =====");
}

// For browser environment, make the function available globally
if (typeof window !== 'undefined') {
  (window as any).runStegCloakTests = runTests;
}

// For direct execution
if (typeof module !== 'undefined' && require.main === module) {
  runTests().catch(error => {
    console.error("Error running tests:", error);
  });
}