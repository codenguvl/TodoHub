import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/server/db";
import { type Project } from "@prisma/client";
import { getAuth } from "@clerk/nextjs/server";

export type GetProjectResponse = {
  project: Project | null;
};

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) return new Response("Unauthenticated request", { status: 403 });

  const projectId = req.url.split("/").pop();
  if (!projectId)
    return new Response("Organization ID is required", { status: 400 });

  let project = await prisma.project.findUnique({
    where: {
      key: projectId.toUpperCase(),
    },
  });

  if (!project) {
    const organizationName = projectId.replace(/_/g, " ");
    project = await prisma.project.create({
      data: {
        key: projectId,
        name: organizationName,
        defaultAssignee: userId,
      },
    });
  }

  return NextResponse.json({ project });
}
