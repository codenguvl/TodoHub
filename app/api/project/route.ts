import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/server/db";
import { type Project } from "@prisma/client";
import { getAuth } from "@clerk/nextjs/server";

export type GetProjectResponse = {
  project: Project | null;
};

export async function GET(req: NextRequest) {
  const { userId, orgId } = getAuth(req);
  if (!userId) return new Response("Unauthenticated request", { status: 403 });

  const organizationId = req.url.split("/").pop();
  if (!organizationId)
    return new Response("Organization ID is required", { status: 400 });

  const project = await prisma.project.findUnique({
    where: {
      key: orgId,
    },
  });

  if (!project) {
    return new Response("Project not found", { status: 404 });
  }

  return NextResponse.json({ project });
}
