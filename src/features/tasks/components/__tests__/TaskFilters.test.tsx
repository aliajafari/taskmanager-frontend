import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskFilters } from '../TaskFilters';
import { Project } from '@/features/projects/api/projects';
import { Tag } from '../../api/tasks';

const mockProjects: Project[] = [
  { id: 1, title: 'Project 1' },
  { id: 2, title: 'Project 2' },
];

const mockTags: Tag[] = [
  { id: 1, name: 'urgent' },
  { id: 2, name: 'work' },
];

describe('TaskFilters', () => {
  const mockOnProjectChange = jest.fn();
  const mockOnTagChange = jest.fn();
  const mockOnDueDateChange = jest.fn();
  const mockOnClearFilters = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders filter section with title', () => {
    render(
      <TaskFilters
        projects={mockProjects}
        tags={mockTags}
        selectedProjectId=""
        selectedTagId=""
        selectedDueDate=""
        onProjectChange={mockOnProjectChange}
        onTagChange={mockOnTagChange}
        onDueDateChange={mockOnDueDateChange}
        onClearFilters={mockOnClearFilters}
      />
    );
    expect(screen.getByText('Filters')).toBeInTheDocument();
  });

  it('renders project filter select', () => {
    render(
      <TaskFilters
        projects={mockProjects}
        tags={mockTags}
        selectedProjectId=""
        selectedTagId=""
        selectedDueDate=""
        onProjectChange={mockOnProjectChange}
        onTagChange={mockOnTagChange}
        onDueDateChange={mockOnDueDateChange}
        onClearFilters={mockOnClearFilters}
      />
    );
    expect(screen.getByLabelText('Filter by Project')).toBeInTheDocument();
  });

  it('renders tag filter select', () => {
    render(
      <TaskFilters
        projects={mockProjects}
        tags={mockTags}
        selectedProjectId=""
        selectedTagId=""
        selectedDueDate=""
        onProjectChange={mockOnProjectChange}
        onTagChange={mockOnTagChange}
        onDueDateChange={mockOnDueDateChange}
        onClearFilters={mockOnClearFilters}
      />
    );
    expect(screen.getByLabelText('Filter by Tag')).toBeInTheDocument();
  });

  it('renders due date filter input', () => {
    render(
      <TaskFilters
        projects={mockProjects}
        tags={mockTags}
        selectedProjectId=""
        selectedTagId=""
        selectedDueDate=""
        onProjectChange={mockOnProjectChange}
        onTagChange={mockOnTagChange}
        onDueDateChange={mockOnDueDateChange}
        onClearFilters={mockOnClearFilters}
      />
    );
    expect(screen.getByLabelText('Filter by Due Date')).toBeInTheDocument();
  });

  it('renders all projects in select', () => {
    render(
      <TaskFilters
        projects={mockProjects}
        tags={mockTags}
        selectedProjectId=""
        selectedTagId=""
        selectedDueDate=""
        onProjectChange={mockOnProjectChange}
        onTagChange={mockOnTagChange}
        onDueDateChange={mockOnDueDateChange}
        onClearFilters={mockOnClearFilters}
      />
    );
    expect(screen.getByText('Project 1')).toBeInTheDocument();
    expect(screen.getByText('Project 2')).toBeInTheDocument();
  });

  it('renders all tags in select', () => {
    render(
      <TaskFilters
        projects={mockProjects}
        tags={mockTags}
        selectedProjectId=""
        selectedTagId=""
        selectedDueDate=""
        onProjectChange={mockOnProjectChange}
        onTagChange={mockOnTagChange}
        onDueDateChange={mockOnDueDateChange}
        onClearFilters={mockOnClearFilters}
      />
    );
    expect(screen.getByText('urgent')).toBeInTheDocument();
    expect(screen.getByText('work')).toBeInTheDocument();
  });

  it('calls onProjectChange when project is selected', async () => {
    const user = userEvent.setup();
    render(
      <TaskFilters
        projects={mockProjects}
        tags={mockTags}
        selectedProjectId=""
        selectedTagId=""
        selectedDueDate=""
        onProjectChange={mockOnProjectChange}
        onTagChange={mockOnTagChange}
        onDueDateChange={mockOnDueDateChange}
        onClearFilters={mockOnClearFilters}
      />
    );
    
    const projectSelect = screen.getByLabelText('Filter by Project');
    await user.selectOptions(projectSelect, '1');
    
    expect(mockOnProjectChange).toHaveBeenCalledWith('1');
  });

  it('calls onTagChange when tag is selected', async () => {
    const user = userEvent.setup();
    render(
      <TaskFilters
        projects={mockProjects}
        tags={mockTags}
        selectedProjectId=""
        selectedTagId=""
        selectedDueDate=""
        onProjectChange={mockOnProjectChange}
        onTagChange={mockOnTagChange}
        onDueDateChange={mockOnDueDateChange}
        onClearFilters={mockOnClearFilters}
      />
    );
    
    const tagSelect = screen.getByLabelText('Filter by Tag');
    await user.selectOptions(tagSelect, '2');
    
    expect(mockOnTagChange).toHaveBeenCalledWith('2');
  });

  it('calls onDueDateChange when date is entered', async () => {
    const user = userEvent.setup();
    render(
      <TaskFilters
        projects={mockProjects}
        tags={mockTags}
        selectedProjectId=""
        selectedTagId=""
        selectedDueDate=""
        onProjectChange={mockOnProjectChange}
        onTagChange={mockOnTagChange}
        onDueDateChange={mockOnDueDateChange}
        onClearFilters={mockOnClearFilters}
      />
    );
    
    const dateInput = screen.getByLabelText('Filter by Due Date');
    await user.type(dateInput, '2024-12-31');
    
    expect(mockOnDueDateChange).toHaveBeenCalled();
  });

  it('calls onClearFilters when Clear Filters button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TaskFilters
        projects={mockProjects}
        tags={mockTags}
        selectedProjectId="1"
        selectedTagId="2"
        selectedDueDate="2024-12-31"
        onProjectChange={mockOnProjectChange}
        onTagChange={mockOnTagChange}
        onDueDateChange={mockOnDueDateChange}
        onClearFilters={mockOnClearFilters}
      />
    );
    
    const clearButton = screen.getByRole('button', { name: /clear filters/i });
    await user.click(clearButton);
    
    expect(mockOnClearFilters).toHaveBeenCalledTimes(1);
  });

  it('disables Clear Filters button when no filters are selected', () => {
    render(
      <TaskFilters
        projects={mockProjects}
        tags={mockTags}
        selectedProjectId=""
        selectedTagId=""
        selectedDueDate=""
        onProjectChange={mockOnProjectChange}
        onTagChange={mockOnTagChange}
        onDueDateChange={mockOnDueDateChange}
        onClearFilters={mockOnClearFilters}
      />
    );
    
    const clearButton = screen.getByRole('button', { name: /clear filters/i });
    expect(clearButton).toBeDisabled();
  });

  it('enables Clear Filters button when at least one filter is selected', () => {
    render(
      <TaskFilters
        projects={mockProjects}
        tags={mockTags}
        selectedProjectId="1"
        selectedTagId=""
        selectedDueDate=""
        onProjectChange={mockOnProjectChange}
        onTagChange={mockOnTagChange}
        onDueDateChange={mockOnDueDateChange}
        onClearFilters={mockOnClearFilters}
      />
    );
    
    const clearButton = screen.getByRole('button', { name: /clear filters/i });
    expect(clearButton).not.toBeDisabled();
  });

  it('shows "No projects available" when projects array is empty', () => {
    render(
      <TaskFilters
        projects={[]}
        tags={mockTags}
        selectedProjectId=""
        selectedTagId=""
        selectedDueDate=""
        onProjectChange={mockOnProjectChange}
        onTagChange={mockOnTagChange}
        onDueDateChange={mockOnDueDateChange}
        onClearFilters={mockOnClearFilters}
      />
    );
    expect(screen.getByText('No projects available')).toBeInTheDocument();
  });

  it('handles projects with missing title', () => {
    const projectsWithoutTitle: Project[] = [{ id: 3, title: '' }];
    render(
      <TaskFilters
        projects={projectsWithoutTitle}
        tags={mockTags}
        selectedProjectId=""
        selectedTagId=""
        selectedDueDate=""
        onProjectChange={mockOnProjectChange}
        onTagChange={mockOnTagChange}
        onDueDateChange={mockOnDueDateChange}
        onClearFilters={mockOnClearFilters}
      />
    );
    expect(screen.getByText('Project 3')).toBeInTheDocument();
  });

  it('displays selected project value', () => {
    render(
      <TaskFilters
        projects={mockProjects}
        tags={mockTags}
        selectedProjectId="1"
        selectedTagId=""
        selectedDueDate=""
        onProjectChange={mockOnProjectChange}
        onTagChange={mockOnTagChange}
        onDueDateChange={mockOnDueDateChange}
        onClearFilters={mockOnClearFilters}
      />
    );
    const projectSelect = screen.getByLabelText('Filter by Project') as HTMLSelectElement;
    expect(projectSelect.value).toBe('1');
  });

  it('displays selected tag value', () => {
    render(
      <TaskFilters
        projects={mockProjects}
        tags={mockTags}
        selectedProjectId=""
        selectedTagId="2"
        selectedDueDate=""
        onProjectChange={mockOnProjectChange}
        onTagChange={mockOnTagChange}
        onDueDateChange={mockOnDueDateChange}
        onClearFilters={mockOnClearFilters}
      />
    );
    const tagSelect = screen.getByLabelText('Filter by Tag') as HTMLSelectElement;
    expect(tagSelect.value).toBe('2');
  });

  it('displays selected due date value', () => {
    render(
      <TaskFilters
        projects={mockProjects}
        tags={mockTags}
        selectedProjectId=""
        selectedTagId=""
        selectedDueDate="2024-12-31"
        onProjectChange={mockOnProjectChange}
        onTagChange={mockOnTagChange}
        onDueDateChange={mockOnDueDateChange}
        onClearFilters={mockOnClearFilters}
      />
    );
    const dateInput = screen.getByLabelText('Filter by Due Date') as HTMLInputElement;
    expect(dateInput.value).toBe('2024-12-31');
  });
});

