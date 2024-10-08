import { NotImplemented } from "@/components/not-implemented";
import { ChildrenTreeIcon } from "@/components/svgs";
import { Button } from "@/components/ui/button";
import { TooltipWrapper } from "@/components/ui/tooltip";
import { BiLink } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { CgAttachment } from "react-icons/cg";

const TaskDetailsInfoActions: React.FC<{
  onAddChildTask: () => void;
  variant?: "sm" | "lg";
}> = ({ onAddChildTask, variant = "sm" }) => {
  return (
    <div className="flex gap-x-2 text-gray-700">
      {/* <NotImplemented feature="attachment">
        <Button
          customColors
          className="flex items-center whitespace-nowrap bg-gray-100 hover:bg-gray-200"
        >
          <CgAttachment className="rotate-45 text-xl" />
          <span
            data-state={variant === "sm" ? "sm" : "lg"}
            className="whitespace-nowrap text-sm  font-medium [&[data-state=lg]]:ml-2"
          >
            {variant === "sm" ? null : "Attach"}
          </span>
        </Button>
      </NotImplemented> */}
      <TooltipWrapper text="Thêm tác vụ con">
        <Button
          onClick={onAddChildTask}
          customColors
          className="flex items-center whitespace-nowrap bg-gray-100 hover:bg-gray-200"
        >
          <ChildrenTreeIcon />
          <span
            data-state={variant === "sm" ? "sm" : "lg"}
            className="whitespace-nowrap text-sm  font-medium [&[data-state=lg]]:ml-2"
          >
            {variant === "sm" ? null : "Add a child task"}
          </span>
        </Button>
      </TooltipWrapper>
      {/* <NotImplemented feature="link">
        <Button
          customColors
          className="flex items-center whitespace-nowrap bg-gray-100 hover:bg-gray-200"
        >
          <BiLink className="text-xl" />
          <span
            data-state={variant === "sm" ? "sm" : "lg"}
            className="whitespace-nowrap text-sm  font-medium [&[data-state=lg]]:ml-2"
          >
            {variant === "sm" ? null : "Link task"}
          </span>
        </Button>
      </NotImplemented>
      <NotImplemented feature="add apps">
        <Button
          customColors
          className="flex items-center whitespace-nowrap bg-gray-100 hover:bg-gray-200"
        >
          <BsThreeDots className="text-xl" />
        </Button>
      </NotImplemented> */}
    </div>
  );
};

export { TaskDetailsInfoActions };
