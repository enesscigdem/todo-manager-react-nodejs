"use client"

import { Plus } from "lucide-react"
import { useTasks } from "@/context/tasks-provider"

export function FloatingAddButton() {
  const { dispatch } = useTasks()

  const handleClick = () => {
    dispatch({ type: "OPEN_MODAL" })
  }

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 z-40"
      aria-label="Add new task"
    >
      <Plus className="h-6 w-6" />
    </button>
  )
}
