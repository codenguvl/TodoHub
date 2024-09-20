"use client";
import { api } from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelectedTaskContext } from "@/context/use-selected-task-context";
import { type GetTaskCommentsResponse } from "@/app/api/tasks/[taskId]/comments/route";
import { toast } from "@/components/toast";
import { type AxiosError } from "axios";
import { TOO_MANY_REQUESTS, useTasks } from "./use-tasks";
import { useCallback, useEffect, useState } from "react";
import { type TaskType } from "@/utils/types";

export const useTaskDetails = () => {
  const { taskKey } = useSelectedTaskContext();
  const { tasks } = useTasks();

  const getTaskId = useCallback(
    (tasks: TaskType[] | undefined) => {
      return tasks?.find((task) => task.key === taskKey)?.id ?? null;
    },
    [taskKey]
  );

  const [taskId, setTaskId] = useState<TaskType["id"] | null>(() =>
    getTaskId(tasks)
  );

  useEffect(() => {
    setTaskId(getTaskId(tasks));
  }, [setTaskId, getTaskId, tasks]);

  const queryClient = useQueryClient();

  // GET
  const { data: comments, isLoading: commentsLoading } = useQuery(
    ["tasks", "comments", taskId],
    () => api.tasks.getTaskComments({ taskId: taskId ?? "" }),
    {
      enabled: !!taskId,
      refetchOnMount: false,
    }
  );

  // POST
  const { mutate: addComment, isLoading: isAddingComment } = useMutation(
    api.tasks.addCommentToTask,
    {
      onSuccess: () => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        queryClient.invalidateQueries(["tasks", "comments", taskId]);
      },
      onError: (err: AxiosError) => {
        if (err?.response?.data == "Too many requests") {
          toast.error(TOO_MANY_REQUESTS);
          return;
        }
        toast.error({
          message: `Something went wrong while creating comment`,
          description: "Please try again later.",
        });
      },
    }
  );

  const { mutate: updateComment, isLoading: commentUpdating } = useMutation(
    api.tasks.updateTaskComment,
    {
      onMutate: async (newComment) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(["tasks", "comments", taskId]);
        // Snapshot the previous value
        const previousComments = queryClient.getQueryData<
          GetTaskCommentsResponse["comments"]
        >(["tasks", "comments", taskId]);
        // Optimistically update the comment
        queryClient.setQueryData(
          ["tasks", "comments", taskId],
          (old?: GetTaskCommentsResponse["comments"]) => {
            const newComments = (old ?? []).map((comment) => {
              const { content } = newComment;
              if (comment.id === newComment.commentId) {
                // Assign the new prop values to the comment
                return { ...comment, content };
              }
              return comment;
            });
            return newComments;
          }
        );
        // Return a context object with the snapshotted value
        return { previousComments };
      },
      onError: (err: AxiosError, newTask, context) => {
        // If the mutation fails, use the context returned from onMutate to roll back
        queryClient.setQueryData(
          ["tasks", "comments", taskId],
          context?.previousComments
        );

        if (err?.response?.data == "Too many requests") {
          toast.error(TOO_MANY_REQUESTS);
          return;
        }

        toast.error({
          message: `Something went wrong while updating comment`,
          description: "Please try again later.",
        });
      },
      onSettled: () => {
        // Always refetch after error or success
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        queryClient.invalidateQueries(["tasks", "comments", taskId]);
      },
    }
  );

  const { mutate: deleteComment, isLoading: isDeletingComment } = useMutation(
    api.tasks.deleteComment,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["tasks", "comments", taskId]);
      },
      onError: (err: AxiosError) => {
        if (err?.response?.data == "Too many requests") {
          toast.error(TOO_MANY_REQUESTS);
          return;
        }
        toast.error({
          message: `Something went wrong while deleting comment`,
          description: "Please try again later.",
        });
      },
    }
  );

  return {
    comments,
    commentsLoading,
    addComment,
    isAddingComment,
    updateComment,
    commentUpdating,
    deleteComment,
    isDeletingComment,
  };
};
