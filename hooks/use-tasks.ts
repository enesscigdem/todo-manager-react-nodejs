"use client"

import { useTasks, type Task } from "@/context/tasks-provider"
import { useCallback } from "react"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || ""

// Custom hook for task operations with API integration
export function useTaskOperations() {
  const { state, dispatch } = useTasks()
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null

  const authHeader = token ? { Authorization: `Bearer ${token}` } : {}

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
          headers: { "Content-Type": "application/json", ...authHeader },
          body: JSON.stringify(taskData),
        })
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || "Görev oluşturulamadı")
        }
        const created = await res.json()

        dispatch({ type: "ADD_TASK", payload: created })
        dispatch({
          type: "SHOW_TOAST",
          payload: { message: "Görev başarıyla oluşturuldu!", type: "success" },
        })
      } catch (error) {
        dispatch({
          type: "SHOW_TOAST",
          payload: { message: (error as Error).message, type: "error" },
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
        const res = await fetch(`${API_BASE}/api/tasks/${updatedTask.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...authHeader },
          body: JSON.stringify(taskWithUpdatedTime),
        })
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || "Görev güncellenemedi")
        }

        dispatch({ type: "UPDATE_TASK", payload: taskWithUpdatedTime })
        dispatch({
          type: "SHOW_TOAST",
          payload: { message: "Görev başarıyla güncellendi!", type: "success" },
        })
      } catch (error) {
        dispatch({
          type: "SHOW_TOAST",
          payload: { message: (error as Error).message, type: "error" },
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
        const res = await fetch(`${API_BASE}/api/tasks/${taskId}`, {
          method: "DELETE",
          headers: { ...authHeader },
        })
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || "Görev silinemedi")
        }

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
          payload: { message: (error as Error).message, type: "error" },
        })
      }
    },
    [state.tasks, dispatch],
  )

  // Toggle task completion status
  const toggleTask = useCallback(
    async (taskId: string) => {
      try {
        const res = await fetch(`${API_BASE}/api/tasks/${taskId}/toggle`, {
          method: "PATCH",
          headers: { ...authHeader },
        })
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || "Görev güncellenemedi")
        }

        dispatch({ type: "TOGGLE_TASK", payload: taskId })
      } catch (error) {
        dispatch({
          type: "SHOW_TOAST",
          payload: { message: (error as Error).message, type: "error" },
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
