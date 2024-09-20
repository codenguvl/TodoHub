import { type NextRequest, NextResponse } from "next/server";
import { prisma, ratelimit } from "@/server/db";
import {
  TaskType,
  type Task,
  TaskStatus,
  type DefaultUser,
} from "@prisma/client";
import { z } from "zod";
import { getAuth } from "@clerk/nextjs/server";
import {
  calculateInsertPosition,
  filterUserForClient,
  generateTasksForClient,
} from "@/utils/helpers";
import { clerkClient } from "@clerk/nextjs/server";

const postTasksBodyValidator = z.object({
  name: z.string(),
  type: z.enum([
    "HIGH_PRIORITY",
    "MEDIUM_PRIORITY",
    "LOW_PRIORITY",
    "TASK",
    "SUBTASK",
    "INITIATIVE",
  ]),
  workPeriodId: z.string().nullable(),
  reporterId: z.string().nullable(),
  parentId: z.string().nullable(),
  workPeriodColor: z.string().nullable().optional(),
});

export type PostTaskBody = z.infer<typeof postTasksBodyValidator>;

const patchTasksBodyValidator = z.object({
  ids: z.array(z.string()),
  type: z.nativeEnum(TaskType).optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  assigneeId: z.string().nullable().optional(),
  reporterId: z.string().optional(),
  parentId: z.string().nullable().optional(),
  workPeriodId: z.string().nullable().optional(),
  isDeleted: z.boolean().optional(),
});

export type PatchTasksBody = z.infer<typeof patchTasksBodyValidator>;

type TaskT = Task & {
  children: TaskT[];
  workPeriodIsActive: boolean;
  parent: Task & {
    workPeriodIsActive: boolean;
    children: TaskT[];
    parent: null;
    assignee: DefaultUser | null;
    reporter: DefaultUser | null;
  };
  assignee: DefaultUser | null;
  reporter: DefaultUser | null;
};

export type GetTasksResponse = {
  tasks: TaskT[];
};

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);

  const activeTasks = await prisma.task.findMany({
    where: {
      creatorId: userId ?? "init",
      isDeleted: false,
    },
  });

  if (!activeTasks || activeTasks.length === 0) {
    return NextResponse.json({ tasks: [] });
  }

  const activeWorkPeriods = await prisma.workPeriod.findMany({
    where: {
      status: "ACTIVE",
    },
  });

  const userIds = activeTasks
    .flatMap((task) => [task.assigneeId, task.reporterId] as string[])
    .filter(Boolean);

  // USE THIS IF RUNNING LOCALLY -----------------------
  // const users = await prisma.defaultUser.findMany({
  //   where: {
  //     id: {
  //       in: userIds,
  //     },
  //   },
  // });
  // --------------------------------------------------

  // COMMENT THIS IF RUNNING LOCALLY ------------------
  const users = (
    await clerkClient.users.getUserList({
      userId: userIds,
      limit: 10,
    })
  ).data.map(filterUserForClient);
  // --------------------------------------------------

  const tasksForClient = generateTasksForClient(
    activeTasks,
    users,
    activeWorkPeriods.map((workPeriod) => workPeriod.id)
  );

  // const tasksForClient = await getTasksFromServer();
  return NextResponse.json({ tasks: tasksForClient });
}

// POST
export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) return new Response("Unauthenticated request", { status: 403 });
  const { success } = await ratelimit.limit(userId);
  if (!success) return new Response("Too many requests", { status: 429 });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const body = await req.json();

  const validated = postTasksBodyValidator.safeParse(body);

  if (!validated.success) {
    const message =
      "Invalid body. " + (validated.error.errors[0]?.message ?? "");
    return new Response(message, { status: 400 });
  }

  const { data: valid } = validated;

  const tasks = await prisma.task.findMany({
    where: {
      creatorId: userId,
    },
  });

  const currentWorkPeriodTasks = tasks.filter(
    (task) =>
      task.workPeriodId === valid.workPeriodId && task.isDeleted === false
  );

  const workPeriod = await prisma.workPeriod.findUnique({
    where: {
      id: valid.workPeriodId ?? "",
    },
  });

  let boardPosition = -1;

  if (workPeriod && workPeriod.status === "ACTIVE") {
    // If task is created in active work period, add it to the bottom of the TODO column in board
    const tasksInColum = currentWorkPeriodTasks.filter(
      (task) => task.status === "TODO"
    );
    boardPosition = calculateInsertPosition(tasksInColum);
  }

  const k = tasks.length + 1;

  const positionToInsert = calculateInsertPosition(currentWorkPeriodTasks);

  const task = await prisma.task.create({
    data: {
      key: `TASK-${k}`,
      name: valid.name,
      type: valid.type,
      reporterId: valid.reporterId ?? "user_2PwZmH2xP5aE0svR6hDH4AwDlcu",
      workPeriodId: valid.workPeriodId ?? undefined,
      workPeriodPosition: positionToInsert,
      boardPosition,
      parentId: valid.parentId,
      workPeriodColor: valid.workPeriodColor,
      creatorId: userId,
    },
  });
  // return NextResponse.json<PostTaskResponse>({ task });
  return NextResponse.json({ task });
}

export async function PATCH(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) return new Response("Unauthenticated request", { status: 403 });
  const { success } = await ratelimit.limit(userId);
  if (!success) return new Response("Too many requests", { status: 429 });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const body = await req.json();
  const validated = patchTasksBodyValidator.safeParse(body);

  if (!validated.success) {
    // eslint-disable-next-line
    const message = "Invalid body. " + validated.error.errors[0]?.message ?? "";
    return new Response(message, { status: 400 });
  }

  const { data: valid } = validated;

  const tasksToUpdate = await prisma.task.findMany({
    where: {
      id: {
        in: valid.ids,
      },
    },
  });

  const updatedTasks = await Promise.all(
    tasksToUpdate.map(async (task) => {
      return await prisma.task.update({
        where: {
          id: task.id,
        },
        data: {
          type: valid.type ?? undefined,
          status: valid.status ?? undefined,
          assigneeId: valid.assigneeId ?? undefined,
          reporterId: valid.reporterId ?? undefined,
          isDeleted: valid.isDeleted ?? undefined,
          workPeriodId:
            valid.workPeriodId === undefined ? undefined : valid.workPeriodId,
          parentId: valid.parentId ?? undefined,
        },
      });
    })
  );

  // return NextResponse.json<PostTaskResponse>({ task });
  return NextResponse.json({ tasks: updatedTasks });
}
