"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useTasks } from "@/hooks/query-hooks/use-tasks";
import { useIsInViewport } from "@/hooks/use-is-in-viewport";
import { TaskDetailsHeader } from "./task-details-header";
import { TaskDetailsInfo } from "./task-details-info";
import { type TaskType } from "@/utils/types";

const TaskDetails: React.FC<{
  taskKey: string | null;
  setTaskKey: React.Dispatch<React.SetStateAction<TaskType["key"] | null>>;
}> = ({ taskKey, setTaskKey }) => {
  const { tasks } = useTasks();
  const renderContainerRef = React.useRef<HTMLDivElement>(null);
  const [isInViewport, viewportRef] = useIsInViewport({ threshold: 1 });

  const getTask = useCallback(
    (taskKey: string | null) => {
      return tasks?.find((task) => task.key === taskKey);
    },
    [tasks]
  );
  const [taskInfo, setTaskInfo] = useState(() => getTask(taskKey));

  useEffect(() => {
    setTaskInfo(() => getTask(taskKey));
    if (renderContainerRef.current) {
      renderContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [taskKey, getTask]);

  if (!taskInfo || !tasks) return <div />;

  return (
    <div
      ref={renderContainerRef}
      data-state={taskKey ? "open" : "closed"}
      className="relative z-10 flex w-full flex-col overflow-y-auto pl-4 pr-2 [&[data-state=closed]]:hidden"
    >
      <TaskDetailsHeader
        task={taskInfo}
        setTaskKey={setTaskKey}
        isInViewport={isInViewport}
      />
      <TaskDetailsInfo task={taskInfo} ref={viewportRef} />
    </div>
  );
};

export { TaskDetails };
