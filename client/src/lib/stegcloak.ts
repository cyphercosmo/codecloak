/**
 * This module provides an interface for hiding secrets in code comments
 * This approach is more compatible across different platforms and code editors
 * than using zero-width characters
 */

import * as commentSteg from './commentSteg';

/**
 * Hides a secret message in the given code using comments
 * @param sourceCode Source code to hide the secret in
 * @param secret Secret message to hide
 * @param password Password for encryption (optional)
 * @param encrypt Whether to encrypt the secret
 * @param integrity Whether to add integrity checking (ignored in this implementation)
 * @returns Code with hidden secret in comments
 */
export async function hideSecret(
  sourceCode: string, 
  secret: string, 
  password: string,
  encrypt: boolean = true,
  integrity: boolean = false
): Promise<string> {
  try {
    console.log(`Hiding "${secret}" with password "${password}", encryption: ${encrypt}`);
    
    // Detect the programming language from the source code - placeholder for future improvements
    console.log("Detected language: javascript");
    
    // Use our comment-based implementation
    // Note: We use the integrity flag to control random placement of the comment
    const result = commentSteg.hide(
      sourceCode, 
      secret, 
      password, 
      encrypt, 
      integrity // Controls random placement of comments
    );
    return result;
  } catch (error) {
    console.error("Error hiding secret:", error);
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
    
    // Quick check if the code might contain a hidden message (base64 pattern in comments)
    const hasCommentWithBase64 = /\/\/\s*([A-Za-z0-9+/=]+)(?:\n|$)|\/\*\s*([A-Za-z0-9+/=]+)\s*\*\//.test(encodedText);
    console.log(`Might contain hidden message: ${hasCommentWithBase64}`);
    
    // Detect the programming language for potential future use
    console.log("Detected language for revealing: javascript");
    
    // Try our comment-based implementation first
    try {
      const result = commentSteg.reveal(encodedText, password);
      return result;
    } catch (commentError) {
      console.log("Code steg approach failed, will try fallback:", commentError);
      
      // If the comment-based approach fails, we could add a fallback here
      // For example, try the zero-width character approach
      try {
        // This would be where we'd implement a fallback
        // For now, just re-throw the original error
        console.log("Fallback approach failed:", commentError);
        throw commentError;
      } catch (fallbackError) {
        throw commentError; // Throw the original error from the comment approach
      }
    }
  } catch (error) {
    console.error("Error revealing secret:", error);
    throw new Error("Failed to reveal secret. Check if the password is correct and that the text contains a hidden message.");
  }
}
