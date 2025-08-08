
import express from 'express';
import http from 'http';
import cors from 'cors';
import { PeerServer } from 'peer';

// --- Configuration ---
const PORT = process.env.PORT || 9000;

// --- Initialize App ---
const app = express();
const server = http.createServer(app);

// --- Middleware ---
// Use CORS to allow connections from any origin
app.use(cors());
console.log('CORS enabled for all origins.');

// --- Routes ---
app.get('/', (req, res) => {
  console.log(`[${new Date().toISOString()}] Received HTTP GET request on /`);
  res.send('Signaling server is active and ready.');
});

// --- PeerJS Server Setup ---
// The PeerServer hooks directly into the HTTP server instance.
// It should NOT be used as middleware with `app.use()`.
const peerServer = PeerServer(server, {
  path: '/peerjs',
  allow_discovery: true,
  debug: true, // Enable debug mode for more verbose logging
});

console.log('PeerJS server configured and attached to Express.');

// --- Detailed Logging for PeerJS Events ---
peerServer.on('connection', (client) => {
  console.log(`[${new Date().toISOString()}] [PEER EVENT: Connection] Client connected with ID: ${client.getId()}`);
});

peerServer.on('disconnect', (client) => {
  console.log(`[${new Date().toISOString()}] [PEER EVENT: Disconnect] Client disconnected with ID: ${client.getId()}`);
});

peerServer.on('error', (error) => {
    console.error(`[${new Date().toISOString()}] [PEER EVENT: Error] An error occurred:`, error);
});

// --- Start Server ---
server.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] HTTP and PeerJS server running on port ${PORT}`);
  console.log(`Signaling server is accessible at ws(s)://<your-server-url>/peerjs`);
});
