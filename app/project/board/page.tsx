import { Board } from "@/components/board";
import { type Metadata } from "next";
import { getQueryClient } from "@/utils/get-query-client";
import { Hydrate } from "@/utils/hydrate";
import { dehydrate } from "@tanstack/query-core";
import { auth, currentUser } from "@clerk/nextjs/server";
import {
  getInitialTasksFromServer,
  getInitialProjectFromServer,
  getInitialWorkPeriodsFromServer,
} from "@/server/functions";

export const metadata: Metadata = {
  title: "Bảng quản lý",
};

const BoardPage = async () => {
  const user = await currentUser();
  const queryClient = getQueryClient();

  const { orgId } = auth();

  const organizationId = orgId ?? "";

  await Promise.all([
    await queryClient.prefetchQuery(["project"], () =>
      getInitialProjectFromServer(organizationId)
    ),
    await queryClient.prefetchQuery(["tasks"], () =>
      getInitialTasksFromServer(user?.id, organizationId)
    ),
    await queryClient.prefetchQuery(["workPeriods"], () =>
      getInitialWorkPeriodsFromServer(user?.id, organizationId)
    ),
  ]);

  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <Board />
    </Hydrate>
  );
};

export default BoardPage;
