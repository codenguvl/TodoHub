import React, { Fragment, useRef, useState } from "react";
import { NotImplemented } from "@/components/not-implemented";
import { LightningIcon } from "@/components/svgs";
import { TaskTitle } from "../../task-title";
import { TaskSelectStatus } from "../../task-select-status";
import { useSelectedTaskContext } from "@/context/use-selected-task-context";
import { type TaskType } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { Comments } from "./task-details-info-comments";
import { TaskMetaInfo } from "./task-details-info-meta";
import { Description } from "./task-details-info-description";
import { TaskDetailsInfoAccordion } from "./task-details-info-accordion";
import { TaskDetailsInfoActions } from "./task-details-info-actions";
import { ChildTaskList } from "./task-details-info-child-tasks";
import { hasChildren, isInitiative } from "@/utils/helpers";
import { useContainerWidth } from "@/hooks/use-container-width";
import Split from "react-split";
import "@/styles/split.css";

const TaskDetailsInfo = React.forwardRef<
  HTMLDivElement,
  { task: TaskType | undefined }
>(({ task }, ref) => {
  const [parentRef, parentWidth] = useContainerWidth();

  if (!task) return <div />;
  return (
    <div ref={parentRef}>
      {!parentWidth ? null : parentWidth > 800 ? (
        <LargeTaskDetails task={task} ref={ref} />
      ) : (
        <SmallTaskDetailsInfo task={task} ref={ref} />
      )}
    </div>
  );
});

TaskDetailsInfo.displayName = "TaskDetailsInfo";

const SmallTaskDetailsInfo = React.forwardRef<
  HTMLDivElement,
  { task: TaskType }
>(({ task }, ref) => {
  const { taskKey } = useSelectedTaskContext();
  const nameRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingChildTask, setIsAddingChildTask] = useState(false);

  return (
    <Fragment>
      <div className="flex items-center gap-x-2">
        <h1
          ref={ref}
          role="button"
          onClick={() => setIsEditing(true)}
          data-state={isEditing ? "editing" : "notEditing"}
          className="w-full transition-all [&[data-state=notEditing]]:hover:bg-gray-100"
        >
          <TaskTitle
            className="mr-1 py-1"
            key={task.id + task.name}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            task={task}
            ref={nameRef}
          />
        </h1>
      </div>

      <div className="relative mb-3 flex items-center gap-x-3">
        <TaskDetailsInfoActions
          onAddChildTask={() => setIsAddingChildTask(true)}
        />
        <TaskSelectStatus
          key={task.id + task.status}
          currentStatus={task.status}
          taskId={task.id}
          variant="lg"
        />
      </div>
      <Description task={task} key={String(taskKey) + task.id} />
      {hasChildren(task) || isAddingChildTask ? (
        <ChildTaskList
          tasks={task.children}
          parentIsInitiative={isInitiative(task)}
          parentId={task.id}
          isAddingChildTask={isAddingChildTask}
          setIsAddingChildTask={setIsAddingChildTask}
        />
      ) : null}
      <TaskDetailsInfoAccordion task={task} />
      <TaskMetaInfo task={task} />
      <Comments task={task} />
    </Fragment>
  );
});

SmallTaskDetailsInfo.displayName = "SmallTaskDetailsInfo";

const LargeTaskDetails = React.forwardRef<HTMLDivElement, { task: TaskType }>(
  ({ task }, ref) => {
    const { taskKey } = useSelectedTaskContext();
    const nameRef = useRef<HTMLInputElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isAddingChildTask, setIsAddingChildTask] = useState(false);

    return (
      <Split
        sizes={[60, 40]}
        gutterSize={2}
        className="flex max-h-[70vh] w-full overflow-hidden"
        minSize={300}
      >
        <div className="overflow-y-auto pr-3">
          <div className="flex items-center gap-x-2">
            <h1
              ref={ref}
              role="button"
              onClick={() => setIsEditing(true)}
              data-state={isEditing ? "editing" : "notEditing"}
              className="w-full transition-all [&[data-state=notEditing]]:hover:bg-gray-100"
            >
              <TaskTitle
                className="mr-1 py-1"
                key={task.id + task.name}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                task={task}
                ref={nameRef}
              />
            </h1>
          </div>
          <TaskDetailsInfoActions
            onAddChildTask={() => setIsAddingChildTask(true)}
            variant={"lg"}
          />
          <Description task={task} key={String(taskKey) + task.id} />
          {hasChildren(task) || isAddingChildTask ? (
            <ChildTaskList
              tasks={task.children}
              parentIsInitiative={isInitiative(task)}
              parentId={task.id}
              isAddingChildTask={isAddingChildTask}
              setIsAddingChildTask={setIsAddingChildTask}
            />
          ) : null}
          <Comments task={task} />
        </div>

        <div className="mt-4 bg-white pl-3">
          <div className="relative flex items-center gap-x-3">
            <TaskSelectStatus
              key={task.id + task.status}
              currentStatus={task.status}
              taskId={task.id}
              variant="sm"
            />
            {/* <NotImplemented>
              <Button customColors className="hover:bg-gray-200">
                <div className="flex items-center">
                  <LightningIcon className="mt-0.5" />
                  <span>Actions</span>
                </div>
              </Button>
            </NotImplemented> */}
          </div>

          <TaskDetailsInfoAccordion task={task} />
          <TaskMetaInfo task={task} />
        </div>
      </Split>
    );
  }
);

LargeTaskDetails.displayName = "LargeTaskDetails";

export { TaskDetailsInfo };
