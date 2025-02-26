// This is a custom implementation using zero-width unicode characters for steganography
// These characters are completely invisible in most text renderers

// Zero-width characters we can use for encoding
const ZWC = {
  ZERO_WIDTH_SPACE: '\u200B',           // &#8203;
  ZERO_WIDTH_NON_JOINER: '\u200C',      // &#8204;
  ZERO_WIDTH_JOINER: '\u200D',          // &#8205;
  LEFT_TO_RIGHT_MARK: '\u200E',         // &#8206;
  RIGHT_TO_LEFT_MARK: '\u200F',         // &#8207;
  WORD_JOINER: '\u2060',                // &#8288;
};

// Simple XOR encryption
function simpleEncrypt(text: string, password: string): string {
  let result = '';
  
  // Create a repeating password that matches the length of the text
  const repeatedPassword = password.repeat(Math.ceil(text.length / password.length)).slice(0, text.length);
  
  // XOR each character
  for (let i = 0; i < text.length; i++) {
    const textCharCode = text.charCodeAt(i);
    const passwordCharCode = repeatedPassword.charCodeAt(i);
    const encryptedCharCode = textCharCode ^ passwordCharCode;
    result += String.fromCharCode(encryptedCharCode);
  }
  
  return result;
}

// Simple XOR decryption (same operation as encryption)
function simpleDecrypt(encryptedText: string, password: string): string {
  return simpleEncrypt(encryptedText, password); // XOR is symmetric
}

// Convert string to binary
function textToBinary(text: string): string {
  let binary = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    // Convert to 16-bit binary (for better unicode support)
    const bin = charCode.toString(2).padStart(16, '0');
    binary += bin;
  }
  return binary;
}

// Convert binary to string
function binaryToText(binary: string): string {
  let text = '';
  // Process 16 bits at a time
  for (let i = 0; i < binary.length; i += 16) {
    const bin = binary.slice(i, i + 16);
    if (bin.length === 16) {
      const charCode = parseInt(bin, 2);
      text += String.fromCharCode(charCode);
    }
  }
  return text;
}

// Encode binary data using zero-width characters
function encodeBinary(binary: string): string {
  let result = '';
  for (let i = 0; i < binary.length; i++) {
    if (binary[i] === '0') {
      result += ZWC.ZERO_WIDTH_SPACE;
    } else {
      result += ZWC.ZERO_WIDTH_NON_JOINER;
    }
  }
  // Add markers at the beginning and end
  return ZWC.ZERO_WIDTH_JOINER + result + ZWC.ZERO_WIDTH_JOINER;
}

// Decode binary data from zero-width characters
function decodeBinary(text: string): string {
  let binary = '';
  // Look for marker characters
  const startIndex = text.indexOf(ZWC.ZERO_WIDTH_JOINER);
  const endIndex = text.lastIndexOf(ZWC.ZERO_WIDTH_JOINER);
  
  if (startIndex === -1 || endIndex === -1 || startIndex === endIndex) {
    throw new Error('No hidden data found in this text');
  }
  
  // Extract the hidden data
  const hiddenData = text.substring(startIndex + 1, endIndex);
  
  // Decode the binary
  for (let i = 0; i < hiddenData.length; i++) {
    if (hiddenData[i] === ZWC.ZERO_WIDTH_SPACE) {
      binary += '0';
    } else if (hiddenData[i] === ZWC.ZERO_WIDTH_NON_JOINER) {
      binary += '1';
    }
  }
  
  return binary;
}

/**
 * Hides a secret message in the given text using invisible unicode characters
 * @param sourceCode Source code to hide the secret in
 * @param secret Secret message to hide
 * @param password Password for encryption (optional)
 * @param encrypt Whether to encrypt the secret
 * @param integrity Whether to add HMAC integrity checking (not implemented yet)
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
    // Apply encryption if enabled
    let processedSecret = secret;
    if (encrypt && password) {
      processedSecret = simpleEncrypt(secret, password);
    }
    
    // Convert to binary
    const binarySecret = textToBinary(processedSecret);
    
    // Encode using zero-width characters
    const encodedSecret = encodeBinary(binarySecret);
    
    // Insert the encoded secret at the end of the source code
    console.log(`Hiding "${secret}" with password "${password}", encryption: ${encrypt}, integrity: ${integrity}`);
    return sourceCode + encodedSecret;
  } catch (error) {
    console.error("Error hiding secret:", error);
    throw new Error("Failed to hide secret in code");
  }
}

/**
 * Reveals a secret message hidden in the given text
 * @param encodedText Text with hidden secret
 * @param password Password for decryption (if encryption was used)
 * @returns Revealed secret message
 */
export async function revealSecret(
  encodedText: string,
  password: string
): Promise<string> {
  try {
    // Extract the binary data from the encoded text
    const binarySecret = decodeBinary(encodedText);
    
    // Convert binary back to text
    let processedSecret = binaryToText(binarySecret);
    
    // Apply decryption if password is provided
    if (password) {
      processedSecret = simpleDecrypt(processedSecret, password);
    }
    
    // Return the revealed secret
    console.log(`Revealing secret with password "${password}"`);
    return processedSecret;
  } catch (error) {
    console.error("Error revealing secret:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to reveal secret. Check if the password is correct.");
  }
}
