import { type TaskCountType } from "./types";
import { type TaskType } from "@/utils/types";
import { type clerkClient } from "@clerk/nextjs/server";
import { type DefaultUser, type Task } from "@prisma/client";

type Value<T> = T extends Promise<infer U> ? U : T;

export function getBaseUrl() {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
}

export function getHeaders() {
  return {
    "Content-type": "application/json",
  };
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function capitalizeMany(str: string) {
  return str
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
}

export function getTaskCountByStatus(tasks: TaskType[]) {
  return tasks.reduce(
    (acc, task) => {
      acc[task.status]++;
      return acc;
    },
    {
      TODO: 0,
      IN_PROGRESS: 0,
      DONE: 0,
    } as TaskCountType
  );
}

export function isInitiative(task: TaskType | TaskType["parent"] | null) {
  if (!task) return false;
  return task.type == "INITIATIVE";
}

export function isSubtask(task: TaskType | null) {
  if (!task) return false;
  return task.type == "SUBTASK";
}

export function hasChildren(task: TaskType | TaskType["parent"] | null) {
  if (!task) return false;
  return task.children.length > 0;
}

export function workPeriodId(id: string | null | undefined) {
  return id == "backlog" ? null : id;
}

export function isNullish<T>(
  value: T | null | undefined
): value is null | undefined {
  return value == null || value == undefined;
}

export function filterUserForClient(
  user: Value<ReturnType<Awaited<typeof clerkClient.users.getUser>>>
) {
  return <DefaultUser>{
    id: user.id,
    name: `${user.firstName ?? ""} ${user.lastName ?? ""}`,
    email: user?.emailAddresses[0]?.emailAddress ?? "",
    avatar: user.imageUrl,
  };
}

export function taskNotInSearch({
  task,
  search,
}: {
  task: TaskType;
  search: string;
}) {
  return (
    search.length &&
    !(
      task.name.toLowerCase().includes(search.toLowerCase()) ||
      task.assignee?.name.toLowerCase().includes(search.toLowerCase()) ||
      task.key.toLowerCase().includes(search.toLowerCase())
    )
  );
}

export function assigneeNotInFilters({
  task,
  assignees,
}: {
  task: TaskType;
  assignees: string[];
}) {
  return (
    assignees.length && !assignees.includes(task.assignee?.id ?? "unassigned")
  );
}

export function initiativeNotInFilters({
  task,
  initiatives,
}: {
  task: TaskType;
  initiatives: string[];
}) {
  return (
    initiatives.length &&
    (!task.parentId || !initiatives.includes(task.parentId))
  );
}

export function taskTypeNotInFilters({
  task,
  taskTypes,
}: {
  task: TaskType;
  taskTypes: string[];
}) {
  return taskTypes.length && !taskTypes.includes(task.type);
}

export function taskWorkPeriodNotInFilters({
  task,
  workPeriodIds,
  excludeBacklog = false,
}: {
  task: TaskType;
  workPeriodIds: string[];
  excludeBacklog?: boolean;
}) {
  if (isNullish(task.workPeriodId)) {
    if (workPeriodIds.length && excludeBacklog) return true;
    return false;
  }
  return workPeriodIds.length && !workPeriodIds.includes(task.workPeriodId);
}

export function dateToLongString(date: Date) {
  const dateString = new Date(date).toDateString();
  const timeString = new Date(date).toLocaleTimeString();

  return dateString + " at " + timeString;
}

export function isDone(task: TaskType) {
  return task.status == "DONE";
}

export function hexToRgba(hex: string | null, opacity?: number) {
  if (!hex) return "rgba(0, 0, 0, 0)";
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity ?? 1})`;
}

export function generateTasksForClient(
  tasks: Task[],
  users: DefaultUser[],
  activeWorkPeriodIds?: string[]
) {
  // Maps are used to make lookups faster
  const userMap = new Map(users.map((user) => [user.id, user]));
  const parentMap = new Map(tasks.map((task) => [task.id, task]));

  const tasksForClient = tasks.map((task) => {
    const parent = parentMap.get(task.parentId ?? "") ?? null;
    const assignee = userMap.get(task.assigneeId ?? "") ?? null;
    const reporter = userMap.get(task.reporterId) ?? null;
    const children = tasks
      .filter((i) => i.parentId === task.id)
      .map((task) => {
        const assignee = userMap.get(task.assigneeId ?? "") ?? null;
        return Object.assign(task, { assignee });
      });
    const workPeriodIsActive = activeWorkPeriodIds?.includes(
      task.workPeriodId ?? ""
    );
    return {
      ...task,
      workPeriodIsActive,
      parent,
      assignee,
      reporter,
      children,
    };
  });

  return tasksForClient as TaskType[];
}

export function calculateInsertPosition(tasks: Task[]) {
  return Math.max(...tasks.map((task) => task.workPeriodPosition), 0) + 1;
}

export function moveItemWithinArray<T>(arr: T[], item: T, newIndex: number) {
  const arrClone = [...arr];
  const oldIndex = arrClone.indexOf(item);
  const oldItem = arrClone.splice(oldIndex, 1)[0];
  if (oldItem) arrClone.splice(newIndex, 0, oldItem);
  return arrClone;
}

export function insertItemIntoArray<T>(arr: T[], item: T, index: number) {
  const arrClone = [...arr];
  arrClone.splice(index, 0, item);
  return arrClone;
}

export function getPluralEnd<T>(arr: T[]) {
  if (arr.length == 0) return "s";
  return arr.length > 1 ? "s" : "";
}
