import { TaskService } from '../services/taskService';
import { CreateTaskPayload, UpdateTaskPayload } from '../models/types';
import { logError } from '../utils/logger';

export const TaskController = {
  // Get all tasks
  async getAllTasks(req: Request): Promise<Response> {
    try {
      const tasks = await TaskService.getAllTasks();
      return new Response(JSON.stringify({ success: true, data: tasks }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      // Log service layer error
      logError(error as Error, req, { 
        location: 'TaskController.getAllTasks', 
        service_method: 'TaskService.getAllTasks' 
      });
      
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  },

  // Get task by ID
  async getTaskById(req: Request, id: string): Promise<Response> {
    try {
      const task = await TaskService.getTaskById(id);
      if (!task) {
        // Log not found case
        logError(new Error('Task not found'), req, { 
          location: 'TaskController.getTaskById', 
          service_method: 'TaskService.getTaskById',
          taskId: id,
          status_code: 404
        });
        
        return new Response(JSON.stringify({ success: false, error: 'Task not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return new Response(JSON.stringify({ success: true, data: task }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      // Log service layer error
      logError(error as Error, req, { 
        location: 'TaskController.getTaskById', 
        service_method: 'TaskService.getTaskById',
        taskId: id
      });
      
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  },

  // Create a new task
  async createTask(req: Request): Promise<Response> {
    try {
      const body = await req.json() as CreateTaskPayload;
      
      if (!body.title) {
        // Log validation error
        logError(new Error('Title is required'), req, { 
          location: 'TaskController.createTask', 
          validation_error: true,
          status_code: 400
        });
        
        return new Response(JSON.stringify({ success: false, error: 'Title is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const task = await TaskService.createTask(body);
      return new Response(JSON.stringify({ success: true, data: task }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      // Log service layer error
      logError(error as Error, req, { 
        location: 'TaskController.createTask', 
        service_method: 'TaskService.createTask',
        payload: JSON.stringify(body)
      });
      
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  },

  // Update an existing task
  async updateTask(req: Request, id: string): Promise<Response> {
    try {
      const body = await req.json() as UpdateTaskPayload;
      
      // Check if task exists
      const existingTask = await TaskService.getTaskById(id);
      if (!existingTask) {
        // Log not found case
        logError(new Error('Task not found for update'), req, { 
          location: 'TaskController.updateTask', 
          service_method: 'TaskService.getTaskById',
          taskId: id,
          status_code: 404
        });
        
        return new Response(JSON.stringify({ success: false, error: 'Task not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const task = await TaskService.updateTask(id, body);
      return new Response(JSON.stringify({ success: true, data: task }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      // Log service layer error
      logError(error as Error, req, { 
        location: 'TaskController.updateTask', 
        service_method: 'TaskService.updateTask',
        taskId: id,
        payload: JSON.stringify(body)
      });
      
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  },

  // Delete a task
  async deleteTask(req: Request, id: string): Promise<Response> {
    try {
      // Check if task exists
      const existingTask = await TaskService.getTaskById(id);
      if (!existingTask) {
        // Log not found case
        logError(new Error('Task not found for deletion'), req, { 
          location: 'TaskController.deleteTask', 
          service_method: 'TaskService.getTaskById',
          taskId: id,
          status_code: 404
        });
        
        return new Response(JSON.stringify({ success: false, error: 'Task not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      await TaskService.deleteTask(id);
      return new Response(JSON.stringify({ success: true, message: 'Task deleted successfully' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      // Log service layer error
      logError(error as Error, req, { 
        location: 'TaskController.deleteTask', 
        service_method: 'TaskService.deleteTask',
        taskId: id
      });
      
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};