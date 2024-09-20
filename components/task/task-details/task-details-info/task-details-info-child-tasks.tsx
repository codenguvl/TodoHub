import { TaskIcon } from "../../task-icon";
import { TaskTitle } from "../../task-title";
import { Button } from "@/components/ui/button";
import { TaskContextMenu } from "../../task-menu";
import { MdEdit } from "react-icons/md";
import { TaskSelectStatus } from "../../task-select-status";
import { TaskAssigneeSelect } from "../../task-select-assignee";
import clsx from "clsx";
import { useSelectedTaskContext } from "@/context/use-selected-task-context";
import { Fragment, useRef, useState } from "react";
import { ContextTrigger } from "@/components/ui/context-menu";
import { type TaskType } from "@/utils/types";
import { AiOutlinePlus } from "react-icons/ai";
import { EmptyTask } from "@/components/task/task-empty";
import { useTasks } from "@/hooks/query-hooks/use-tasks";
import { ProgressBar } from "@/components/progress-bar";
import { useIsAuthenticated } from "@/hooks/use-is-authed";

const ChildTaskList: React.FC<{
  tasks: TaskType[];
  parentIsInitiative: boolean;
  parentId: TaskType["id"];
  isAddingChildTask: boolean;
  setIsAddingChildTask: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  tasks,
  parentIsInitiative,
  parentId,
  isAddingChildTask,
  setIsAddingChildTask,
}) => {
  const { createTask, isCreating } = useTasks();
  const [isEditing, setIsEditing] = useState(isAddingChildTask);
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();

  function handleCreateTask({
    name,
    type,
    parentId,
  }: {
    name: string;
    type: TaskType["type"];
    parentId: TaskType["id"] | null;
  }) {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    if (!name) {
      return;
    }
    createTask(
      {
        name,
        type,
        parentId,
        workPeriodId: null,
        reporterId: null,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          setIsAddingChildTask(false);
        },
      }
    );
  }
  return (
    <Fragment>
      <div className="flex items-center justify-between">
        <h2>Tác vụ con</h2>
        <Button
          onClick={() => setIsEditing(true)}
          customColors
          customPadding
          className="p-1 hover:bg-gray-100"
        >
          <AiOutlinePlus />
        </Button>
      </div>
      {tasks.length ? <ProgressBar tasks={tasks} /> : null}
      <div className="mt-3" />
      {tasks
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
        .map((task) => {
          return <ChildTask key={task.key} task={task} />;
        })}
      <EmptyTask
        data-state={isEditing || isAddingChildTask ? "open" : "closed"}
        className="[&[data-state=closed]]:hidden"
        onCreate={({ name, type, parentId }) =>
          handleCreateTask({ name, type, parentId })
        }
        onCancel={() => {
          setIsEditing(false);
          setIsAddingChildTask(false);
        }}
        isCreating={isCreating}
        isSubtask={!parentIsInitiative}
        parentId={parentId}
      />
    </Fragment>
  );
};

const ChildTask: React.FC<{ task: TaskType }> = ({ task }) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setTaskKey, taskKey } = useSelectedTaskContext();
  return (
    <div
      key={task.id}
      data-state={taskKey == task.key ? "selected" : "not-selected"}
      onClick={() => setTaskKey(task.key)}
      className={clsx(
        "group flex w-full max-w-full items-center justify-between border-[0.3px] border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 [&[data-state=selected]]:bg-blue-100"
      )}
    >
      <div
        data-state={isEditing ? "editing" : "not-editing"}
        className="flex w-fit items-center gap-x-2 [&[data-state=editing]]:w-full [&[data-state=not-editing]]:overflow-x-hidden"
      >
        <TaskIcon taskType={task.type} />
        <div
          data-state={task.status}
          className="whitespace-nowrap text-sm text-gray-500 [&[data-state=DONE]]:line-through"
        >
          {task.key}
        </div>

        <TaskTitle
          key={task.id + task.name}
          className="truncate py-1.5 text-sm hover:cursor-pointer hover:underline"
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          task={task}
          useTooltip={true}
          ref={inputRef}
        />

        <div
          data-state={isEditing ? "editing" : "not-editing"}
          className="flex items-center gap-x-1 [&[data-state=editing]]:hidden"
        >
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(!isEditing);
            }}
            className="invisible w-0 px-0 group-hover:visible group-hover:w-fit group-hover:bg-transparent group-hover:px-1.5 group-hover:hover:bg-gray-200 "
          >
            <MdEdit className="text-sm" />
          </Button>
        </div>
      </div>
      <TaskContextMenu isEditing={isEditing} className="flex-auto">
        <ContextTrigger className="h-8 w-full" />
      </TaskContextMenu>
      <div className="relative ml-2 flex min-w-fit items-center justify-end gap-x-2">
        <TaskAssigneeSelect task={task} avatarSize={20} avatarOnly />
        <TaskSelectStatus
          key={task.id + task.status}
          currentStatus={task.status}
          taskId={task.id}
        />
      </div>
    </div>
  );
};

export { ChildTaskList };
