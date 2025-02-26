// The CodeSteg library works by hiding secrets in code that appears legitimate
// Instead of using zero-width characters, we disguise the message as normal code elements

// Import both implementations
import * as browserStegCloak from './browserStegCloak';
import * as codeSteg from './codeSteg';

// Flag to determine which implementation to use
// We're using both approaches together for better compatibility
const USE_CODE_STEG = true; // For encoding we use both code-based and zero-width approaches

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
    
    // First apply code-based steganography
    let processedCode = sourceCode;
    
    if (USE_CODE_STEG) {
      try {
        // Use our code-based steganography implementation
        processedCode = codeSteg.hideInCode(sourceCode, secret, password, encrypt);
        console.log("Successfully applied code-based steganography");
      } catch (error) {
        console.error("Error with code-based hiding, will still try zero-width approach:", error);
        processedCode = sourceCode; // Fallback to original code
      }
    }
    
    // Then add zero-width characters as well for better compatibility
    try {
      // Add zero-width characters to the already processed code
      processedCode = browserStegCloak.hide(processedCode, secret, password, encrypt);
      console.log("Successfully applied zero-width steganography");
    } catch (error) {
      console.error("Error with zero-width hiding:", error);
      // If this fails but we already have code-based steganography, we can continue
      if (processedCode !== sourceCode) {
        console.log("Will use only code-based steganography");
        return processedCode;
      }
      throw error; // If both methods failed, propagate the error
    }
    
    return processedCode;
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
