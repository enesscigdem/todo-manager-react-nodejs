"use client"

import { TasksProvider } from "@/context/tasks-provider"
import { Header } from "@/components/header"
import { FilterBar } from "@/components/filter-bar"
import { TaskGrid } from "@/components/task-grid"
import { TaskModal } from "@/components/task-modal"
import { Toast } from "@/components/toast"
import { FloatingAddButton } from "@/components/floating-add-button"
import { TaskDetailModal } from "@/components/task-detail-modal"

export default function App() {
  return (
    <TasksProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Main container with responsive max width */}
        <div className="max-w-4xl mx-auto py-8 px-4">
          {/* Header with title and search */}
          <Header />

          {/* Filter bar for task status filtering */}
          <FilterBar />

          {/* Main task grid */}
          <TaskGrid />

          {/* Floating add button */}
          <FloatingAddButton />

          {/* Task creation/editing modal */}
          <TaskModal />

          {/* Task detail viewing modal */}
          <TaskDetailModal />

          {/* Toast notifications */}
          <Toast />
        </div>
      </div>
    </TasksProvider>
  )
}
