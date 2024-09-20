"use client";

import { type TaskType } from "@/utils/types";
import { usePathname, useSearchParams } from "next/navigation";
import {
  type ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

type SelectedTaskContextProps = {
  taskKey: TaskType["key"] | null;
  setTaskKey: React.Dispatch<React.SetStateAction<TaskType["key"] | null>>;
};

const SelectedTaskContext = createContext<SelectedTaskContextProps>({
  taskKey: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setTaskKey: () => {},
});

export const SelectedTaskProvider = ({ children }: { children: ReactNode }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [taskKey, setTaskKey] = useState<TaskType["key"] | null>(null);

  const setSelectedTaskUrl = useCallback(
    (key: TaskType["key"] | null) => {
      const urlWithQuery = pathname + (key ? `?selectedTask=${key}` : "");
      window.history.pushState(null, "", urlWithQuery);
    },
    [pathname]
  );

  useEffect(() => {
    setTaskKey(searchParams.get("selectedTask"));
  }, [searchParams]);

  useEffect(() => {
    setSelectedTaskUrl(taskKey);
  }, [taskKey, setSelectedTaskUrl]);

  return (
    <SelectedTaskContext.Provider value={{ taskKey, setTaskKey }}>
      {children}
    </SelectedTaskContext.Provider>
  );
};

export const useSelectedTaskContext = () => useContext(SelectedTaskContext);
