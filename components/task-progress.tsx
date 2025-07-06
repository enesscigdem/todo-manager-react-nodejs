"use client"

import { useTasks } from "@/context/tasks-provider"

export function TaskProgress() {
  const { state } = useTasks()
  const total = state.tasks.length
  const completed = state.tasks.filter((t) => t.completed).length
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <div className="my-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Tamamlanma: {percent}%</span>
        <span className="text-xs text-gray-500">{completed}/{total}</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-green-400 to-blue-500 h-2 transition-all"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  )
}
