"use client";
import { Fragment, useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { TaskList } from "./task-list";
import { TaskStatusCount } from "../task/task-status-count";
import { type TaskType } from "@/utils/types";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useWorkPeriods } from "@/hooks/query-hooks/use-work-periods";
import { useIsAuthenticated } from "@/hooks/use-is-authed";
import { useProject } from "@/hooks/query-hooks/use-project";

const BacklogList: React.FC<{
  id: string;
  tasks: TaskType[];
}> = ({ id, tasks }) => {
  const [openAccordion, setOpenAccordion] = useState("");

  useEffect(() => {
    setOpenAccordion(`backlog`); // Open accordion on mount in order for DND to work.
  }, [id]);

  return (
    <Accordion
      className="rounded-md pb-20 pl-2"
      type="single"
      value={openAccordion}
      onValueChange={setOpenAccordion}
      collapsible
    >
      <AccordionItem value={`backlog`}>
        <BacklogListHeader tasks={tasks ?? []} />
        <TaskList workPeriodId={null} tasks={tasks ?? []} />
      </AccordionItem>
    </Accordion>
  );
};

const BacklogListHeader: React.FC<{ tasks: TaskType[] }> = ({ tasks }) => {
  const { createWorkPeriod } = useWorkPeriods();
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();
  const { project } = useProject();
  let projectId = project?.id;

  function handleCreateWorkPeriod() {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    if (projectId) {
      createWorkPeriod({ projectId });
    }
  }

  return (
    <div className="flex w-full items-center justify-between text-sm ">
      <AccordionTrigger className="flex w-full items-center p-2 font-medium [&[data-state=open]>svg]:rotate-90">
        <Fragment>
          <FaChevronRight
            className="mr-2 text-xs text-black transition-transform"
            aria-hidden
          />
          <div className="flex items-center">
            <div className="text-semibold">Danh sách chờ</div>
            <div className="ml-3 font-normal text-gray-500">
              ({tasks.length} nhiệm vụ)
            </div>
          </div>
        </Fragment>
      </AccordionTrigger>
      <div className="flex items-center gap-x-2 py-2">
        <TaskStatusCount tasks={tasks} />
        <Button onClick={handleCreateWorkPeriod}>
          <span className="whitespace-nowrap">Lên lịch làm việc</span>
        </Button>
      </div>
    </div>
  );
};

export { BacklogList };
