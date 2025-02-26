// The StegCloak library works by hiding secrets in invisible unicode characters
// These zero-width characters can be embedded in plain text without being visible

// Import our browser-compatible StegCloak implementation
import * as browserStegCloak from './browserStegCloak';

/**
 * Hides a secret message in the given text using zero-width character steganography
 * @param sourceCode Source code to hide the secret in
 * @param secret Secret message to hide
 * @param password Password for encryption (optional)
 * @param encrypt Whether to encrypt the secret
 * @param integrity Whether to add integrity checking (ignored in browser implementation)
 * @returns Text with hidden secret
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
    
    // Use our browser-compatible implementation
    const result = browserStegCloak.hide(sourceCode, secret, password, encrypt);
    return result;
  } catch (error) {
    console.error("Error hiding secret:", error);
    throw new Error("Failed to hide secret in code. Please try again or check your inputs.");
  }
}

/**
 * Reveals a secret message hidden in the given text
 * @param encodedText Text with hidden secret
 * @param password Password for decryption (if encryption was used)
 * @returns Revealed secret message
 */
export async function revealSecret(
  encodedText: string,
  password: string
): Promise<string> {
  try {
    console.log(`Revealing secret with password "${password}"`);
    
    // Use our browser-compatible implementation
    const result = browserStegCloak.reveal(encodedText, password);
    return result;
  } catch (error) {
    console.error("Error revealing secret:", error);
    throw new Error("Failed to reveal secret. Check if the password is correct and that the text contains a hidden message.");
  }
}
