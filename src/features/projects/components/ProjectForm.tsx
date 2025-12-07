'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useId } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CreateProjectDto, Project } from '../api/projects';

interface ProjectFormProps {
  project?: Project;
  onSubmit: (data: CreateProjectDto) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProjectForm({
  project,
  onSubmit,
  onCancel,
  isLoading,
}: ProjectFormProps) {
  const descriptionId = useId();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateProjectDto>({
    defaultValues: {},
  });

  useEffect(() => {
    if (project) {
      reset({
        title: project.title || project.name || '',
        name: project.name || project.title || '',
        description: project.description || '',
      });
    }
  }, [project, reset]);

  const handleFormSubmit = (data: CreateProjectDto) => {
    const submitData: CreateProjectDto = {
      title: data.title || data.name,
      name: data.title || data.name,
      description: data.description,
    };
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        label="Project Name"
        {...register('title', { 
          required: 'Project name is required',
          minLength: {
            value: 1,
            message: 'Project name is required',
          },
        })}
        error={errors.title?.message || errors.name?.message}
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

      <div className="flex gap-2 justify-end pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : project ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}

