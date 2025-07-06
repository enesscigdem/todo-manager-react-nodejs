"use client"

import { X, Edit, Trash2, Calendar, Flag } from "lucide-react"
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

export function TaskDetailModal() {
  const { state, dispatch } = useTasks()
  const { toggleTask, deleteTask } = useTaskOperations()

  if (!state.isDetailModalOpen || !state.viewingTask) return null

  const task = state.viewingTask

  const handleClose = () => {
    dispatch({ type: "CLOSE_DETAIL_MODAL" })
  }

  const handleEdit = () => {
    dispatch({ type: "CLOSE_DETAIL_MODAL" })
    dispatch({ type: "OPEN_MODAL", payload: task })
  }

  const handleDelete = () => {
    deleteTask(task.id)
    dispatch({ type: "CLOSE_DETAIL_MODAL" })
  }

  const handleToggleComplete = () => {
    toggleTask(task.id)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-600 bg-red-50"
      case "Medium":
        return "text-yellow-600 bg-yellow-50"
      case "Low":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "High":
        return "Yüksek Öncelik"
      case "Medium":
        return "Orta Öncelik"
      case "Low":
        return "Düşük Öncelik"
      default:
        return priority
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-"
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "-"
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-modal-title"
      >
        {/* Modal header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <h2
                id="detail-modal-title"
                className={`text-2xl font-bold text-gray-900 mb-2 ${task.completed ? "line-through opacity-60" : ""}`}
              >
                {task.title}
              </h2>
              <div className="flex items-center space-x-4">
                <div
                  className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}
                >
                  <Flag className="h-4 w-4 mr-1" />
                  {getPriorityText(task.priority)}
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    task.completed ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {task.completed ? "Tamamlandı" : "Devam Ediyor"}
                </div>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
              aria-label="Modalı kapat"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Modal content */}
        <div className="p-6">
          {/* Description */}
          {task.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Açıklama</h3>
              <div className={`bg-gray-50 rounded-lg p-4 ${task.completed ? "line-through opacity-60" : ""}`}>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{task.description}</p>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Detaylar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Oluşturulma: {formatDate(task.createdAt)}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Son Güncelleme: {formatDate(task.updatedAt)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleToggleComplete}
              className={`px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                task.completed
                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 focus:ring-yellow-500"
                  : "bg-green-100 text-green-800 hover:bg-green-200 focus:ring-green-500"
              }`}
            >
              {task.completed ? "Tamamlanmamış Olarak İşaretle" : "Tamamlandı Olarak İşaretle"}
            </button>
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Edit className="h-4 w-4 inline mr-2" />
              Düzenle
            </button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="px-4 py-2 bg-red-100 text-red-800 hover:bg-red-200 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  <Trash2 className="h-4 w-4 inline mr-2" />
                  Sil
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
        </div>
      </div>
    </div>
  )
}
