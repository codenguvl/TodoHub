"use client";
import { useState } from "react";
import { useTasks } from "@/hooks/query-hooks/use-tasks";
import { Droppable } from "react-beautiful-dnd";
import { AccordionContent } from "../ui/accordion";
import { Task } from "./task";
import { Button } from "../ui/button";
import { AiOutlinePlus } from "react-icons/ai";
import { EmptyTask } from "../task/task-empty";
import { type TaskType } from "@/utils/types";
import clsx from "clsx";
import { useUser } from "@clerk/clerk-react";
import { useStrictModeDroppable } from "@/hooks/use-strictmode-droppable";
import { useIsAuthenticated } from "@/hooks/use-is-authed";
import { useProject } from "@/hooks/query-hooks/use-project";

const TaskList: React.FC<{
  workPeriodId: string | null;
  tasks: TaskType[];
}> = ({ workPeriodId, tasks }) => {
  const { createTask, isCreating } = useTasks();
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [droppableEnabled] = useStrictModeDroppable();
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();
  const { project } = useProject();

  if (!droppableEnabled) {
    return null;
  }

  function handleCreateTask({
    name,
    type,
  }: {
    name: string;
    type: TaskType["type"];
  }) {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    if (!name) {
      return;
    }

    createTask(
      {
        name,
        type,
        parentId: null,
        workPeriodId,
        reporterId: user?.id ?? null,
        projectId: project?.id ?? "",
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  }
  return (
    <AccordionContent className="pt-2">
      <Droppable droppableId={workPeriodId ?? "backlog"}>
        {({ droppableProps, innerRef, placeholder }) => (
          <div
            {...droppableProps}
            ref={innerRef}
            className={clsx(tasks.length == 0 && "min-h-[1px]")}
          >
            <div
              className={clsx(tasks.length && "border-[0.3px]", "divide-y ")}
            >
              {tasks
                .sort((a, b) => a.workPeriodPosition - b.workPeriodPosition)
                .map((task, index) => (
                  <Task key={task.id} index={index} task={task} />
                ))}
            </div>
            {placeholder}
          </div>
        )}
      </Droppable>

      <Button
        onClick={() => setIsEditing(true)}
        data-state={isEditing ? "closed" : "open"}
        customColors
        className="my-1 flex w-full bg-transparent hover:bg-gray-200 [&[data-state=closed]]:hidden"
      >
        <AiOutlinePlus className="text-sm" />
        <span className="text-sm">Thêm công việc mới</span>
      </Button>

      <EmptyTask
        data-state={isEditing ? "open" : "closed"}
        className="[&[data-state=closed]]:hidden"
        onCreate={({ name, type }) => handleCreateTask({ name, type })}
        onCancel={() => setIsEditing(false)}
        isCreating={isCreating}
      />
    </AccordionContent>
  );
};

export { TaskList };
