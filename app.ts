import { config } from 'dotenv';
import { handleRoutes } from './src/routes';
import { logRequest, logError } from './src/utils/logger';
import { response } from './src/utils/responseHelper';

// Load environment variables
config();

const PORT: number = +(process.env.PORT || 8081);
const NODE_ENV = process.env.NODE_ENV ?? "development";

// Create server
const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    // Add CORS headers to all responses
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };
    
    // Record start time for response time calculation
    const startTime = Date.now();
    
    try {
      // Handle routes
      const response = await handleRoutes(req);
      
      // Add CORS headers to the response
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      
      // Log successful request
      logRequest(req, response.status, startTime);
      
      return response;
    } catch (error) {
      // Log error with details
      logError(error as Error, req, { location: 'server.fetch' });
      
      // Return error response with CORS headers
      const failResponse = response.fail('Internal server error', 500);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        failResponse.headers.set(key, value);
      });

      // Log error response
      logRequest(req, 500, startTime);

      return failResponse;
    }
  },
});

console.log(`[${NODE_ENV}] Server running at http://localhost:${server.port}`);
console.log(`API endpoints available at http://localhost:${server.port}/api/tasks`);

