// Define types for our application

// Task entity type
export interface Task {
  id: string;
  title: string;
  description?: string;
  is_completed: boolean;
  created_at: string;
  updated_at?: string;
}

// Task creation payload
export interface CreateTaskPayload {
  title: string;
  description?: string;
}

// Task update payload
export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  is_completed?: boolean;
}