import { useCallback, useLayoutEffect, useRef, useState } from "react";
import {
  AccordionItem,
  Accordion,
  AccordionTrigger,
  AccordionContent,
} from "../ui/accordion";
import { FaChevronRight } from "react-icons/fa";
import { TaskIcon } from "../task/task-icon";
import { useTasks } from "@/hooks/query-hooks/use-tasks";
import clsx from "clsx";
import { TaskSelectStatus } from "../task/task-select-status";
import { TaskAssigneeSelect } from "../task/task-select-assignee";
import { AiOutlinePlus } from "react-icons/ai";
import { Button } from "../ui/button";
import { useSelectedTaskContext } from "@/context/use-selected-task-context";
import { EmptyTask } from "../task/task-empty";
import { type TaskType } from "@/utils/types";
import { useUser } from "@clerk/clerk-react";
import { LIGHT_COLORS } from "../color-picker";
import {
  assigneeNotInFilters,
  initiativeNotInFilters,
  isSubtask,
  taskNotInSearch,
  taskWorkPeriodNotInFilters,
  taskTypeNotInFilters,
} from "@/utils/helpers";
import { useFiltersContext } from "@/context/use-filters-context";
import { ProgressBar } from "@/components/progress-bar";
import { useIsAuthenticated } from "@/hooks/use-is-authed";
import { useProject } from "@/hooks/query-hooks/use-project";

type CreateTaskProps = {
  name: string;
  type: TaskType["type"];
  parentId?: TaskType["id"] | null;
  workPeriodColor?: string | null;
};

const InitiativesTable: React.FC = () => {
  const { createTask, isCreating } = useTasks();
  const [isCreatingInitiative, setIsCreatingInitiative] = useState(false);
  const renderContainerRef = useRef<HTMLDivElement>(null);
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();
  const { user } = useUser();
  const { project } = useProject();

  useLayoutEffect(() => {
    if (!renderContainerRef.current) return;
    const calculatedHeight = renderContainerRef.current.offsetTop + 15;
    renderContainerRef.current.style.height = `calc(100vh - ${calculatedHeight}px)`;
  }, []);

  function handleCreateTask({
    name,
    type,
    parentId = null,
    workPeriodColor = null,
  }: CreateTaskProps) {
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
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        reporterId: user!.id,
        workPeriodColor,
        projectId: project?.id ?? "",
      },
      {
        onSuccess: () => {
          setIsCreatingInitiative(false);
        },
      }
    );
  }

  return (
    <div
      className="w-full overflow-y-auto rounded-[3px] border"
      ref={renderContainerRef}
    >
      <div className="sticky top-0 z-10 h-10 bg-gray-100" />
      <InitiativesAccordion handleCreateTask={handleCreateTask} />
      <div className="sticky bottom-0 h-10 border-t bg-white">
        <Button
          onClick={() => setIsCreatingInitiative(true)}
          data-state={isCreatingInitiative ? "closed" : "open"}
          customColors
          className="flex w-full items-center gap-x-1.5 hover:bg-gray-100 [&[data-state=closed]]:hidden"
        >
          <AiOutlinePlus />
          <span className="text-[14px] font-medium">Thêm kế hoạch</span>
        </Button>
        <EmptyTask
          data-state={isCreatingInitiative ? "open" : "closed"}
          className="[&[data-state=closed]]:hidden"
          onCreate={({ name }) =>
            handleCreateTask({
              name,
              type: "INITIATIVE",
              workPeriodColor: LIGHT_COLORS[0]?.hex ?? null,
            })
          }
          onCancel={() => setIsCreatingInitiative(false)}
          isCreating={isCreating}
          isInitiative
        />
      </div>
    </div>
  );
};

const InitiativesAccordion: React.FC<{
  handleCreateTask: (props: CreateTaskProps) => void;
}> = ({ handleCreateTask }) => {
  const [creationParent, setCreationParent] = useState<number | null>(null);
  const { setTaskKey } = useSelectedTaskContext();
  const { tasks, isCreating } = useTasks();
  const { search, assignees, taskTypes, initiatives, workPeriods } =
    useFiltersContext();
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);

  const filterTasks = useCallback(
    (tasks: TaskType[] | undefined) => {
      if (!tasks) return [];
      const filteredTasks = tasks.filter((task) => {
        if (!isSubtask(task)) {
          if (taskNotInSearch({ task, search })) return false;
          if (assigneeNotInFilters({ task, assignees })) return false;
          if (initiativeNotInFilters({ task, initiatives })) return false;
          if (taskTypeNotInFilters({ task, taskTypes })) return false;
          if (
            taskWorkPeriodNotInFilters({
              task,
              workPeriodIds: workPeriods,
              excludeBacklog: true,
            })
          ) {
            return false;
          }
          return true;
        }
        return false;
      });

      return filteredTasks;
    },
    [search, assignees, initiatives, taskTypes, workPeriods]
  );

  function handleAddTaskToInitiative(taskKey: TaskType["key"], index: number) {
    setCreationParent(index);
    setOpenAccordions((prev) => [...prev, taskKey]);
  }

  return (
    <Accordion
      value={openAccordions}
      onValueChange={setOpenAccordions}
      type="multiple"
      className="overflow-hidden"
    >
      {tasks
        ?.filter((task) => task.type === "INITIATIVE")
        .map((task, index) => (
          <AccordionItem key={task.id} value={task.key}>
            <div
              className={clsx(
                index % 2 == 0 ? "bg-white" : "bg-gray-100",
                "flex w-full items-center justify-between hover:bg-gray-200"
              )}
            >
              <AccordionTrigger className="flex w-full items-center px-2 py-2.5 font-medium [&[data-state=open]>svg]:rotate-90">
                <FaChevronRight
                  data-state={
                    task.children.length ? "show-arrow" : "hide-arrow"
                  }
                  className="mr-2 text-xs text-transparent transition-transform [&[data-state=show-arrow]]:text-black"
                  aria-hidden
                />
              </AccordionTrigger>
              <div
                className="flex flex-grow items-center py-1.5"
                role="button"
                onClick={() => setTaskKey(task.key)}
              >
                <TaskIcon taskType="INITIATIVE" />
                <div className="flex flex-col gap-y-1 py-1">
                  <div className="flex items-center">
                    <div className="flex items-center gap-x-2">
                      <span className="ml-3 text-sm font-normal text-gray-500">
                        {task.key}
                      </span>
                      <span className="text-sm font-normal">{task.name}</span>
                    </div>
                  </div>
                  <div className="ml-3 w-64">
                    {task.children.length ? (
                      <ProgressBar variant="sm" tasks={task.children} />
                    ) : null}
                  </div>
                </div>
              </div>
              <Button
                customColors
                className="mr-2  hover:bg-gray-300"
                onClick={() => handleAddTaskToInitiative(task.key, index)}
              >
                <AiOutlinePlus />
              </Button>
            </div>
            <AccordionContent>
              {filterTasks(task.children)?.map((child) => (
                <div
                  key={child.key}
                  role="button"
                  onClick={() => setTaskKey(child.key)}
                  className="flex items-center justify-between p-1.5 pl-12 hover:bg-gray-100"
                >
                  <div className="flex items-center gap-x-2">
                    <TaskIcon taskType={child.type} />
                    <div
                      data-state={child.status}
                      className="whitespace-nowrap text-sm text-gray-500 [&[data-state=DONE]]:line-through"
                    >
                      {child.key}
                    </div>
                    <span className="text-sm">{child.name}</span>
                  </div>
                  <div className="flex items-center gap-x-2 pr-2">
                    <TaskSelectStatus
                      key={child.key + child.status}
                      currentStatus={child.status}
                      taskId={child.id}
                    />
                    <TaskAssigneeSelect
                      task={child}
                      avatarSize={18}
                      avatarOnly
                    />
                  </div>
                </div>
              ))}
              <EmptyTask
                data-state={creationParent == index ? "open" : "closed"}
                className="[&[data-state=closed]]:hidden"
                onCreate={({ name, type }) =>
                  handleCreateTask({ name, type, parentId: task.id })
                }
                onCancel={() => setCreationParent(null)}
                isCreating={isCreating}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
    </Accordion>
  );
};

export { InitiativesTable };
