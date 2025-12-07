import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskCard } from '../TaskCard';
import { Task } from '../../api/tasks';

const mockTask: Task = {
  id: 1,
  title: 'Test Task',
  description: 'This is a test task',
  project_id: 1,
  project: {
    id: 1,
    name: 'Test Project',
  },
  status: 'todo',
  due_date: '2024-12-31',
  tags: [
    { id: 1, name: 'urgent' },
    { id: 2, name: 'work' },
  ],
};

describe('TaskCard', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders task title', () => {
    render(<TaskCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('renders task description when provided', () => {
    render(<TaskCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    expect(screen.getByText('This is a test task')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    const taskWithoutDescription = { ...mockTask, description: undefined };
    render(<TaskCard task={taskWithoutDescription} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    expect(screen.queryByText('This is a test task')).not.toBeInTheDocument();
  });

  it('renders project name', () => {
    render(<TaskCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    expect(screen.getByText(/Test Project/)).toBeInTheDocument();
  });

  it('renders "No project" when project is not provided', () => {
    const taskWithoutProject = { ...mockTask, project: undefined };
    render(<TaskCard task={taskWithoutProject} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    expect(screen.getByText('No project')).toBeInTheDocument();
  });

  it('renders formatted due date', () => {
    render(<TaskCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    expect(screen.getByText(/Dec 31, 2024/)).toBeInTheDocument();
  });

  it('renders "No due date" when due_date is not provided', () => {
    const taskWithoutDueDate = { ...mockTask, due_date: undefined };
    render(<TaskCard task={taskWithoutDueDate} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    expect(screen.getByText('No due date')).toBeInTheDocument();
  });

  it('renders all tags', () => {
    render(<TaskCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    expect(screen.getByText('urgent')).toBeInTheDocument();
    expect(screen.getByText('work')).toBeInTheDocument();
  });

  it('does not render tags section when tags are empty', () => {
    const taskWithoutTags = { ...mockTask, tags: [] };
    render(<TaskCard task={taskWithoutTags} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    expect(screen.queryByText('urgent')).not.toBeInTheDocument();
  });

  it('renders status badge with correct styling for todo', () => {
    render(<TaskCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    const statusBadge = screen.getByText('todo');
    expect(statusBadge).toHaveClass('bg-gray-100', 'text-gray-800');
  });

  it('renders status badge with correct styling for in-progress', () => {
    const inProgressTask = { ...mockTask, status: 'in-progress' as const };
    render(<TaskCard task={inProgressTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    const statusBadge = screen.getByText('in progress');
    expect(statusBadge).toHaveClass('bg-blue-100', 'text-blue-800');
  });

  it('renders status badge with correct styling for done', () => {
    const doneTask = { ...mockTask, status: 'done' as const };
    render(<TaskCard task={doneTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    const statusBadge = screen.getByText('done');
    expect(statusBadge).toHaveClass('bg-green-100', 'text-green-800');
  });

  it('calls onEdit when Edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<TaskCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);
    
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
  });

  it('calls onDelete when Delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<TaskCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(mockTask.id);
  });

  it('formats date correctly when date includes time', () => {
    const taskWithTime = { ...mockTask, due_date: '2024-12-31T10:30:00' };
    render(<TaskCard task={taskWithTime} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    expect(screen.getByText(/Dec 31, 2024/)).toBeInTheDocument();
  });

  it('formats date correctly when date includes space', () => {
    const taskWithSpace = { ...mockTask, due_date: '2024-12-31 10:30:00' };
    render(<TaskCard task={taskWithSpace} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    expect(screen.getByText(/Dec 31, 2024/)).toBeInTheDocument();
  });

  it('shows overdue styling for past due dates', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    const overdueTask = {
      ...mockTask,
      due_date: pastDate.toISOString().split('T')[0],
    };
    render(<TaskCard task={overdueTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    const dueDateElement = screen.getByText(/Due Date:/).nextSibling;
    expect(dueDateElement).toHaveClass('text-red-600', 'font-medium');
  });

  it('does not show overdue styling for future dates', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const futureTask = {
      ...mockTask,
      due_date: futureDate.toISOString().split('T')[0],
    };
    render(<TaskCard task={futureTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    const dueDateElement = screen.getByText(/Due Date:/).nextSibling;
    expect(dueDateElement).toHaveClass('text-gray-700');
    expect(dueDateElement).not.toHaveClass('text-red-600');
  });
});

