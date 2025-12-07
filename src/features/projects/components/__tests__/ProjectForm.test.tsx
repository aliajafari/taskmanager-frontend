import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProjectForm } from '../ProjectForm';
import { Project } from '../../api/projects';

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
        title: 'Test Project',
        description: 'Test Description',
      });
    }),
    formState: { errors: {} },
    reset: jest.fn(),
  })),
}));

// Mock useEffect
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn((fn) => fn()),
}));

describe('ProjectForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form with all fields', () => {
    render(
      <ProjectForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByLabelText('Project Name')).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
  });

  it('renders Cancel and Create buttons when no project is provided', () => {
    render(
      <ProjectForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument();
  });

  it('renders Update button when project is provided', () => {
    const mockProject: Project = {
      id: 1,
      title: 'Test Project',
      name: 'Test Project',
      description: 'Test Description',
    };

    render(
      <ProjectForm
        project={mockProject}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument();
  });

  it('shows loading state on submit button when isLoading is true', () => {
    render(
      <ProjectForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={true}
      />
    );

    expect(screen.getByRole('button', { name: /saving/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled();
  });

  it('calls onCancel when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <ProjectForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('renders textarea for description', () => {
    render(
      <ProjectForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const descriptionTextarea = screen.getByLabelText(/Description/i);
    expect(descriptionTextarea).toBeInTheDocument();
    expect(descriptionTextarea.tagName).toBe('TEXTAREA');
  });

  it('handles project with title property', () => {
    const mockProject: Project = {
      id: 1,
      title: 'Project Title',
      description: 'Project Description',
    };

    render(
      <ProjectForm
        project={mockProject}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByLabelText('Project Name')).toBeInTheDocument();
  });

  it('handles project with name property', () => {
    const mockProject: Project = {
      id: 1,
      title: 'Project Name',
      name: 'Project Name',
      description: 'Project Description',
    };

    render(
      <ProjectForm
        project={mockProject}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByLabelText('Project Name')).toBeInTheDocument();
  });
});

