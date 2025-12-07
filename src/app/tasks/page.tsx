'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTasks, useDeleteTask } from '@/features/tasks/hooks/useTasks';
import { useProjects } from '@/features/projects/hooks/useProjects';
import { useLogout } from '@/features/auth/hooks/useAuth';
import { TaskCard } from '@/features/tasks/components/TaskCard';
import { TaskFilters } from '@/features/tasks/components/TaskFilters';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { Error } from '@/components/ui/error';
import { Task } from '@/features/tasks/api/tasks';
import { filterTasks, sortTasksByDueDate } from '@/features/tasks/utils/filterTasks';

export default function TasksPage() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    projectId: '',
    tagId: '',
    dueDate: '',
  });

  const { data: tasks = [], isLoading: tasksLoading, error: tasksError } = useTasks();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const deleteTask = useDeleteTask();
  const logout = useLogout();

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

  const filteredAndSortedTasks = useMemo(() => {
    if (!Array.isArray(tasks)) {
      return [];
    }
    const filterParams = {
      projectId: filters.projectId ? Number(filters.projectId) : undefined,
      tagId: filters.tagId ? Number(filters.tagId) : undefined,
      dueDate: filters.dueDate || undefined,
    };

    const filtered = filterTasks(tasks, filterParams);
    return sortTasksByDueDate(filtered);
  }, [tasks, filters]);

  const handleCreateTask = () => {
    router.push('/tasks/new');
  };

  const handleEditTask = (task: Task) => {
    router.push(`/tasks/${task.id}/edit`);
  };

  const handleDeleteTask = async (id: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask.mutateAsync(id);
    }
  };

  const handleLogout = () => {
    logout.mutate();
  };

  if (tasksLoading || projectsLoading) {
    return <Loading />;
  }

  if (tasksError) {
    return <Error message="Failed to load tasks. Please try again." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="secondary"
                onClick={() => router.push('/projects')}
              >
                Projects
              </Button>
              <Button
                variant="secondary"
                onClick={() => router.push('/projects/new')}
              >
                Create New Project
              </Button>
              <Button onClick={handleCreateTask}>Create New Task</Button>
              <Button
                variant="secondary"
                onClick={handleLogout}
                disabled={logout.isPending}
              >
                {logout.isPending ? 'Logging out...' : 'Logout'}
              </Button>
            </div>
          </div>
        </div>

        <TaskFilters
          projects={projects}
          tags={allTags}
          selectedProjectId={filters.projectId}
          selectedTagId={filters.tagId}
          selectedDueDate={filters.dueDate}
          onProjectChange={(projectId) =>
            setFilters({ ...filters, projectId })
          }
          onTagChange={(tagId) => setFilters({ ...filters, tagId })}
          onDueDateChange={(dueDate) =>
            setFilters({ ...filters, dueDate })
          }
          onClearFilters={() =>
            setFilters({ projectId: '', tagId: '', dueDate: '' })
          }
        />

        {filteredAndSortedTasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-lg">
              {!Array.isArray(tasks) || tasks.length === 0
                ? 'No tasks found. Create your first task!'
                : 'No tasks match the selected filters.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {filteredAndSortedTasks.map((task) => {
              const foundProject = task.project || projects.find((p) => p.id === task.project_id);
              const project = foundProject
                ? {
                    id: foundProject.id,
                    name:
                      ('name' in foundProject && foundProject.name) ||
                      ('title' in foundProject && foundProject.title) ||
                      `Project ${foundProject.id}`,
                  }
                : undefined;
              const taskWithProject: Task = { ...task, project };
              return (
                <div key={task.id} className="w-full md:w-[calc(33.333%-12px)] lg:w-[calc(25%-12px)] flex">
                  <TaskCard
                    task={taskWithProject}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

