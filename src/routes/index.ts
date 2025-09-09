import { handleTaskRoutes } from './taskRoutes';
import { errorResponse } from '../utils/routeUtils';
import { logError } from '../utils/logger';
import { buildCorsHeaders } from '../utils/cors';

export async function handleRoutes(req: Request): Promise<Response> {
  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: buildCorsHeaders(),
      });
    }

    // Handle API routes
    const url = new URL(req.url);
    const path = url.pathname;

    // API routes
    if (path.startsWith('/api/')) {
      try {
        // Task routes
        const taskResponse = await handleTaskRoutes(req);
        if (taskResponse) return taskResponse;

        // Add other route handlers here as needed
        // const otherResponse = await handleOtherRoutes(req);
        // if (otherResponse) return otherResponse;

        // No matching API route found
        return errorResponse('Endpoint not found', 404);
      } catch (routeError) {
        // Log specific API route errors with path information
        logError(routeError as Error, req, { 
          location: 'api_route_handler', 
          path: path 
        });
        throw routeError; // Re-throw to be caught by the outer try-catch
      }
    }

    // No matching route found
    return errorResponse('Not found', 404);
  } catch (error) {
    // Log unhandled errors
    logError(error as Error, req, { location: 'handleRoutes' });
    return errorResponse('Internal server error', 500);
  }
}