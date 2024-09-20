import { type ReactNode } from "react";
import { CheckboxIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { type Task as TaskType } from "@prisma/client";

type TaskIconProps = {
  taskType: TaskType["type"];
};

const Icon: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div className={clsx("rounded-sm  p-0.5 text-sm text-white", className)}>
      {children}
    </div>
  );
};

const _SubTaskIcon = () => {
  return (
    <Icon className="h-fit bg-subtask">
      <CheckboxIcon />
    </Icon>
  );
};

const TaskIcon = () => {
  return (
    <Icon className="h-fit bg-task">
      <CheckboxIcon />
    </Icon>
  );
};

const InitiativeIcon = () => {
  return (
    <Icon className="h-fit bg-initiative">
      <CheckboxIcon />
    </Icon>
  );
};

const HighPriorityIcon = () => {
  return (
    <Icon className="h-fit bg-high-priority">
      <CheckboxIcon />
    </Icon>
  );
};

const MediumPriorityIcon = () => {
  return (
    <Icon className="h-fit bg-medium-priority">
      <CheckboxIcon />
    </Icon>
  );
};

const LowPriorityIcon = () => {
  return (
    <Icon className="h-fit bg-low-priority">
      <CheckboxIcon />
    </Icon>
  );
};

const TaskIconComponent: React.FC<TaskIconProps> = ({ taskType }) => {
  if (taskType === "TASK") return <TaskIcon />;
  if (taskType === "HIGH_PRIORITY") return <HighPriorityIcon />;
  if (taskType === "MEDIUM_PRIORITY") return <MediumPriorityIcon />;
  if (taskType === "LOW_PRIORITY") return <LowPriorityIcon />;
  if (taskType === "SUBTASK") return <_SubTaskIcon />;
  if (taskType === "INITIATIVE") return <InitiativeIcon />;

  return null;
};

export { TaskIconComponent as TaskIcon };
