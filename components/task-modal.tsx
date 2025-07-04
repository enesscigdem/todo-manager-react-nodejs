"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { useTasks } from "@/context/tasks-provider"
import { useTaskOperations } from "@/hooks/use-tasks"

export function TaskModal() {
  const { state, dispatch } = useTasks()
  const { addTask, updateTask } = useTaskOperations()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium" as "Low" | "Medium" | "High",
  })
  const [errors, setErrors] = useState<{ title?: string }>({})

  const isEditing = !!state.editingTask

  // Populate form when editing
  useEffect(() => {
    if (state.editingTask) {
      setFormData({
        title: state.editingTask.title,
        description: state.editingTask.description,
        priority: state.editingTask.priority,
      })
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "Medium",
      })
    }
    setErrors({})
  }, [state.editingTask, state.isModalOpen])

  const handleClose = () => {
    dispatch({ type: "CLOSE_MODAL" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    const newErrors: { title?: string } = {}
    if (!formData.title.trim()) {
      newErrors.title = "Başlık gereklidir"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      if (isEditing && state.editingTask) {
        await updateTask({
          ...state.editingTask,
          ...formData,
          title: formData.title.trim(),
          description: formData.description.trim(),
        })
      } else {
        await addTask({
          ...formData,
          title: formData.title.trim(),
          description: formData.description.trim(),
          completed: false,
        })
      }
      handleClose()
    } catch (error) {
      console.error("Failed to save task:", error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  if (!state.isModalOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
            {isEditing ? "Görevi Düzenle" : "Yeni Görev Oluştur"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Title input */}
          <div className="mb-4">
            <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 mb-2">
              Başlık *
            </label>
            <input
              id="task-title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Görev başlığını girin"
              aria-describedby={errors.title ? "title-error" : undefined}
            />
            {errors.title && (
              <p id="title-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.title}
              </p>
            )}
          </div>

          {/* Description input */}
          <div className="mb-4">
            <label htmlFor="task-description" className="block text-sm font-medium text-gray-700 mb-2">
              Açıklama
            </label>
            <textarea
              id="task-description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
              placeholder="Görev açıklamasını girin (isteğe bağlı)"
            />
          </div>

          {/* Priority select */}
          <div className="mb-6">
            <label htmlFor="task-priority" className="block text-sm font-medium text-gray-700 mb-2">
              Öncelik
            </label>
            <select
              id="task-priority"
              value={formData.priority}
              onChange={(e) => handleInputChange("priority", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <option value="Low">Düşük</option>
              <option value="Medium">Orta</option>
              <option value="High">Yüksek</option>
            </select>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isEditing ? "Güncelle" : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
