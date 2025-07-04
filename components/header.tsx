"use client"

import { Search } from "lucide-react"
import { useTasks } from "@/context/tasks-provider"
import { useEffect, useState } from "react"

export function Header() {
  const { state, dispatch } = useTasks()
  const [searchInput, setSearchInput] = useState("")

  // Debounced search implementation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch({ type: "SET_SEARCH_QUERY", payload: searchInput })
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchInput, dispatch])

  return (
    <header className="mb-8">
      {/* Main title */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6">📋 Görev Yöneticim</h1>

      {/* Search input with icon */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          type="text"
          placeholder="Görevlerde ara..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          aria-label="Görevlerde ara"
        />
      </div>
    </header>
  )
}
