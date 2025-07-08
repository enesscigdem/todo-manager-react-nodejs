"use client"

import { useTasks, type Task } from "@/context/tasks-provider"
import { useCallback } from "react"
import { useAuth } from "@/context/auth-provider"

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

// Custom hook for task operations with API integration
export function useTaskOperations() {
  const { state, dispatch } = useTasks()
  const { token } = useAuth()

  // Add a new task
  const addTask = useCallback(
    async (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
      const newTask: Task = {
        ...taskData,
        progress: 0,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      try {
        const res = await fetch(`${API_BASE}/api/tasks`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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
    [dispatch, token],
  )

  // Update an existing task
  const updateTask = useCallback(
    async (updatedTask: Task) => {
      const taskWithUpdatedTime = {
        ...updatedTask,
        updatedAt: new Date().toISOString(),
      }

      // Only send fields that API expects
      const payload = {
        title: taskWithUpdatedTime.title,
        description: taskWithUpdatedTime.description,
        priority: taskWithUpdatedTime.priority,
        completed: taskWithUpdatedTime.completed,
      }

      try {
        const res = await fetch(`${API_BASE}/api/tasks/${updatedTask.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
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
    [dispatch, token],
  )

  // Delete a task with undo functionality
  const deleteTask = useCallback(
    async (taskId: string) => {
      const taskToDelete = state.tasks.find((task) => task.id === taskId)
      if (!taskToDelete) return

      try {
        const res = await fetch(`${API_BASE}/api/tasks/${taskId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
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
    [state.tasks, dispatch, token],
  )

  // Toggle task completion status
  const toggleTask = useCallback(
    async (taskId: string) => {
      try {
        const res = await fetch(`${API_BASE}/api/tasks/${taskId}/toggle`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
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
    [dispatch, token],
  )

  return {
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
  }
}
