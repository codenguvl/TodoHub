"use client";
import { getTaskCountByStatus } from "@/utils/helpers";
import { type TaskType } from "@/utils/types";
import clsx from "clsx";
import { Fragment, useCallback, useEffect, useState } from "react";

const TaskStatusCount: React.FC<{ tasks: TaskType[] }> = ({ tasks }) => {
  const memoizedCount = useCallback(getTaskCountByStatus, []);
  const [statusCount, setStatusCount] = useState(() =>
    memoizedCount(tasks ?? [])
  );

  useEffect(() => {
    setStatusCount(() => memoizedCount(tasks ?? []));
  }, [tasks, memoizedCount]);

  return (
    <Fragment>
      {Object.entries(statusCount ?? {})?.map(([status, count]) => (
        <CountBall
          key={status}
          count={count}
          className={clsx(
            status == "TODO" && "bg-todo text-black",
            status == "IN_PROGRESS" && "bg-inprogress text-white",
            status == "DONE" && "bg-done text-white"
          )}
        />
      ))}
    </Fragment>
  );
};

const CountBall: React.FC<{
  count: number;
  className: string;
  hideOnZero?: boolean;
}> = ({ count, className, hideOnZero = false }) => {
  if (hideOnZero && count === 0) return null;
  return (
    <span
      className={clsx(
        "flex h-4 w-fit items-center justify-center rounded-full px-2 text-xs font-semibold",
        className
      )}
    >
      {count}
    </span>
  );
};

export { TaskStatusCount, CountBall };
