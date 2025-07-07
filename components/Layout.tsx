"use client"
import { ReactNode } from "react"

interface MarketingInfo {
  icon: ReactNode
  title: string
  points: string[]
}

interface LayoutProps {
  children: ReactNode
  marketing: MarketingInfo
}

export function Layout({ children, marketing }: LayoutProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center text-white bg-[theme('background.light')] dark:bg-[theme('background.dark')]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur" />
      <div className="relative w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
        <div className="order-2 md:order-1 flex flex-col justify-center space-y-6">
          <div className="text-4xl">{marketing.icon}</div>
          <h2 className="text-3xl font-bold">{marketing.title}</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-200 text-sm">
            {marketing.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
        <div className="order-1 md:order-2 flex justify-center">{children}</div>
      </div>
    </div>
  )
}
