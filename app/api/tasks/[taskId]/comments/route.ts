import { type NextRequest, NextResponse } from "next/server";
import { prisma, ratelimit } from "@/server/db";
import { type DefaultUser, type Comment } from "@prisma/client";
import { z } from "zod";
import { getAuth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { filterUserForClient } from "@/utils/helpers";

export type GetTaskCommentsResponse = {
  comments: GetTaskCommentResponse["comment"][];
};

export type GetTaskCommentResponse = {
  comment: Comment & { author: DefaultUser };
};

export async function GET(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  const { taskId } = params;

  const comments = await prisma.comment.findMany({
    where: {
      taskId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const userIds = comments.map((c) => c.authorId);

  // USE THIS IF RUNNING LOCALLY -----------------------
  // const users = await prisma.defaultUser.findMany({
  //   where: {
  //     id: {
  //       in: userIds,
  //     },
  //   },
  // });
  // --------------------------------------------------

  // COMMENT THIS IF RUNNING LOCALLY ------------------
  const users = (
    await clerkClient.users.getUserList({
      userId: userIds,
      limit: 110,
    })
  ).data.map(filterUserForClient);
  // --------------------------------------------------

  const commentsForClient = comments.map((comment) => {
    const author = users.find((u) => u.id === comment.authorId) ?? null;
    return { ...comment, author };
  });

  return NextResponse.json({ comments: commentsForClient });
}

const postCommentBodyValidator = z.object({
  content: z.string(),
  authorId: z.string(),
});

export type PostCommentBody = z.infer<typeof postCommentBodyValidator>;

export async function POST(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  const { userId } = getAuth(req);
  if (!userId) return new Response("Unauthenticated request", { status: 403 });
  const { success } = await ratelimit.limit(userId);
  if (!success) return new Response("Too many requests", { status: 429 });

  const { taskId } = params;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const body = await req.json();

  const validated = postCommentBodyValidator.safeParse(body);

  if (!validated.success) {
    const message =
      "Invalid body. " + (validated.error.errors[0]?.message ?? "");
    return new Response(message, { status: 400 });
  }

  const { data: valid } = validated;

  const comment = await prisma.comment.create({
    data: {
      taskId: taskId,
      content: valid.content,
      authorId: valid.authorId,
    },
  });

  // USE THIS INSTEAD IF YOU HAVE USERS IN CLERK
  // const author = await clerkClient.users.getUser(comment.authorId);
  // const authorForClient = filterUserForClient(author);

  const authorForClient = await prisma.defaultUser.findUnique({
    where: {
      id: comment.authorId,
    },
  });

  return NextResponse.json({
    comment: {
      ...comment,
      author: authorForClient,
    },
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { commentId: string } }
) {
  const { userId } = getAuth(req);
  if (!userId) return new Response("Unauthenticated request", { status: 403 });
  const { success } = await ratelimit.limit(userId);
  if (!success) return new Response("Too many requests", { status: 429 });

  const { commentId } = params;

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    return new Response("Comment not found", { status: 404 });
  }

  await prisma.comment.delete({
    where: { id: commentId },
  });

  return new Response(null, { status: 204 });
}
