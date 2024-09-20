"use client";
import React, { Fragment, useCallback, useLayoutEffect, useRef } from "react";
import { type TaskStatus } from "@prisma/client";
import "@/styles/split.css";
import { BoardHeader } from "./header";
import {
  DragDropContext,
  type DraggableLocation,
  type DropResult,
} from "react-beautiful-dnd";
import { useTasks } from "@/hooks/query-hooks/use-tasks";
import { type TaskType } from "@/utils/types";
import {
  assigneeNotInFilters,
  initiativeNotInFilters,
  insertItemIntoArray,
  isInitiative,
  isNullish,
  isSubtask,
  taskNotInSearch,
  taskWorkPeriodNotInFilters,
  taskTypeNotInFilters,
  moveItemWithinArray,
} from "@/utils/helpers";
import { TaskList } from "./task-list";
import { TaskDetailsModal } from "../modals/board-task-details";
import { useWorkPeriods } from "@/hooks/query-hooks/use-work-periods";
import { useProject } from "@/hooks/query-hooks/use-project";
import { useFiltersContext } from "@/context/use-filters-context";
import { useIsAuthenticated } from "@/hooks/use-is-authed";

const STATUSES: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];
const STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: "Chưa hoàn thành",
  IN_PROGRESS: "Đang tiến hành",
  DONE: "Đã hoàn thành",
};

const Board: React.FC = () => {
  const renderContainerRef = useRef<HTMLDivElement>(null);

  const { tasks } = useTasks();

  const { workPeriods } = useWorkPeriods();
  const { project } = useProject();
  const {
    search,
    assignees,
    taskTypes,
    initiatives,
    workPeriods: filterWorkPeriods,
  } = useFiltersContext();

  const filterTasks = useCallback(
    (tasks: TaskType[] | undefined, status: TaskStatus) => {
      if (!tasks) return [];
      const filteredTasks = tasks.filter((task) => {
        if (
          task.status === status &&
          task.workPeriodIsActive &&
          !isInitiative(task) &&
          !isSubtask(task)
        ) {
          if (taskNotInSearch({ task, search })) return false;
          if (assigneeNotInFilters({ task, assignees })) return false;
          if (initiativeNotInFilters({ task, initiatives })) return false;
          if (taskTypeNotInFilters({ task, taskTypes })) return false;
          if (
            taskWorkPeriodNotInFilters({
              task,
              workPeriodIds: filterWorkPeriods,
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
    [search, assignees, initiatives, taskTypes, filterWorkPeriods]
  );

  const { updateTask } = useTasks();
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();

  useLayoutEffect(() => {
    if (!renderContainerRef.current) return;
    const calculatedHeight = renderContainerRef.current.offsetTop + 20;
    renderContainerRef.current.style.height = `calc(100vh - ${calculatedHeight}px)`;
  }, []);

  if (!tasks || !workPeriods || !project) {
    return null;
  }

  const onDragEnd = (result: DropResult) => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    const { destination, source } = result;
    if (isNullish(destination) || isNullish(source)) return;

    updateTask({
      taskId: result.draggableId,
      status: destination.droppableId as TaskStatus,
      boardPosition: calculateTaskBoardPosition({
        activeTasks: tasks.filter((task) => task.workPeriodIsActive),
        destination,
        source,
        droppedTaskId: result.draggableId,
      }),
    });
  };

  return (
    <Fragment>
      <TaskDetailsModal />
      <BoardHeader project={project} />
      <DragDropContext onDragEnd={onDragEnd}>
        <div
          ref={renderContainerRef}
          className="relative flex w-full max-w-full gap-x-4 overflow-y-auto"
        >
          {STATUSES.map((status) => (
            <TaskList
              key={status}
              status={status}
              tasks={filterTasks(tasks, status)}
              label={STATUS_LABELS[status]}
            />
          ))}
        </div>
      </DragDropContext>
    </Fragment>
  );
};

type TaskListPositionProps = {
  activeTasks: TaskType[];
  destination: DraggableLocation;
  source: DraggableLocation;
  droppedTaskId: string;
};

function calculateTaskBoardPosition(props: TaskListPositionProps) {
  const { prevTask, nextTask } = getAfterDropPrevNextTask(props);
  let position: number;

  if (isNullish(prevTask) && isNullish(nextTask)) {
    position = 1;
  } else if (isNullish(prevTask) && nextTask) {
    position = nextTask.boardPosition - 1;
  } else if (isNullish(nextTask) && prevTask) {
    position = prevTask.boardPosition + 1;
  } else if (prevTask && nextTask) {
    position =
      prevTask.boardPosition +
      (nextTask.boardPosition - prevTask.boardPosition) / 2;
  } else {
    throw new Error("Invalid position");
  }
  return position;
}

function getAfterDropPrevNextTask(props: TaskListPositionProps) {
  const { activeTasks, destination, source, droppedTaskId } = props;
  const beforeDropDestinationTasks = getSortedBoardTasks({
    activeTasks,
    status: destination.droppableId as TaskStatus,
  });
  const droppedTask = activeTasks.find((task) => task.id === droppedTaskId);

  if (!droppedTask) {
    throw new Error("dropped task not found");
  }
  const isSameList = destination.droppableId === source.droppableId;

  const afterDropDestinationTasks = isSameList
    ? moveItemWithinArray(
        beforeDropDestinationTasks,
        droppedTask,
        destination.index
      )
    : insertItemIntoArray(
        beforeDropDestinationTasks,
        droppedTask,
        destination.index
      );

  return {
    prevTask: afterDropDestinationTasks[destination.index - 1],
    nextTask: afterDropDestinationTasks[destination.index + 1],
  };
}

function getSortedBoardTasks({
  activeTasks,
  status,
}: {
  activeTasks: TaskType[];
  status: TaskStatus;
}) {
  return activeTasks
    .filter((task) => task.status === status)
    .sort((a, b) => a.boardPosition - b.boardPosition);
}

export { Board };
