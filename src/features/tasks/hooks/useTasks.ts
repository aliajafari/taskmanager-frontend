import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi, Task, CreateTaskDto, UpdateTaskDto } from '../api/tasks';

export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: () => tasksApi.getAll(),
  });
};

export const useTask = (id: number) => {
  return useQuery({
    queryKey: ['tasks', id],
    queryFn: () => tasksApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskDto) => tasksApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTaskDto }) =>
      tasksApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.id] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => tasksApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

