"use client"

import type React from "react"

import { Edit, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { useTasks } from "@/context/tasks-provider"
import { useTaskOperations } from "@/hooks/use-tasks"
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities"

interface TaskCardProps {
  id: string
  title: string
  description: string
  priority: "Low" | "Medium" | "High"
  completed: boolean
  progress?: number
  dragHandleListeners?: SyntheticListenerMap
  isDragging?: boolean
}

export function TaskCard({
  id,
  title,
  description,
  priority,
  completed,
  progress,
  dragHandleListeners,
  isDragging = false,
}: TaskCardProps) {
  const { state, dispatch } = useTasks()
  const { toggleTask, deleteTask } = useTaskOperations()

  // Get priority badge styling
  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "High":
        return "Yüksek"
      case "Medium":
        return "Orta"
      case "Low":
        return "Düşük"
      default:
        return priority
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    const task = state.tasks.find((t) => t.id === id)
    if (task) {
      dispatch({ type: "OPEN_MODAL", payload: task })
    }
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    deleteTask(id)
  }

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault() // Popup açılmasını engelle
    toggleTask(id)
  }

  const handleCardClick = () => {
    const task = state.tasks.find((t) => t.id === id)
    if (task) {
      dispatch({ type: "OPEN_DETAIL_MODAL", payload: task })
    }
  }

  // Better title truncation with word boundaries
  const truncateTitle = (text: string, maxLength = 60) => {
    if (text.length <= maxLength) return text

    // Try to break at word boundary
    const truncated = text.substring(0, maxLength)
    const lastSpace = truncated.lastIndexOf(" ")

    if (lastSpace > maxLength * 0.7) {
      return truncated.substring(0, lastSpace) + "..."
    }

    return truncated + "..."
  }

  return (
    <div
      className={`card-hover bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:scale-[1.02] transition-all duration-200 cursor-pointer relative group border border-gray-100 dark:border-gray-700 ${
        completed ? "opacity-60" : ""
      } ${isDragging ? "shadow-2xl scale-105 z-50 rotate-1" : "hover:shadow-xl"}`}
      role="article"
      aria-label={`Görev: ${title}`}
      onClick={handleCardClick}
    >
      {/* Drag handle and toggle button */}
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-2">
        <button
          {...dragHandleListeners}
          className="p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
          aria-label="Görevi sürükle"
        >
          <svg viewBox="0 0 20 20" className="w-3 h-3 fill-current" aria-hidden="true">
            <path d="M7 4h2v2H7V4zm4 0h2v2h-2V4zm-4 4h2v2H7V8zm4 0h2v2h-2V8zm-4 4h2v2H7v-2zm4 0h2v2h-2v-2z" />
          </svg>
        </button>
        <button
          onClick={handleToggleComplete}
          className={`w-6 h-6 rounded-full border-2 transition-all duration-200 flex items-center justify-center hover:scale-110 ${
            completed
              ? "bg-green-500 border-green-500 text-white"
              : "border-gray-300 dark:border-gray-600 hover:border-blue-400 bg-white dark:bg-gray-800"
          }`}
          aria-label={`Görevi "${title}" ${completed ? "tamamlanmamış" : "tamamlanmış"} olarak işaretle`}
        >
          {completed && (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Action buttons - positioned in top-right with better visibility */}
      <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-150 z-10">
        <button
          onClick={handleEdit}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
          aria-label={`Görevi düzenle "${title}"`}
        >
          <Edit className="h-4 w-4" />
        </button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-lg"
              aria-label={`Görevi sil "${title}"`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Görev silinsin mi?</AlertDialogTitle>
              <AlertDialogDescription>
                Bu işlem geri alınamaz. Silmek istediğinize emin misiniz?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Vazgeç</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Sil</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Task content with better spacing and layout */}
      <div className="mt-8 mb-4 pl-2">
        {/* Title with proper truncation and line height */}
        <h3
          className={`text-lg font-semibold text-gray-900 mb-3 pr-20 leading-tight ${completed ? "line-through" : ""}`}
          title={title} // Show full title on hover
          style={{
            wordBreak: "break-word",
            hyphens: "auto",
            lineHeight: "1.3",
          }}
        >
          {truncateTitle(title)}
        </h3>

        {/* Description with better line clamping */}
        {description && (
          <p
            className={`text-gray-600 text-sm mb-4 leading-relaxed ${completed ? "line-through" : ""}`}
            title={description} // Show full description on hover
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              wordBreak: "break-word",
            }}
          >
            {description}
          </p>
        )}

        {/* Priority badge with better styling */}
        <div className="flex items-center justify-between">
          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getPriorityBadgeClass(priority)}`}>
            {getPriorityText(priority)}
          </span>

          {/* Drag indicator - subtle visual cue */}
          <div className="opacity-0 group-hover:opacity-30 transition-opacity duration-200">
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {typeof progress === 'number' && (
        <div className="mt-4">
          <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="bg-primary h-1 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Click hint with better positioning */}
      <div className="absolute bottom-3 left-4 opacity-0 group-hover:opacity-60 transition-opacity duration-200">
        <span className="text-xs text-gray-500">Detaylar için tıklayın</span>
      </div>

      {/* Drag overlay effect */}
      {isDragging && <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 bg-opacity-50 rounded-2xl pointer-events-none"></div>}
    </div>
  )
}
