import { type NextRequest, NextResponse } from "next/server";
import { prisma, ratelimit } from "@/server/db";
import { WorkPeriodStatus, type WorkPeriod } from "@prisma/client";
import { z } from "zod";
import { getAuth } from "@clerk/nextjs/server";

const patchWorkPeriodBodyValidator = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  duration: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.nativeEnum(WorkPeriodStatus).optional(),
});

export type PatchWorkPeriodBody = z.infer<typeof patchWorkPeriodBodyValidator>;
export type PatchWorkPeriodResponse = { workPeriod: WorkPeriod };

type ParamsType = {
  params: {
    workPeriod_id: string;
  };
};

export async function PATCH(req: NextRequest, { params }: ParamsType) {
  const { userId } = getAuth(req);
  if (!userId) return new Response("Unauthenticated request", { status: 403 });
  const { success } = await ratelimit.limit(userId);
  if (!success) return new Response("Too many requests", { status: 429 });

  const { workPeriod_id } = params;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const body = await req.json();
  const validated = patchWorkPeriodBodyValidator.safeParse(body);

  if (!validated.success) {
    const message =
      "Invalid body. " + (validated.error.errors[0]?.message ?? "");
    return new Response(message, { status: 400 });
  }

  const { data: valid } = validated;

  const current = await prisma.workPeriod.findUnique({
    where: {
      id: workPeriod_id,
    },
  });

  if (!current) {
    return new Response("WorkPeriod not found", { status: 404 });
  }

  const workPeriod = await prisma.workPeriod.update({
    where: {
      id: workPeriod_id,
    },
    data: {
      name: valid.name ?? current.name,
      description: valid.description ?? current.description,
      startDate: valid.startDate ?? current.startDate,
      endDate: valid.endDate ?? current.endDate,
      status: valid.status ?? current.status,
      duration: valid.duration ?? current.duration,
    },
  });

  // return NextResponse.json<PatchWorkPeriodResponse>({ workPeriod });
  return NextResponse.json({ workPeriod });
}

export async function DELETE(req: NextRequest, { params }: ParamsType) {
  const { userId } = getAuth(req);
  if (!userId) return new Response("Unauthenticated request", { status: 403 });
  const { success } = await ratelimit.limit(userId);
  if (!success) return new Response("Too many requests", { status: 429 });

  const { workPeriod_id } = params;

  await prisma.task.updateMany({
    where: {
      workPeriodId: workPeriod_id,
    },
    data: {
      workPeriodId: null,
    },
  });

  const workPeriod = await prisma.workPeriod.delete({
    where: {
      id: workPeriod_id,
    },
  });

  // return NextResponse.json<PatchWorkPeriodResponse>({ workPeriod });
  return NextResponse.json({ workPeriod });
}
