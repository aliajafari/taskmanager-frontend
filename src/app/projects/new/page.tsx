'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateProject } from '@/features/projects/hooks/useProjects';
import { ProjectForm } from '@/features/projects/components/ProjectForm';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { Error } from '@/components/ui/error';
import { CreateProjectDto } from '@/features/projects/api/projects';

export default function NewProjectPage() {
  const router = useRouter();
  const createProject = useCreateProject();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (data: CreateProjectDto) => {
    try {
      setErrorMessage(null);
      await createProject.mutateAsync(data);
      router.push('/projects');
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to create project. Please try again.';
      setErrorMessage(message);
      console.error('Error creating project:', error);
    }
  };

  const handleCancel = () => {
    router.push('/projects');
  };

  if (createProject.isPending) {
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
            ← Back to Projects
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {errorMessage && <Error message={errorMessage} />}
          <ProjectForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={createProject.isPending}
          />
        </div>
      </div>
    </div>
  );
}

