import React, { Fragment, useEffect, useState } from "react";
import { useTasks } from "@/hooks/query-hooks/use-tasks";
import { Button } from "../ui/button";
import { MdCheck, MdClose } from "react-icons/md";
import { type TaskType } from "@/utils/types";
import { TooltipWrapper } from "../ui/tooltip";
import { useIsAuthenticated } from "@/hooks/use-is-authed";

type TaskTitleProps = {
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  task: TaskType;
  className?: string;
  useTooltip?: boolean;
};

const TaskTitle = React.forwardRef<HTMLInputElement, TaskTitleProps>(
  ({ isEditing, setIsEditing, task, className, useTooltip }, ref) => {
    const [currentTitle, setCurrentTitle] = useState(task.name);
    useEffect(() => {
      if (isEditing) {
        (ref as React.RefObject<HTMLInputElement>).current?.focus();
      }
    }, [isEditing, ref]);

    const { updateTask } = useTasks();
    const [isAuthenticated, openAuthModal] = useIsAuthenticated();

    function handleNameChange(e: React.SyntheticEvent) {
      e.stopPropagation();
      e.preventDefault();
      if (!isAuthenticated) {
        openAuthModal();
        return;
      }
      updateTask({
        taskId: task.id,
        name: currentTitle,
      });
      setIsEditing(false);
    }

    return (
      <Fragment>
        {isEditing ? (
          <div className="relative flex w-full">
            <label htmlFor="task-title" className="sr-only">
              Task title
            </label>
            <input
              type="text"
              ref={ref}
              id="task-title"
              value={currentTitle}
              onChange={(e) => setCurrentTitle(e.target.value)}
              className="w-full min-w-max whitespace-pre-wrap px-1 py-1.5 outline-2 outline-blue-400"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleNameChange(e);
                }
                if (e.key === "Escape") {
                  setIsEditing(false);
                }
              }}
            />
            <div className="absolute -bottom-10 right-0 z-10 flex gap-x-1">
              <Button
                className="mt-2 aspect-square bg-gray-50 p-2.5 shadow-md transition-all hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(false);
                }}
                customColors
                customPadding
              >
                <MdClose className="text-sm" />
              </Button>
              <Button
                className="mt-2 aspect-square bg-gray-50 p-2.5 shadow-md transition-all hover:bg-gray-100"
                onClick={handleNameChange}
                customColors
                customPadding
              >
                <MdCheck className="text-sm" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full overflow-x-hidden">
            {useTooltip ? (
              <TooltipWrapper text={task.name}>
                <p className={className}>{task.name}</p>
              </TooltipWrapper>
            ) : (
              <p className={className}>{task.name}</p>
            )}
          </div>
        )}
      </Fragment>
    );
  }
);

TaskTitle.displayName = "TaskTitle";

export { TaskTitle };
