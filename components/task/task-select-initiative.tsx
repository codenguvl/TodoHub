import { type ReactNode, useState } from "react";
import { useTasks } from "@/hooks/query-hooks/use-tasks";
import clsx from "clsx";
import { TaskIcon } from "./task-icon";
import { type TaskType } from "@/utils/types";
import { isInitiative } from "@/utils/helpers";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectPortal,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from "@/components/ui/select";
import { TooltipWrapper } from "../ui/tooltip";
import { useIsAuthenticated } from "@/hooks/use-is-authed";

const TaskSelectInitiative: React.FC<{
  task: TaskType;
  children: ReactNode;
  className?: string;
}> = ({ task, children, className }) => {
  const { tasks, updateTask } = useTasks();
  const [selected, setSelected] = useState<string | null>(task.parentId);
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();

  function handleSelect(id: string | null) {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    updateTask({
      taskId: task.id,
      parentId: id,
    });
    setSelected(id);
  }

  return (
    <Select onValueChange={handleSelect}>
      <TooltipWrapper
        text={`Sáng kiến - ${selected ? "Thay đổi" : "Thêm"} sáng kiến`}
        side="top"
      >
        <SelectTrigger
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-x-1 rounded-[3px] p-1.5 text-xs font-semibold text-white hover:bg-gray-200 focus:ring-2"
        >
          <SelectValue
            defaultValue={selected ?? undefined}
            className={className}
          >
            {children}
          </SelectValue>
        </SelectTrigger>
      </TooltipWrapper>
      <SelectContent position="popper">
        <SelectViewport className="min-w-60 rounded-md border border-gray-300 bg-white pt-2 shadow-md">
          <span className="pl-3 text-xs text-gray-500">SÁNG KIẾN</span>{" "}
          <SelectGroup>
            {tasks
              ?.filter((task) => isInitiative(task))
              .map((task) => (
                <SelectItem
                  key={task.id}
                  value={task.id}
                  className={clsx(
                    "border-l-[3px] border-transparent py-2 pl-3 text-sm hover:cursor-pointer  hover:bg-gray-50 [&[data-state=checked]]:bg-gray-200"
                  )}
                >
                  <div className="flex items-center">
                    <TaskIcon taskType={task.type} />
                    <span className="rounded-md bg-opacity-30 px-4 text-sm">
                      {task.name}
                    </span>
                  </div>
                </SelectItem>
              ))}
          </SelectGroup>
          <SelectSeparator className="mt-2 h-[1px] bg-gray-300" />
          <button
            onClick={() => handleSelect(null)}
            className="w-full py-3 pl-4 text-left text-sm text-gray-500 hover:bg-gray-100"
          >
            Ngắt liên kết cha
          </button>
          <button className="w-full py-3 pl-4 text-left text-sm text-gray-500 hover:bg-gray-100">
            Xem tất cả sáng kiến{" "}
          </button>
        </SelectViewport>
      </SelectContent>
    </Select>
  );
};

export { TaskSelectInitiative };
