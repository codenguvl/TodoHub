"use client";
import { Button } from "../ui/button";
import { TaskSelectType } from "./task-select-type";
import { type TaskType } from "@/utils/types";
import { TaskSelectInitiative } from "./task-select-initiative";
import { toast } from "../toast";
import { TaskIcon } from "./task-icon";
import { AiOutlinePlus } from "react-icons/ai";
import { isInitiative } from "@/utils/helpers";
import { type ReactNode } from "react";
import { useTasks } from "@/hooks/query-hooks/use-tasks";
import { TooltipWrapper } from "../ui/tooltip";
import { useIsAuthenticated } from "@/hooks/use-is-authed";

const TaskPath: React.FC<{
  task: TaskType;
  setTaskKey: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ task, setTaskKey }) => {
  if (isInitiative(task))
    return (
      <div className="flex items-center">
        <TaskIcon taskType={task.type} />
        <TooltipWrapper text={`${task.key}: ${task.name}`} side="top">
          <Button
            onClick={() => setTaskKey(task.key)}
            customColors
            className="bg-transparent text-xs text-gray-500 underline-offset-2 hover:underline"
          >
            <span className="whitespace-nowrap">{task.key}</span>
          </Button>
        </TooltipWrapper>
      </div>
    );

  if (task.parent && isInitiative(task.parent))
    return (
      <ParentContainer task={task} setTaskKey={setTaskKey}>
        <TaskSelectInitiative task={task} key={task.id}>
          <TaskIcon taskType={task.parent.type} />
        </TaskSelectInitiative>
      </ParentContainer>
    );

  if (task.parent)
    return (
      <ParentContainer task={task} setTaskKey={setTaskKey}>
        <TaskIcon taskType={task.parent.type} />
      </ParentContainer>
    );

  return (
    <ParentContainer task={task} setTaskKey={setTaskKey}>
      <TaskSelectInitiative task={task}>
        <AddInitiative />
      </TaskSelectInitiative>
    </ParentContainer>
  );
};

const ParentContainer: React.FC<{
  children: ReactNode;
  task: TaskType;
  setTaskKey: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ children, task, setTaskKey }) => {
  const { updateTask } = useTasks();
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();

  function handleSelectType(type: TaskType["type"]) {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    updateTask(
      {
        taskId: task.id,
        type,
      },
      {
        onSuccess: (data) => {
          toast.success({
            message: `Task type updated to ${data.type}`,
            description: "Task type changed",
          });
        },
      }
    );
  }
  return (
    <div className="flex gap-x-3">
      <div className="flex items-center">
        {children}
        <TaskLink task={task.parent} setTaskKey={setTaskKey} />
      </div>
      <span className="py-1.5 text-gray-500">/</span>
      <div className="relative flex items-center">
        <TaskSelectType
          key={task.id + task.type}
          currentType={task.type}
          onSelect={handleSelectType}
        />
        <TooltipWrapper text={`${task.key}: ${task.name}`} side="top">
          <TaskLink task={task} setTaskKey={setTaskKey} />
        </TooltipWrapper>
      </div>
    </div>
  );
};

const TaskLink: React.FC<{
  task: TaskType | TaskType["parent"] | null;
  setTaskKey: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ task, setTaskKey }) => {
  if (!task) return <div />;
  return (
    <TooltipWrapper text={`${task.key}: ${task.name}`} side="top">
      <Button
        onClick={() => setTaskKey(task?.key ?? null)}
        customColors
        className=" bg-transparent text-xs text-gray-500 underline-offset-2 hover:underline"
      >
        <span className="whitespace-nowrap">{task?.key}</span>
      </Button>
    </TooltipWrapper>
  );
};

const AddInitiative: React.FC = () => {
  return (
    <div className="flex items-center font-normal text-gray-500">
      <AiOutlinePlus className="text-sm" />
      <span>Add Initiative</span>
    </div>
  );
};

export { TaskPath };
