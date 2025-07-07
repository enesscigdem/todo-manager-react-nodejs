"use client"

import { TasksProvider } from "@/context/tasks-provider"
import { Header } from "@/components/header"
import { FilterBar } from "@/components/filter-bar"
import { TaskGrid } from "@/components/task-grid"
import React, { Suspense } from "react"
const TaskProgress = React.lazy(() => import("@/components/task-progress"))
const MiniDashboard = React.lazy(() => import("@/components/mini-dashboard"))
const TaskModal = React.lazy(() => import("@/components/task-modal"))
import { Toast } from "@/components/toast"
import { FloatingAddButton } from "@/components/floating-add-button"
const TaskDetailModal = React.lazy(() => import("@/components/task-detail-modal"))
const OnboardingTour = React.lazy(() => import("@/components/onboarding-tour"))
const InteractionDashboard = React.lazy(() => import("@/components/interaction-dashboard"))

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
          <Suspense fallback={<div className="h-32" />}>
            <MiniDashboard />
          </Suspense>

          <Suspense fallback={<div className="h-40" />}>
            <InteractionDashboard />
          </Suspense>

          {/* Progress bar showing completion percentage */}
          <Suspense fallback={null}>
            <TaskProgress />
          </Suspense>

          {/* Main task grid */}
          <TaskGrid />

          {/* Floating add button */}
          <FloatingAddButton />

          {/* Task creation/editing modal */}
          <Suspense fallback={null}>
            <TaskModal />
          </Suspense>

          {/* Task detail viewing modal */}
          <Suspense fallback={null}>
            <TaskDetailModal />
          </Suspense>

          {/* Toast notifications */}
          <Toast />
          <Suspense fallback={null}>
            <OnboardingTour />
          </Suspense>
        </div>
      </div>
    </TasksProvider>
  )
}
