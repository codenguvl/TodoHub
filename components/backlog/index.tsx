"use client";
import React, { Fragment, useLayoutEffect } from "react";
import Split from "react-split";
import { ListGroup } from "./list-group";
import { TaskDetails } from "../task/task-details";
import { useSelectedTaskContext } from "@/context/use-selected-task-context";
import "@/styles/split.css";
import clsx from "clsx";
import { BacklogHeader } from "./header";
import { useProject } from "@/hooks/query-hooks/use-project";

const Backlog: React.FC = () => {
  const { project } = useProject();
  const { taskKey, setTaskKey } = useSelectedTaskContext();
  const renderContainerRef = React.useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!renderContainerRef.current) return;
    const calculatedHeight = renderContainerRef.current.offsetTop;
    renderContainerRef.current.style.height = `calc(100vh - ${calculatedHeight}px)`;
  }, []);

  if (!project) return null;

  return (
    <Fragment>
      <BacklogHeader project={project} />
      <div ref={renderContainerRef} className="min-w-full max-w-max">
        <Split
          sizes={taskKey ? [60, 40] : [100, 0]}
          gutterSize={taskKey ? 2 : 0}
          className="flex max-h-full w-full"
          minSize={taskKey ? 400 : 0}
        >
          <ListGroup className={clsx(taskKey && "pb-5 pr-4")} />
          <TaskDetails setTaskKey={setTaskKey} taskKey={taskKey} />
        </Split>
      </div>
    </Fragment>
  );
};

export { Backlog };
