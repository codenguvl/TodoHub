import {
  BreadCrumbSkeleton,
  TaskSkeleton,
  WorkPeriodHeaderSkeleton,
  WorkPeriodSearchSkeleton,
  TitleSkeleton,
} from "@/components/skeletons";

const BacklogSkeleton = () => {
  return (
    <div role="status" className="flex animate-pulse flex-col gap-y-4">
      <BreadCrumbSkeleton />
      <TitleSkeleton />
      <WorkPeriodSearchSkeleton />
      <WorkPeriodHeaderSkeleton />
      <div className="mt-3 flex flex-col gap-y-4 px-8">
        {[...Array(10).keys()].map((el, index) => (
          <TaskSkeleton key={index} size={index % 2 === 0 ? 300 : 400} />
        ))}
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default BacklogSkeleton;
