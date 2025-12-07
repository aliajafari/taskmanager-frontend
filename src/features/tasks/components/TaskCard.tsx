'use client';

import { Task } from '../api/tasks';
import { Button } from '@/components/ui/button';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No due date';
    let datePart = dateString;
    if (dateString.includes(' ')) {
      datePart = dateString.split(' ')[0];
    } else if (dateString.includes('T')) {
      datePart = dateString.split('T')[0];
    }
    
    const [year, month, day] = datePart.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 text-gray-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'done':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = (() => {
    if (!task.due_date) return false;
    let datePart = task.due_date;
    if (task.due_date.includes(' ')) {
      datePart = task.due_date.split(' ')[0];
    } else if (task.due_date.includes('T')) {
      datePart = task.due_date.split('T')[0];
    }
    
    const [year, month, day] = datePart.split('-').map(Number);
    const dueDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    
    return dueDate < today;
  })();

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            task.status
          )}`}
        >
          {task.status.replace('-', ' ')}
        </span>
      </div>

      {task.description && (
        <p className="text-gray-600 text-sm mb-3">{task.description}</p>
      )}

      <div className="space-y-2 mb-3 grow">
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium mr-2">Project:</span>
          <span>{task.project?.name || 'No project'}</span>
        </div>

        <div className="flex items-center text-sm">
          <span className="font-medium text-gray-600 mr-2">Due Date:</span>
          <span className={isOverdue ? 'text-red-600 font-medium' : 'text-gray-700'}>
            {formatDate(task.due_date)}
          </span>
        </div>

        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-2 border-t mt-auto">
        <Button
          variant="secondary"
          onClick={() => onEdit(task)}
          className="flex-1 text-sm"
        >
          Edit
        </Button>
        <Button
          variant="danger"
          onClick={() => onDelete(task.id)}
          className="flex-1 text-sm"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

