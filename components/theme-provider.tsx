'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  React.useEffect(() => {
    const saved = localStorage.getItem('primaryColor')
    if (saved) {
      document.documentElement.style.setProperty('--primary', saved)
    }
  }, [])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
