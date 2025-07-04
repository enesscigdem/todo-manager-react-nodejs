"use client"

import { useEffect } from "react"
import { CheckCircle, XCircle, Info, X } from "lucide-react"
import { useTasks } from "@/context/tasks-provider"

export function Toast() {
  const { state, dispatch } = useTasks()

  // Auto-hide toast after 5 seconds
  useEffect(() => {
    if (state.toast.show) {
      const timeoutId = setTimeout(() => {
        dispatch({ type: "HIDE_TOAST" })
      }, 5000)

      return () => clearTimeout(timeoutId)
    }
  }, [state.toast.show, dispatch])

  if (!state.toast.show) return null

  const getIcon = () => {
    switch (state.toast.type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-400" />
      case "info":
        return <Info className="h-5 w-5 text-blue-400" />
      default:
        return <Info className="h-5 w-5 text-blue-400" />
    }
  }

  const getBgColor = () => {
    switch (state.toast.type) {
      case "success":
        return "bg-green-50 border-green-200"
      case "error":
        return "bg-red-50 border-red-200"
      case "info":
        return "bg-blue-50 border-blue-200"
      default:
        return "bg-blue-50 border-blue-200"
    }
  }

  const handleClose = () => {
    dispatch({ type: "HIDE_TOAST" })
  }

  const handleUndo = () => {
    if (state.toast.undoAction) {
      state.toast.undoAction()
    }
  }

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-50">
      <div className={`${getBgColor()} border rounded-lg shadow-lg p-4`} role="alert" aria-live="polite">
        <div className="flex items-start">
          <div className="flex-shrink-0">{getIcon()}</div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">{state.toast.message}</p>
          </div>
          <div className="ml-4 flex space-x-2">
            {state.toast.undoAction && (
              <button
                onClick={handleUndo}
                className="text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
              >
                Geri Al
              </button>
            )}
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded"
              aria-label="Bildirimi kapat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
