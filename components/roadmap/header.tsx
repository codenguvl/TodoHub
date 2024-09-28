"use client";
import React from "react";
import { useFiltersContext } from "@/context/use-filters-context";
import { type Project } from "@prisma/client";
import { InitiativeFilter } from "@/components/filter-initiative";
import { TaskTypeFilter } from "@/components/filter-task-type";
import { SearchBar } from "@/components/filter-search-bar";
import { Members } from "../members";
import { ClearFilters } from "../filter-task-clear";
import { WorkPeriodFilter } from "../filter-workPeriod";
import { useOrganization } from "@clerk/clerk-react";

const RoadmapHeader: React.FC<{ project: Project }> = ({ project }) => {
  const { search, setSearch } = useFiltersContext();
  const { organization } = useOrganization();
  return (
    <div className="flex h-fit flex-col">
      <div className="text-sm text-gray-500">Dự án / {organization?.name}</div>
      <h1>Kế hoạch </h1>
      <div className="my-3 flex items-center justify-between">
        <div className="flex items-center gap-x-5">
          <SearchBar search={search} setSearch={setSearch} />
          <Members />
          <InitiativeFilter /> <TaskTypeFilter />
          <WorkPeriodFilter />
          <ClearFilters />
        </div>
      </div>
    </div>
  );
};

export { RoadmapHeader };
