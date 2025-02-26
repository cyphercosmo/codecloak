// The StegCloak library works by hiding secrets in invisible unicode characters
// These zero-width characters can be embedded in plain text without being visible

// Define what we expect from the StegCloak class
type StegCloakType = {
  new (encrypt?: boolean, integrity?: boolean): {
    hide: (secret: string, password: string, cover: string) => string;
    reveal: (data: string, password: string) => string;
  };
};

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
    // Dynamically import StegCloak
    const StegCloakModule = await import('stegcloak');
    const StegCloak = StegCloakModule.default as StegCloakType;
    
    // Initialize the StegCloak library with encryption and integrity options
    const stegcloak = new StegCloak(encrypt, integrity);
    
    // Hide the secret message in the code
    // StegCloak uses zero-width characters which are invisible to the human eye
    console.log(`Hiding "${secret}" with password "${password}", encryption: ${encrypt}, integrity: ${integrity}`);
    return stegcloak.hide(secret, password, sourceCode);
  } catch (error) {
    console.error("Error hiding secret:", error);
    throw new Error("Failed to hide secret in code");
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
    // Dynamically import StegCloak
    const StegCloakModule = await import('stegcloak');
    const StegCloak = StegCloakModule.default as StegCloakType;
    
    // Initialize the StegCloak library (encryption settings are detected automatically)
    const stegcloak = new StegCloak();
    
    // Reveal the hidden secret
    console.log(`Revealing secret with password "${password}"`);
    return stegcloak.reveal(encodedText, password);
  } catch (error) {
    console.error("Error revealing secret:", error);
    throw new Error("Failed to reveal secret. Check if the password is correct.");
  }
}
