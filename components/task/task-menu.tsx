import { type ReactNode } from "react";
import { useTasks } from "@/hooks/query-hooks/use-tasks";
import { type TaskType } from "@/utils/types";
import { type MenuOptionType } from "@/utils/types";
import clsx from "clsx";
import {
  Dropdown,
  DropdownContent,
  DropdownGroup,
  DropdownItem,
  DropdownLabel,
  DropdownPortal,
} from "@/components/ui/dropdown-menu";
import {
  Context,
  ContextContent,
  ContextGroup,
  ContextItem,
  ContextLabel,
  ContextPortal,
} from "@/components/ui/context-menu";
import { useIsAuthenticated } from "@/hooks/use-is-authed";

type MenuOptionsType = {
  actions: MenuOptionType[];
};

const menuOptions: MenuOptionsType = {
  actions: [
    // ONLY DELETE IS IMPLEMENTED
    // { id: "add-flag", label: "Add Flag" },
    // { id: "change-parent", label: "Change Parent" },
    // { id: "copy-task-link", label: "Copy Task Link" },
    // { id: "split-task", label: "Split Task" },
    { id: "delete", label: "Xóa" },
  ],
};

const TaskDropdownMenu: React.FC<{
  children: ReactNode;
  task: TaskType;
}> = ({ children, task }) => {
  const { deleteTask, updateTask } = useTasks();
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();

  const handleTaskAction = (
    id: MenuOptionType["id"],
    e: React.SyntheticEvent,
    workPeriodId?: string
  ) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    if (id == "delete") {
      deleteTask({ taskId: task.id });
    }
    if (id == "move-to") {
      updateTask({
        taskId: task.id,
        workPeriodId,
      });
    }
  };
  return (
    <Dropdown>
      {children}
      <DropdownPortal>
        <DropdownContent
          side="top"
          sideOffset={5}
          align="end"
          className="z-50 w-fit min-w-[100px] rounded-md border border-gray-300 bg-white pt-2 shadow-md"
        >
          <DropdownLabel className="p-2 text-xs font-normal text-gray-400">
            THAO TÁC
          </DropdownLabel>
          <DropdownGroup>
            {menuOptions.actions.map((action) => (
              <DropdownItem
                onClick={(e) => handleTaskAction(action.id, e)}
                key={action.id}
                textValue={action.label}
                className={clsx(
                  "rounded-sm border-transparent p-2 text-sm hover:cursor-pointer hover:bg-gray-100"
                )}
              >
                <span className={clsx("pr-2 text-sm")}>{action.label}</span>
              </DropdownItem>
            ))}
          </DropdownGroup>
          {/* TODO: Implement "move to" actions */}
          {/* <DropdownLabel className="p-2 text-xs font-normal text-gray-400">
            MOVE TO
          </DropdownLabel>
          <DropdownGroup>
            {[
              ...(workPeriods ?? []),
              {
                id: "backlog",
                name: "Backlog",
                key: "backlog",
              },
            ].map((workPeriod) => (
              <DropdownItem
                onClick={(e) => handleTaskAction("move-to", e, workPeriod.key)}
                key={workPeriod.id}
                textValue={workPeriod.name}
                className={clsx(
                  "border-transparent p-2 text-sm hover:cursor-default hover:bg-gray-100"
                )}
              >
                <span className={clsx("pr-2 text-sm")}>{workPeriod.name}</span>
              </DropdownItem>
            ))}
          </DropdownGroup> */}
        </DropdownContent>
      </DropdownPortal>
    </Dropdown>
  );
};

const TaskContextMenu: React.FC<{
  children: ReactNode;
  isEditing: boolean;
  className?: string;
}> = ({ children, isEditing, className }) => {
  return (
    <div
      data-state={isEditing ? "editing" : "not-editing"}
      className={clsx("flex [&[data-state=editing]]:hidden", className)}
    >
      <Context>
        {children}
        <ContextPortal>
          <ContextContent className="w-fit min-w-[100px] rounded-md border border-gray-300 bg-white pt-2 shadow-md">
            <ContextLabel className="p-2 text-xs font-normal text-gray-400">
              ACTIONS
            </ContextLabel>
            <ContextGroup>
              {menuOptions.actions.map((action) => (
                <ContextItem
                  key={action.id}
                  textValue={action.label}
                  className={clsx(
                    "border-transparent p-2 text-sm hover:cursor-default hover:bg-gray-100"
                  )}
                >
                  <span className={clsx("pr-2 text-sm")}>{action.label}</span>
                </ContextItem>
              ))}
            </ContextGroup>
          </ContextContent>
        </ContextPortal>
      </Context>
    </div>
  );
};

export { TaskDropdownMenu, TaskContextMenu };
