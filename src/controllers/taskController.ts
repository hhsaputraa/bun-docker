import { TaskService } from "../services/taskService";
import { CreateTaskPayload, UpdateTaskPayload } from "../models/types";
import { logError } from "../utils/logger";
import { response } from "../utils/responseHelper";

function validateTaskPayload(
  payload: CreateTaskPayload | UpdateTaskPayload,
  requireTitle = false
): string | null {
  if (requireTitle && (!payload.title || payload.title.trim().length === 0)) {
    return "Title is required";
  }
  if (payload.title !== undefined && payload.title.trim().length === 0) {
    return "Title cannot be empty";
  }
  return null;
}

export const TaskController = {
  async getAllTasks(req: Request): Promise<Response> {
    try {
      const tasks = await TaskService.getAllTasks();
      return response.ok(tasks, "Tasks retrieved successfully");
    } catch (err) {
      logError(err as Error, req, {
        location: "TaskController.getAllTasks",
        service_method: "TaskService.getAllTasks",
      });
      return response.fail();
    }
  },

  async getTaskById(req: Request, id: string): Promise<Response> {
    try {
      const task = await TaskService.getTaskById(id);
      if (!task) {
        logError(new Error("Task not found"), req, {
          location: "TaskController.getTaskById",
          service_method: "TaskService.getTaskById",
          taskId: id,
          status_code: 404,
        });
        return response.notFound("Task not found");
      }
      return response.ok(task, "Task retrieved successfully");
    } catch (err) {
      logError(err as Error, req, {
        location: "TaskController.getTaskById",
        service_method: "TaskService.getTaskById",
        taskId: id,
      });
      return response.fail();
    }
  },

  async createTask(req: Request): Promise<Response> {
    let body: CreateTaskPayload | undefined; 
    try {
      body = (await req.json()) as CreateTaskPayload;
      const validationError = validateTaskPayload(body, true);
      if (validationError) {
        logError(new Error(validationError), req, {
          location: "TaskController.createTask",
          validation_error: true,
          status_code: 400,
        });
        return response.badRequest(validationError);
      }

      const task = await TaskService.createTask(body);
      return response.created(task, "Task created successfully");
    } catch (err) {
      logError(err as Error, req, {
        location: "TaskController.createTask",
        service_method: "TaskService.createTask",
      });
      return response.fail();
    }
  },

  async updateTask(req: Request, id: string): Promise<Response> {
    let body: UpdateTaskPayload | undefined;
    try {
      body = (await req.json()) as UpdateTaskPayload;
      const validationError = validateTaskPayload(body);
      if (validationError) {
        logError(new Error(validationError), req, {
          location: "TaskController.updateTask",
          validation_error: true,
          taskId: id,
          status_code: 400,
        });
        return response.badRequest(validationError);
      }

      const updated = await TaskService.updateTask(id, body);
      if (!updated) {
        logError(new Error("Task not found for update"), req, {
          location: "TaskController.updateTask",
          service_method: "TaskService.updateTask",
          taskId: id,
          status_code: 404,
        });
        return response.notFound("Task not found");
      }

      return response.ok(updated, "Task updated successfully");
    } catch (err) {
      logError(err as Error, req, {
        location: "TaskController.updateTask",
        service_method: "TaskService.updateTask",
        taskId: id,
      });
      return response.fail();
    }
  },


  async deleteTask(req: Request, id: string): Promise<Response> {
    try {
      await TaskService.deleteTask(id);
      return response.ok({ id }, "Task deleted successfully");
    } catch (err) {
      const error = err as Error;
      if (error.message === "Task not found") {
        logError(error, req, {
          location: "TaskController.deleteTask",
          service_method: "TaskService.deleteTask",
          taskId: id,
          status_code: 404,
        });
        return response.notFound("Task not found");
      }

      logError(error, req, {
        location: "TaskController.deleteTask",
        service_method: "TaskService.deleteTask",
        taskId: id,
      });
      return response.fail();
    }
  },
};
