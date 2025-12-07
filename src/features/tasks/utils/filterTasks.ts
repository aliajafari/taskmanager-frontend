import { Task } from '../api/tasks';

export interface TaskFilters {
  projectId?: number;
  tagId?: number;
  dueDate?: string;
}

export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
  let filtered = [...tasks];

  if (filters.projectId) {
    filtered = filtered.filter((task) => task.project_id === filters.projectId);
  }

  if (filters.tagId) {
    filtered = filtered.filter(
      (task) => task.tags?.some((tag) => tag.id === filters.tagId)
    );
  }

  if (filters.dueDate) {
    const filterDate = new Date(filters.dueDate);
    filterDate.setHours(0, 0, 0, 0);
    filtered = filtered.filter((task) => {
      if (!task.due_date) return false;
      const taskDate = new Date(task.due_date);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === filterDate.getTime();
    });
  }

  return filtered;
}

export function sortTasksByDueDate(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    if (!a.due_date && !b.due_date) return 0;
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
  });
}

