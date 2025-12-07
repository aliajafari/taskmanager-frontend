import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateTaskForm } from '../CreateTaskForm';
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
        title: 'Test Task',
        project_id: 1,
        status: 'todo',
        tags: [],
      });
    }),
    formState: { errors: {} },
    watch: jest.fn(() => []),
    setValue: jest.fn(),
  })),
}));

const mockProjects: Project[] = [
  { id: 1, title: 'Project 1' },
  { id: 2, title: 'Project 2' },
];

const mockTags: Tag[] = [
  { id: 1, name: 'urgent' },
  { id: 2, name: 'work' },
];

describe('CreateTaskForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form with all fields', () => {
    render(
      <CreateTaskForm
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
      <CreateTaskForm
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
      <CreateTaskForm
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
      <CreateTaskForm
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

  it('renders Cancel and Create buttons', () => {
    render(
      <CreateTaskForm
        projects={mockProjects}
        tags={mockTags}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument();
  });

  it('shows loading state on submit button when isLoading is true', () => {
    render(
      <CreateTaskForm
        projects={mockProjects}
        tags={mockTags}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={true}
      />
    );

    expect(screen.getByRole('button', { name: /creating/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /creating/i })).toBeDisabled();
  });

  it('calls onCancel when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <CreateTaskForm
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

  it('shows "No projects available" when projects array is empty', () => {
    render(
      <CreateTaskForm
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
      <CreateTaskForm
        projects={mockProjects}
        tags={[]}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.queryByText('Tags')).not.toBeInTheDocument();
  });

  it('handles projects with missing title', () => {
    const projectsWithoutTitle: Project[] = [{ id: 3, title: '' }];
    render(
      <CreateTaskForm
        projects={projectsWithoutTitle}
        tags={mockTags}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Project 3')).toBeInTheDocument();
  });
});

