const { startServer, closeServer } = require('../server'); // Import server functions

const TEST_PORT = 8001; // Define the test port

// Start the test server and handle errors
async function startTestServer() {
  try {
    await startServer(TEST_PORT);
    console.log(`Test server running on PORT ${TEST_PORT}`);
  } catch (err) {
    console.error('Error starting test server:', err);
    process.exit(1); // Exit with failure status
  }
}

// Close the test server
async function stopTestServer() {
  try {
    await closeServer();
    console.log('Test server closed');
  } catch (err) {
    console.error('Error closing test server:', err);
    process.exit(1); // Exit with failure status
  }
}

// Handle process termination to ensure server is closed
process.on('SIGINT', async () => {
  await stopTestServer();
  process.exit(0); // Exit with success status
});

// Start the test server
startTestServer();
