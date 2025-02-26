// The StegCloak library works by hiding secrets in invisible unicode characters
// These zero-width characters can be embedded in plain text without being visible

// Import the buffer polyfill
import './bufferPolyfill';

// Import the actual StegCloak library dynamically (defer loading until needed)
import type StegCloak from 'stegcloak';

/**
 * Dynamically import the StegCloak library
 * This helps avoid issues with server-side rendering
 */
async function getStegCloak(): Promise<typeof StegCloak> {
  try {
    // Dynamic import of the StegCloak library
    const StegCloakModule = await import('stegcloak');
    return StegCloakModule.default;
  } catch (error) {
    console.error("Error loading StegCloak:", error);
    throw new Error("Failed to load the steganography library. Please refresh the page and try again.");
  }
}

/**
 * Hides a secret message in the given text using StegCloak
 * @param sourceCode Source code to hide the secret in
 * @param secret Secret message to hide
 * @param password Password for encryption (optional)
 * @param encrypt Whether to encrypt the secret
 * @param integrity Whether to add HMAC integrity checking
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
    console.log(`Hiding "${secret}" with password "${password}", encryption: ${encrypt}, integrity: ${integrity}`);
    
    // First check if we should use the fallback implementation
    if (typeof window === 'undefined' || typeof (window as any).Buffer === 'undefined') {
      console.warn("Using StegCloakWrapper fallback - Buffer not available");
      // Dynamic import of the wrapper
      const { default: StegCloakWrapper } = await import('./StegCloakWrapper');
      const stegcloak = new StegCloakWrapper(encrypt, integrity);
      return stegcloak.hide(secret, password, sourceCode);
    }
    
    // Use the actual StegCloak library if Buffer is available
    const StegCloakClass = await getStegCloak();
    const stegcloak = new StegCloakClass(encrypt, integrity);
    
    // Hide the secret message in the code
    // StegCloak uses zero-width characters which are invisible to the human eye
    return stegcloak.hide(secret, password, sourceCode);
  } catch (error) {
    console.error("Error hiding secret:", error);
    
    // Fallback to our custom implementation if the StegCloak library fails
    try {
      console.warn("Falling back to StegCloakWrapper");
      const { default: StegCloakWrapper } = await import('./StegCloakWrapper');
      const stegcloak = new StegCloakWrapper(encrypt, integrity);
      return stegcloak.hide(secret, password, sourceCode);
    } catch (fallbackError) {
      console.error("Fallback also failed:", fallbackError);
      throw new Error("Failed to hide secret in code. Please try again or check your inputs.");
    }
  }
}

/**
 * Reveals a secret message hidden in the given text using StegCloak
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
    
    // First check if we should use the fallback implementation
    if (typeof window === 'undefined' || typeof (window as any).Buffer === 'undefined') {
      console.warn("Using StegCloakWrapper fallback - Buffer not available");
      // Dynamic import of the wrapper
      const { default: StegCloakWrapper } = await import('./StegCloakWrapper');
      const stegcloak = new StegCloakWrapper();
      return stegcloak.reveal(encodedText, password);
    }
    
    // Use the actual StegCloak library if Buffer is available
    const StegCloakClass = await getStegCloak();
    const stegcloak = new StegCloakClass();
    
    // Reveal the hidden secret
    return stegcloak.reveal(encodedText, password);
  } catch (error) {
    console.error("Error revealing secret:", error);
    
    // Fallback to our custom implementation if the StegCloak library fails
    try {
      console.warn("Falling back to StegCloakWrapper");
      const { default: StegCloakWrapper } = await import('./StegCloakWrapper');
      const stegcloak = new StegCloakWrapper();
      return stegcloak.reveal(encodedText, password);
    } catch (fallbackError) {
      console.error("Fallback also failed:", fallbackError);
      throw new Error("Failed to reveal secret. Check if the password is correct and that the text contains a hidden message.");
    }
  }
}
