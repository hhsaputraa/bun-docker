import { TaskController } from '../controllers/taskController';
import { extractPathParams, matchRoute } from '../utils/routeUtils';
import { logError } from '../utils/logger';

interface RouteConfig {
  method: string;
  path: string;
  handler: (req: Request, params: Record<string, string>) => Promise<Response>;
  location: string;
}

const routes: RouteConfig[] = [
  {
    method: 'GET',
    path: '/api/tasks',
    handler: (req, _params) => TaskController.getAllTasks(req),
    location: 'TaskController.getAllTasks',
  },
  {
    method: 'POST',
    path: '/api/tasks',
    handler: (req, _params) => TaskController.createTask(req),
    location: 'TaskController.createTask',
  },
  {
    method: 'GET',
    path: '/api/tasks/:id',
    handler: (req, params) => TaskController.getTaskById(req, params.id),
    location: 'TaskController.getTaskById',
  },
  {
    method: 'PUT',
    path: '/api/tasks/:id',
    handler: (req, params) => TaskController.updateTask(req, params.id),
    location: 'TaskController.updateTask',
  },
  {
    method: 'DELETE',
    path: '/api/tasks/:id',
    handler: (req, params) => TaskController.deleteTask(req, params.id),
    location: 'TaskController.deleteTask',
  },
];

export async function handleTaskRoutes(req: Request, url: URL): Promise<Response | null> {
  const path = url.pathname;
  const method = req.method;

  for (const route of routes) {
    if (method === route.method && matchRoute(path, route.path)) {
      const params = extractPathParams(path, route.path) ?? {};
      try {
        return await route.handler(req, params);
      } catch (error) {
        logError(error as Error, req, {
          location: route.location,
          route: `${method} ${route.path}`,
          ...(params.id && { taskId: params.id }),
        });
        throw error;
      }
    }
  }

  return null;
}

