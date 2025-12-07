import { httpClient } from '@/lib/http/client';

export interface Tag {
  id: number;
  name: string;
}

export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: number;
  title: string;
  description?: string;
  project_id: number;
  project?: {
    id: number;
    name: string;
  };
  tags?: Tag[];
  due_date?: string;
  status: TaskStatus;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  project_id: number;
  tags?: number[];
  due_date?: string;
  status: TaskStatus;
}

export interface UpdateTaskDto extends Partial<CreateTaskDto> {}

export const tasksApi = {
  getAll: async (): Promise<Task[]> => {
    const response = await httpClient.get<Task[] | { data: Task[] }>('/api/tasks');
    if (Array.isArray(response)) {
      return response;
    }
    if (response && typeof response === 'object' && 'data' in response && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  },

  getById: async (id: number): Promise<Task> => {
    const response = await httpClient.get<Task | { data: Task }>(`/api/tasks/${id}`);
    if (response && typeof response === 'object') {
      if ('data' in response && typeof response.data === 'object') {
        return response.data;
      }
      if ('id' in response && 'title' in response) {
        return response as Task;
      }
    }
    throw new Error('Invalid task response format');
  },

  create: async (data: CreateTaskDto): Promise<Task> => {
    let formattedDueDate = data.due_date;
    if (data.due_date) {
      if (data.due_date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        formattedDueDate = `${data.due_date} 00:00:00`;
      }
    }
    
    const payload = {
      title: data.title,
      description: data.description,
      project_id: data.project_id,
      status: data.status,
      due_date: formattedDueDate,
      tags: data.tags || [],
    };
    
    return httpClient.post<Task>('/api/tasks', payload);
  },

  update: async (id: number, data: UpdateTaskDto): Promise<Task> => {
    let formattedDueDate = data.due_date;
    if (data.due_date) {
      if (data.due_date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        formattedDueDate = `${data.due_date} 00:00:00`;
      }
    }
    
    const payload: any = {
      title: data.title,
      description: data.description,
      project_id: data.project_id,
      status: data.status,
      due_date: formattedDueDate,
      tags: data.tags || [],
    };
    
    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined) {
        delete payload[key];
      }
    });
    
    return httpClient.put<Task>(`/api/tasks/${id}`, payload);
  },

  delete: async (id: number): Promise<void> => {
    return httpClient.delete<void>(`/api/tasks/${id}`);
  },
};

