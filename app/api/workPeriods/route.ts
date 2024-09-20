import { prisma, ratelimit } from "@/server/db";
import { getAuth } from "@clerk/nextjs/server";
import { WorkPeriodStatus, type WorkPeriod } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";

export type PostWorkPeriodResponse = {
  workPeriod: WorkPeriod;
};

export type GetWorkPeriodsResponse = {
  workPeriods: WorkPeriod[];
};

export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) return new Response("Unauthenticated request", { status: 403 });
  const { success } = await ratelimit.limit(userId);
  if (!success) return new Response("Too many requests", { status: 429 });

  const workPeriods = await prisma.workPeriod.findMany({
    where: {
      creatorId: userId,
    },
  });

  const k = workPeriods.length + 1;

  const workPeriod = await prisma.workPeriod.create({
    data: {
      name: `WORKPERIOD-${k}`,
      description: "",
      creatorId: userId,
    },
  });
  // return NextResponse.json<PostWorkPeriodResponse>({ workPeriod });
  return NextResponse.json({ workPeriod });
}

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);
  const workPeriods = await prisma.workPeriod.findMany({
    where: {
      OR: [{ status: WorkPeriodStatus.ACTIVE }, { status: WorkPeriodStatus.PENDING }],
      creatorId: userId ?? "init",
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // return NextResponse.json<GetWorkPeriodsResponse>({ workPeriods });
  return NextResponse.json({ workPeriods });
}
