// The CodeSteg library works by hiding secrets in code that appears legitimate
// Instead of using zero-width characters, we disguise the message as normal code elements

// Import both implementations
import * as browserStegCloak from './browserStegCloak';
import * as codeSteg from './codeSteg';

// Flag to determine which implementation to use
const USE_CODE_STEG = true; // Set to true to use the code-based approach, false for zero-width chars

/**
 * Hides a secret message in the given text using code-based steganography
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
    
    if (USE_CODE_STEG) {
      // Use our code-based steganography implementation
      return codeSteg.hideInCode(sourceCode, secret, password, encrypt);
    } else {
      // Use the zero-width character implementation
      return browserStegCloak.hide(sourceCode, secret, password, encrypt);
    }
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
    
    if (!encodedText || encodedText.trim() === '') {
      throw new Error('No text provided to reveal a secret from.');
    }
    
    // First determine if code-based steganography was likely used
    const mightHaveHiddenMessage = USE_CODE_STEG && codeSteg.mightContainHiddenMessage(encodedText);
    console.log(`Might contain hidden message: ${mightHaveHiddenMessage}`);
    
    let codeStegError = null;
    let result = null;
    
    if (USE_CODE_STEG) {
      // Try code-based approach first
      try {
        console.log("Attempting code-based steganography approach...");
        result = codeSteg.revealFromCode(encodedText, password);
        if (result && result.trim() !== '') {
          console.log("Successfully revealed secret using code-based approach");
          return result;
        }
      } catch (error) {
        codeStegError = error;
        console.log("Code steg approach failed, will try fallback:", error instanceof Error ? error.message : error);
        // Continue to fallback if this fails
      }
    }
    
    // Fallback to zero-width character approach
    try {
      console.log("Attempting zero-width character approach...");
      result = browserStegCloak.reveal(encodedText, password);
      if (result && result.trim() !== '') {
        console.log("Successfully revealed secret using zero-width approach");
        return result;
      }
    } catch (fallbackError) {
      console.log("Fallback approach failed:", fallbackError instanceof Error ? fallbackError.message : fallbackError);
      
      // If both approaches failed, provide more detailed error
      if (codeStegError) {
        throw new Error(`Failed to reveal secret: Code-based approach error: ${codeStegError instanceof Error ? codeStegError.message : 'Unknown error'}, Zero-width approach error: ${fallbackError instanceof Error ? fallbackError.message : 'Unknown error'}`);
      } else {
        throw new Error(`No hidden message found or the password is incorrect: ${fallbackError instanceof Error ? fallbackError.message : ''}`);
      }
    }
    
    // If we get here with no results, no message was found
    throw new Error("No hidden message found in the provided code.");
  } catch (error) {
    console.error("Error revealing secret:", error instanceof Error ? error.message : error);
    throw error instanceof Error ? error : new Error("Failed to reveal secret. Check if the password is correct and that the text contains a hidden message.");
  }
}
