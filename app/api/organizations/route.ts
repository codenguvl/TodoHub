import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) return new Response("Unauthenticated request", { status: 403 });

  const body = await req.json();
  const { organizationName } = body;

  if (!organizationName) {
    return new Response("Organization name is required", { status: 400 });
  }

  const project = await prisma.project.create({
    data: {
      key: organizationName.replace(/\s+/g, "_"),
      name: organizationName,
      defaultAssignee: userId,
    },
  });

  return NextResponse.json({ project });
}
