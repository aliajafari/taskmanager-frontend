'use client';

import { useRouter, useParams } from 'next/navigation';
import { useProject, useUpdateProject } from '@/features/projects/hooks/useProjects';
import { ProjectForm } from '@/features/projects/components/ProjectForm';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { Error } from '@/components/ui/error';
import { CreateProjectDto } from '@/features/projects/api/projects';

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = Number(params.id);

  const { data: project, isLoading: projectLoading, error: projectError } = useProject(projectId);
  const updateProject = useUpdateProject();

  const handleSubmit = async (data: CreateProjectDto) => {
    try {
      await updateProject.mutateAsync({ id: projectId, data });
      router.push('/projects');
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleCancel = () => {
    router.push('/projects');
  };

  if (projectLoading) {
    return <Loading />;
  }

  if (projectError || !project) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Error message="Project not found or failed to load." />
          <Button variant="secondary" onClick={handleCancel} className="mt-4">
            ← Back to Projects
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
            ← Back to Projects
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Project</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <ProjectForm
            key={project.id}
            project={project}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={updateProject.isPending}
          />
        </div>
      </div>
    </div>
  );
}

