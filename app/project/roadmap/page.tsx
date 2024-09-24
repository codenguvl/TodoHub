import { type Metadata } from "next";
import { getQueryClient } from "@/utils/get-query-client";
import { Hydrate } from "@/utils/hydrate";
import { dehydrate } from "@tanstack/query-core";
import { Roadmap } from "@/components/roadmap";
import {
  getInitialTasksFromServer,
  getInitialProjectFromServer,
  getInitialWorkPeriodsFromServer,
} from "@/server/functions";
import { auth, currentUser } from "@clerk/nextjs/server";

export const metadata: Metadata = {
  title: "Kế hoạch",
};

const RoadmapPage = async () => {
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
      <Roadmap />
    </Hydrate>
  );
};

export default RoadmapPage;
