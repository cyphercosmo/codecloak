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
    
    // Use our comment-based implementation
    // Pass integrity flag as the last argument to control comment placement
    const result = commentSteg.hide(
      sourceCode, 
      secret, 
      password, 
      encrypt, 
      integrity // Using integrity flag to control random placement
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
    
    // Use our comment-based implementation
    const result = commentSteg.reveal(encodedText, password);
    return result;
  } catch (error) {
    console.error("Error revealing secret:", error);
    throw new Error("Failed to reveal secret. Check if the password is correct and that the text contains a hidden message.");
  }
}
