"use client";
import { Fragment, useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { TaskList } from "./task-list";
import { TaskStatusCount } from "../task/task-status-count";
import { type WorkPeriod } from "@prisma/client";
import { type TaskType } from "@/utils/types";
import { WorkPeriodDropdownMenu } from "./workPeriod-menu";
import { DropdownTrigger } from "../ui/dropdown-menu";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { StartWorkPeriodModal } from "@/components/modals/start-workPeriod";
import { CompleteWorkPeriodModal } from "../modals/complete-workPeriod";
import { UpdateWorkPeriodModal } from "../modals/update-workPeriod";
import { AlertModal } from "../modals/alert";
import { useQueryClient } from "@tanstack/react-query";
import { useWorkPeriods } from "@/hooks/query-hooks/use-work-periods";
import { toast } from "../toast";
import { useIsAuthenticated } from "@/hooks/use-is-authed";
import { getPluralEnd } from "@/utils/helpers";

const WorkPeriodList: React.FC<{
  workPeriod: WorkPeriod;
  tasks: TaskType[];
}> = ({ workPeriod, tasks }) => {
  const [openAccordion, setOpenAccordion] = useState("");
  useEffect(() => {
    setOpenAccordion(workPeriod.id); // Open accordion on mount in order for DND to work.
  }, [workPeriod.id]);

  return (
    <Accordion
      onValueChange={setOpenAccordion}
      value={openAccordion}
      className="overflow-hidden rounded-lg bg-gray-100 p-2"
      type="single"
      collapsible
    >
      <AccordionItem value={workPeriod.id}>
        <WorkPeriodListHeader workPeriod={workPeriod} tasks={tasks} />
        <TaskList workPeriodId={workPeriod.id} tasks={tasks} />
      </AccordionItem>
    </Accordion>
  );
};

const WorkPeriodListHeader: React.FC<{
  tasks: TaskType[];
  workPeriod: WorkPeriod;
}> = ({ tasks, workPeriod }) => {
  const [updateModalIsOpen, setUpdateModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();
  const { deleteWorkPeriod } = useWorkPeriods();

  function handleDeleteWorkPeriod() {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    deleteWorkPeriod(
      { workPeriodId: workPeriod.id },
      {
        onSuccess: () => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          queryClient.invalidateQueries(["tasks"]);
          toast.success({
            message: `Deleted work period ${workPeriod.name}`,
            description: "Work period deleted",
          });
          setDeleteModalIsOpen(false);
        },
        onError: () => {
          toast.error({
            message: `Failed to delete work period ${workPeriod.name}`,
            description: "Something went wrong",
          });
        },
      }
    );
  }

  function getFormattedDateRange(
    startDate: Date | undefined | null,
    endDate: Date | undefined | null
  ) {
    if (!startDate || !endDate) {
      return "";
    }
    return `${new Date(startDate).toLocaleDateString("en", {
      day: "numeric",
      month: "short",
    })} - ${new Date(endDate).toLocaleDateString("en", {
      day: "numeric",
      month: "short",
    })}`;
  }

  return (
    <Fragment>
      <UpdateWorkPeriodModal
        isOpen={updateModalIsOpen}
        setIsOpen={setUpdateModalIsOpen}
        workPeriod={workPeriod}
      />
      <AlertModal
        isOpen={deleteModalIsOpen}
        setIsOpen={setDeleteModalIsOpen}
        title="Xóa khoảng thời gian làm việc"
        description={`Bạn có chắc chắn muốn xóa khoảng thời gian làm việc BOLD${workPeriod.name}BOLD?`}
        actionText="Xóa"
        onAction={handleDeleteWorkPeriod}
      />
      <div className="flex w-full min-w-max items-center justify-between pl-2 text-sm">
        <AccordionTrigger className="flex w-full items-center font-medium [&[data-state=open]>svg]:rotate-90">
          <Fragment>
            <FaChevronRight
              className="mr-2 text-xs text-black transition-transform"
              aria-hidden
            />
            <div className="flex items-center gap-x-2">
              <div className="text-semibold whitespace-nowrap">
                {workPeriod.name}
              </div>
              <div className="flex items-center gap-x-3 whitespace-nowrap font-normal text-gray-500">
                <span>
                  {getFormattedDateRange(
                    workPeriod.startDate,
                    workPeriod.endDate
                  )}
                </span>
                <span>({tasks.length} nhiệm vụ)</span>
              </div>
            </div>
          </Fragment>
        </AccordionTrigger>
        <div className="flex items-center gap-x-2">
          <TaskStatusCount tasks={tasks} />
          <WorkPeriodActionButton workPeriod={workPeriod} tasks={tasks} />
          <WorkPeriodDropdownMenu
            setUpdateModalIsOpen={setUpdateModalIsOpen}
            setDeleteModalIsOpen={setDeleteModalIsOpen}
          >
            <DropdownTrigger
              asChild
              className="rounded-m flex items-center gap-x-1 px-1.5 py-0.5 text-xs font-semibold focus:ring-2"
            >
              <div className="rounded-sm bg-gray-200 px-1.5 py-1.5 text-gray-600 hover:cursor-pointer hover:bg-gray-300 [&[data-state=open]]:bg-gray-700 [&[data-state=open]]:text-white">
                <BsThreeDots className="sm:text-xl" />
              </div>
            </DropdownTrigger>
          </WorkPeriodDropdownMenu>
        </div>
      </div>
    </Fragment>
  );
};

const WorkPeriodActionButton: React.FC<{
  workPeriod: WorkPeriod;
  tasks: TaskType[];
}> = ({ workPeriod, tasks }) => {
  if (workPeriod.status === "ACTIVE") {
    return (
      <CompleteWorkPeriodModal tasks={tasks} workPeriod={workPeriod}>
        <Button>
          <span className="whitespace-nowrap">Hoàn thành</span>
        </Button>
      </CompleteWorkPeriodModal>
    );
  }

  if (workPeriod.status === "PENDING") {
    return (
      <StartWorkPeriodModal taskCount={tasks.length} workPeriod={workPeriod}>
        <Button>
          <span className="whitespace-nowrap">Bắt đầu</span>
        </Button>
      </StartWorkPeriodModal>
    );
  }

  return null;
};

export { WorkPeriodList };
