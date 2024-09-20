import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { z } from "zod";

const organizationBodyValidator = z.object({
  name: z.string(),
  // Thêm các trường khác nếu cần
});

export type CreateOrganizationBody = z.infer<typeof organizationBodyValidator>;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const validated = organizationBodyValidator.safeParse(body);

  if (!validated.success) {
    return new Response("Invalid body", { status: 400 });
  }

  const { name } = validated.data;

  // Tạo Organization (giả sử bạn có model Organization trong Prisma)
  const organization = await prisma.organization.create({
    data: {
      name,
      // Thêm các trường khác nếu cần
    },
  });

  // Tạo Project tương ứng
  const project = await prisma.project.create({
    data: {
      key: `PROJECT-${organization.id}`, // Hoặc một key khác phù hợp
      name: `${name} Project`,
      // Thêm các trường khác nếu cần
      members: [], // Nếu cần khởi tạo thành viên
    },
  });

  return NextResponse.json({ organization, project });
}
