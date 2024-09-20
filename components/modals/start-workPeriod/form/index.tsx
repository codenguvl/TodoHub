"use client";
import { type WorkPeriod } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { NameField } from "./fields/name";
import { DurationField } from "./fields/duration";
import { StartDateField } from "./fields/start-date";
import { EndDateField } from "./fields/end-date";
import { DescriptionField } from "./fields/description";
import { useWorkPeriods } from "@/hooks/query-hooks/use-work-periods";
import { FormSubmit } from "@/components/form/submit";
import { useIsAuthenticated } from "@/hooks/use-is-authed";

export type FormValues = {
  name: string;
  duration: "1 week" | "2 weeks" | "3 weeks" | "4 weeks" | "custom";
  startDate: Date;
  endDate: Date;
  description: string;
};

export const DEFAULT_DURATION = "1 week";

const StartWorkPeriodForm: React.FC<{
  workPeriod: WorkPeriod;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ workPeriod, setModalIsOpen }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
    setValue,
    reset,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      name: workPeriod.name,
      duration:
        (workPeriod.duration as FormValues["duration"]) ?? DEFAULT_DURATION,
      startDate: workPeriod.startDate
        ? new Date(workPeriod.startDate)
        : new Date(),
      endDate: workPeriod.endDate ? new Date(workPeriod.endDate) : new Date(),
      description: workPeriod.description ?? "",
    },
  });
  const { updateWorkPeriod, isUpdating } = useWorkPeriods();
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();

  const queryClient = useQueryClient();

  const durationLabels: Record<FormValues["duration"], string> = {
    "1 week": "1 tuần",
    "2 weeks": "2 tuần",
    "3 weeks": "3 tuần",
    "4 weeks": "4 tuần",
    custom: "Tùy chỉnh",
  };

  function handleStartWorkPeriod(data: FormValues) {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    updateWorkPeriod(
      {
        workPeriodId: workPeriod.id,
        status: "ACTIVE",
        name: data.name,
        duration: data.duration ?? DEFAULT_DURATION,
        description: data.description,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
      },
      {
        onSuccess: () => {
          // eslint-disable-next-line
          queryClient.invalidateQueries(["tasks"]);
          handleClose();
        },
      }
    );
  }

  function handleClose() {
    reset();
    setModalIsOpen(false);
  }

  return (
    <form
      // eslint-disable-next-line
      onSubmit={handleSubmit(handleStartWorkPeriod)}
      className="relative h-full"
    >
      <NameField register={register} errors={errors} />
      <label
        htmlFor="duration"
        className="block text-sm font-medium text-gray-700"
      >
        Thời gian: {durationLabels[watch("duration") as FormValues["duration"]]}
      </label>
      <DurationField control={control} errors={errors} />
      <StartDateField register={register} errors={errors} control={control} />
      <EndDateField
        register={register}
        errors={errors}
        duration={watch("duration")}
        startDate={watch("startDate")}
        setValue={setValue}
      />
      <DescriptionField register={register} />
      <FormSubmit
        submitText="Bắt đầu"
        ariaLabel="Bắt đầu khoảng thời gian làm việc"
        onCancel={handleClose}
        isLoading={isUpdating}
      />
    </form>
  );
};

export { StartWorkPeriodForm };
