import { supabase } from '../config/supabase';
import { Task, CreateTaskPayload, UpdateTaskPayload } from '../models/types';
import { logInfo } from '../utils/logger';

const TABLE_NAME = 'tasks';

// Mock data for development mode when Supabase is not configured
let mockTasks: Task[] = [
  {
    id: '1',
    title: 'Sample Task 1',
    description: 'This is a sample task for development',
    is_completed: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Sample Task 2',
    description: 'Another sample task for testing',
    is_completed: true,
    created_at: new Date().toISOString(),
  },
];

// Gunakan Supabase untuk operasi CRUD
const useMockData = process.env.USE_MOCK_DATA === 'true';

export const TaskService = {
  // Get all tasks
  async getAllTasks(): Promise<Task[]> {
    if (useMockData) {
      logInfo('Using mock data for getAllTasks');
      return [...mockTasks];
    }
    
    const { data, error } = await supabase!
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Task[];
  },

  // Get task by ID
  async getTaskById(id: string): Promise<Task | null> {
    if (useMockData) {
      logInfo('Using mock data for getTaskById', { id });
      const task = mockTasks.find(t => t.id === id);
      return task || null;
    }
    
    const { data, error } = await supabase!
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Task;
  },

  // Create a new task
  async createTask(task: CreateTaskPayload): Promise<Task> {
    if (useMockData) {
      logInfo('Using mock data for createTask');
      const newTask: Task = {
        id: (mockTasks.length + 1).toString(),
        title: task.title,
        description: task.description,
        is_completed: false,
        created_at: new Date().toISOString(),
      };
      mockTasks.push(newTask);
      return newTask;
    }
    
    const { data, error } = await supabase!
      .from(TABLE_NAME)
      .insert([task])
      .select()
      .single();

    if (error) throw error;
    return data as Task;
  },

  // Update an existing task
  async updateTask(id: string, updates: UpdateTaskPayload): Promise<Task> {
    if (useMockData) {
      logInfo('Using mock data for updateTask', { id });
      const index = mockTasks.findIndex(t => t.id === id);
      if (index === -1) throw new Error('Task not found');
      
      mockTasks[index] = {
        ...mockTasks[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      
      return mockTasks[index];
    }
    
    const { data, error } = await supabase!
      .from(TABLE_NAME)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Task;
  },

  // Delete a task
  async deleteTask(id: string): Promise<void> {
    if (useMockData) {
      logInfo('Using mock data for deleteTask', { id });
      const index = mockTasks.findIndex(t => t.id === id);
      if (index === -1) throw new Error('Task not found');
      mockTasks.splice(index, 1);
      return;
    }
    
    const { error } = await supabase!
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};