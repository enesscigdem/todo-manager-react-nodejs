// components/filter-bar.tsx
"use client"

import { useTasks, type FilterType } from "@/context/tasks-provider"

const filters: FilterType[] = ["All", "Active", "Completed"]

export function FilterBar() {
    const { state, dispatch } = useTasks()

    const counts: Record<FilterType, number> = {
        All: state.tasks.length,
        Active: state.tasks.filter((t) => !t.completed).length,
        Completed: state.tasks.filter((t) => t.completed).length,
    }

    // İç filtre değişimini doğrudan İngilizce değerle yapıyoruz
    const handleFilterChange = (filter: FilterType) => {
        dispatch({ type: "SET_ACTIVE_FILTER", payload: filter })
    }

    // UI’da göstereceğimiz etiketler
    const getDisplayFilter = (filter: FilterType) => {
        const displayMap: Record<FilterType, string> = {
            All: "Tümü",
            Active: "Aktif",
            Completed: "Tamamlanan",
        }
        return displayMap[filter]
    }

    return (
        <div className="mb-6">
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg shadow-sm">
                {filters.map((filter) => {
                    const isActive = state.activeFilter === filter
                    return (
                        <button
                            key={filter}
                            onClick={() => handleFilterChange(filter)}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                isActive
                                    ? "bg-white dark:bg-gray-700 text-blue-600 shadow-sm"
                                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                            aria-pressed={isActive}
                            aria-label={`${getDisplayFilter(filter)} görevlere göre filtrele`}
                        >
                            {getDisplayFilter(filter)}
                            <span className="ml-1 text-xs text-gray-500">({counts[filter]})</span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
