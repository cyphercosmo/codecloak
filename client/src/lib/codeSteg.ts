/**
 * Code Steganography Module
 * 
 * This module implements a technique to hide messages within code by encoding the message
 * into what appears to be legitimate variable names, comments, or string literals.
 */

// Characters we can use in identifiers
const VALID_ID_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$';
// Special marker at the beginning of our encoded data
const STEG_MARKER = '/* @codecloak */';

/**
 * Encode binary data using a base64-like scheme, but using characters
 * that are valid in identifiers
 */
function encodeToIdentifierSafe(binary: string): string {
  // Split binary into chunks of 6 bits (64 possible values like base64)
  const chunks = binary.match(/.{1,6}/g) || [];
  
  return chunks.map(chunk => {
    // Convert 6 bits to a number (0-63)
    const value = parseInt(chunk.padEnd(6, '0'), 2);
    // Map to a character in our valid set
    return VALID_ID_CHARS[value];
  }).join('');
}

/**
 * Decode identifier-safe encoding back to binary
 */
function decodeFromIdentifierSafe(encoded: string): string {
  let binary = '';
  
  for (let i = 0; i < encoded.length; i++) {
    const char = encoded[i];
    const value = VALID_ID_CHARS.indexOf(char);
    if (value === -1) continue; // Skip invalid characters
    
    // Convert value back to 6 bits of binary
    binary += value.toString(2).padStart(6, '0');
  }
  
  return binary;
}

/**
 * Convert text to binary
 */
function textToBinary(text: string): string {
  return Array.from(text)
    .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join('');
}

/**
 * Convert binary to text
 */
function binaryToText(binary: string): string {
  const chunks = binary.match(/.{1,8}/g) || [];
  return chunks.map(chunk => {
    return String.fromCharCode(parseInt(chunk, 2));
  }).join('');
}

/**
 * Encrypt a message with a simple XOR cipher
 */
function encryptMessage(message: string, password: string): string {
  if (!password) return message;
  
  let encrypted = '';
  const passwordBinary = textToBinary(password);
  const messageBinary = textToBinary(message);
  
  for (let i = 0; i < messageBinary.length; i++) {
    const messageChar = messageBinary[i];
    const passwordChar = passwordBinary[i % passwordBinary.length];
    // XOR operation
    encrypted += messageChar === passwordChar ? '0' : '1';
  }
  
  return binaryToText(encrypted);
}

/**
 * Decrypt a message with a simple XOR cipher
 */
function decryptMessage(encrypted: string, password: string): string {
  if (!password) return encrypted;
  
  let decrypted = '';
  const passwordBinary = textToBinary(password);
  const encryptedBinary = textToBinary(encrypted);
  
  for (let i = 0; i < encryptedBinary.length; i++) {
    const encryptedChar = encryptedBinary[i];
    const passwordChar = passwordBinary[i % passwordBinary.length];
    // XOR operation
    decrypted += encryptedChar === passwordChar ? '0' : '1';
  }
  
  return binaryToText(decrypted);
}

/**
 * Create a fake comment that contains the encoded message
 */
function createHiddenComment(encodedMessage: string): string {
  // Create a comment with a message that looks legitimate
  return `${STEG_MARKER}\n * Generated code - DO NOT MODIFY\n * Version: ${encodedMessage}\n */`;
}

/**
 * Find the best place to insert a fake comment in the code
 */
function findCommentInsertionPoint(code: string): number {
  const lines = code.split('\n');
  
  // Look for existing comments at the top of the file
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    if (lines[i].trim().startsWith('/*') || lines[i].trim().startsWith('//')) {
      // Insert after this comment
      const insertLine = i + 1;
      return lines.slice(0, insertLine).join('\n').length + 1;
    }
  }
  
  // If no comments found, insert at the top
  return 0;
}

/**
 * Extract the encoded message from a hidden comment
 */
function extractEncodedMessage(code: string): string | null {
  const markerIndex = code.indexOf(STEG_MARKER);
  if (markerIndex === -1) return null;
  
  // Find the comment end
  const commentEnd = code.indexOf('*/', markerIndex);
  if (commentEnd === -1) return null;
  
  // Extract the version line with our encoded message
  const commentSection = code.substring(markerIndex, commentEnd);
  const versionMatch = commentSection.match(/\* Version: ([a-zA-Z0-9_$]+)/);
  
  if (versionMatch && versionMatch[1]) {
    return versionMatch[1];
  }
  
  return null;
}

/**
 * Hide a secret message within source code
 */
export function hideInCode(
  sourceCode: string, 
  secret: string, 
  password: string = '',
  encrypt: boolean = true
): string {
  // Process the secret message
  let processedSecret = secret;
  if (encrypt && password) {
    processedSecret = encryptMessage(processedSecret, password);
  }
  
  // Convert to binary and then to our identifier-safe encoding
  const binarySecret = textToBinary(processedSecret);
  const encodedSecret = encodeToIdentifierSafe(binarySecret);
  
  // Create a comment with our encoded message
  const hiddenComment = createHiddenComment(encodedSecret);
  
  // Find the best place to insert our comment
  const insertionPoint = findCommentInsertionPoint(sourceCode);
  
  // Insert the comment
  return sourceCode.slice(0, insertionPoint) + 
         (insertionPoint > 0 ? '\n\n' : '') + 
         hiddenComment + 
         (insertionPoint > 0 ? '\n' : '\n\n') + 
         sourceCode.slice(insertionPoint);
}

/**
 * Reveal a hidden message from source code
 */
export function revealFromCode(
  encodedCode: string,
  password: string = ''
): string {
  // Extract the encoded message
  const encodedMessage = extractEncodedMessage(encodedCode);
  if (!encodedMessage) {
    throw new Error('No hidden message found in this code.');
  }
  
  // Decode from identifier-safe format to binary
  const binaryMessage = decodeFromIdentifierSafe(encodedMessage);
  
  // Convert binary back to text
  let message = binaryToText(binaryMessage);
  
  // Decrypt if password provided
  if (password) {
    message = decryptMessage(message, password);
  }
  
  return message;
}

/**
 * Check if code might contain a hidden message
 */
export function mightContainHiddenMessage(code: string): boolean {
  return code.includes(STEG_MARKER);
}