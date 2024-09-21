import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { organization_id: string } }
) {
  const { organization_id } = params;

  const project = await prisma.project.findUnique({
    where: {
      key: organization_id.toUpperCase(),
    },
  });

  if (!project) {
    return new Response("Project not found", { status: 404 });
  }

  return NextResponse.json({ project });
}
