import { TaskDetails } from "@/components/task/task-details";
import {
  Modal,
  ModalContent,
  ModalOverlay,
  ModalPortal,
} from "@/components/ui/modal";
import { useSelectedTaskContext } from "@/context/use-selected-task-context";
import { useEffect, useState } from "react";

const TaskDetailsModal: React.FC = () => {
  const { setTaskKey, taskKey } = useSelectedTaskContext();
  const [isOpen, setIsOpen] = useState(() => !!taskKey);

  function handleOpenChange(open: boolean) {
    if (open) return;
    setTaskKey(null);
    setIsOpen(false);
  }

  useEffect(() => {
    if (taskKey) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [taskKey, setIsOpen]);
  return (
    <Modal open={isOpen} onOpenChange={handleOpenChange}>
      <ModalPortal>
        <ModalOverlay />
        <ModalContent className="h-fit max-h-[80vh] w-[80vw] overflow-hidden">
          <TaskDetails taskKey={taskKey} setTaskKey={setTaskKey} />
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
};

export { TaskDetailsModal };
