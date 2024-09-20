import {
  BoardColumnSkeleton,
  BreadCrumbSkeleton,
  WorkPeriodSearchSkeleton,
  TitleSkeleton,
} from "@/components/skeletons";

const BoardSkeleton = () => {
  return (
    <div role="status" className="flex animate-pulse flex-col">
      <BreadCrumbSkeleton />
      <TitleSkeleton />
      <WorkPeriodSearchSkeleton />
      <div className="mt-3 flex gap-x-6">
        {[...Array(4).keys()].map((el, index) => (
          <BoardColumnSkeleton key={index} />
        ))}
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default BoardSkeleton;
