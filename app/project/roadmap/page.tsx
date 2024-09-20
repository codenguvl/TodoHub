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
import { currentUser } from "@clerk/nextjs/server";

export const metadata: Metadata = {
  title: "Roadmap",
};

const RoadmapPage = async () => {
  const user = await currentUser();
  const queryClient = getQueryClient();

  await Promise.all([
    await queryClient.prefetchQuery(["tasks"], () =>
      getInitialTasksFromServer(user?.id)
    ),
    await queryClient.prefetchQuery(["workPeriods"], () =>
      getInitialWorkPeriodsFromServer(user?.id)
    ),
    await queryClient.prefetchQuery(["project"], getInitialProjectFromServer),
  ]);

  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <Roadmap />
    </Hydrate>
  );
};

export default RoadmapPage;
