import { useUser } from "@clerk/nextjs";
import { FaChevronUp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { type TaskType } from "@/utils/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar } from "@/components/avatar";
import { useWorkPeriods } from "@/hooks/query-hooks/use-work-periods";
import { TaskAssigneeSelect } from "../../task-select-assignee";
import { useTasks } from "@/hooks/query-hooks/use-tasks";
import { useIsAuthenticated } from "@/hooks/use-is-authed";

const TaskDetailsInfoAccordion: React.FC<{ task: TaskType }> = ({ task }) => {
  const { updateTask } = useTasks();
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();
  const { workPeriods } = useWorkPeriods();
  const { user } = useUser();
  const [openAccordion, setOpenAccordion] = useState("details");

  function handleAutoAssign() {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    updateTask({
      taskId: task.id,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      assigneeId: user!.id,
    });
  }
  return (
    <Accordion
      onValueChange={setOpenAccordion}
      value={openAccordion}
      className="my-3 w-min min-w-full rounded-[3px] border"
      type="single"
      collapsible
    >
      <AccordionItem value={"details"}>
        <AccordionTrigger className="flex w-full items-center justify-between p-2 font-medium hover:bg-gray-100 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]]:border-b">
          <div className="flex items-center gap-x-1">
            <span className="text-sm">Chi tiết</span>
          </div>
          <FaChevronUp
            className="mr-2 text-xs text-black transition-transform"
            aria-hidden
          />
        </AccordionTrigger>
        <AccordionContent className="flex flex-col bg-white px-3 [&[data-state=open]]:py-2">
          <div
            data-state={task.assignee ? "assigned" : "unassigned"}
            className="my-2 grid grid-cols-3 [&[data-state=assigned]]:items-center"
          >
            <span className="text-sm font-semibold text-gray-600">
              Người được giao
            </span>
            <div className="flex flex-col">
              <TaskAssigneeSelect task={task} />
              <Button
                onClick={handleAutoAssign}
                data-state={task.assignee ? "assigned" : "unassigned"}
                customColors
                customPadding
                className="mt-1 hidden text-sm text-blue-600 underline-offset-2 hover:underline [&[data-state=unassigned]]:flex"
              >
                Giao cho tôi
              </Button>
            </div>
          </div>
          <div className="my-4 grid grid-cols-3 items-center">
            <span className="text-sm font-semibold text-gray-600">
              Lịch làm việc
            </span>
            <div className="flex items-center">
              <span className="text-sm text-gray-700">
                {workPeriods?.find(
                  (workPeriod) => workPeriod?.id == task.workPeriodId
                )?.name ?? "Không có"}
              </span>
            </div>
          </div>
          <div className="my-2 grid grid-cols-3  items-center">
            <span className="text-sm font-semibold text-gray-600">
              Người báo cáo
            </span>
            <div className="flex items-center gap-x-3 ">
              <Avatar
                src={task.reporter?.avatar}
                alt={`${task.reporter?.name ?? "Chưa được giao"}`}
              />
              <span className="whitespace-nowrap text-sm">
                {task.reporter?.name}
              </span>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export { TaskDetailsInfoAccordion };
