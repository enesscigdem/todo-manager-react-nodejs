"use client"

import { TasksProvider } from "@/context/tasks-provider"
import { Header } from "@/components/header"
import { FilterBar } from "@/components/filter-bar"
import { TaskGrid } from "@/components/task-grid"
import { TaskProgress } from "@/components/task-progress"
import { MiniDashboard } from "@/components/mini-dashboard"
import { TaskModal } from "@/components/task-modal"
import { Toast } from "@/components/toast"
import { FloatingAddButton } from "@/components/floating-add-button"
import { TaskDetailModal } from "@/components/task-detail-modal"

export default function App() {
  return (
    <TasksProvider>
      <div className="min-h-screen bg-gradient-to-r from-sky-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        {/* Main container with responsive max width */}
        <div className="max-w-5xl mx-auto py-10 px-4">
          {/* Header with title and search */}
          <Header />

          {/* Filter bar for task status filtering */}
          <FilterBar />

          {/* Mini dashboard */}
          <MiniDashboard />

          {/* Progress bar showing completion percentage */}
          <TaskProgress />

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
