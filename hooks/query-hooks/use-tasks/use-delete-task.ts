"use client";
import { toast } from "@/components/toast";
import { useSelectedTaskContext } from "@/context/use-selected-task-context";
import { api } from "@/utils/api";
import { type TaskType } from "@/utils/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import { TOO_MANY_REQUESTS } from ".";

const useDeleteTask = () => {
  const { taskKey, setTaskKey } = useSelectedTaskContext();

  const queryClient = useQueryClient();

  const { mutate: deleteTask, isLoading: isDeleting } = useMutation(
    api.tasks.deleteTask,
    {
      // OPTIMISTIC UPDATE
      onMutate: async (deletedTask) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries({ queryKey: ["tasks"] });
        // Snapshot the previous value
        const previousTasks = queryClient.getQueryData(["tasks"]);
        // Optimistically delete the task
        queryClient.setQueryData(["tasks"], (old: TaskType[] | undefined) => {
          return old?.filter((task) => task.id !== deletedTask.taskId);
        });
        // Return a context object with the snapshotted value
        return { previousTasks };
      },
      onError: (err: AxiosError, deletedTask, context) => {
        // If the mutation fails, use the context returned from onMutate to roll back
        if (err?.response?.data == "Too many requests") {
          toast.error(TOO_MANY_REQUESTS);
          return;
        }
        toast.error({
          message: `Something went wrong while deleting the task ${deletedTask.taskId}`,
          description: "Please try again later.",
        });
        queryClient.setQueryData(["tasks"], context?.previousTasks);
      },
      onSettled: (deletedTask) => {
        // Always refetch after error or success
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        queryClient.invalidateQueries(["tasks"]);

        // Unselect the deleted task if it is currently selected
        if (taskKey == deletedTask?.key) {
          setTaskKey(null);
        }
      },
    }
  );
  return { deleteTask, isDeleting };
};

export { useDeleteTask };
