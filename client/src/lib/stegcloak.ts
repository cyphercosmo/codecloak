/**
 * This module provides an interface for hiding secrets in code comments
 * This approach is more compatible across different platforms and code editors
 * than using zero-width characters
 */

import * as commentSteg from './commentSteg';
import { 
  SupportedLanguage, 
  detectLanguage, 
  hideWithLanguageComment, 
  extractPayloadFromComment 
} from './languageSteg';

/**
 * Hides a secret message in the given code using comments
 * @param sourceCode Source code to hide the secret in
 * @param secret Secret message to hide
 * @param password Password for encryption (optional)
 * @param encrypt Whether to encrypt the secret
 * @param integrity Whether to add integrity checking (controls random placement)
 * @param language Programming language to use (auto-detect if not specified)
 * @returns Code with hidden secret in comments
 */
export async function hideSecret(
  sourceCode: string, 
  secret: string, 
  password: string,
  encrypt: boolean = true,
  integrity: boolean = false,
  language: SupportedLanguage = 'auto'
): Promise<string> {
  try {
    console.log(`Hiding "${secret}" with password "${password}", encryption: ${encrypt}`);
    
    // Auto-detect the programming language or use specified language
    const detectedLanguage = language === 'auto' ? detectLanguage(sourceCode) : language;
    console.log(`Detected language: ${detectedLanguage}`);
    
    try {
      // First encrypt the secret using the core encryption method
      let encryptedPayload = '';
      
      if (encrypt && password) {
        try {
          // Use the encryption method from commentSteg
          // This extracts just the encryption logic without comment formatting
          const tempResult = commentSteg.hide(
            "temp-placeholder-code", 
            secret, 
            password, 
            true, 
            false
          );
          
          // Extract the payload from the temporary result
          const payloadMatch = tempResult.match(/see commit ([A-Za-z0-9+/=]+) for context/);
          if (payloadMatch && payloadMatch[1]) {
            encryptedPayload = payloadMatch[1];
          } else {
            throw new Error("Failed to extract encrypted payload");
          }
        } catch (encryptError) {
          console.error("Error during encryption:", encryptError);
          // Fallback to simple base64 encoding
          encryptedPayload = btoa(unescape(encodeURIComponent(secret)));
          console.log("Fallback to simple base64 encoding");
        }
      } else {
        // No encryption, just use base64
        encryptedPayload = btoa(unescape(encodeURIComponent(secret)));
      }
      
      // Now hide the encrypted payload using language-specific comment
      const result = hideWithLanguageComment(
        sourceCode,
        encryptedPayload,
        detectedLanguage,
        integrity // Controls random placement of comments
      );
      
      console.log("Hide function completed successfully");
      return result;
    } catch (innerError) {
      console.error("Error in steganography process:", innerError);
      console.error("Error details:", JSON.stringify(innerError, Object.getOwnPropertyNames(innerError)));
      
      // Fallback to original implementation if language-specific approach fails
      console.log("Falling back to default comment implementation");
      const result = commentSteg.hide(
        sourceCode, 
        secret, 
        password, 
        encrypt, 
        integrity
      );
      return result;
    }
  } catch (error) {
    console.error("Error hiding secret:", error);
    console.error("Full error object:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    throw new Error("Failed to hide secret in code. Please try again or check your inputs.");
  }
}

/**
 * Reveals a secret message hidden in code comments
 * @param encodedText Code with hidden secret
 * @param password Password for decryption (if encryption was used)
 * @returns Revealed secret message
 */
export async function revealSecret(
  encodedText: string,
  password: string
): Promise<string> {
  try {
    console.log(`Revealing secret with password "${password}"`);
    
    // Detect the programming language from the code
    const detectedLanguage = detectLanguage(encodedText);
    console.log(`Detected language for revealing: ${detectedLanguage}`);
    
    // First try to extract the payload using language-specific patterns
    const extractedPayload = extractPayloadFromComment(encodedText);
    
    if (extractedPayload) {
      console.log("Extracted payload using language-specific comment patterns");
      
      // Try to decrypt the payload
      try {
        if (password) {
          // Try our decrypt method from commentSteg 
          // Create a temporary commentSteg-formatted string to help with decryption
          const tempEncodedText = `// TODO: Rework this hot mess - see commit ${extractedPayload} for context.`;
          return commentSteg.reveal(tempEncodedText, password);
        } else {
          // No password, just base64 decode
          try {
            return decodeURIComponent(escape(atob(extractedPayload)));
          } catch (e) {
            console.error("Base64 decode failed, trying Buffer decode:", e);
            return Buffer.from(extractedPayload, 'base64').toString('utf-8');
          }
        }
      } catch (decryptError) {
        console.error("Language-specific decrypt failed:", decryptError);
      }
    }
    
    // If language-specific extraction failed, try the fallback method
    console.log("Language-specific extraction failed, trying fallback...");
    
    // Quick check if the code might contain a message in standard format
    const hasCommentWithBase64 = /\/\/\s*([A-Za-z0-9+/=]+)(?:\n|$)|\/\*\s*([A-Za-z0-9+/=]+)\s*\*\//.test(encodedText);
    console.log(`Might contain traditional comment with Base64: ${hasCommentWithBase64}`);
    
    // Try our standard comment-based implementation as fallback
    try {
      const result = commentSteg.reveal(encodedText, password);
      console.log("Successfully revealed with standard comment approach");
      return result;
    } catch (commentError) {
      console.log("Standard comment approach failed, trying zero-width character fallback:", commentError);
      
      // If both approaches fail, we could try a zero-width character approach
      // This would be implemented in a future version
      console.log("All approaches failed to reveal the secret");
      throw new Error("Failed to reveal secret. Make sure the code contains a hidden message and the password is correct.");
    }
  } catch (error) {
    console.error("Error revealing secret:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to reveal secret. Check if the password is correct and that the text contains a hidden message.");
    }
  }
}
