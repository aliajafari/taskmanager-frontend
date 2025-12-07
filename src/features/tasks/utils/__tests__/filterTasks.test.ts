import { filterTasks, sortTasksByDueDate } from '../filterTasks';
import { Task } from '../../api/tasks';

const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Task 1',
    project_id: 1,
    status: 'todo',
    due_date: '2024-01-15',
    tags: [{ id: 1, name: 'urgent' }, { id: 2, name: 'work' }],
  },
  {
    id: 2,
    title: 'Task 2',
    project_id: 1,
    status: 'in-progress',
    due_date: '2024-01-20',
    tags: [{ id: 2, name: 'work' }],
  },
  {
    id: 3,
    title: 'Task 3',
    project_id: 2,
    status: 'done',
    due_date: '2024-01-10',
    tags: [{ id: 1, name: 'urgent' }],
  },
  {
    id: 4,
    title: 'Task 4',
    project_id: 2,
    status: 'todo',
    tags: [{ id: 3, name: 'personal' }],
  },
];

describe('filterTasks', () => {
  it('returns all tasks when no filters are applied', () => {
    const result = filterTasks(mockTasks, {});
    expect(result).toHaveLength(4);
    expect(result).toEqual(mockTasks);
  });

  it('filters tasks by project_id', () => {
    const result = filterTasks(mockTasks, { projectId: 1 });
    expect(result).toHaveLength(2);
    expect(result.every((task) => task.project_id === 1)).toBe(true);
    expect(result.map((t) => t.id)).toEqual([1, 2]);
  });

  it('filters tasks by tag_id', () => {
    const result = filterTasks(mockTasks, { tagId: 1 });
    expect(result).toHaveLength(2);
    expect(result.every((task) => task.tags?.some((tag) => tag.id === 1))).toBe(true);
    expect(result.map((t) => t.id)).toEqual([1, 3]);
  });

  it('filters tasks by due_date', () => {
    const result = filterTasks(mockTasks, { dueDate: '2024-01-15' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
    expect(result[0].due_date).toBe('2024-01-15');
  });

  it('excludes tasks without due_date when filtering by due_date', () => {
    const result = filterTasks(mockTasks, { dueDate: '2024-01-20' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
    expect(result.every((task) => task.due_date)).toBe(true);
  });

  it('combines multiple filters', () => {
    const result = filterTasks(mockTasks, { projectId: 1, tagId: 2 });
    expect(result).toHaveLength(2);
    expect(result.every((task) => task.project_id === 1)).toBe(true);
    expect(result.every((task) => task.tags?.some((tag) => tag.id === 2))).toBe(true);
  });

  it('returns empty array when no tasks match filters', () => {
    const result = filterTasks(mockTasks, { projectId: 999 });
    expect(result).toHaveLength(0);
  });

  it('handles tasks with no tags when filtering by tag', () => {
    const tasksWithoutTags: Task[] = [
      { id: 1, title: 'Task 1', project_id: 1, status: 'todo' },
    ];
    const result = filterTasks(tasksWithoutTags, { tagId: 1 });
    expect(result).toHaveLength(0);
  });

  it('does not mutate original array', () => {
    const originalTasks = [...mockTasks];
    filterTasks(mockTasks, { projectId: 1 });
    expect(mockTasks).toEqual(originalTasks);
  });
});

describe('sortTasksByDueDate', () => {
  it('sorts tasks by due date ascending', () => {
    const result = sortTasksByDueDate(mockTasks);
    expect(result[0].due_date).toBe('2024-01-10');
    expect(result[1].due_date).toBe('2024-01-15');
    expect(result[2].due_date).toBe('2024-01-20');
  });

  it('places tasks without due_date at the end', () => {
    const result = sortTasksByDueDate(mockTasks);
    const lastTask = result[result.length - 1];
    expect(lastTask.due_date).toBeUndefined();
  });

  it('handles tasks with same due date', () => {
    const tasksWithSameDate: Task[] = [
      { id: 1, title: 'Task 1', project_id: 1, status: 'todo', due_date: '2024-01-15' },
      { id: 2, title: 'Task 2', project_id: 1, status: 'todo', due_date: '2024-01-15' },
    ];
    const result = sortTasksByDueDate(tasksWithSameDate);
    expect(result).toHaveLength(2);
  });

  it('handles empty array', () => {
    const result = sortTasksByDueDate([]);
    expect(result).toHaveLength(0);
  });

  it('handles array with only tasks without due_date', () => {
    const tasksWithoutDates: Task[] = [
      { id: 1, title: 'Task 1', project_id: 1, status: 'todo' },
      { id: 2, title: 'Task 2', project_id: 1, status: 'todo' },
    ];
    const result = sortTasksByDueDate(tasksWithoutDates);
    expect(result).toHaveLength(2);
  });

  it('does not mutate original array', () => {
    const originalTasks = [...mockTasks];
    sortTasksByDueDate(mockTasks);
    expect(mockTasks).toEqual(originalTasks);
  });
});

