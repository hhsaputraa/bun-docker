import { TaskController } from '../controllers/taskController';
import { extractPathParams, matchRoute } from '../utils/routeUtils';
import { logError } from '../utils/logger';

export async function handleTaskRoutes(req: Request): Promise<Response | null> {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;

  try {
    // GET /api/tasks - Get all tasks
    if (path === '/api/tasks' && method === 'GET') {
      try {
        return await TaskController.getAllTasks(req);
      } catch (error) {
        logError(error as Error, req, { 
          location: 'TaskController.getAllTasks', 
          route: 'GET /api/tasks' 
        });
        throw error;
      }
    }

    // POST /api/tasks - Create a new task
    if (path === '/api/tasks' && method === 'POST') {
      try {
        return await TaskController.createTask(req);
      } catch (error) {
        logError(error as Error, req, { 
          location: 'TaskController.createTask', 
          route: 'POST /api/tasks' 
        });
        throw error;
      }
    }

    // GET /api/tasks/:id - Get task by ID
    if (matchRoute(path, '/api/tasks/:id') && method === 'GET') {
      const params = extractPathParams(path, '/api/tasks/:id');
      if (params && params.id) {
        try {
          return await TaskController.getTaskById(req, params.id);
        } catch (error) {
          logError(error as Error, req, { 
            location: 'TaskController.getTaskById', 
            route: `GET /api/tasks/${params.id}`,
            taskId: params.id
          });
          throw error;
        }
      }
    }

    // PUT /api/tasks/:id - Update task
    if (matchRoute(path, '/api/tasks/:id') && method === 'PUT') {
      const params = extractPathParams(path, '/api/tasks/:id');
      if (params && params.id) {
        try {
          return await TaskController.updateTask(req, params.id);
        } catch (error) {
          logError(error as Error, req, { 
            location: 'TaskController.updateTask', 
            route: `PUT /api/tasks/${params.id}`,
            taskId: params.id
          });
          throw error;
        }
      }
    }

    // DELETE /api/tasks/:id - Delete task
    if (matchRoute(path, '/api/tasks/:id') && method === 'DELETE') {
      const params = extractPathParams(path, '/api/tasks/:id');
      if (params && params.id) {
        try {
          return await TaskController.deleteTask(req, params.id);
        } catch (error) {
          logError(error as Error, req, { 
            location: 'TaskController.deleteTask', 
            route: `DELETE /api/tasks/${params.id}`,
            taskId: params.id
          });
          throw error;
        }
      }
    }

    // No matching route found
    return null;
  } catch (routeError) {
    logError(routeError as Error, req, { 
      location: 'handleTaskRoutes', 
      path, 
      method 
    });
    throw routeError;
  }
}