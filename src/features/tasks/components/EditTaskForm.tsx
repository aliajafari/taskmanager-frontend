'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useId } from 'react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Task, CreateTaskDto, TaskStatus, Tag } from '../api/tasks';
import { Project } from '@/features/projects/api/projects';

interface EditTaskFormProps {
  task: Task;
  projects: Project[];
  tags: Tag[];
  onSubmit: (data: CreateTaskDto) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function EditTaskForm({
  task,
  projects,
  tags,
  onSubmit,
  onCancel,
  isLoading,
}: EditTaskFormProps) {
  const descriptionId = useId();
  const formatDueDate = (dueDate?: string): string | undefined => {
    if (!dueDate) return undefined;
    if (dueDate.includes(' ')) {
      return dueDate.split(' ')[0];
    }
    if (dueDate.includes('T')) {
      return dueDate.split('T')[0];
    }
    return dueDate;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<CreateTaskDto & { tags?: number[] }>({
    defaultValues: {
      status: 'todo',
      tags: [],
    },
  });

  useEffect(() => {
    if (task) {
      const formData = {
        title: task.title || '',
        description: task.description || '',
        project_id: task.project_id,
        due_date: formatDueDate(task.due_date),
        status: task.status,
        tags: task.tags?.map((tag) => tag.id) || [],
      };
      
      reset(formData);
    }
  }, [task, reset]);

  const selectedTags = watch('tags') || [];

  const handleTagToggle = (tagId: number) => {
    const current = selectedTags || [];
    const newTags = current.includes(tagId)
      ? current.filter((id) => id !== tagId)
      : [...current, tagId];
    setValue('tags', newTags);
  };

  const handleFormSubmit = (data: CreateTaskDto & { tags?: number[] | string }) => {
    let tags: number[] = [];
    if (data.tags) {
      if (typeof data.tags === 'string') {
        try {
          tags = JSON.parse(data.tags);
        } catch {
          tags = [];
        }
      } else {
        tags = data.tags;
      }
    }
    
    const submitData: CreateTaskDto = {
      ...data,
      tags: tags.filter((id) => id),
    };
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        label="Title"
        {...register('title', { required: 'Title is required' })}
        error={errors.title?.message}
      />

      <div>
        <label htmlFor={descriptionId} className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id={descriptionId}
          {...register('description')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium"
          rows={3}
        />
      </div>

      <Select
        label="Project"
        {...register('project_id', {
          required: 'Project is required',
          valueAsNumber: true,
        })}
        error={errors.project_id?.message}
      >
        <option value="">Select a project</option>
        {Array.isArray(projects) && projects.length > 0 ? (
          projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title || `Project ${project.id}`}
            </option>
          ))
        ) : (
          <option value="" disabled>No projects available</option>
        )}
      </Select>

      <Input
        label="Due Date"
        type="date"
        {...register('due_date')}
        error={errors.due_date?.message}
      />

      <Select
        label="Status"
        {...register('status', { required: 'Status is required' })}
        error={errors.status?.message}
      >
        <option value="todo">Todo</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </Select>

      {Array.isArray(tags) && tags.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <div className="border border-gray-300 rounded-lg p-2 max-h-32 overflow-y-auto">
            <input
              type="hidden"
              {...register('tags')}
              value={JSON.stringify(selectedTags)}
            />
            {tags.map((tag) => (
              <label
                key={tag.id}
                className="flex items-center space-x-2 py-1 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag.id)}
                  onChange={() => handleTagToggle(tag.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{tag.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 justify-end pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update'}
        </Button>
      </div>
    </form>
  );
}

