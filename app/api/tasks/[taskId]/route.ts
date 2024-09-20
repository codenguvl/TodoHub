import { type NextRequest, NextResponse } from "next/server";
import { prisma, ratelimit } from "@/server/db";
import {
  TaskStatus,
  type Task,
  TaskType,
  type DefaultUser,
} from "@prisma/client";
import { z } from "zod";
import { type GetTasksResponse } from "../route";
import { clerkClient } from "@clerk/nextjs/server";
import { filterUserForClient } from "@/utils/helpers";
import { getAuth } from "@clerk/nextjs/server";

export type GetTaskDetailsResponse = {
  task: GetTasksResponse["tasks"][number] | null;
};

export type PostTaskResponse = { task: Task };

export async function GET(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  const { taskId } = params;
  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
  });
  if (!task?.parentId) {
    return NextResponse.json({ task: { ...task, parent: null } });
  }
  const parent = await prisma.task.findUnique({
    where: {
      id: task.parentId,
    },
  });
  return NextResponse.json({ task: { ...task, parent } });
}

const patchTaskBodyValidator = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  type: z.nativeEnum(TaskType).optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  workPeriodPosition: z.number().optional(),
  boardPosition: z.number().optional(),
  assigneeId: z.string().nullable().optional(),
  reporterId: z.string().optional(),
  parentId: z.string().nullable().optional(),
  workPeriodId: z.string().nullable().optional(),
  isDeleted: z.boolean().optional(),
  workPeriodColor: z.string().optional(),
});

export type PatchTaskBody = z.infer<typeof patchTaskBodyValidator>;
export type PatchTaskResponse = {
  task: Task & { assignee: DefaultUser | null };
};

type ParamsType = {
  params: {
    taskId: string;
  };
};

export async function PATCH(req: NextRequest, { params }: ParamsType) {
  const { userId } = getAuth(req);
  if (!userId) return new Response("Unauthenticated request", { status: 403 });
  const { success } = await ratelimit.limit(userId);
  if (!success) return new Response("Too many requests", { status: 429 });
  const { taskId } = params;

  const body = await req.json();
  const validated = patchTaskBodyValidator.safeParse(body);

  if (!validated.success) {
    const message = "Invalid body. " + validated.error.errors[0]?.message ?? "";
    return new Response(message, { status: 400 });
  }
  const { data: valid } = validated;

  const currentTask = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
  });

  if (!currentTask) {
    return new Response("Task not found", { status: 404 });
  }

  const task = await prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      name: valid.name ?? undefined,
      description: valid.description ?? undefined,
      status: valid.status ?? undefined,
      type: valid.type ?? undefined,
      workPeriodPosition: valid.workPeriodPosition ?? undefined,
      assigneeId: valid.assigneeId === undefined ? undefined : valid.assigneeId,
      reporterId: valid.reporterId ?? undefined,
      isDeleted: valid.isDeleted ?? undefined,
      workPeriodId:
        valid.workPeriodId === undefined ? undefined : valid.workPeriodId,
      parentId: valid.parentId === undefined ? undefined : valid.parentId,
      workPeriodColor: valid.workPeriodColor ?? undefined,
      boardPosition: valid.boardPosition ?? undefined,
    },
  });

  if (task.assigneeId) {
    const assignee = await clerkClient.users.getUser(task.assigneeId);
    const assigneeForClient = filterUserForClient(assignee);
    return NextResponse.json({
      task: { ...task, assignee: assigneeForClient },
    });
  }

  return NextResponse.json({
    task: { ...task, assignee: null },
  });
}

export async function DELETE(req: NextRequest, { params }: ParamsType) {
  const { userId } = getAuth(req);
  if (!userId) return new Response("Unauthenticated request", { status: 403 });
  const { success } = await ratelimit.limit(userId);
  if (!success) return new Response("Too many requests", { status: 429 });

  const { taskId } = params;

  const task = await prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      isDeleted: true,
      boardPosition: -1,
      workPeriodPosition: -1,
      workPeriodId: "DELETED-WORKPERIOD-ID",
    },
  });

  return NextResponse.json({ task });
}
