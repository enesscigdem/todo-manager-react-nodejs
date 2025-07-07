"use client"

import { ReactNode } from "react"
import { Card } from "@/components/ui/card"

interface AuthLayoutProps {
  title: string
  description?: string
  children: ReactNode
}

export function AuthLayout({ title, description, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center overflow-x-hidden py-10 bg-background">
      <div className="relative flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="absolute pointer-events-none">
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="98" stroke="var(--color-primary)" strokeDasharray="8 8" strokeOpacity="0.3" />
          </svg>
        </div>
        <Card className="relative z-10 w-full space-y-6 rounded-xl p-6 shadow-md sm:min-w-md lg:p-8">
          <div className="flex items-center gap-3">
            <img src="https://cdn.flyonui.com/fy-assets//logo/logo.png" className="size-8" alt="brand-logo" />
            <h2 className="text-xl font-bold">TodoManager</h2>
          </div>
          <div>
            <h3 className="mb-1.5 text-2xl font-semibold">{title}</h3>
            {description && <p className="text-muted-foreground">{description}</p>}
          </div>
          {children}
        </Card>
      </div>
    </div>
  )
}

