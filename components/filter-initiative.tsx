import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownPortal,
  DropdownTrigger,
} from "@/components/ui/dropdown-menu";
import { FaChevronDown } from "react-icons/fa";
import { useTasks } from "@/hooks/query-hooks/use-tasks";
import { isInitiative } from "@/utils/helpers";
import { TooltipWrapper } from "@/components/ui/tooltip";
import { type TaskType } from "@/utils/types";
import { useFiltersContext } from "@/context/use-filters-context";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "./filter-search-bar";
import { CountBall } from "./task/task-status-count";

const InitiativeFilter: React.FC = () => {
  const { initiatives, setInitiatives } = useFiltersContext();
  const { tasks } = useTasks();
  const [search, setSearch] = useState("");

  function searchFilter(task: TaskType) {
    return (
      isInitiative(task) &&
      task.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  function onSelectChange(
    e: React.ChangeEvent<HTMLInputElement>,
    task: TaskType
  ) {
    if (e.target.checked) {
      setInitiatives((prev) => [...prev, task.id]);
    } else {
      setInitiatives((prev) => prev.filter((id) => id !== task.id));
    }
  }

  return (
    <Dropdown>
      <DropdownTrigger className="rounded-[3px] [&[data-state=open]]:bg-gray-700 [&[data-state=open]]:text-white">
        <Button
          customColors
          className="flex items-center gap-x-2 transition-all duration-200 hover:bg-gray-200"
        >
          <span className="text-sm">Yêu cầu</span>
          <CountBall
            count={initiatives.length}
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
          className="z-10 mt-2 w-64 rounded-[3px] border-[0.3px] bg-white pb-2 shadow-md"
        >
          <div className="w-full p-2">
            <SearchBar
              placeholder="Tìm kiếm yêu cầu..."
              fullWidth={true}
              search={search}
              setSearch={setSearch}
            />
          </div>
          {tasks?.filter(searchFilter).map((task) => (
            <DropdownItem
              onSelect={(e) => e.preventDefault()}
              key={task.id}
              className="px-3 py-1.5 text-sm hover:bg-gray-100"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onSelectChange(e, task)
              }
            >
              <div className="flex items-center gap-x-2 hover:cursor-default">
                <label htmlFor="initiative-filter" className="sr-only">
                  Hộp kiểm lọc yêu cầu
                </label>
                <input
                  type="checkbox"
                  id="initiative-filter"
                  className="form-checkbox h-3 w-3 rounded-sm text-inprogress"
                  checked={initiatives.includes(task.id)}
                />
                <TooltipWrapper text={task.name}>
                  <span className="text-sm text-gray-700">{task.name}</span>
                </TooltipWrapper>
              </div>
            </DropdownItem>
          ))}
          {tasks?.filter(searchFilter).length === 0 && (
            <div className="py-4 text-center text-sm text-gray-500">
              Không tìm thấy yêu cầu
            </div>
          )}
        </DropdownContent>
      </DropdownPortal>
    </Dropdown>
  );
};

export { InitiativeFilter };
