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
  
  try {
    // Encrypt the message if requested
    let payload = '';
    if (encrypt && password) {
      payload = encryptMessage(secret, password);
    } else {
      // Simple base64 encoding without encryption
      try {
        payload = Buffer.from(secret).toString('base64');
        console.log("Base64 encoding successful:", payload);
      } catch (e) {
        console.error("Base64 encoding failed:", e);
        // Fallback to a simple encoding if Buffer fails
        payload = btoa(secret);
        console.log("Fallback btoa encoding used:", payload);
      }
    }
    
    // Split the source code into lines
    const lines = sourceCode.split('\n');
    
    if (lines.length === 0) {
      return `// TODO: Rework this hot mess - see commit ${payload} for context.\n`;
    }
    
    // Determine if we should use a random position (based on randomPlacement parameter)
    // or a fixed position (start of the file)
    const position = randomPlacement ? Math.floor(Math.random() * lines.length) : 0;
    
    // Format the comment to look like a typical TODO comment with the secret embedded as a commit hash
    // Using regular hyphen instead of em dash for compatibility
    const commentedSecret = `// TODO: Rework this hot mess - see commit ${payload} for context.`;
    
    // Insert the comment at the chosen position
    lines.splice(position, 0, commentedSecret);
    
    return lines.join('\n');
  } catch (error) {
    console.error("Error in hide function:", error);
    // Return a basic fallback comment if all else fails
    return sourceCode + '\n// TODO: Rework this hot mess - see commit FAILED_ENCODING for context.';
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
  
  try {
    console.log("Attempting to reveal secret in code");
    
    // Regular expression to match our specific TODO comment format
    const todoCommentRegex = /\/\/\s*TODO:\s*Rework\s*this\s*hot\s*mess\s*-\s*see\s*commit\s*([A-Za-z0-9+/=]+)\s*for\s*context\./g;
    
    // Extract all comments that match our format
    const matches = [];
    let match;
    while ((match = todoCommentRegex.exec(code)) !== null) {
      matches.push(match);
    }
    
    console.log(`Found ${matches.length} matches with TODO format`);
    
    // Fall back to the old method if we don't find our specific pattern
    if (matches.length === 0) {
      console.log("No TODO format matches found, trying legacy format");
      // Legacy format support - regular expression to match both single-line and multi-line comments
      const legacyCommentRegex = /\/\/\s*([A-Za-z0-9+/=]+)(?:\n|$)|\/\*\s*([A-Za-z0-9+/=]+)\s*\*\//g;
      
      while ((match = legacyCommentRegex.exec(code)) !== null) {
        matches.push(match);
      }
      
      console.log(`Found ${matches.length} matches with legacy format`);
      
      if (matches.length === 0) {
        throw new Error('No hidden message found in the code.');
      }
    }
    
    // Try each comment to see if it contains our secret
    for (const match of matches) {
      try {
        // Extract the payload - first check if it's our TODO format (group 1)
        // or legacy format (groups 1 or 2 from the old regex)
        const payload = match[1] || match[2];
        
        console.log("Attempting to decode payload:", payload);
        
        if (!payload || !/^[A-Za-z0-9+/=]+$/.test(payload)) {
          console.log("Payload is not valid base64, skipping");
          continue; // Skip if not valid base64
        }
        
        let decoded;
        try {
          if (password) {
            // First try to decrypt using the password in case the message was encrypted
            console.log("Attempting to decrypt with password");
            decoded = decryptMessage(payload, password);
          } else {
            // If no password, just try base64 decoding
            console.log("No password, attempting base64 decode");
            decoded = Buffer.from(payload, 'base64').toString('utf-8');
          }
        } catch (error) {
          console.error("First decoding attempt failed:", error);
          
          // If decryption fails, try alternative methods
          try {
            console.log("Trying fallback - direct base64 decode");
            decoded = Buffer.from(payload, 'base64').toString('utf-8');
          } catch (decodeError) {
            console.error("Buffer decode failed, trying browser atob");
            try {
              decoded = atob(payload);
            } catch (atobError) {
              console.error("All decoding methods failed for this payload");
              continue;
            }
          }
        }
        
        // If we got here, we successfully decoded/decrypted something
        console.log("Successfully decoded message:", decoded);
        return decoded;
      } catch (error) {
        console.error("Error processing match:", error);
        // If decryption fails, try the next comment
        continue;
      }
    }
    
    throw new Error('No valid hidden message found in the code, or incorrect password.');
  } catch (error) {
    console.error("Error in reveal function:", error);
    throw new Error(`Failed to reveal secret: ${error.message}`);
  }
}