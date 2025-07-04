"use client"

import { useTasks, type FilterType } from "@/context/tasks-provider"

const filters: FilterType[] = ["Tümü", "Aktif", "Tamamlanan"]

export function FilterBar() {
  const { state, dispatch } = useTasks()

  const handleFilterChange = (filter: FilterType) => {
    const filterMap = {
      Tümü: "All",
      Aktif: "Active",
      Tamamlanan: "Completed",
    }
    dispatch({ type: "SET_ACTIVE_FILTER", payload: filterMap[filter] as FilterType })
  }

  const getDisplayFilter = (filter: string) => {
    const displayMap = {
      All: "Tümü",
      Active: "Aktif",
      Completed: "Tamamlanan",
    }
    return displayMap[filter] || filter
  }

  return (
    <div className="mb-6">
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => handleFilterChange(filter)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              state.activeFilter === (filter === "Tümü" ? "All" : filter === "Aktif" ? "Active" : "Completed")
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
            aria-pressed={
              state.activeFilter === (filter === "Tümü" ? "All" : filter === "Aktif" ? "Active" : "Completed")
            }
            aria-label={`${filter.toLowerCase()} görevlere göre filtrele`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  )
}
