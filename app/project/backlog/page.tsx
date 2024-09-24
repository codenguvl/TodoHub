import { Backlog } from "@/components/backlog";
import { type Metadata } from "next";
import { getQueryClient } from "@/utils/get-query-client";
import { dehydrate } from "@tanstack/query-core";
import { Hydrate } from "@/utils/hydrate";
import { currentUser } from "@clerk/nextjs/server";
import {
  getInitialTasksFromServer,
  getInitialProjectFromServer,
  getInitialWorkPeriodsFromServer,
} from "@/server/functions";
import { auth } from "@clerk/nextjs/server";

export const metadata: Metadata = {
  title: "Công việc tồn đọng",
};

const BacklogPage = async () => {
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
      getInitialWorkPeriodsFromServer(user?.id)
    ),
  ]);

  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <Backlog />
    </Hydrate>
  );
};

export default BacklogPage;
