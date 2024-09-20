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
import { StartWorkPeriodForm } from "./form";

const StartWorkPeriodModal: React.FC<{
  children: ReactNode;
  taskCount: number;
  workPeriod: WorkPeriod;
}> = ({ children, taskCount, workPeriod }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalPortal>
        <ModalOverlay />
        <ModalContent>
          <ModalTitle>Bắt đầu khoảng thời gian làm việc</ModalTitle>
          <ModalDescription>
            <span className="font-bold text-gray-600">{taskCount}</span>
            {taskCount > 1 ? " nhiệm vụ" : " nhiệm vụ"} sẽ được bao gồm trong khoảng thời gian làm việc này.
          </ModalDescription>
          <StartWorkPeriodForm
            workPeriod={workPeriod}
            setModalIsOpen={setIsOpen}
          />
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
};

export { StartWorkPeriodModal };
