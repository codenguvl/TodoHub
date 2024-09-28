import { useStrictModeDroppable } from "@/hooks/use-strictmode-droppable";
import { type TaskType } from "@/utils/types";
import { Droppable } from "react-beautiful-dnd";
import { Task } from "./task";
import clsx from "clsx";
import { statusMap } from "../task/task-select-status";
import { type TaskStatus } from "@prisma/client";
import { getPluralEnd } from "@/utils/helpers";

const TaskList: React.FC<{
  status: TaskStatus;
  tasks: TaskType[];
  label: string;
}> = ({
  status,
  tasks,
  label, // Thêm thuộc tính label
}) => {
  const [droppableEnabled] = useStrictModeDroppable();

  if (!droppableEnabled) {
    return null;
  }

  return (
    <div
      className={clsx(
        "mb-5 h-max min-h-fit w-[350px] rounded-md bg-gray-100 px-1.5  pb-3"
      )}
    >
      <h2 className="sticky top-0 -mx-1.5 -mt-1.5 mb-1.5 rounded-t-md bg-gray-100 px-2 py-3 text-xs text-gray-500">
        {label} {tasks.filter((task) => task.status == status).length} việc
        {/* {` TASK${getPluralEnd(tasks).toUpperCase()}`} */}
      </h2>

      <Droppable droppableId={status}>
        {({ droppableProps, innerRef, placeholder }) => (
          <div
            {...droppableProps}
            ref={innerRef}
            className=" h-fit min-h-[10px]"
          >
            {tasks
              .sort((a, b) => a.boardPosition - b.boardPosition)
              .map((task, index) => (
                <Task key={task.id} index={index} task={task} />
              ))}
            {placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export { TaskList };
