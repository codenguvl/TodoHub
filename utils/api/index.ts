import { projectRoutes } from "./project";
import { tasksRoutes } from "./tasks";
import { workPeriodsRoutes } from "./workPeriods";

export const api = {
  project: projectRoutes,
  tasks: tasksRoutes,
  workPeriods: workPeriodsRoutes,
};
