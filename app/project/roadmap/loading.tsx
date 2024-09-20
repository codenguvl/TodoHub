import {
  RoadmapTableSkeleton,
  BreadCrumbSkeleton,
  WorkPeriodSearchSkeleton,
  TitleSkeleton,
} from "@/components/skeletons";

const RoadmapSkeleton = () => {
  return (
    <div
      role="status"
      className="flex h-[calc(100vh_-_3rem)] animate-pulse flex-col"
    >
      <BreadCrumbSkeleton />
      <TitleSkeleton />
      <WorkPeriodSearchSkeleton />
      <RoadmapTableSkeleton />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default RoadmapSkeleton;
