"use client";
import { type TaskType } from "@/utils/types";
import { type WorkPeriod } from "@prisma/client";
import { type ReactNode, createContext, useContext, useState } from "react";
import { type UserResource } from "@clerk/types";

type FiltersContextProps = {
  assignees: UserResource["id"][];
  setAssignees: React.Dispatch<React.SetStateAction<UserResource["id"][]>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  initiatives: TaskType["id"][];
  setInitiatives: React.Dispatch<React.SetStateAction<TaskType["id"][]>>;
  taskTypes: TaskType["type"][];
  setTaskTypes: React.Dispatch<React.SetStateAction<TaskType["type"][]>>;
  workPeriods: WorkPeriod["id"][];
  setWorkPeriods: React.Dispatch<React.SetStateAction<WorkPeriod["id"][]>>;
};

const FiltersContext = createContext<FiltersContextProps>({
  assignees: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setAssignees: () => {},
  search: "",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSearch: () => {},
  initiatives: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setInitiatives: () => {},
  taskTypes: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setTaskTypes: () => {},
  workPeriods: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setWorkPeriods: () => {},
});

export const FiltersProvider = ({ children }: { children: ReactNode }) => {
  const [assignees, setAssignees] = useState<UserResource["id"][]>([]);
  const [search, setSearch] = useState<string>("");
  const [initiatives, setInitiatives] = useState<TaskType["id"][]>([]);
  const [taskTypes, setTaskTypes] = useState<TaskType["type"][]>([]);
  const [workPeriods, setWorkPeriods] = useState<WorkPeriod["id"][]>([]);

  return (
    <FiltersContext.Provider
      value={{
        assignees,
        setAssignees,
        search,
        setSearch,
        initiatives,
        setInitiatives,
        taskTypes,
        setTaskTypes,
        workPeriods,
        setWorkPeriods,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
};

export const useFiltersContext = () => useContext(FiltersContext);
