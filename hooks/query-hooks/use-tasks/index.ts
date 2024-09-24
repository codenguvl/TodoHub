"use client";
import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useUpdateTask } from "./use-update-task";
import { useUpdateTasksBatch } from "./use-update-batch";
import { usePostTask } from "./use-post-task";
import { useDeleteTask } from "./use-delete-task";
import { useProject } from "../use-project";

export const TOO_MANY_REQUESTS = {
  message: `You have exceeded the number of requests allowed per minute.`,
  description: "Please try again later.",
};

export const useTasks = () => {
  const { project } = useProject();
  let projectId = project?.id;
  const { data: tasks, isLoading: tasksLoading } = useQuery(
    ["tasks"],
    ({ signal }) => api.tasks.getTasks({ signal, projectId }),
    {
      refetchOnMount: false,
    }
  );

  const { updateTasksBatch, batchUpdating } = useUpdateTasksBatch();
  const { updateTask, isUpdating } = useUpdateTask();
  const { createTask, isCreating } = usePostTask();
  const { deleteTask, isDeleting } = useDeleteTask();

  return {
    tasks,
    tasksLoading,
    updateTask,
    isUpdating,
    updateTasksBatch,
    batchUpdating,
    createTask,
    isCreating,
    deleteTask,
    isDeleting,
  };
};
