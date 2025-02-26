/**
 * This is a simplified browser-compatible implementation of StegCloak
 * that uses zero-width unicode characters to hide messages in text.
 */

// Zero-width characters for steganography
const ZWSP = '\u200B'; // Zero-width space
const ZWNJ = '\u200C'; // Zero-width non-joiner
const ZWJ = '\u200D';  // Zero-width joiner
const LRE = '\u202A';  // Left-to-right embedding
const PDF = '\u202C';  // Pop directional formatting
const MARKER_START = ZWJ + ZWSP + ZWJ + LRE; // Enhanced marker for start of hidden content
const MARKER_END = PDF + ZWJ + ZWNJ + ZWJ; // Enhanced marker for end of hidden content

/**
 * Simple function to convert a string to binary
 * @param str The string to convert
 * @returns Binary representation as a string of 0s and 1s
 */
function textToBinary(str: string): string {
  return str.split('').map(char => {
    return char.charCodeAt(0).toString(2).padStart(8, '0');
  }).join('');
}

/**
 * Simple function to convert binary back to a string
 * @param binary Binary representation as a string of 0s and 1s
 * @returns The decoded string
 */
function binaryToText(binary: string): string {
  const chunks = binary.match(/.{1,8}/g) || [];
  return chunks.map(chunk => {
    return String.fromCharCode(parseInt(chunk, 2));
  }).join('');
}

/**
 * Encode a binary string using zero-width characters
 * @param binary Binary string (0s and 1s)
 * @returns String of zero-width characters
 */
function binaryToZeroWidth(binary: string): string {
  return binary
    .replace(/0/g, ZWSP)
    .replace(/1/g, ZWNJ);
}

/**
 * Decode zero-width characters back to a binary string
 * @param zeroWidth String containing zero-width characters
 * @returns Binary string (0s and 1s)
 */
function zeroWidthToBinary(zeroWidth: string): string {
  let binary = '';
  for (let i = 0; i < zeroWidth.length; i++) {
    const char = zeroWidth[i];
    if (char === ZWSP) binary += '0';
    else if (char === ZWNJ) binary += '1';
  }
  return binary;
}

/**
 * Extract zero-width characters from text that are between our markers
 * @param text Text that may contain zero-width characters
 * @returns String containing only zero-width characters between markers
 */
function extractZeroWidth(text: string): string {
  if (!text || typeof text !== 'string') {
    console.log("Invalid text provided for extractZeroWidth", text);
    return '';
  }
  
  // Look for marker start and end
  const startIndex = text.indexOf(MARKER_START);
  if (startIndex === -1) {
    console.log("No marker start found, trying fallback method");
    // Try the old method if no markers found - backward compatibility
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === ZWSP || char === ZWNJ) {
        result += char;
      }
    }
    
    if (result.length > 0) {
      console.log(`Found ${result.length} zero-width characters without markers`);
    }
    return result;
  }
  
  const endIndex = text.indexOf(MARKER_END, startIndex + MARKER_START.length);
  if (endIndex === -1) {
    console.log("Found start marker but no end marker");
    throw new Error('Corrupted message: start marker found but no end marker');
  }
  
  // Extract only the content between markers
  const content = text.substring(startIndex + MARKER_START.length, endIndex);
  console.log(`Found ${content.length} zero-width characters between markers`);
  return content;
}

/**
 * Encrypt a message with a simple XOR cipher
 * @param message The message to encrypt
 * @param password The password for encryption
 * @returns Encrypted message
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
 * @param encrypted The encrypted message
 * @param password The password for decryption
 * @returns Decrypted message
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
 * Hide a secret message within visible text using zero-width characters
 * @param cover The visible text to hide the message in
 * @param secret The secret message to hide
 * @param password Optional password for encryption
 * @param encrypt Whether to encrypt the message
 * @returns The cover text with hidden message
 */
export function hide(
  cover: string,
  secret: string,
  password: string = '',
  encrypt: boolean = true
): string {
  if (!secret) {
    return cover;
  }
  
  let message = secret;
  
  // Encrypt the message if requested
  if (encrypt && password) {
    message = encryptMessage(message, password);
  }
  
  // Add a simple tag to help identify the real message
  if (!message.startsWith('STEG:')) {
    message = 'STEG:' + message;
  }
  
  // Convert the message to binary and then to zero-width chars
  const messageBinary = textToBinary(message);
  console.log(`Message binary length: ${messageBinary.length} bits`);
  const zeroWidthMessage = MARKER_START + binaryToZeroWidth(messageBinary) + MARKER_END;
  
  // Find a comment line to embed the secret into
  const lines = cover.split('\n');
  
  // First try to find a multi-line comment which is safer
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Look for /* style comments first - safer place to hide
    const commentIndex = line.indexOf('/*');
    const endCommentIndex = line.indexOf('*/');
    
    // Only use comments that start and end on the same line
    if (commentIndex !== -1 && endCommentIndex !== -1 && commentIndex < endCommentIndex) {
      // Insert the zero-width characters inside the comment
      const insertionPoint = commentIndex + 2;
      lines[i] = line.substring(0, insertionPoint) + 
                zeroWidthMessage + 
                line.substring(insertionPoint);
      return lines.join('\n');
    }
  }
  
  // Then try to find a single-line comment
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const commentIndex = line.indexOf('//');
    
    if (commentIndex !== -1) {
      // Insert the zero-width characters right after the //
      const insertionPoint = commentIndex + 2;
      lines[i] = line.substring(0, insertionPoint) + 
                zeroWidthMessage + 
                line.substring(insertionPoint);
      return lines.join('\n');
    }
  }
  
  // If no suitable comment found, add one at the top of the file
  if (lines.length > 0) {
    // Try to find a good place for a comment, preferably after any headers
    // like shebang lines or use strict
    let insertionLine = 0;
    
    // Skip shebang or 'use strict' if present
    if (lines[0].startsWith('#!') || lines[0].includes('use strict')) {
      insertionLine = 1;
    }
    
    // Add a new comment with our hidden message
    lines.splice(insertionLine, 0, '/* ' + zeroWidthMessage + ' */');
    return lines.join('\n');
  }
  
  // If all else fails, just add a comment at the end
  return cover + '\n/* ' + zeroWidthMessage + ' */';
}

/**
 * Reveal a hidden message in text
 * @param text Text that may contain a hidden message
 * @param password Password for decryption (if applicable)
 * @returns The revealed secret message
 */
export function reveal(
  text: string,
  password: string = ''
): string {
  if (!text) {
    throw new Error('Empty text provided for revealing.');
  }
  
  // Extract only the zero-width characters
  const zeroWidthChars = extractZeroWidth(text);
  
  if (!zeroWidthChars || zeroWidthChars.length === 0) {
    throw new Error('No zero-width characters found in the text.');
  }
  
  console.log(`Found ${zeroWidthChars.length} zero-width characters`);
  
  // Convert zero-width characters to binary and then to text
  const binary = zeroWidthToBinary(zeroWidthChars);
  if (binary.length === 0) {
    throw new Error('Failed to extract binary data from zero-width characters.');
  }
  
  console.log(`Extracted ${binary.length} bits of binary data`);
  
  try {
    // Try to convert the binary to readable text
    let message = binaryToText(binary);
    console.log(`Raw decoded message: ${message.slice(0, 20)}${message.length > 20 ? '...' : ''}`);
    
    // Decrypt if password provided
    if (password) {
      try {
        message = decryptMessage(message, password);
        console.log(`Decrypted message: ${message.slice(0, 20)}${message.length > 20 ? '...' : ''}`);
      } catch (decryptError) {
        console.error("Decryption error:", decryptError);
        throw new Error('Failed to decrypt message with provided password.');
      }
    }
    
    // Check for the 'STEG:' prefix and remove it
    if (message.startsWith('STEG:')) {
      message = message.substring(5);
      console.log("Found STEG prefix, extracting actual message");
    }
    
    // Validate that we actually got meaningful text
    if (message && message.length > 0) {
      // Looser validation to allow more characters
      if (/^[\x20-\x7E\u0080-\uFFFF]+$/.test(message)) {
        return message;
      } else {
        console.log("Message contains invalid characters, might be corrupted");
        // Try to extract only the valid part
        const validChars = message.match(/[\x20-\x7E\u0080-\uFFFF]+/g) || [];
        if (validChars.length > 0) {
          return validChars.join('');
        }
      }
    } 
    
    throw new Error('Message extracted is not valid text. Password may be incorrect.');
  } catch (error) {
    console.error("Error in reveal process:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to convert binary data to text.');
  }
}