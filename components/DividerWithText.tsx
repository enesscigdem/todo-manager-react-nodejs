"use client"
import { ReactNode } from "react"

export function DividerWithText({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-gray-300">
      <span className="flex-1 h-px bg-gray-600" />
      <span className="text-sm">{children}</span>
      <span className="flex-1 h-px bg-gray-600" />
    </div>
  )
}
