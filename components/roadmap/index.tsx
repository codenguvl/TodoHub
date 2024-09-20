"use client";
import React, { Fragment, useLayoutEffect, useRef } from "react";
import { useSelectedTaskContext } from "@/context/use-selected-task-context";
import "@/styles/split.css";
import { RoadmapHeader } from "./header";
import { useProject } from "@/hooks/query-hooks/use-project";
import Split from "react-split";
import { TaskDetails } from "../task/task-details";
import { notFound } from "next/navigation";
import { InitiativesTable } from "./initiatives-table";

const Roadmap: React.FC = () => {
  const { taskKey, setTaskKey } = useSelectedTaskContext();
  const renderContainerRef = useRef<HTMLDivElement>(null);

  const { project } = useProject();

  useLayoutEffect(() => {
    if (!renderContainerRef.current) return;
    const calculatedHeight = renderContainerRef.current.offsetTop;
    renderContainerRef.current.style.height = `calc(100vh - ${calculatedHeight}px)`;
  }, []);

  if (!project) {
    return notFound();
  }

  return (
    <Fragment>
      <RoadmapHeader project={project} />
      <div ref={renderContainerRef} className="min-w-full max-w-max">
        <Split
          sizes={taskKey ? [60, 40] : [100, 0]}
          gutterSize={taskKey ? 2 : 0}
          className="flex max-h-full w-full"
          minSize={taskKey ? 400 : 0}
        >
          <InitiativesTable />{" "}
          <TaskDetails setTaskKey={setTaskKey} taskKey={taskKey} />
        </Split>
      </div>
    </Fragment>
  );
};

export { Roadmap };
