'use client';

import { useRouter } from 'next/navigation';
import { useProjects } from '@/features/projects/hooks/useProjects';
import { useLogout } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { Error } from '@/components/ui/error';
import { Project } from '@/features/projects/api/projects';

export default function ProjectsPage() {
  const router = useRouter();
  const { data: projects = [], isLoading, error } = useProjects();
  const logout = useLogout();

  const handleCreateProject = () => {
    router.push('/projects/new');
  };

  const handleEditProject = (project: Project) => {
    router.push(`/projects/${project.id}/edit`);
  };

  const handleLogout = () => {
    logout.mutate();
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error message="Failed to load projects. Please try again." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Projects</h1>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              onClick={() => router.push('/tasks')}
            >
              Tasks
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.push('/projects/new')}
            >
              Create New Project
            </Button>
            <Button onClick={() => router.push('/tasks/new')}>
              Create New Task
            </Button>
            <Button
              variant="secondary"
              onClick={handleLogout}
              disabled={logout.isPending}
            >
              {logout.isPending ? 'Logging out...' : 'Logout'}
            </Button>
          </div>
        </div>

        {!Array.isArray(projects) || projects.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-lg">
              No projects found. Create your first project!
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex-1 min-w-[300px] max-w-[400px] h-full flex flex-col bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {project.title}
                  </h3>
                </div>

                {project.description && (
                  <p className="text-gray-600 text-sm mb-3 grow">{project.description}</p>
                )}

                <div className="flex gap-2 pt-2 border-t mt-auto">
                  <Button
                    variant="secondary"
                    onClick={() => handleEditProject(project)}
                    className="flex-1 text-sm"
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

