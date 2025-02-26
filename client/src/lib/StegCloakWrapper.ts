// StegCloak wrapper - a simplification that works in the browser

// This is a fallback implementation to handle StegCloak's functionality
// without relying on Node.js-specific APIs
class StegCloakWrapper {
  private encrypt: boolean;
  private integrity: boolean;
  
  // Zero-width characters used for steganography
  private static readonly ZWSP = '\u200B'; // zero width space
  private static readonly ZWNJ = '\u200C'; // zero width non-joiner
  private static readonly ZWJ = '\u200D';  // zero width joiner
  
  constructor(encrypt = false, integrity = false) {
    this.encrypt = encrypt;
    this.integrity = integrity;
  }
  
  // Simple encryption using XOR with password
  private encryptMessage(message: string, password: string): string {
    if (!password || !this.encrypt) return message;
    
    const result = [];
    for (let i = 0; i < message.length; i++) {
      const charCode = message.charCodeAt(i) ^ password.charCodeAt(i % password.length);
      result.push(String.fromCharCode(charCode));
    }
    return result.join('');
  }
  
  // Decrypt using the same XOR with password
  private decryptMessage(encrypted: string, password: string): string {
    if (!password) return encrypted;
    return this.encryptMessage(encrypted, password); // XOR is symmetric
  }
  
  // Convert string to binary representation
  private textToBinary(text: string): string {
    return text.split('').map(char => {
      const binary = char.charCodeAt(0).toString(2);
      // Ensure each character is represented by 16 bits
      return '0'.repeat(16 - binary.length) + binary;
    }).join('');
  }
  
  // Convert binary back to string
  private binaryToText(binary: string): string {
    const chunks = binary.match(/.{1,16}/g) || [];
    return chunks.map(chunk => String.fromCharCode(parseInt(chunk, 2))).join('');
  }
  
  // Hide a message in a cover text using zero-width characters
  hide(message: string, password: string, cover: string): string {
    // Optional encryption
    const processedMessage = this.encrypt ? this.encryptMessage(message, password) : message;
    
    // Convert to binary
    const binaryData = this.textToBinary(processedMessage);
    
    // Map binary to zero-width characters
    let hiddenData = '';
    for (let i = 0; i < binaryData.length; i++) {
      if (binaryData[i] === '0') {
        hiddenData += StegCloakWrapper.ZWSP;
      } else if (binaryData[i] === '1') {
        hiddenData += StegCloakWrapper.ZWNJ;
      }
    }
    
    // Add a marker for the end of the hidden message 
    // This will help during extraction
    hiddenData += StegCloakWrapper.ZWJ;
    
    // Insert the hidden data in the middle of the cover text
    // This is more secure and prevents easy detection
    if (cover.length === 0) {
      return hiddenData;
    }
    
    const middleIndex = Math.floor(cover.length / 2);
    return cover.substring(0, middleIndex) + hiddenData + cover.substring(middleIndex);
  }
  
  // Reveal a hidden message
  reveal(stegoText: string, password: string): string {
    // Extract the binary data from zero-width characters
    let binaryData = '';
    let foundHiddenData = false;
    let endFound = false;
    
    // Look for invisible characters throughout the text
    for (let i = 0; i < stegoText.length; i++) {
      const char = stegoText[i];
      
      if (char === StegCloakWrapper.ZWSP) {
        foundHiddenData = true;
        binaryData += '0';
      } else if (char === StegCloakWrapper.ZWNJ) {
        foundHiddenData = true;
        binaryData += '1';
      } else if (char === StegCloakWrapper.ZWJ) {
        // End marker found
        endFound = true;
        // We can stop now, as we've found the end marker
        break;
      }
    }
    
    if (!foundHiddenData || !endFound) {
      throw new Error("No hidden message found in the text");
    }
    
    // Convert binary back to text
    const extractedMessage = this.binaryToText(binaryData);
    
    // Decrypt if needed
    return this.encrypt ? this.decryptMessage(extractedMessage, password) : extractedMessage;
  }
}

export default StegCloakWrapper;