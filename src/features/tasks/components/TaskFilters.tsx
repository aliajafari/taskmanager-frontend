'use client';

import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Project } from '@/features/projects/api/projects';
import { Tag } from '../api/tasks';

interface TaskFiltersProps {
  projects: Project[];
  tags: Tag[];
  selectedProjectId: string;
  selectedTagId: string;
  selectedDueDate: string;
  onProjectChange: (projectId: string) => void;
  onTagChange: (tagId: string) => void;
  onDueDateChange: (dueDate: string) => void;
  onClearFilters: () => void;
}

export function TaskFilters({
  projects,
  tags,
  selectedProjectId,
  selectedTagId,
  selectedDueDate,
  onProjectChange,
  onTagChange,
  onDueDateChange,
  onClearFilters,
}: TaskFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <Select
            label="Filter by Project"
            value={selectedProjectId}
            onChange={(e) => onProjectChange(e.target.value)}
          >
          <option value="">All Projects</option>
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
        </div>

        <div className="flex-1 min-w-[200px]">
          <Select
            label="Filter by Tag"
            value={selectedTagId}
            onChange={(e) => onTagChange(e.target.value)}
          >
          <option value="">All Tags</option>
          {Array.isArray(tags) &&
            tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <Input
            label="Filter by Due Date"
            type="date"
            value={selectedDueDate}
            onChange={(e) => onDueDateChange(e.target.value)}
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          onClick={onClearFilters}
          disabled={!selectedProjectId && !selectedTagId && !selectedDueDate}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}

