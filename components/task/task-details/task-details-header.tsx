import { MdClose, MdOutlineShare, MdRemoveRedEye } from "react-icons/md";
import { AiOutlineLike } from "react-icons/ai";
import { TaskDropdownMenu } from "../task-menu";
import { DropdownTrigger } from "../../ui/dropdown-menu";
import { TaskPath } from "../task-path";
import { type TaskType } from "@/utils/types";
import { NotImplemented } from "@/components/not-implemented";
import { Button } from "@/components/ui/button";
import { BsThreeDots } from "react-icons/bs";

const TaskDetailsHeader: React.FC<{
  task: TaskType;
  setTaskKey: React.Dispatch<React.SetStateAction<string | null>>;
  isInViewport: boolean;
}> = ({ task, setTaskKey, isInViewport }) => {
  if (!task) return <div />;
  return (
    <div
      data-state={isInViewport ? "inViewport" : "notInViewport"}
      className="sticky top-0 z-10 flex h-fit w-full items-center justify-between border-b-2 border-transparent bg-white p-0.5 [&[data-state=notInViewport]]:border-gray-200"
    >
      <TaskPath task={task} setTaskKey={setTaskKey} />
      <div className="relative flex items-center gap-x-0.5">
        {/* <NotImplemented feature="watch">
          <Button customColors className="bg-transparent hover:bg-gray-200">
            <MdRemoveRedEye className="text-xl" />
          </Button>
        </NotImplemented>
        <NotImplemented feature="like">
          <Button customColors className="bg-transparent hover:bg-gray-200">
            <AiOutlineLike className="text-xl" />
          </Button>
        </NotImplemented>
        <NotImplemented feature="share">
          <Button customColors className="bg-transparent hover:bg-gray-200">
            <MdOutlineShare className="text-xl" />
          </Button>
        </NotImplemented> */}
        <TaskDropdownMenu task={task}>
          <DropdownTrigger
            asChild
            className="rounded-m flex items-center gap-x-1 bg-opacity-30 p-2 text-xs font-semibold focus:ring-2 [&[data-state=open]]:bg-gray-700 [&[data-state=open]]:text-white"
          >
            <div className="rounded-[3px] text-gray-800 hover:bg-gray-200">
              <BsThreeDots className="sm:text-xl" />
            </div>
          </DropdownTrigger>
        </TaskDropdownMenu>
        <Button
          customColors
          className="bg-transparent hover:bg-gray-200"
          onClick={() => setTaskKey(null)}
        >
          <MdClose className="text-2xl" />
        </Button>
      </div>
    </div>
  );
};

export { TaskDetailsHeader };
