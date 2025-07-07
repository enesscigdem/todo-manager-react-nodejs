"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useTasks } from "@/context/tasks-provider"
import Skeleton from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'
import { SortableTaskCard } from "./sortable-task-card"

export function TaskGrid() {
  const { state, dispatch } = useTasks()

  // Configure drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // Daha az hareket gerekli
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      dispatch({
        type: "REORDER_TASKS",
        payload: {
          activeId: active.id as string,
          overId: over.id as string,
        },
      })
    }
  }

  // Show skeletons while loading
  if (state.loading) {
    return (
      <div className="task-grid" data-testid="loading">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} height={120} style={{ borderRadius: '1rem' }} />
        ))}
      </div>
    )
  }

  // Show empty state when no tasks match current filter/search
  if (state.filteredTasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {state.tasks.length === 0 ? "Henüz görev yok" : "Eşleşen görev bulunamadı"}
        </h3>
        <p className="text-gray-500">
          {state.tasks.length === 0
            ? "İlk görevinizi eklemek için + butonuna tıklayın"
            : "Arama veya filtreyi ayarlamayı deneyin"}
        </p>
      </div>
    )
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={state.filteredTasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        <div className="task-grid">
          <AnimatePresence mode="popLayout">
            {state.filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  duration: 0.15, // Daha hızlı
                  ease: "easeOut",
                }}
              >
                <SortableTaskCard
                  id={task.id}
                  title={task.title}
                  description={task.description}
                  priority={task.priority}
                  completed={task.completed}
                  progress={task.progress}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>
    </DndContext>
  )
}
