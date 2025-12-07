'use client';

import { useRouter, useParams } from 'next/navigation';
import { useTask, useUpdateTask } from '@/features/tasks/hooks/useTasks';
import { useProjects } from '@/features/projects/hooks/useProjects';
import { EditTaskForm } from '@/features/tasks/components/EditTaskForm';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { Error } from '@/components/ui/error';
import { CreateTaskDto } from '@/features/tasks/api/tasks';
import { useMemo } from 'react';
import { useTasks } from '@/features/tasks/hooks/useTasks';

export default function EditTaskPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = Number(params.id);

  const { data: task, isLoading: taskLoading, error: taskError } = useTask(taskId);
  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const updateTask = useUpdateTask();

  const allTags = useMemo(() => {
    if (!Array.isArray(tasks)) {
      return [];
    }
    const tagMap = new Map<number, { id: number; name: string }>();
    tasks.forEach((t) => {
      t.tags?.forEach((tag) => {
        tagMap.set(tag.id, tag);
      });
    });
    return Array.from(tagMap.values());
  }, [tasks]);

  const handleSubmit = async (data: CreateTaskDto) => {
    try {
      await updateTask.mutateAsync({ id: taskId, data });
      router.push('/tasks');
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleCancel = () => {
    router.push('/tasks');
  };

  if (taskLoading || tasksLoading || projectsLoading) {
    return <Loading />;
  }

  if (taskError || !task) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Error message="Task not found or failed to load." />
          <Button variant="secondary" onClick={handleCancel} className="mt-4">
            ← Back to Tasks
          </Button>
        </div>
      </div>
    );
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
          <h1 className="text-3xl font-bold text-gray-900">Edit Task</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <EditTaskForm
            key={task.id}
            task={task}
            projects={projects}
            tags={allTags}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={updateTask.isPending}
          />
        </div>
      </div>
    </div>
  );
}

