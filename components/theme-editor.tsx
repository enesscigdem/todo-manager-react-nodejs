"use client"

import { useState, useEffect } from 'react'
import { Palette } from 'lucide-react'

export function ThemeEditor() {
  const [open, setOpen] = useState(false)
  const [color, setColor] = useState('#3b82f6')

  useEffect(() => {
    const saved = localStorage.getItem('primaryColor')
    if (saved) setColor(saved)
  }, [])

  useEffect(() => {
    document.documentElement.style.setProperty('--primary', color)
    localStorage.setItem('primaryColor', color)
  }, [color])

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-label="Tema Düzenle"
      >
        <Palette className="w-5 h-5" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-md shadow-lg z-50">
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label="Renk seç" />
        </div>
      )}
    </div>
  )
}
