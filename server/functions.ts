import { filterUserForClient, generateTasksForClient } from "@/utils/helpers";
import { type UserResource } from "@clerk/types";
import { clerkClient } from "@clerk/nextjs/server";

import {
  defaultUsers,
  generateInitialUserComments,
  generateInitialUserTasks,
  generateInitialUserWorkPeriods,
} from "../prisma/seed-data";
import { prisma } from "./db";
import { WorkPeriodStatus } from "@prisma/client";

export async function getInitialTasksFromServer(
  userId: UserResource["id"] | undefined | null,
  organizationId: string
) {
  const project = await prisma.project.findUnique({
    where: { key: organizationId },
  });

  if (!project) {
    return [];
  }

  let activeTasks = await prisma.task.findMany({
    where: {
      isDeleted: false,
      projectId: project.id,
    },
  });

  /* if (userId && (!activeTasks || activeTasks.length === 0)) {
    // New user, create default tasks
    await initDefaultTasks(userId);
    // Create comments for default tasks
    await initDefaultTaskComments(userId);

    const newActiveTasks = await prisma.task.findMany({
      where: {
        creatorId: userId,
        isDeleted: false,
      },
    });
    activeTasks = newActiveTasks;
  } */

  if (!activeTasks || activeTasks.length === 0) {
    return [];
  }

  const activeWorkPeriods = await prisma.workPeriod.findMany({
    where: {
      status: "ACTIVE",
    },
  });

  const userIds = activeTasks
    .flatMap((task) => [task.assigneeId, task.reporterId] as string[])
    .filter(Boolean);

  // USE THIS IF RUNNING LOCALLY ----------------------
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
      limit: 20,
    })
  ).data.map(filterUserForClient);
  // --------------------------------------------------

  const tasks = generateTasksForClient(
    activeTasks,
    users,
    activeWorkPeriods.map((workPeriod) => workPeriod.id)
  );
  return tasks;
}

export async function getInitialProjectFromServer(organizationId: string) {
  const project = await prisma.project.findUnique({
    where: { key: organizationId },
  });
  return project;
}

export async function getInitialWorkPeriodsFromServer(
  userId: UserResource["id"] | undefined
) {
  let workPeriods = await prisma.workPeriod.findMany({
    where: {
      OR: [
        { status: WorkPeriodStatus.ACTIVE },
        { status: WorkPeriodStatus.PENDING },
      ],
      creatorId: userId ?? "init",
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (userId && (!workPeriods || workPeriods.length === 0)) {
    // New user, create default work periods
    await initDefaultWorkPeriods(userId);

    const newWorkPeriods = await prisma.workPeriod.findMany({
      where: {
        creatorId: userId,
      },
    });
    workPeriods = newWorkPeriods;
  }
  return workPeriods;
}

/* export async function initProject() {
  await prisma.project.upsert({
    where: {
      id: "init-project-id-dq8yh-d0as89hjd",
    },
    update: {},
    create: {
      id: "init-project-id-dq8yh-d0as89hjd",
      name: "Jira Clone Project",
      key: "JIRA-CLONE",
    },
  });
} */
export async function initDefaultUsers() {
  await Promise.all(
    defaultUsers.map(
      async (user) =>
        await prisma.defaultUser.upsert({
          where: {
            id: user.id,
          },
          update: {
            avatar: user.avatar,
          },
          create: {
            id: user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
          },
        })
    )
  );
}
export async function initDefaultProjectMembers() {
  await Promise.all(
    defaultUsers.map(
      async (user) =>
        await prisma.member.upsert({
          where: {
            id: user.id,
          },
          update: {},
          create: {
            id: user.id,
            projectId: "init-project-id-dq8yh-d0as89hjd",
          },
        })
    )
  );
}

export async function initDefaultTasks(userId: string) {
  const initialTasks = generateInitialUserTasks(userId);
  await Promise.all(
    initialTasks.map(
      async (task) =>
        await prisma.task.upsert({
          where: {
            id: task.id,
          },
          update: {},
          create: {
            ...task,
          },
        })
    )
  );
}

export async function initDefaultTaskComments(userId: string) {
  const initialComments = generateInitialUserComments(userId);
  await Promise.all(
    initialComments.map(
      async (comment) =>
        await prisma.comment.upsert({
          where: {
            id: comment.id,
          },
          update: {},
          create: {
            ...comment,
          },
        })
    )
  );
}

export async function initDefaultWorkPeriods(userId: string) {
  const initialWorkPeriods = generateInitialUserWorkPeriods(userId);
  await Promise.all(
    initialWorkPeriods.map(
      async (workPeriod) =>
        await prisma.workPeriod.upsert({
          where: {
            id: workPeriod.id,
          },
          update: {},
          create: {
            ...workPeriod,
          },
        })
    )
  );
}
