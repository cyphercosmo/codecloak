/**
 * This is a simplified browser-compatible implementation of StegCloak
 * that uses zero-width unicode characters to hide messages in text.
 */

// Zero-width characters for steganography
const ZWSP = '\u200B'; // Zero-width space
const ZWNJ = '\u200C'; // Zero-width non-joiner
const ZWJ = '\u200D';  // Zero-width joiner

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
 * Extract zero-width characters from text
 * @param text Text that may contain zero-width characters
 * @returns String containing only zero-width characters
 */
function extractZeroWidth(text: string): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === ZWSP || char === ZWNJ || char === ZWJ) {
      result += char;
    }
  }
  return result;
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
  
  // Convert the message to binary and then to zero-width chars
  const messageBinary = textToBinary(message);
  const zeroWidthMessage = binaryToZeroWidth(messageBinary);
  
  // Insert zero-width characters at the beginning
  return zeroWidthMessage + cover;
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
    return '';
  }
  
  // Extract only the zero-width characters
  const zeroWidthChars = extractZeroWidth(text);
  
  if (!zeroWidthChars) {
    throw new Error('No hidden message found in the text.');
  }
  
  // Convert zero-width characters to binary and then to text
  const binary = zeroWidthToBinary(zeroWidthChars);
  let message = binaryToText(binary);
  
  // Decrypt if password provided
  if (password) {
    message = decryptMessage(message, password);
  }
  
  return message;
}