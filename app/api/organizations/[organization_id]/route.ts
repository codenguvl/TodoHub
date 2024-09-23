import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { organization_id: string } }
) {
  const { userId } = getAuth(req);
  if (!userId) return new Response("Unauthenticated request", { status: 403 });

  const { organization_id } = params;

  let project = await prisma.project.findUnique({
    where: {
      key: organization_id,
    },
  });

  if (!project) {
    try {
      project = await prisma.project.create({
        data: {
          key: organization_id.replace(/\s+/g, "_"),
          name: organization_id,
          defaultAssignee: userId,
        },
      });
    } catch (error) {
      return new Response("Failed to create project", { status: 500 });
    }
  }

  return NextResponse.json({ project });
}
