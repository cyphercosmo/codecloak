/**
 * Command line test runner for steganography tests
 * 
 * Run with: npx tsx client/src/run-tests.ts
 */

import { runTests } from './test-stegcloak';

// Set up console color helpers
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};

// Override console.log and console.error to add colors
const originalLog = console.log;
const originalError = console.error;

console.log = (...args) => {
  const message = args.join(' ');
  if (message.includes('✅ PASS')) {
    originalLog(`${colors.green}${message}${colors.reset}`);
  } else if (message.includes('===== Starting')) {
    originalLog(`${colors.bright}${colors.cyan}${message}${colors.reset}`);
  } else if (message.includes('----- Testing')) {
    originalLog(`${colors.bright}${colors.yellow}${message}${colors.reset}`);
  } else {
    originalLog(...args);
  }
};

console.error = (...args) => {
  const message = args.join(' ');
  if (message.includes('❌ FAIL')) {
    originalError(`${colors.red}${colors.bright}${message}${colors.reset}`);
  } else {
    originalError(`${colors.red}${message}${colors.reset}`);
  }
};

// Run the tests
console.log("Starting tests...");
runTests()
  .then(() => {
    console.log(`${colors.cyan}${colors.bright}All tests completed.${colors.reset}`);
  })
  .catch((error) => {
    console.error("Test execution error:", error);
    process.exit(1);
  });