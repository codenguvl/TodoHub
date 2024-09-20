"use client";
import { toast } from "@/components/toast";
import { api } from "@/utils/api";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import { TOO_MANY_REQUESTS } from ".";

const usePostTask = () => {
  const queryClient = useQueryClient();

  const { mutate: createTask, isLoading: isCreating } = useMutation(
    api.tasks.postTask,
    {
      // NO OPTIMISTIC UPDATE BECAUSE WE DON'T KNOW THE KEY OF THE NEW TASK
      onError: (err: AxiosError, createdTask) => {
        // If the mutation fails, use the context returned from onMutate to roll back
        if (err?.response?.data == "Too many requests") {
          toast.error(TOO_MANY_REQUESTS);
          return;
        }
        toast.error({
          message: `Something went wrong while creating the task ${createdTask.name}`,
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
  return { createTask, isCreating };
};

export { usePostTask };
