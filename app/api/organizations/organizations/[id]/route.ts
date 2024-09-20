import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const organization = await prisma.organization.findUnique({
    where: { id },
    include: { projects: true }, // Giả sử bạn đã thiết lập quan hệ giữa Organization và Project
  });

  if (!organization) {
    return new Response("Organization not found", { status: 404 });
  }

  return NextResponse.json(organization);
}
