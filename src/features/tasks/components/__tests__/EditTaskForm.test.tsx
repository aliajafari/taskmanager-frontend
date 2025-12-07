import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditTaskForm } from '../EditTaskForm';
import { Task } from '../../api/tasks';
import { Project } from '@/features/projects/api/projects';
import { Tag } from '../../api/tasks';

// Mock react-hook-form
jest.mock('react-hook-form', () => ({
  useForm: jest.fn(() => ({
    register: jest.fn((name, options) => ({
      name,
      onChange: jest.fn(),
      onBlur: jest.fn(),
      ref: jest.fn(),
    })),
    handleSubmit: jest.fn((fn) => (e: React.FormEvent) => {
      e.preventDefault();
      fn({
        title: 'Updated Task',
        project_id: 1,
        status: 'in-progress',
        tags: [1],
      });
    }),
    formState: { errors: {} },
    watch: jest.fn(() => [1]),
    setValue: jest.fn(),
    reset: jest.fn(),
  })),
}));

// Mock useEffect
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn((fn) => fn()),
}));

const mockTask: Task = {
  id: 1,
  title: 'Test Task',
  description: 'Test Description',
  project_id: 1,
  project: {
    id: 1,
    name: 'Test Project',
  },
  status: 'todo',
  due_date: '2024-12-31',
  tags: [
    { id: 1, name: 'urgent' },
  ],
};

const mockProjects: Project[] = [
  { id: 1, title: 'Project 1' },
  { id: 2, title: 'Project 2' },
];

const mockTags: Tag[] = [
  { id: 1, name: 'urgent' },
  { id: 2, name: 'work' },
];

describe('EditTaskForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form with all fields', () => {
    render(
      <EditTaskForm
        task={mockTask}
        projects={mockProjects}
        tags={mockTags}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Project')).toBeInTheDocument();
    expect(screen.getByLabelText('Due Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
  });

  it('renders all projects in select', () => {
    render(
      <EditTaskForm
        task={mockTask}
        projects={mockProjects}
        tags={mockTags}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Project 1')).toBeInTheDocument();
    expect(screen.getByText('Project 2')).toBeInTheDocument();
  });

  it('renders all tags as checkboxes', () => {
    render(
      <EditTaskForm
        task={mockTask}
        projects={mockProjects}
        tags={mockTags}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('urgent')).toBeInTheDocument();
    expect(screen.getByText('work')).toBeInTheDocument();
  });

  it('renders status options', () => {
    render(
      <EditTaskForm
        task={mockTask}
        projects={mockProjects}
        tags={mockTags}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Todo')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('renders Cancel and Update buttons', () => {
    render(
      <EditTaskForm
        task={mockTask}
        projects={mockProjects}
        tags={mockTags}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument();
  });

  it('shows loading state on submit button when isLoading is true', () => {
    render(
      <EditTaskForm
        task={mockTask}
        projects={mockProjects}
        tags={mockTags}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={true}
      />
    );

    expect(screen.getByRole('button', { name: /updating/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /updating/i })).toBeDisabled();
  });

  it('calls onCancel when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <EditTaskForm
        task={mockTask}
        projects={mockProjects}
        tags={mockTags}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('handles task without due date', () => {
    const taskWithoutDueDate = { ...mockTask, due_date: undefined };
    render(
      <EditTaskForm
        task={taskWithoutDueDate}
        projects={mockProjects}
        tags={mockTags}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByLabelText('Due Date')).toBeInTheDocument();
  });

  it('handles task without tags', () => {
    const taskWithoutTags = { ...mockTask, tags: [] };
    render(
      <EditTaskForm
        task={taskWithoutTags}
        projects={mockProjects}
        tags={mockTags}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('urgent')).toBeInTheDocument();
  });

  it('handles task with due date including time', () => {
    const taskWithTime = { ...mockTask, due_date: '2024-12-31T10:30:00' };
    render(
      <EditTaskForm
        task={taskWithTime}
        projects={mockProjects}
        tags={mockTags}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByLabelText('Due Date')).toBeInTheDocument();
  });

  it('handles task with due date including space', () => {
    const taskWithSpace = { ...mockTask, due_date: '2024-12-31 10:30:00' };
    render(
      <EditTaskForm
        task={taskWithSpace}
        projects={mockProjects}
        tags={mockTags}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByLabelText('Due Date')).toBeInTheDocument();
  });

  it('shows "No projects available" when projects array is empty', () => {
    render(
      <EditTaskForm
        task={mockTask}
        projects={[]}
        tags={mockTags}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('No projects available')).toBeInTheDocument();
  });

  it('does not render tags section when tags array is empty', () => {
    render(
      <EditTaskForm
        task={mockTask}
        projects={mockProjects}
        tags={[]}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.queryByText('Tags')).not.toBeInTheDocument();
  });
});

