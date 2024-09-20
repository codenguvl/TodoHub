import { type TaskType } from "@/utils/types";
import clsx from "clsx";
import { Draggable } from "react-beautiful-dnd";
import { TaskIcon } from "../task/task-icon";
import { Avatar } from "../avatar";
import { TaskDropdownMenu } from "../task/task-menu";
import { DropdownTrigger } from "../ui/dropdown-menu";
import { BsThreeDots } from "react-icons/bs";
import { isInitiative } from "@/utils/helpers";
import { InitiativeName } from "../backlog/task";

import { useSelectedTaskContext } from "@/context/use-selected-task-context";

const Task: React.FC<{ task: TaskType; index: number }> = ({ task, index }) => {
  const { setTaskKey } = useSelectedTaskContext();

  return (
    <Draggable draggableId={task.id} index={index}>
      {({ innerRef, dragHandleProps, draggableProps }, { isDragging }) => (
        <div
          role="button"
          onClick={() => setTaskKey(task.key)}
          ref={innerRef}
          {...draggableProps}
          {...dragHandleProps}
          className={clsx(
            isDragging && "bg-white",
            "group my-0.5 max-w-full rounded-[3px] border-[0.3px] border-gray-300 bg-white p-2 text-sm shadow-sm shadow-gray-300 hover:bg-gray-200 "
          )}
        >
          <div className="flex items-start justify-between">
            <span className="mb-2">{task.name}</span>
            <TaskDropdownMenu task={task}>
              <DropdownTrigger
                asChild
                className="rounded-m flex h-fit items-center gap-x-2 bg-opacity-30 px-1.5 text-xs font-semibold focus:ring-2"
              >
                <div className="invisible rounded-sm px-1.5 py-1.5 text-gray-700 group-hover:visible group-hover:bg-gray-100 group-hover:hover:bg-gray-300 [&[data-state=open]]:visible [&[data-state=open]]:bg-gray-700 [&[data-state=open]]:text-white">
                  <BsThreeDots className="sm:text-xl" />
                </div>
              </DropdownTrigger>
            </TaskDropdownMenu>
          </div>
          <div className="w-fit">
            {isInitiative(task.parent) ? (
              <InitiativeName task={task.parent} className="py-0.5 text-sm" />
            ) : null}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-x-3">
              <TaskIcon taskType={task.type} />
              <span className="text-xs font-medium text-gray-600">
                {task.key}
              </span>
            </div>
            <Avatar
              size={20}
              src={task.assignee?.avatar}
              alt={task.assignee?.name ?? "Unassigned"}
            />
          </div>
        </div>
      )}
    </Draggable>
  );
};

export { Task };
