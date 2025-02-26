#!/usr/bin/env node

/**
 * Command-line test runner for steganography unit tests
 * 
 * This script provides a way to run tests from the command line
 * without needing to use the browser interface.
 */

const path = require('path');
const fs = require('fs');

console.log('Running steganography unit tests...\n');

// First check if the dist directory exists
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  console.log('Building TypeScript files first...');
  
  const { execSync } = require('child_process');
  try {
    execSync('npx tsc --project tsconfig.json', { stdio: 'inherit' });
    console.log('Build completed successfully.\n');
  } catch (error) {
    console.error('Error building TypeScript files:', error.message);
    process.exit(1);
  }
}

// Now run the tests
try {
  // Find the unit test file
  const testFile = path.join(distDir, 'unit-tests.js');
  if (!fs.existsSync(testFile)) {
    console.error(`Could not find test file: ${testFile}`);
    console.error('Make sure you have built the TypeScript files correctly.');
    process.exit(1);
  }
  
  // Run the unit tests
  const unitTests = require(testFile);
  unitTests.runUnitTests()
    .then(results => {
      console.log(`\nTests completed: ${results.passCount} passed, ${results.failCount} failed`);
      process.exit(results.failCount > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('Error running tests:', error);
      process.exit(1);
    });
} catch (error) {
  console.error('Unexpected error:', error);
  process.exit(1);
}