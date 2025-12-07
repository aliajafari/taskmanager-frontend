'use client';

import { useRouter } from 'next/navigation';
import { useCreateTask } from '@/features/tasks/hooks/useTasks';
import { useProjects } from '@/features/projects/hooks/useProjects';
import { CreateTaskForm } from '@/features/tasks/components/CreateTaskForm';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { Error } from '@/components/ui/error';
import { CreateTaskDto } from '@/features/tasks/api/tasks';
import { useMemo } from 'react';
import { useTasks } from '@/features/tasks/hooks/useTasks';

export default function NewTaskPage() {
  const router = useRouter();
  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const createTask = useCreateTask();

  const allTags = useMemo(() => {
    if (!Array.isArray(tasks)) {
      return [];
    }
    const tagMap = new Map<number, { id: number; name: string }>();
    tasks.forEach((task) => {
      task.tags?.forEach((tag) => {
        tagMap.set(tag.id, tag);
      });
    });
    return Array.from(tagMap.values());
  }, [tasks]);

  const handleSubmit = async (data: CreateTaskDto) => {
    try {
      await createTask.mutateAsync(data);
      router.push('/tasks');
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleCancel = () => {
    router.push('/tasks');
  };

  if (tasksLoading || projectsLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button
            variant="secondary"
            onClick={handleCancel}
            className="mb-4"
          >
            ← Back to Tasks
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Task</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <CreateTaskForm
            projects={projects}
            tags={allTags}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={createTask.isPending}
          />
        </div>
      </div>
    </div>
  );
}

