"use client"

import { Search, UserCircle2 } from "lucide-react"
import { useTasks } from "@/context/tasks-provider"
import { useEffect, useState } from "react"
import { DarkModeToggle } from "@/components/dark-mode-toggle"
import { ThemeEditor } from "@/components/theme-editor"
import Link from "next/link"
import { useAuth } from "@/context/auth-provider"

export function Header() {
  const { state, dispatch } = useTasks()
  const [searchInput, setSearchInput] = useState("")
  const { user } = useAuth()

  // Debounced search implementation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch({ type: "SET_SEARCH_QUERY", payload: searchInput })
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchInput, dispatch])

  return (
    <header className="mb-8">
      <div className="flex items-center justify-between mb-6">
        {/* Main title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">📋 Görev Yöneticim</h1>
        <div className="flex items-center space-x-2">
          <ThemeEditor />
          <DarkModeToggle />
          <Link href={user ? "/profile" : "/login"} aria-label="Hesap" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            <UserCircle2 className="w-6 h-6" />
          </Link>
        </div>
      </div>

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
          className="block w-full pl-10 pr-4 py-2 border rounded-lg leading-5 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:border-blue-500 transition-colors shadow-sm"
          aria-label="Görevlerde ara"
        />
      </div>
    </header>
  )
}
