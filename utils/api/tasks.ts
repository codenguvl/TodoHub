import axios from "axios";
import { getBaseUrl, getHeaders } from "../helpers";
import {
  type PatchTasksBody,
  type GetTasksResponse,
  type PostTaskBody,
} from "@/app/api/tasks/route";
import {
  type PatchTaskBody,
  type GetTaskDetailsResponse,
  type PatchTaskResponse,
  type PostTaskResponse,
} from "@/app/api/tasks/[taskId]/route";
import {
  type GetTaskCommentResponse,
  type GetTaskCommentsResponse,
  type PostCommentBody,
} from "@/app/api/tasks/[taskId]/comments/route";

const baseUrl = getBaseUrl();

export const tasksRoutes = {
  getTasks: async ({
    signal,
    projectId,
  }: {
    signal?: AbortSignal;
    projectId?: string;
  }) => {
    const { data } = await axios.get<GetTasksResponse>(
      `${baseUrl}/api/tasks?projectId=${projectId}`,
      {
        signal,
      }
    );
    return data?.tasks;
  },
  updateBatchTasks: async (body: PatchTasksBody) => {
    const { data } = await axios.patch<GetTasksResponse>(
      `${baseUrl}/api/tasks`,
      body,
      { headers: getHeaders() }
    );
    return data?.tasks;
  },
  getTaskDetails: async ({ taskId }: { taskId: string }) => {
    const { data } = await axios.get<GetTaskDetailsResponse>(
      `${baseUrl}/api/tasks/${taskId}`
    );
    return data?.task;
  },
  postTask: async (body: PostTaskBody) => {
    const { data } = await axios.post<PostTaskResponse>(
      `${baseUrl}/api/tasks`,
      body,
      { headers: getHeaders() }
    );

    return data?.task;
  },
  patchTask: async ({
    taskId,
    ...body
  }: { taskId: string } & PatchTaskBody) => {
    const { data } = await axios.patch<PatchTaskResponse>(
      `${baseUrl}/api/tasks/${taskId}`,
      body,
      { headers: getHeaders() }
    );

    return data?.task;
  },
  deleteTask: async ({ taskId }: { taskId: string }) => {
    const { data } = await axios.delete<PostTaskResponse>(
      `${baseUrl}/api/tasks/${taskId}`,
      { headers: getHeaders() }
    );

    return data?.task;
  },
  addCommentToTask: async (
    payload: {
      taskId: string;
    } & PostCommentBody
  ) => {
    const { taskId, content, authorId } = payload;
    const { data } = await axios.post<GetTaskCommentResponse>(
      `${baseUrl}/api/tasks/${taskId}/comments`,
      { content, authorId },
      { headers: getHeaders() }
    );

    return data?.comment;
  },
  getTaskComments: async ({ taskId }: { taskId: string }) => {
    const { data } = await axios.get<GetTaskCommentsResponse>(
      `${baseUrl}/api/tasks/${taskId}/comments`
    );

    return data?.comments;
  },

  updateTaskComment: async ({
    taskId,
    content,
    commentId,
  }: {
    taskId: string;
    commentId: string;
    content: string;
  }) => {
    const { data } = await axios.patch<GetTaskCommentResponse>(
      `${baseUrl}/api/tasks/${taskId}/comments/${commentId}`,
      { content },
      { headers: getHeaders() }
    );
    return data?.comment;
  },

  deleteComment: async ({
    taskId,
    commentId,
  }: {
    taskId: string;
    commentId: string;
  }) => {
    const { data } = await axios.delete<GetTaskCommentResponse>(
      `${baseUrl}/api/tasks/${taskId}/comments/${commentId}`,
      { headers: getHeaders() }
    );

    return data?.comment;
  },
};
