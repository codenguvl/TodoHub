"use client";
import { toast } from "@/components/toast";
import { api } from "@/utils/api";
import { type TaskType } from "@/utils/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import { TOO_MANY_REQUESTS } from ".";

const useUpdateTask = () => {
  const queryClient = useQueryClient();

  const { mutate: updateTask, isLoading: isUpdating } = useMutation(
    ["tasks"],
    api.tasks.patchTask,
    {
      // OPTIMISTIC UPDATE
      onMutate: async (newTask) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(["tasks"]);
        // Snapshot the previous value
        const previousTasks = queryClient.getQueryData<TaskType[]>(["tasks"]);

        queryClient.setQueryData(["tasks"], (old?: TaskType[]) => {
          const newTasks = (old ?? []).map((task) => {
            const { taskId, ...updatedProps } = newTask;
            if (task.id === taskId) {
              // Assign the new prop values to the task
              return Object.assign(task, updatedProps);
            }
            return task;
          });
          return newTasks;
        });
        // }
        // Return a context object with the snapshotted value
        return { previousTasks };
      },
      onError: (err: AxiosError, newTask, context) => {
        // If the mutation fails, use the context returned from onMutate to roll back
        queryClient.setQueryData(["tasks"], context?.previousTasks);

        if (err?.response?.data == "Too many requests") {
          toast.error(TOO_MANY_REQUESTS);
          return;
        }

        toast.error({
          message: `Something went wrong while updating the task ${newTask.taskId}`,
          description: "Please try again later.",
        });
      },
      onSettled: () => {
        // Always refetch after error or success
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        queryClient.invalidateQueries(["tasks"]);
      },
    }
  );

  return { updateTask, isUpdating };
};

export { useUpdateTask };
