// This is a custom implementation of text steganography using invisible Unicode characters
// We're using zero-width characters to hide information in text

// Zero-width characters that will be used for encoding
const ZERO_WIDTH_SPACE = '\u200B';       // Binary 0
const ZERO_WIDTH_NON_JOINER = '\u200C';  // Binary 1

/**
 * Simple encryption/decryption function using XOR with a key
 * @param text Text to encrypt/decrypt
 * @param key Encryption key
 * @returns Encrypted/decrypted text
 */
function xorCipher(text: string, key: string): string {
  if (!key) return text; // If no key, return the original text
  
  let result = '';
  for (let i = 0; i < text.length; i++) {
    // XOR the character code with the corresponding character in the key
    const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }
  return result;
}

/**
 * Converts a string to its binary representation
 * @param str String to convert
 * @returns Binary representation (e.g. "01001000")
 */
function stringToBinary(str: string): string {
  let binary = '';
  for (let i = 0; i < str.length; i++) {
    // Convert each character to its binary representation
    const charCode = str.charCodeAt(i);
    const bin = charCode.toString(2);
    // Ensure each binary number is 8 bits (pad with leading zeros if necessary)
    binary += '0'.repeat(8 - bin.length) + bin;
  }
  return binary;
}

/**
 * Converts a binary string back to a regular string
 * @param binary Binary string (e.g. "01001000")
 * @returns Regular string
 */
function binaryToString(binary: string): string {
  let result = '';
  // Process 8 bits at a time (each character is 8 bits)
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.substr(i, 8);
    // Convert binary to decimal (character code)
    const charCode = parseInt(byte, 2);
    // Convert character code to character
    result += String.fromCharCode(charCode);
  }
  return result;
}

/**
 * Encodes binary data using zero-width characters
 * @param binary Binary string to encode
 * @returns String of zero-width characters
 */
function binaryToZeroWidth(binary: string): string {
  let zeroWidth = '';
  for (let i = 0; i < binary.length; i++) {
    // Use different zero-width characters for 0 and 1
    zeroWidth += binary[i] === '0' ? ZERO_WIDTH_SPACE : ZERO_WIDTH_NON_JOINER;
  }
  return zeroWidth;
}

/**
 * Decodes zero-width characters back to binary
 * @param zeroWidth String of zero-width characters
 * @returns Binary string
 */
function zeroWidthToBinary(zeroWidth: string): string {
  let binary = '';
  for (let i = 0; i < zeroWidth.length; i++) {
    // Convert zero-width characters back to binary
    binary += zeroWidth[i] === ZERO_WIDTH_SPACE ? '0' : '1';
  }
  return binary;
}

/**
 * Hides a secret message in the given text using zero-width characters
 * @param sourceCode Source code to hide the secret in
 * @param secret Secret message to hide
 * @param password Password for encryption (optional)
 * @param encrypt Whether to encrypt the secret
 * @param integrity Whether to add HMAC integrity checking (not used in this implementation)
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
    // Optional encryption
    const processedSecret = encrypt && password ? xorCipher(secret, password) : secret;
    
    // Convert the secret to binary
    const binarySecret = stringToBinary(processedSecret);
    
    // Convert binary to zero-width characters
    const zeroWidthSecret = binaryToZeroWidth(binarySecret);
    
    // Log for debugging
    console.log(`Hiding "${secret}" with password "${password}", encryption: ${encrypt}, integrity: ${integrity}`);
    
    // Insert zero-width characters at the beginning of the source code
    // They'll be completely invisible
    return zeroWidthSecret + sourceCode;
  } catch (error) {
    console.error("Error hiding secret:", error);
    throw new Error("Failed to hide secret in code.");
  }
}

/**
 * Reveals a secret message hidden in the given text using zero-width characters
 * @param encodedText Text with hidden secret
 * @param password Password for decryption (if encryption was used)
 * @returns Revealed secret message
 */
export async function revealSecret(
  encodedText: string,
  password: string
): Promise<string> {
  try {
    // Extract zero-width characters from the beginning of the text
    let zeroWidthChars = '';
    let i = 0;
    
    // Scan through the encoded text looking for our zero-width characters
    while (i < encodedText.length) {
      if (encodedText[i] === ZERO_WIDTH_SPACE || encodedText[i] === ZERO_WIDTH_NON_JOINER) {
        zeroWidthChars += encodedText[i];
      } else {
        // If we've found a non-zero-width character, we've reached the end of our hidden message
        break;
      }
      i++;
    }
    
    // If no zero-width characters were found, throw an error
    if (!zeroWidthChars) {
      throw new Error("No hidden message found in the provided text.");
    }
    
    // Convert zero-width characters to binary
    const binary = zeroWidthToBinary(zeroWidthChars);
    
    // Convert binary to string
    const secretMessage = binaryToString(binary);
    
    // Decrypt if needed
    const revealedSecret = password ? xorCipher(secretMessage, password) : secretMessage;
    
    // Log for debugging
    console.log(`Revealing secret with password "${password}"`);
    
    return revealedSecret;
  } catch (error) {
    console.error("Error revealing secret:", error);
    throw new Error("Failed to reveal secret. Check if the password is correct and that the text contains a hidden message.");
  }
}
