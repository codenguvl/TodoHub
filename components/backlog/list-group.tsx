"use client";
import { useTasks } from "@/hooks/query-hooks/use-tasks";
import clsx from "clsx";
import { BacklogList } from "./list-backlog";
import { WorkPeriodList } from "./list-workPeriod";
import {
  DragDropContext,
  type DraggableLocation,
  type DropResult,
} from "react-beautiful-dnd";
import { type TaskType } from "@/utils/types";
import { useCallback } from "react";
import { useFiltersContext } from "@/context/use-filters-context";
import {
  assigneeNotInFilters,
  initiativeNotInFilters,
  insertItemIntoArray,
  isInitiative,
  isNullish,
  isSubtask,
  taskNotInSearch,
  taskTypeNotInFilters,
  moveItemWithinArray,
  workPeriodId,
} from "@/utils/helpers";
import { useWorkPeriods } from "@/hooks/query-hooks/use-work-periods";
import { type WorkPeriod } from "@prisma/client";
import { useIsAuthenticated } from "@/hooks/use-is-authed";

const ListGroup: React.FC<{ className?: string }> = ({ className }) => {
  const { tasks, updateTask } = useTasks();
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();
  const { search, assignees, taskTypes, initiatives } = useFiltersContext();
  const { workPeriods } = useWorkPeriods();

  const filterTasks = useCallback(
    (tasks: TaskType[] | undefined, workPeriodId: string | null) => {
      if (!tasks) return [];
      const filteredTasks = tasks.filter((task) => {
        if (
          task.workPeriodId === workPeriodId &&
          !isInitiative(task) &&
          !isSubtask(task)
        ) {
          if (taskNotInSearch({ task, search })) return false;
          if (assigneeNotInFilters({ task, assignees })) return false;
          if (initiativeNotInFilters({ task, initiatives })) return false;
          if (taskTypeNotInFilters({ task, taskTypes })) return false;
          return true;
        }
        return false;
      });

      return filteredTasks;
    },
    [search, assignees, initiatives, taskTypes]
  );

  const onDragEnd = (result: DropResult) => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    const { destination, source } = result;
    if (isNullish(destination) || isNullish(source)) return;
    updateTask({
      taskId: result.draggableId,
      workPeriodId: workPeriodId(destination.droppableId),
      workPeriodPosition: calculateTaskWorkPeriodPosition({
        activeTasks: tasks ?? [],
        destination,
        source,
        droppedTaskId: result.draggableId,
      }),
    });
  };

  if (!workPeriods) return <div />;
  return (
    <div
      className={clsx(
        "min-h-full w-full max-w-full overflow-y-auto",
        className
      )}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        {workPeriods.map((workPeriod) => (
          <div key={workPeriod.id} className="my-3">
            <WorkPeriodList
              workPeriod={workPeriod}
              tasks={filterTasks(tasks, workPeriod.id)}
            />
          </div>
        ))}
        <BacklogList id="backlog" tasks={filterTasks(tasks, null)} />
      </DragDropContext>
    </div>
  );
};

function calculateTaskWorkPeriodPosition(props: TaskListPositionProps) {
  const { prevTask, nextTask } = getAfterDropPrevNextTask(props);
  let position: number;

  if (isNullish(prevTask) && isNullish(nextTask)) {
    position = 1;
  } else if (isNullish(prevTask) && nextTask) {
    position = nextTask.workPeriodPosition - 1;
  } else if (isNullish(nextTask) && prevTask) {
    position = prevTask.workPeriodPosition + 1;
  } else if (prevTask && nextTask) {
    position =
      prevTask.workPeriodPosition +
      (nextTask.workPeriodPosition - prevTask.workPeriodPosition) / 2;
  } else {
    throw new Error("Invalid position");
  }
  return position;
}

type TaskListPositionProps = {
  activeTasks: TaskType[];
  destination: DraggableLocation;
  source: DraggableLocation;
  droppedTaskId: string;
};

function getAfterDropPrevNextTask(props: TaskListPositionProps) {
  const { activeTasks, destination, source, droppedTaskId } = props;
  const beforeDropDestinationTasks = getSortedWorkPeriodTasks({
    activeTasks,
    workPeriodId: destination.droppableId,
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

function getSortedWorkPeriodTasks({
  activeTasks,
  workPeriodId,
}: {
  activeTasks: TaskType[];
  workPeriodId: WorkPeriod["id"] | null;
}) {
  return activeTasks
    .filter((task) => task.workPeriodId === workPeriodId)
    .sort((a, b) => a.workPeriodPosition - b.workPeriodPosition);
}

ListGroup.displayName = "ListGroup";

export { ListGroup };
