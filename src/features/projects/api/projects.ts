import { httpClient } from '@/lib/http/client';

export interface Project {
  id: number;
  title: string;
  name?: string; // Some APIs might use 'name' instead of 'title'
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateProjectDto {
  title?: string;
  name?: string;
  description?: string;
}

export interface UpdateProjectDto extends Partial<CreateProjectDto> {}

export const projectsApi = {
  getAll: async (): Promise<Project[]> => {
    try {
      const response = await httpClient.get<Project[] | { data: Project[] } | { projects: Project[] }>('/api/projects');
      let projects: Project[] = [];
      
      if (Array.isArray(response)) {
        projects = response;
      } else if (response && typeof response === 'object') {
        if ('data' in response && Array.isArray(response.data)) {
          projects = response.data;
        }
        else if ('projects' in response && Array.isArray(response.projects)) {
          projects = response.projects;
        }
      }
      
      return projects.map((project) => ({
        ...project,
        title: project.title || project.name || `Project ${project.id}`,
      }));
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  },

  getById: async (id: number): Promise<Project> => {
    const response = await httpClient.get<Project | { data: Project }>(`/api/projects/${id}`);
    if (response && typeof response === 'object') {
      if ('data' in response && typeof response.data === 'object') {
        const project = response.data;
        return {
          ...project,
          title: project.title || project.name || `Project ${project.id}`,
        };
      }
      if ('id' in response) {
        const project = response as Project;
        return {
          ...project,
          title: project.title || project.name || `Project ${project.id}`,
        };
      }
    }
    throw new Error('Invalid project response format');
  },

  create: async (data: CreateProjectDto): Promise<Project> => {
    const projectName = data.name || data.title;
    if (!projectName) {
      throw new Error('Project name is required');
    }
    const payload = {
      name: projectName,
      title: projectName,
      description: data.description,
    };
    return httpClient.post<Project>('/api/projects', payload);
  },

  update: async (id: number, data: UpdateProjectDto): Promise<Project> => {
    const payload: any = {};
    if (data.title !== undefined) {
      payload.title = data.title;
      payload.name = data.title;
    }
    if (data.name !== undefined) {
      payload.name = data.name;
      payload.title = data.name;
    }
    if (data.description !== undefined) {
      payload.description = data.description;
    }
    return httpClient.put<Project>(`/api/projects/${id}`, payload);
  },
};

