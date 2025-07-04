"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { TaskCard } from "./task-card"

interface SortableTaskCardProps {
  id: string
  title: string
  description: string
  priority: "Low" | "Medium" | "High"
  completed: boolean
}

export function SortableTaskCard({ id, title, description, priority, completed }: SortableTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging, isOver } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 150ms ease-out", // Daha hızlı
    zIndex: isDragging ? 1000 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`${isOver && !isDragging ? "scale-102 transition-transform duration-150" : ""}`} // Daha hızlı
    >
      <TaskCard
        id={id}
        title={title}
        description={description}
        priority={priority}
        completed={completed}
        dragHandleProps={listeners}
        isDragging={isDragging}
      />
    </div>
  )
}
