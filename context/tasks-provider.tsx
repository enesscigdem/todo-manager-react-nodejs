"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || ""

// Types for our task management system
export interface Task {
  id: string
  title: string
  description: string
  priority: "Low" | "Medium" | "High"
  completed: boolean
  createdAt: string
  updatedAt: string
}

export type FilterType = "All" | "Active" | "Completed"

interface TasksState {
  tasks: Task[]
  filteredTasks: Task[]
  searchQuery: string
  activeFilter: FilterType
  isModalOpen: boolean
  editingTask: Task | null
  toast: {
    show: boolean
    message: string
    type: "success" | "error" | "info"
    undoAction?: () => void
  }
  isDetailModalOpen: boolean
  viewingTask: Task | null
}

type TasksAction =
  | { type: "SET_TASKS"; payload: Task[] }
  | { type: "ADD_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "TOGGLE_TASK"; payload: string }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_ACTIVE_FILTER"; payload: FilterType }
  | { type: "FILTER_TASKS" }
  | { type: "OPEN_MODAL"; payload?: Task }
  | { type: "CLOSE_MODAL" }
  | { type: "SHOW_TOAST"; payload: { message: string; type: "success" | "error" | "info"; undoAction?: () => void } }
  | { type: "HIDE_TOAST" }
  | { type: "REORDER_TASKS"; payload: { activeId: string; overId: string } }
  | { type: "OPEN_DETAIL_MODAL"; payload: Task }
  | { type: "CLOSE_DETAIL_MODAL" }

const initialState: TasksState = {
  tasks: [],
  filteredTasks: [],
  searchQuery: "",
  activeFilter: "All",
  isModalOpen: false,
  editingTask: null,
  toast: {
    show: false,
    message: "",
    type: "info",
  },
  isDetailModalOpen: false,
  viewingTask: null,
}

// Reducer for managing tasks state
function tasksReducer(state: TasksState, action: TasksAction): TasksState {
  switch (action.type) {
    case "SET_TASKS":
      return {
        ...state,
        tasks: action.payload,
        filteredTasks: filterTasks(action.payload, state.searchQuery, state.activeFilter),
      }

    case "ADD_TASK":
      const newTasks = [...state.tasks, action.payload]
      return {
        ...state,
        tasks: newTasks,
        filteredTasks: filterTasks(newTasks, state.searchQuery, state.activeFilter),
      }

    case "UPDATE_TASK":
      const updatedTasks = state.tasks.map((task) => (task.id === action.payload.id ? action.payload : task))
      return {
        ...state,
        tasks: updatedTasks,
        filteredTasks: filterTasks(updatedTasks, state.searchQuery, state.activeFilter),
      }

    case "DELETE_TASK":
      const remainingTasks = state.tasks.filter((task) => task.id !== action.payload)
      return {
        ...state,
        tasks: remainingTasks,
        filteredTasks: filterTasks(remainingTasks, state.searchQuery, state.activeFilter),
      }

    case "TOGGLE_TASK":
      const toggledTasks = state.tasks.map((task) =>
        task.id === action.payload
          ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() }
          : task,
      )
      return {
        ...state,
        tasks: toggledTasks,
        filteredTasks: filterTasks(toggledTasks, state.searchQuery, state.activeFilter),
      }

    case "SET_SEARCH_QUERY":
      return {
        ...state,
        searchQuery: action.payload,
        filteredTasks: filterTasks(state.tasks, action.payload, state.activeFilter),
      }

    case "SET_ACTIVE_FILTER":
      return {
        ...state,
        activeFilter: action.payload,
        filteredTasks: filterTasks(state.tasks, state.searchQuery, action.payload),
      }

    case "FILTER_TASKS":
      return {
        ...state,
        filteredTasks: filterTasks(state.tasks, state.searchQuery, state.activeFilter),
      }

    case "OPEN_MODAL":
      return {
        ...state,
        isModalOpen: true,
        editingTask: action.payload || null,
      }

    case "CLOSE_MODAL":
      return {
        ...state,
        isModalOpen: false,
        editingTask: null,
      }

    case "SHOW_TOAST":
      return {
        ...state,
        toast: {
          show: true,
          message: action.payload.message,
          type: action.payload.type,
          undoAction: action.payload.undoAction,
        },
      }

    case "HIDE_TOAST":
      return {
        ...state,
        toast: {
          ...state.toast,
          show: false,
        },
      }
    case "REORDER_TASKS":
      const { activeId, overId } = action.payload
      const oldIndex = state.tasks.findIndex((task) => task.id === activeId)
      const newIndex = state.tasks.findIndex((task) => task.id === overId)

      if (oldIndex !== -1 && newIndex !== -1) {
        const newTasks = [...state.tasks]
        const [movedTask] = newTasks.splice(oldIndex, 1)
        newTasks.splice(newIndex, 0, movedTask)

        return {
          ...state,
          tasks: newTasks,
          filteredTasks: filterTasks(newTasks, state.searchQuery, state.activeFilter),
        }
      }
      return state

    case "OPEN_DETAIL_MODAL":
      return {
        ...state,
        isDetailModalOpen: true,
        viewingTask: action.payload,
      }

    case "CLOSE_DETAIL_MODAL":
      return {
        ...state,
        isDetailModalOpen: false,
        viewingTask: null,
      }

    default:
      return state
  }
}

// Helper function to filter tasks based on search query and active filter
function filterTasks(tasks: Task[], searchQuery: string, activeFilter: FilterType): Task[] {
  let filtered = tasks

  // Filter by completion status
  if (activeFilter === "Active") {
    filtered = filtered.filter((task) => !task.completed)
  } else if (activeFilter === "Completed") {
    filtered = filtered.filter((task) => task.completed)
  }

  // Filter by search query
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase()
    filtered = filtered.filter(
      (task) => task.title.toLowerCase().includes(query) || task.description.toLowerCase().includes(query),
    )
  }

  return filtered
}

// Context creation
const TasksContext = createContext<{
  state: TasksState
  dispatch: React.Dispatch<TasksAction>
} | null>(null)

// Provider component
export function TasksProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(tasksReducer, initialState)

  // Load tasks on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks")
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks)
        dispatch({ type: "SET_TASKS", payload: parsedTasks })
      } catch (error) {
        console.error("Failed to parse saved tasks:", error)
      }
    } else {
      fetch(`${API_BASE}/api/tasks`)
        .then((res) => res.json())
        .then((data) => {
          dispatch({ type: "SET_TASKS", payload: data })
          localStorage.setItem("tasks", JSON.stringify(data))
        })
        .catch((err) => console.error("Failed to load tasks", err))
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (state.tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(state.tasks))
    }
  }, [state.tasks])

  return <TasksContext.Provider value={{ state, dispatch }}>{children}</TasksContext.Provider>
}

// Custom hook to use tasks context
export function useTasks() {
  const context = useContext(TasksContext)
  if (!context) {
    throw new Error("useTasks must be used within a TasksProvider")
  }
  return context
}
