"use client";
import { toast } from "@/components/toast";
import { api } from "@/utils/api";
import { type WorkPeriod } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import { TOO_MANY_REQUESTS } from "./use-tasks";

export const useWorkPeriods = () => {
  const queryClient = useQueryClient();

  // GET
  const { data: workPeriods, isLoading: workPeriodsLoading } = useQuery(
    ["workPeriods"],
    api.workPeriods.getWorkPeriods,
    {
      refetchOnMount: false,
    }
  );

  // UPDATE
  const { mutate: updateWorkPeriod, isLoading: isUpdating } = useMutation(
    api.workPeriods.patchWorkPeriod,
    {
      // OPTIMISTIC UPDATE
      onMutate: async (newWorkPeriod) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(["workPeriods"]);
        // Snapshot the previous value
        const previousWorkPeriods = queryClient.getQueryData<WorkPeriod[]>([
          "workPeriods",
        ]);
        // Optimistically update the work period

        // Otherwise, we are generically updating the work period
        queryClient.setQueryData(["workPeriods"], (old?: WorkPeriod[]) => {
          const newWorkPeriods = (old ?? []).map((workPeriod) => {
            const { workPeriodId, ...updatedProps } = newWorkPeriod;
            if (workPeriod.id === workPeriodId) {
              // Assign the new prop values to the work period
              return Object.assign(workPeriod, updatedProps);
            }
            return workPeriod;
          });
          return newWorkPeriods;
        });

        // Return a context object with the snapshotted value
        return { previousWorkPeriods };
      },
      onError: (err: AxiosError, newWorkPeriod, context) => {
        // If the mutation fails, use the context returned from onMutate to roll back
        queryClient.setQueryData(["workPeriods"], context?.previousWorkPeriods);

        if (err?.response?.data == "Too many requests") {
          toast.error(TOO_MANY_REQUESTS);
          return;
        }
        toast.error({
          message: `Something went wrong while updating work period ${newWorkPeriod.workPeriodId}`,
          description: "Please try again later.",
        });
      },
      onSettled: () => {
        // Always refetch after error or success
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        queryClient.invalidateQueries(["workPeriods"]);
      },
    }
  );

  // POST
  const { mutate: createWorkPeriod, isLoading: isCreating } = useMutation(
    api.workPeriods.postWorkPeriod,
    {
      // NO OPTIMISTIC UPDATE BECAUSE WE DON'T KNOW THE KEY OF THE NEW WORK PERIOD
      onError: (err: AxiosError) => {
        // If the mutation fails, use the context returned from onMutate to roll back
        if (err?.response?.data == "Too many requests") {
          toast.error(TOO_MANY_REQUESTS);
          return;
        }
        toast.error({
          message: `Something went wrong while creating work period`,
          description: "Please try again later.",
        });
      },
      onSettled: () => {
        // Always refetch after error or success
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        queryClient.invalidateQueries(["workPeriods"]);
      },
    }
  );

  // DELETE
  const { mutate: deleteWorkPeriod, isLoading: isDeleting } = useMutation(
    api.workPeriods.deleteWorkPeriod,
    {
      // OPTIMISTIC UPDATE
      onMutate: async (deletedWorkPeriod) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries({ queryKey: ["workPeriods"] });
        // Snapshot the previous value
        const previousWorkPeriods = queryClient.getQueryData<WorkPeriod[]>([
          "workPeriods",
        ]);
        // Optimistically delete the work period
        queryClient.setQueryData(
          ["workPeriods"],
          (old: WorkPeriod[] | undefined) => {
            return old?.filter(
              (workPeriod) => workPeriod.id !== deletedWorkPeriod.workPeriodId
            );
          }
        );
        // Return a context object with the snapshotted value
        return { previousWorkPeriods };
      },
      onError: (err: AxiosError, deletedWorkPeriod, context) => {
        // If the mutation fails, use the context returned from onMutate to roll back
        if (err?.response?.data == "Too many requests") {
          toast.error(TOO_MANY_REQUESTS);
          return;
        }
        toast.error({
          message: `Something went wrong while deleting the work period ${deletedWorkPeriod.workPeriodId}`,
          description: "Please try again later.",
        });
        queryClient.setQueryData(["workPeriods"], context?.previousWorkPeriods);
      },
      onSettled: () => {
        // Always refetch after error or success
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        queryClient.invalidateQueries(["workPeriods"]);
      },
    }
  );

  return {
    workPeriods,
    workPeriodsLoading,
    updateWorkPeriod,
    isUpdating,
    createWorkPeriod,
    isCreating,
    deleteWorkPeriod,
    isDeleting,
  };
};
