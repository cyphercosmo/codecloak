# CodeCloak: Secure Steganography in Code

CodeCloak is a web-based steganography platform that enables users to conceal secret messages within code snippets using advanced encoding and encryption techniques.

## Core Technologies

- **TypeScript**: The entire codebase is written in TypeScript, providing type safety and better developer experience.
- **React**: The frontend is built with React, utilizing hooks and functional components.
- **XOR Encryption**: Implements a simple but effective XOR-based encryption algorithm for securing hidden messages.
- **Base64 Encoding**: Uses Base64 to ensure safe storage of messages in code comments.
- **Comment-Based Steganography**: Hides messages within code comments, providing compatibility across different platforms and editors.

## Project Structure

- **client/src/**
  - **components/**: UI components for the application
  - **lib/**: Core libraries for steganography implementation
    - **commentSteg.ts**: Primary steganography implementation using code comments
    - **stegcloak.ts**: Interface for hiding and revealing secrets
    - **browserStegCloak.ts**: Alternative implementation using zero-width characters (currently not used)
  - **pages/**: Application pages
  - **hooks/**: Custom React hooks
  
- **server/**: Minimal Express.js backend that serves the frontend

## Steganography Methods

1. **Comment-Based Steganography** (Primary Method)
   - Hides Base64-encoded secrets within code comments
   - Works with both single-line (`//`) and multi-line (`/* */`) comments
   - Supports random or fixed placement within the code
   - Highly compatible across different platforms and code editors

2. **Zero-Width Character Steganography** (Alternative Method)
   - Uses invisible Unicode characters (ZWSP, ZWNJ, ZWJ) to hide messages
   - Not currently used in the application
   - Provided as a reference for potential future implementation

## How to Use

1. Enter or paste your code in the editor
2. Type your secret message
3. Enter a password if you want encryption (recommended)
4. Click "Hide Secret in Code" button
5. Copy the resulting code to share it
6. To reveal a secret, paste encoded code, enter the password, and click "Reveal Secret"

## Technical Notes

- The Buffer API is used for Base64 encoding/decoding
- The app uses Base64 encoding to ensure the hidden messages are compatible with code comments
- XOR encryption is used when a password is provided
- The application is entirely client-side, with no server storage of user data

## Development

- Run the application with `npm run dev`
- The frontend and backend are served on the same port (5000)