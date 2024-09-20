import { type WorkPeriod } from "@prisma/client";
import { useForm } from "react-hook-form";
import { WorkPeriodDropdownField } from "./fields/work-period-dropdown";
import { useTasks } from "@/hooks/query-hooks/use-tasks";
import { type TaskType } from "@/utils/types";
import { isDone } from "@/utils/helpers";
import { useWorkPeriods } from "@/hooks/query-hooks/use-work-periods";
import { FormSubmit } from "@/components/form/submit";
import { useIsAuthenticated } from "@/hooks/use-is-authed";

export type FormValues = {
  moveToWorkPeriodId: string;
};

const CompleteWorkPeriodForm: React.FC<{
  workPeriod: WorkPeriod;
  tasks: TaskType[];
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ workPeriod, setModalIsOpen, tasks }) => {
  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      moveToWorkPeriodId: "backlog",
    },
  });

  const { updateWorkPeriod, isUpdating } = useWorkPeriods();
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();
  const { updateTasksBatch, batchUpdating } = useTasks();

  function handleCompleteWorkPeriod(data: FormValues) {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    updateWorkPeriod(
      {
        workPeriodId: workPeriod.id,
        status: "CLOSED",
      },
      {
        onSuccess: () => {
          handleClose();
        },
      }
    );
    updateTasksBatch({
      ids: tasks?.filter((task) => !isDone(task)).map((task) => task.id) ?? [],
      workPeriodId:
        data.moveToWorkPeriodId === "backlog" ? null : data.moveToWorkPeriodId,
    });
  }

  function handleClose() {
    reset();
    setModalIsOpen(false);
  }

  return (
    <form
      // eslint-disable-next-line
      onSubmit={handleSubmit(handleCompleteWorkPeriod)}
      className="relative h-full"
    >
      <WorkPeriodDropdownField control={control} errors={errors} />
      <FormSubmit
        submitText="Hoàn thành"
        ariaLabel="Complete work period"
        onCancel={handleClose}
        isLoading={isUpdating || batchUpdating}
      />
    </form>
  );
};

export { CompleteWorkPeriodForm };
