"use client";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { TaskSelectType } from "./task-select-type";
import { Button } from "../ui/button";
import { MdCheck, MdClose } from "react-icons/md";
import { Spinner } from "../ui/spinner";
import { type TaskType } from "@/utils/types";
import { TaskIcon } from "./task-icon";

const EmptyTask: React.FC<{
  className?: string;
  onCreate: (payload: {
    name: string;
    type: TaskType["type"];
    parentId: TaskType["id"] | null;
  }) => void;
  onCancel: () => void;
  isCreating: boolean;
  isSubtask?: boolean;
  isInitiative?: boolean;
  parentId?: TaskType["id"];
}> = ({
  onCreate,
  onCancel,
  isCreating,
  className,
  isInitiative,
  isSubtask,
  parentId,
  ...props
}) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<TaskType["type"]>(
    () => initialType() as TaskType["type"]
  );
  const inputRef = useRef<HTMLInputElement>(null);

  function initialType() {
    if (isSubtask) return "SUBTASK";
    if (isInitiative) return "INITIATIVE";
    return "TASK";
  }

  useEffect(() => {
    focusInput();
  }, [props]);

  function focusInput() {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  function handleSelect(type: TaskType["type"]) {
    setType(type);
    setTimeout(() => focusInput(), 50);
  }
  function handleCreateTask(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!name) {
        return;
      }

      onCreate({
        name,
        type,
        parentId: parentId ?? null,
      });
      setName("");
    }
  }

  return (
    <div
      {...props}
      className={clsx(
        "relative flex items-center gap-x-2 border-2 border-blue-400 bg-white p-1.5",
        className
      )}
    >
      {isSubtask ? (
        <div className="py-4" />
      ) : isInitiative ? (
        <TaskIcon taskType="INITIATIVE" />
      ) : (
        <TaskSelectType
          currentType={type}
          dropdownIcon
          onSelect={handleSelect}
        />
      )}
      <label htmlFor="empty-task-input" className="sr-only">
        Empty task input
      </label>
      <input
        ref={inputRef}
        autoFocus
        type="text"
        id="empty-task-input"
        placeholder="Bạn cần hoàn thành công việc gì?"
        className=" w-full pl-2 pr-20 text-sm focus:outline-none"
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
        onKeyDown={handleCreateTask}
      />
      {isCreating ? (
        <div className="absolute right-2 z-10">
          <Spinner size="sm" />
        </div>
      ) : (
        <div className="absolute right-2 z-10 flex gap-x-1">
          <Button
            className="aspect-square shadow-md"
            onClick={() => onCancel()}
          >
            <MdClose className="text-sm" />
          </Button>
          <Button
            className="aspect-square shadow-md"
            onClick={() =>
              onCreate({
                name,
                type,
                parentId: parentId ?? null,
              })
            }
          >
            <MdCheck className="text-sm" />
          </Button>
        </div>
      )}
    </div>
  );
};

export { EmptyTask };
