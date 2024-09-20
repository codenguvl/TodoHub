"use client";
import React, { useState, useRef } from "react";
import { Draggable } from "react-beautiful-dnd";
import { TaskIcon } from "../task/task-icon";
import { Button } from "../ui/button";
import clsx from "clsx";
import { BsThreeDots } from "react-icons/bs";
import { ChildrenTreeIcon } from "../svgs";
import { DropdownTrigger } from "../ui/dropdown-menu";
import { ContextTrigger } from "../ui/context-menu";
import { TaskContextMenu, TaskDropdownMenu } from "../task/task-menu";
import { TaskSelectStatus } from "../task/task-select-status";
import { MdEdit } from "react-icons/md";
import { TaskTitle } from "../task/task-title";
import { useSelectedTaskContext } from "@/context/use-selected-task-context";
import { type TaskType } from "@/utils/types";
import { hasChildren, isInitiative, hexToRgba } from "@/utils/helpers";
import { TaskAssigneeSelect } from "../task/task-select-assignee";
import { DARK_COLORS, LIGHT_COLORS } from "../color-picker";

const Task: React.FC<{
  task: TaskType;
  index: number;
}> = ({ index, task }) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setTaskKey, taskKey } = useSelectedTaskContext();

  return (
    <Draggable draggableId={task.id} index={index}>
      {({ innerRef, dragHandleProps, draggableProps }, { isDragging }) => (
        <div
          role="button"
          data-state={taskKey == task.key ? "selected" : "not-selected"}
          onClick={() => setTaskKey(task.key)}
          ref={innerRef}
          {...draggableProps}
          {...dragHandleProps}
          className={clsx(
            isDragging
              ? "border-[0.3px] border-gray-300 bg-blue-100"
              : "bg-white",
            "group flex w-full max-w-full items-center justify-between  px-3 py-1.5 text-sm hover:bg-gray-50 [&[data-state=selected]]:bg-blue-100"
          )}
        >
          <div
            data-state={isEditing ? "editing" : "not-editing"}
            className="flex w-fit items-center gap-x-2 [&[data-state=editing]]:w-full [&[data-state=not-editing]]:overflow-x-hidden"
          >
            <TaskIcon taskType={task.type} />
            <div
              data-state={task.status}
              className="whitespace-nowrap text-gray-500 [&[data-state=DONE]]:line-through"
            >
              {task.key}
            </div>

            <TaskTitle
              key={task.id + task.name}
              className="truncate py-1.5 hover:cursor-pointer hover:underline"
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              task={task}
              useTooltip={true}
              ref={inputRef}
            />

            <div
              data-state={isEditing ? "editing" : "not-editing"}
              className="flex items-center gap-x-1 [&[data-state=editing]]:hidden"
            >
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(!isEditing);
                }}
                className="invisible w-0 px-0 group-hover:visible group-hover:w-fit group-hover:bg-transparent group-hover:px-1.5 group-hover:hover:bg-gray-200 "
              >
                <MdEdit className="text-sm" />
              </Button>
              {isInitiative(task.parent) ? (
                <InitiativeName task={task.parent} />
              ) : null}
            </div>
          </div>
          <TaskContextMenu isEditing={isEditing} className="flex-auto">
            <ContextTrigger className="h-8 w-full" />
          </TaskContextMenu>
          <div className="relative ml-2 flex min-w-fit items-center justify-end gap-x-2">
            {hasChildren(task) ? (
              <ChildrenTreeIcon className="p-0.5 text-gray-600" />
            ) : null}
            <TaskSelectStatus
              key={task.id + task.status}
              currentStatus={task.status}
              taskId={task.id}
            />
            <TaskAssigneeSelect task={task} avatarOnly />
            <TaskDropdownMenu task={task}>
              <DropdownTrigger
                asChild
                className="rounded-m flex items-center gap-x-2 bg-opacity-30 px-1.5 text-xs font-semibold focus:ring-2 "
              >
                <div className="invisible rounded-sm px-1.5 py-1.5 text-gray-700 group-hover:visible group-hover:bg-gray-200 group-hover:hover:bg-gray-300 [&[data-state=open]]:visible [&[data-state=open]]:bg-gray-700 [&[data-state=open]]:text-white">
                  <BsThreeDots className="sm:text-xl" />
                </div>
              </DropdownTrigger>
            </TaskDropdownMenu>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export const InitiativeName: React.FC<{
  task: TaskType["parent"];
  className?: string;
}> = ({ task, className }) => {
  const lightColor = LIGHT_COLORS.find(
    (color) => color.hex == task.workPeriodColor
  );
  const bgColor = hexToRgba(task.workPeriodColor, !!lightColor ? 0.5 : 1);

  function calcTextColor() {
    if (lightColor) {
      return DARK_COLORS.find((color) => color.label == lightColor.label)?.hex;
    } else {
      return "white";
    }
  }

  return (
    <div
      style={{
        backgroundColor: bgColor,
        color: calcTextColor(),
      }}
      className={clsx(
        "whitespace-nowrap rounded-[3px] px-2 text-xs font-bold",
        className
      )}
    >
      {task.name.toUpperCase()}
    </div>
  );
};

export { Task };
