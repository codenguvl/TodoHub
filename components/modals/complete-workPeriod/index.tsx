"use client";
import { useState, type ReactNode } from "react";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalOverlay,
  ModalPortal,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal";
import { type WorkPeriod } from "@prisma/client";
import { CompleteWorkPeriodForm } from "./form";
import { type TaskType } from "@/utils/types";
import { WorkPeriodTrophy } from "@/components/svgs";

const CompleteWorkPeriodModal: React.FC<{
  children: ReactNode;
  tasks: TaskType[];
  workPeriod: WorkPeriod;
}> = ({ children, tasks, workPeriod }) => {
  const [isOpen, setIsOpen] = useState(false);
  const completedTasks = tasks.filter((task) => task.status === "DONE");
  const openTasks = tasks.filter((task) => task.status !== "DONE");
  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalPortal>
        <ModalOverlay />
        <ModalContent className="max-w-[540px]">
          <WorkPeriodTrophy className="-m-8 mb-8" size={540} />
          <ModalTitle>Hoàn thành {workPeriod.name}</ModalTitle>
          <ModalDescription>
            <span className="text-gray-600">
              Khoảng thời gian làm việc này gồm:
            </span>
            <ul className="ml-6 mt-2 list-disc text-sm text-gray-900">
              <li>
                <span className="font-bold">{completedTasks.length} </span>
                nhiệm vụ đã hoàn thành
              </li>
              <li>
                <span className="font-bold">{openTasks.length} </span>
                nhiệm vụ đang mở
              </li>
            </ul>
          </ModalDescription>
          <CompleteWorkPeriodForm
            workPeriod={workPeriod}
            setModalIsOpen={setIsOpen}
            tasks={tasks}
          />
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
};

export { CompleteWorkPeriodModal };
