import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { type TaskType } from "@/utils/types";

const TaskMetaInfo: React.FC<{ task: TaskType }> = ({ task }) => {
  const formatDate = (date: Date) => format(date, "PPPP", { locale: vi });

  return (
    <div className="mb-3 flex flex-col gap-y-3">
      <span className="text-xs text-gray-500">
        {"Được tạo vào " + formatDate(new Date(task.createdAt))}
      </span>
      <span className="text-xs text-gray-500">
        {"Được cập nhật vào " + formatDate(new Date(task.updatedAt))}
      </span>
    </div>
  );
};

export { TaskMetaInfo };
