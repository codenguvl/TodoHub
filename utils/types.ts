import { type GetTasksResponse } from "@/app/api/tasks/route";

export type TaskCountType = {
  TODO: number;
  IN_PROGRESS: number;
  DONE: number;
};

export type MenuOptionType = {
  label: string;
  id: string;
};

export type TaskType = GetTasksResponse["tasks"][number];
