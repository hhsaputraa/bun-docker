import { handleTaskRoutes } from './taskRoutes';
import { logError } from '../utils/logger';
import { response } from '../utils/responseHelper';

export async function handleRoutes(req: Request): Promise<Response> {
  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
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
        return response.notFound('Endpoint not found');
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
    return response.notFound('Not found');
  } catch (error) {
    // Log unhandled errors
    logError(error as Error, req, { location: 'handleRoutes' });
    return response.fail('Internal server error', 500);
  }
}
