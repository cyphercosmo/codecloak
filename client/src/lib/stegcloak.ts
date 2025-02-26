// The StegCloak library works by hiding secrets in invisible unicode characters
// These zero-width characters can be embedded in plain text without being visible
import './bufferPolyfill'; // Import our Buffer polyfill for browser compatibility

// Create a placeholder with fallback for StegCloak
let StegCloakInstance: any = null;

// This function ensures StegCloak is loaded only once
async function getStegCloak() {
  if (StegCloakInstance) return StegCloakInstance;
  
  try {
    // Dynamic import with error handling
    const module = await import('stegcloak');
    StegCloakInstance = module.default;
    return StegCloakInstance;
  } catch (error) {
    console.error("Error loading StegCloak:", error);
    throw new Error("Failed to load StegCloak library");
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
    // Get the StegCloak constructor
    const StegCloak = await getStegCloak();
    
    // Initialize the StegCloak library with encryption and integrity options
    const stegcloak = new StegCloak(encrypt, integrity);
    
    // Hide the secret message in the code
    // StegCloak uses zero-width characters which are invisible to the human eye
    console.log(`Hiding "${secret}" with password "${password}", encryption: ${encrypt}, integrity: ${integrity}`);
    
    // The method adds invisible Unicode characters
    return stegcloak.hide(secret, password, sourceCode);
  } catch (error) {
    console.error("Error hiding secret:", error);
    throw new Error("Failed to hide secret in code. StegCloak could not be initialized properly.");
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
    // Get the StegCloak constructor
    const StegCloak = await getStegCloak();
    
    // Initialize the StegCloak library (encryption settings are detected automatically)
    const stegcloak = new StegCloak();
    
    // Reveal the hidden secret
    console.log(`Revealing secret with password "${password}"`);
    return stegcloak.reveal(encodedText, password);
  } catch (error) {
    console.error("Error revealing secret:", error);
    throw new Error("Failed to reveal secret. Check if the password is correct and that the text contains a hidden message.");
  }
}
