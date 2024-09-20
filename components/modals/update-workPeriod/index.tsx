"use client";
import {
  Modal,
  ModalContent,
  ModalOverlay,
  ModalPortal,
  ModalTitle,
} from "@/components/ui/modal";
import { type WorkPeriod } from "@prisma/client";
import { UpdateWorkPeriodForm } from "./form";

const UpdateWorkPeriodModal: React.FC<{
  workPeriod: WorkPeriod;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ workPeriod, isOpen, setIsOpen }) => {
  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <ModalPortal>
        <ModalOverlay />
        <ModalContent>
          <ModalTitle>Chỉnh sửa lịch làm việc: {workPeriod.name}</ModalTitle>
          <UpdateWorkPeriodForm
            workPeriod={workPeriod}
            setModalIsOpen={setIsOpen}
          />
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
};

export { UpdateWorkPeriodModal };
