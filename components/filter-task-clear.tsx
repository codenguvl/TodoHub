import { useFiltersContext } from "@/context/use-filters-context";
import { Button } from "@/components/ui/button";

const ClearFilters: React.FC = () => {
  const {
    taskTypes,
    setTaskTypes,
    assignees,
    setAssignees,
    initiatives,
    setInitiatives,
    search,
    setSearch,
    workPeriods,
    setWorkPeriods,
  } = useFiltersContext();

  function clearAllFilters() {
    setTaskTypes([]);
    setAssignees([]);
    setInitiatives([]);
    setWorkPeriods([]);
    setSearch("");
  }
  if (
    taskTypes.length === 0 &&
    assignees.length === 0 &&
    initiatives.length === 0 &&
    workPeriods.length === 0 &&
    search === ""
  ) {
    return null;
  }
  return (
    <Button
      customColors
      onClick={clearAllFilters}
      className="text-sm hover:bg-gray-200"
    >
      Xóa bộ lọc
    </Button>
  );
};

export { ClearFilters };
