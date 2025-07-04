"use client"

import { useTasks, type Task } from "@/context/tasks-provider"
import { useCallback } from "react"

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
        // TODO: API call to create task
        // await fetch('/api/tasks', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(newTask)
        // })

        dispatch({ type: "ADD_TASK", payload: newTask })
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
        // TODO: API call to update task
        // await fetch(`/api/tasks/${updatedTask.id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(taskWithUpdatedTime)
        // })

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
        // TODO: API call to delete task
        // await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' })

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
        // TODO: API call to toggle task
        // const task = state.tasks.find(t => t.id === taskId)
        // await fetch(`/api/tasks/${taskId}`, {
        //   method: 'PATCH',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ completed: !task?.completed })
        // })

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
