"use client"

import { useTasks, type Task } from "@/context/tasks-provider"
import { useCallback } from "react"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || ""

// Custom hook for task operations with API integration
export function useTaskOperations() {
  const { state, dispatch } = useTasks()

  // Add a new task
  const addTask = useCallback(
    async (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
      const newTask: Task = {
        ...taskData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      try {
        const res = await fetch(`${API_BASE}/api/tasks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(taskData),
        })
        const created = await res.json()

        dispatch({ type: "ADD_TASK", payload: created })
        dispatch({
          type: "SHOW_TOAST",
          payload: { message: "Görev başarıyla oluşturuldu!", type: "success" },
        })
      } catch (error) {
        dispatch({
          type: "SHOW_TOAST",
          payload: { message: "Görev oluşturulamadı", type: "error" },
        })
      }
    },
    [dispatch],
  )

  // Update an existing task
  const updateTask = useCallback(
    async (updatedTask: Task) => {
      const taskWithUpdatedTime = {
        ...updatedTask,
        updatedAt: new Date().toISOString(),
      }

      try {
        await fetch(`${API_BASE}/api/tasks/${updatedTask.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(taskWithUpdatedTime),
        })

        dispatch({ type: "UPDATE_TASK", payload: taskWithUpdatedTime })
        dispatch({
          type: "SHOW_TOAST",
          payload: { message: "Görev başarıyla güncellendi!", type: "success" },
        })
      } catch (error) {
        dispatch({
          type: "SHOW_TOAST",
          payload: { message: "Görev güncellenemedi", type: "error" },
        })
      }
    },
    [dispatch],
  )

  // Delete a task with undo functionality
  const deleteTask = useCallback(
    async (taskId: string) => {
      const taskToDelete = state.tasks.find((task) => task.id === taskId)
      if (!taskToDelete) return

      try {
        await fetch(`${API_BASE}/api/tasks/${taskId}`, { method: "DELETE" })

        dispatch({ type: "DELETE_TASK", payload: taskId })
        dispatch({
          type: "SHOW_TOAST",
          payload: {
            message: "Görev silindi",
            type: "info",
            undoAction: () => {
              dispatch({ type: "ADD_TASK", payload: taskToDelete })
              dispatch({ type: "HIDE_TOAST" })
            },
          },
        })
      } catch (error) {
        dispatch({
          type: "SHOW_TOAST",
          payload: { message: "Görev silinemedi", type: "error" },
        })
      }
    },
    [state.tasks, dispatch],
  )

  // Toggle task completion status
  const toggleTask = useCallback(
    async (taskId: string) => {
      try {
        await fetch(`${API_BASE}/api/tasks/${taskId}/toggle`, { method: "PATCH" })

        dispatch({ type: "TOGGLE_TASK", payload: taskId })
      } catch (error) {
        dispatch({
          type: "SHOW_TOAST",
          payload: { message: "Görev güncellenemedi", type: "error" },
        })
      }
    },
    [dispatch],
  )

  return {
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
  }
}
