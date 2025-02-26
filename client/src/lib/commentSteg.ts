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
  
  // Encrypt the message if requested
  const payload = encrypt && password ? encryptMessage(secret, password) : Buffer.from(secret).toString('base64');
  
  // Split the source code into lines
  const lines = sourceCode.split('\n');
  
  if (lines.length === 0) {
    return `// ${payload}\n`;
  }
  
  // Determine if we should use a random position (based on randomPlacement parameter)
  // or a fixed position (start of the file)
  const position = randomPlacement ? Math.floor(Math.random() * lines.length) : 0;
  
  // Determine comment style based on position and source code context
  // If at the start of the file, prefer a multi-line comment
  // If elsewhere in the code, randomly choose between styles
  const useSingleLine = position === 0 ? false : (Math.random() > 0.5);
  
  const commentedSecret = useSingleLine 
    ? `// ${payload}` 
    : `/* ${payload} */`;
  
  // Insert the comment at the chosen position
  lines.splice(position, 0, commentedSecret);
  
  return lines.join('\n');
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
  
  // Regular expression to match both single-line and multi-line comments
  const commentRegex = /\/\/\s*([A-Za-z0-9+/=]+)(?:\n|$)|\/\*\s*([A-Za-z0-9+/=]+)\s*\*\//g;
  
  // Extract all comments that might contain base64-encoded content
  // Use a more compatible approach to get all matches
  const matches = [];
  let match;
  while ((match = commentRegex.exec(code)) !== null) {
    matches.push(match);
  }
  
  if (matches.length === 0) {
    throw new Error('No hidden message found in the code.');
  }
  
  // Try each comment to see if it contains our secret
  for (const match of matches) {
    try {
      const payload = match[1] || match[2]; // group 1 is single-line, group 2 is multi-line
      
      if (!payload || !/^[A-Za-z0-9+/=]+$/.test(payload)) {
        continue; // Skip if not valid base64
      }
      
      let decoded;
      try {
        // First try to decrypt using the password in case the message was encrypted
        decoded = decryptMessage(payload, password);
      } catch (error) {
        // If decryption fails, the message may not be encrypted
        // Try to decode as Base64 directly
        try {
          decoded = Buffer.from(payload, 'base64').toString('utf-8');
        } catch (decodeError) {
          // If both methods fail, this comment doesn't contain a valid message
          continue;
        }
      }
      
      // If we got here, we successfully decoded/decrypted something
      return decoded;
    } catch (error) {
      // If decryption fails, try the next comment
      continue;
    }
  }
  
  throw new Error('No valid hidden message found in the code, or incorrect password.');
}