import { useCallback, useEffect, useState } from "react";
import { getTaskCountByStatus } from "@/utils/helpers";
import { TooltipWrapper } from "@/components/ui/tooltip";
import { type TaskType } from "@/utils/types";
import clsx from "clsx";

const ProgressBar: React.FC<{
  tasks: TaskType[];
  variant?: "sm" | "lg";
}> = ({ tasks, variant = "lg" }) => {
  const memoizedCount = useCallback(getTaskCountByStatus, []);
  const [statusCount, setStatusCount] = useState(() =>
    memoizedCount(tasks ?? [])
  );

  useEffect(() => {
    setStatusCount(() => memoizedCount(tasks ?? []));
  }, [tasks, memoizedCount]);
  return (
    <div className="flex items-center gap-x-5">
      <div
        style={{ width: "100%" }}
        className={clsx(
          variant === "sm" ? "h-1" : "h-2.5",
          "flex  gap-x-0.5 overflow-hidden rounded-full bg-white"
        )}
      >
        {statusCount.DONE ? (
          <TooltipWrapper
            text={`Done: ${statusCount.DONE} of ${tasks.length} tasks`}
          >
            <div
              style={{ width: `${(statusCount.DONE / tasks.length) * 100}%` }}
              className="float-left h-full bg-done"
            />
          </TooltipWrapper>
        ) : null}
        {statusCount.IN_PROGRESS ? (
          <TooltipWrapper
            text={`In Progress: ${statusCount.IN_PROGRESS} of ${tasks.length} tasks`}
          >
            <div
              style={{
                width: `${(statusCount.IN_PROGRESS / tasks.length) * 100}%`,
              }}
              className="float-left h-full bg-inprogress"
            />
          </TooltipWrapper>
        ) : null}
        {statusCount.TODO ? (
          <TooltipWrapper
            text={`To Do: ${statusCount.TODO} of ${tasks.length} tasks`}
          >
            <div
              style={{ width: `${(statusCount.TODO / tasks.length) * 100}%` }}
              className="float-left h-full bg-todo"
            />
          </TooltipWrapper>
        ) : null}
      </div>
      {variant === "lg" ? (
        <div className="whitespace-nowrap text-sm text-gray-500">
          {((statusCount.DONE / tasks.length) * 100).toFixed(0)}% Done
        </div>
      ) : null}
    </div>
  );
};

export { ProgressBar };
