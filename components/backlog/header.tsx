"use client";
import React from "react";
import { useFiltersContext } from "@/context/use-filters-context";
import { type Project } from "@prisma/client";
import { InitiativeFilter } from "@/components/filter-initiative";
import { TaskTypeFilter } from "@/components/filter-task-type";
import { SearchBar } from "@/components/filter-search-bar";
import { Members } from "../members";
import { ClearFilters } from "../filter-task-clear";
import { NotImplemented } from "../not-implemented";
import { Button } from "../ui/button";
import { BiLineChart } from "react-icons/bi";

const BacklogHeader: React.FC<{ project: Project }> = ({ project }) => {
  const { search, setSearch } = useFiltersContext();
  return (
    <div className="flex h-fit flex-col">
      <div className="text-sm text-gray-500">Dự án / {project.name}</div>
      <h1>Công việc tồn đọng </h1>
      <div className="my-3 flex items-center justify-between">
        <div className="flex items-center gap-x-5">
          <SearchBar search={search} setSearch={setSearch} />
          <Members />
          <InitiativeFilter /> <TaskTypeFilter />
          <ClearFilters />
        </div>
      </div>
    </div>
  );
};

export { BacklogHeader };
