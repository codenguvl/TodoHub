import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownPortal,
  DropdownTrigger,
} from "@/components/ui/dropdown-menu";
import { FaChevronDown } from "react-icons/fa";
import { TooltipWrapper } from "@/components/ui/tooltip";
import { useFiltersContext } from "@/context/use-filters-context";
import { Button } from "@/components/ui/button";
import { CountBall } from "./task/task-status-count";
import { useWorkPeriods } from "@/hooks/query-hooks/use-work-periods";
import { type WorkPeriod } from "@prisma/client";

const WorkPeriodFilter: React.FC = () => {
  const { workPeriods: filterWorkPeriods, setWorkPeriods } =
    useFiltersContext();
  const { workPeriods } = useWorkPeriods();

  console.log(workPeriods);

  function filterActiveWorkPeriods(workPeriod: WorkPeriod) {
    return workPeriod.status === "ACTIVE";
  }

  function onSelectChange(
    e: React.ChangeEvent<HTMLInputElement>,
    workPeriod: WorkPeriod
  ) {
    if (e.target.checked) {
      setWorkPeriods((prev) => [...prev, workPeriod.id]);
    } else {
      setWorkPeriods((prev) => prev.filter((id) => id !== workPeriod.id));
    }
  }

  return (
    <Dropdown>
      <DropdownTrigger className="rounded-[3px] [&[data-state=open]]:bg-gray-700 [&[data-state=open]]:text-white">
        <Button
          customColors
          className="flex items-center gap-x-2 transition-all duration-200 hover:bg-gray-200"
        >
          <span className="text-sm">Thời gian làm việc</span>
          <CountBall
            count={filterWorkPeriods.length}
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
          className="z-10 mt-2 w-64 rounded-[3px] border-[0.3px] bg-white py-2 shadow-md"
        >
          {workPeriods &&
          workPeriods.filter(filterActiveWorkPeriods).length > 0 ? ( // Added check for undefined
            workPeriods.filter(filterActiveWorkPeriods).map((workPeriod) => (
              <DropdownItem
                onSelect={(e) => e.preventDefault()}
                key={workPeriod.id}
                className="px-3 py-1.5 text-sm hover:bg-gray-100"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onSelectChange(e, workPeriod)
                }
              >
                <div className="flex items-center gap-x-2 hover:cursor-default">
                  <input
                    type="checkbox"
                    className="form-checkbox h-3 w-3 rounded-sm text-inprogress"
                    checked={filterWorkPeriods.includes(workPeriod.id)}
                  />
                  <TooltipWrapper text={workPeriod.name}>
                    <span className="text-sm text-gray-700">
                      {workPeriod.name}
                    </span>
                  </TooltipWrapper>
                </div>
              </DropdownItem>
            ))
          ) : (
            <div className="px-3 py-1.5 text-sm text-gray-500">
              chưa có thời gian công việc nào được bắt đầu
            </div>
          )}
        </DropdownContent>
      </DropdownPortal>
    </Dropdown>
  );
};

export { WorkPeriodFilter };
