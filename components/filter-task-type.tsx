import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownPortal,
  DropdownTrigger,
} from "@/components/ui/dropdown-menu";
import { FaChevronDown } from "react-icons/fa";
import { capitalize } from "@/utils/helpers";
import { TooltipWrapper } from "@/components/ui/tooltip";
import { type TaskType } from "@/utils/types";
import { TASK_TYPES } from "@/components/task/task-select-type";
import { TaskIcon } from "@/components/task/task-icon";
import { useFiltersContext } from "@/context/use-filters-context";
import { Button } from "@/components/ui/button";
import { CountBall } from "./task/task-status-count";

const TaskTypeFilter: React.FC = () => {
  const { taskTypes, setTaskTypes } = useFiltersContext();

  const TASK_TYPE_LABELS: Record<TaskType["type"], string> = {
    HIGH_PRIORITY: "Cao",
    MEDIUM_PRIORITY: "Trung bình",
    LOW_PRIORITY: "Thấp",
  };

  function onSelectChange(
    e: React.ChangeEvent<HTMLInputElement>,
    taskType: TaskType["type"]
  ) {
    if (e.target.checked) {
      setTaskTypes((prev) => [...prev, taskType]);
    } else {
      setTaskTypes((prev) => prev.filter((type) => type !== taskType));
    }
  }
  return (
    <Dropdown>
      <DropdownTrigger className="rounded-[3px] [&[data-state=open]]:bg-gray-700 [&[data-state=open]]:text-white">
        <Button
          customColors
          className="flex items-center  gap-x-2 transition-all duration-200 hover:bg-gray-200"
        >
          <span className="text-sm">Loại công việc</span>
          <CountBall
            count={taskTypes.length}
            className="bg-inprogress text-xs text-white"
            hideOnZero={true}
          />
          <FaChevronDown className="text-xs" />
        </Button>
      </DropdownTrigger>
      <DropdownPortal>
        <DropdownContent
          side="bottom"
          align="start"
          className="z-10 mt-2 w-52 rounded-[3px] border-[0.3px] bg-white py-4 shadow-md"
        >
          {TASK_TYPES.map((type) => (
            <DropdownItem
              onSelect={(e) => e.preventDefault()}
              key={type}
              className="px-3 py-1.5 text-sm hover:bg-gray-100"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onSelectChange(e, type)
              }
            >
              <div className="flex items-center gap-x-2 hover:cursor-default">
                <label htmlFor="task-type-filter" className="sr-only">
                  Hộp kiểm lọc loại công việc
                </label>
                <input
                  type="checkbox"
                  id="task-type-filter"
                  className="form-checkbox h-3 w-3 rounded-sm text-inprogress"
                  checked={taskTypes.includes(type)}
                />

                <TaskIcon taskType={type} />
                <TooltipWrapper text={capitalize(type)}>
                  <span className="text-sm text-gray-700">
                    {TASK_TYPE_LABELS[type]}
                  </span>
                </TooltipWrapper>
              </div>
            </DropdownItem>
          ))}
        </DropdownContent>
      </DropdownPortal>
    </Dropdown>
  );
};

export { TaskTypeFilter };
