import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
// import { clerkClient } from "@clerk/nextjs/server";
// import { filterUserForClient } from "@/utils/helpers";
import { type DefaultUser } from "@prisma/client";
import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { filterUserForClient } from "@/utils/helpers";

export type GetProjectMembersResponse = {
  members: DefaultUser[];
};

type MembersParams = {
  params: {
    project_id: string;
  };
};

export async function GET(req: NextRequest, { params }: MembersParams) {
  const { project_id } = params;
  const { orgId } = getAuth(req);

  // Bước 1: Xóa tất cả các thành viên trong Prisma có projectId tương ứng
  await prisma.member.deleteMany({
    where: {
      projectId: project_id,
    },
  });

  // Bước 2: Lấy danh sách thành viên của tổ chức từ Clerk
  const { data } =
    await clerkClient.organizations.getOrganizationMembershipList({
      organizationId: orgId || "",
      limit: 10,
    });

  console.log("-------------data--------------", data);

  for (const member of data) {
    // Kiểm tra nếu publicUserData tồn tại
    if (member.publicUserData) {
      const userId = member.publicUserData.userId; // Lấy userId của thành viên từ Clerk

      // Tạo thành viên mới trong Prisma
      await prisma.member.create({
        data: {
          key: userId, // ID từ Clerk
          projectId: project_id, // ID dự án hiện tại
        },
      });
    }
  }

  // Bước 3: Lấy danh sách thành viên từ Prisma
  const members = await prisma.member.findMany({
    where: {
      projectId: project_id,
    },
  });

  // Lấy thông tin người dùng từ Clerk dựa trên ID thành viên từ Prisma
  const userIds = members
    .map((member) => member.key)
    .filter((id): id is string => id !== null);

  const users = (
    await clerkClient.users.getUserList({
      userId: userIds,
      limit: 20,
    })
  ).data.map(filterUserForClient);

  // Trả về danh sách thành viên
  return NextResponse.json({ members: users });
}
