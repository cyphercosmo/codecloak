/**
 * This module implements a steganography technique that hides secrets in code comments
 * No special characters are used, making it more compatible across different environments
 * 
 * This approach is used as the primary method for hiding secrets in code.
 * Unlike zero-width character approaches, this works well across various
 * code editors, IDEs, and platforms without losing the hidden data.
 */

/**
 * Encrypt a message with a simple XOR cipher
 * @param message The message to encrypt
 * @param password The password for encryption
 * @returns Encrypted message (Base64 encoded)
 */
function encryptMessage(message: string, password: string): string {
  if (!password) return Buffer.from(message).toString('base64');
  
  let encrypted = '';
  for (let i = 0; i < message.length; i++) {
    const messageChar = message.charCodeAt(i);
    const passwordChar = password.charCodeAt(i % password.length);
    // XOR operation
    encrypted += String.fromCharCode(messageChar ^ passwordChar);
  }
  
  // Convert to base64 for safe storage in comments
  return Buffer.from(encrypted).toString('base64');
}

/**
 * Decrypt a message with a simple XOR cipher
 * @param encrypted The encrypted message (Base64 encoded)
 * @param password The password for decryption
 * @returns Decrypted message
 */
function decryptMessage(encrypted: string, password: string): string {
  if (!password) return Buffer.from(encrypted, 'base64').toString();
  
  // Decode from base64
  const decodedEncrypted = Buffer.from(encrypted, 'base64').toString();
  
  let decrypted = '';
  for (let i = 0; i < decodedEncrypted.length; i++) {
    const encryptedChar = decodedEncrypted.charCodeAt(i);
    const passwordChar = password.charCodeAt(i % password.length);
    // XOR operation (the reverse of encryption)
    decrypted += String.fromCharCode(encryptedChar ^ passwordChar);
  }
  
  return decrypted;
}

/**
 * Hide a secret message within code by adding it as a comment
 * @param sourceCode The source code to hide the message in
 * @param secret The secret message to hide
 * @param password Optional password for encryption
 * @param encrypt Whether to encrypt the message
 * @returns The source code with the hidden message
 */
export function hide(
  sourceCode: string,
  secret: string,
  password: string = '',
  encrypt: boolean = true,
  randomPlacement: boolean = false
): string {
  if (!secret) {
    return sourceCode;
  }
  
  // Simple direct implementation to ensure it works
  try {
    // Get the payload - either encrypted or plain base64
    let payload;
    
    if (encrypt && password) {
      // Use our encrypt function for password protection
      try {
        payload = encryptMessage(secret, password);
        console.log("Encrypted payload created:", payload);
      } catch (encryptError) {
        console.error("Encryption failed:", encryptError);
        // Fallback to simple base64
        payload = btoa(unescape(encodeURIComponent(secret)));
        console.log("Fallback to simple base64 after encryption failure");
      }
    } else {
      // No encryption, just use base64
      try {
        payload = btoa(unescape(encodeURIComponent(secret)));
        console.log("Base64 encoding (btoa) successful");
      } catch (e) {
        console.error("Base64 encoding with btoa failed:", e);
        // Last resort - use a simple identifier
        payload = "ENCODING_FAILED_" + Date.now();
        console.log("Using timestamp as fallback");
      }
    }
    
    // Create our unique pattern with the secret
    const commentFormat = `// TODO: Rework this hot mess - see commit ${payload} for context.`;
    console.log("Generated comment:", commentFormat);
    
    // Add to the beginning of the file for consistency
    return commentFormat + '\n\n' + sourceCode;
  } catch (error) {
    console.error("Error in hide function:", error);
    // Return a basic fallback comment if all else fails
    return `// TODO: Rework this hot mess - see commit FAILED_ENCODING for context.\n\n` + sourceCode;
  }
}

/**
 * Reveal a hidden message from code
 * @param code Code that may contain a hidden message
 * @param password Password for decryption (if applicable)
 * @returns The revealed secret message
 */
export function reveal(
  code: string,
  password: string = ''
): string {
  if (!code) {
    return '';
  }
  
  // Simplified approach with direct pattern matching
  try {
    console.log("Attempting to reveal secret in code");
    
    // Look for our specific pattern
    const todoPattern = /\/\/\s*TODO:\s*Rework\s*this\s*hot\s*mess\s*-\s*see\s*commit\s*([A-Za-z0-9+/=]+)\s*for\s*context\./;
    const match = code.match(todoPattern);
    
    if (match && match[1]) {
      const payload = match[1];
      console.log("Found TODO pattern match with payload:", payload);
      
      // Check if this is the error case
      if (payload.startsWith('FAILED_ENCODING') || payload.startsWith('ENCODING_FAILED')) {
        throw new Error('This code contains a corrupted secret message.');
      }
      
      // Try to decode the payload
      if (password) {
        try {
          // Try with password first
          const result = decryptMessage(payload, password);
          console.log("Successfully decrypted message");
          return result;
        } catch (e) {
          console.error("Decryption failed, trying direct base64", e);
          try {
            // Fallback to direct base64 decode
            return decodeURIComponent(escape(atob(payload)));
          } catch (e2) {
            console.error("Fallback decode failed", e2);
            throw new Error('Could not decrypt the message with the provided password.');
          }
        }
      } else {
        // No password - just try base64 decode
        try {
          console.log("No password, attempting direct base64 decode");
          return decodeURIComponent(escape(atob(payload)));
        } catch (e) {
          console.error("Base64 decode failed", e);
          try {
            // Try another method just in case
            return Buffer.from(payload, 'base64').toString('utf-8');
          } catch (e2) {
            console.error("Buffer decode failed too", e2);
            throw new Error('Failed to decode the message. The message might be encrypted and require a password.');
          }
        }
      }
    }
    
    // If we didn't find our pattern, try the legacy formats as fallback
    console.log("No TODO format found, trying legacy patterns");
    
    // Simple single-line comment with base64
    const legacyMatch = code.match(/\/\/\s*([A-Za-z0-9+/=]+)/);
    if (legacyMatch && legacyMatch[1]) {
      const legacyPayload = legacyMatch[1];
      console.log("Found legacy pattern match");
      
      try {
        if (password) {
          return decryptMessage(legacyPayload, password);
        } else {
          return Buffer.from(legacyPayload, 'base64').toString('utf-8');
        }
      } catch (e) {
        console.error("Legacy decode failed", e);
        throw new Error('Could not decode the legacy format message.');
      }
    }
    
    // If we get here, we couldn't find any valid patterns
    throw new Error('No hidden message found in the code.');
  } catch (error) {
    console.error("Error in reveal function:", error);
    // Safe error handling
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to reveal secret: unknown error');
    }
  }
}