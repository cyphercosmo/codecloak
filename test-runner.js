/**
 * Simple test runner script
 */

const { exec } = require('child_process');

console.log('Building TypeScript for testing...');
exec('npx tsc --project tsconfig.json', (error, stdout, stderr) => {
  if (error) {
    console.error('Error building TypeScript:', error);
    console.error(stderr);
    process.exit(1);
  }
  
  console.log('Running unit tests...');
  // Import and run the tests
  require('./dist/unit-tests').runUnitTests()
    .then(results => {
      console.log(`Tests completed: ${results.passCount} passed, ${results.failCount} failed`);
      process.exit(results.failCount > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('Error running tests:', error);
      process.exit(1);
    });
});