import { useState } from "react";
import clsx from "clsx";
import { type TaskType } from "@/utils/types";
import { TaskIcon } from "./task-icon";
import { FaChevronDown } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectIcon,
  SelectItem,
  SelectPortal,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from "@/components/ui/select";
import { TooltipWrapper } from "../ui/tooltip";
import { capitalize } from "@/utils/helpers";

const TASK_TYPE_LABELS: Record<TaskType["type"], string> = {
  HIGH_PRIORITY: "Cao",
  MEDIUM_PRIORITY: "Trung bình",
  LOW_PRIORITY: "Thấp",
};

export const TASK_TYPES: TaskType["type"][] = [
  "HIGH_PRIORITY",
  "MEDIUM_PRIORITY",
  "LOW_PRIORITY",
];
const SUBTASK_OPTIONS: TaskType["type"][] = ["SUBTASK"];
const TaskSelectType: React.FC<{
  currentType: TaskType["type"];
  dropdownIcon?: boolean;
  onSelect?: (type: TaskType["type"]) => void;
}> = ({ currentType, dropdownIcon, onSelect }) => {
  const [selected, setSelected] = useState(currentType);

  function handleSelect(selected: string) {
    const _selected = selected as TaskType["type"];
    if (onSelect) {
      onSelect(_selected);
    }
    setSelected(_selected);
  }
  return (
    <Select onValueChange={handleSelect}>
      <TooltipWrapper
        text={`${capitalize(selected)} - Thay đổi loại công việc`}
        side="top"
      >
        <SelectTrigger className="flex items-center gap-x-1 rounded-[3px] bg-opacity-30 p-1.5 text-xs font-semibold text-white hover:bg-gray-200 focus:ring-2">
          <SelectValue>
            <TaskIcon taskType={selected} />
          </SelectValue>
          {dropdownIcon ? (
            <SelectIcon>
              <FaChevronDown className="text-gray-500" />
            </SelectIcon>
          ) : null}
        </SelectTrigger>
      </TooltipWrapper>
      <SelectContent position="popper">
        <SelectViewport className="w-52 rounded-md border border-gray-300 bg-white py-2 shadow-md">
          <span className="pl-3 text-xs text-gray-500">
            THAY ĐỔI LOẠI CÔNG VIỆC
          </span>
          <SelectGroup>
            {(currentType === "SUBTASK" ? SUBTASK_OPTIONS : TASK_TYPES).map(
              (type) => (
                <SelectItem
                  key={type}
                  value={type}
                  className={clsx(
                    "border-transparent py-2 pl-3 text-sm hover:cursor-default hover:bg-gray-50"
                  )}
                >
                  <div className="flex">
                    <TaskIcon taskType={type} />
                    <span className={clsx("px-2 text-xs")}>
                      {TASK_TYPE_LABELS[type]}
                    </span>
                  </div>
                </SelectItem>
              )
            )}
          </SelectGroup>
        </SelectViewport>
      </SelectContent>
    </Select>
  );
};

export { TaskSelectType };
