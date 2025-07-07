"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle, XCircle } from "lucide-react"
import clsx from "clsx"

export interface ToastData {
  message: string
  type?: "success" | "error"
}

export function useAuthToast() {
  const [toast, setToast] = useState<ToastData | null>(null)

  const show = (data: ToastData) => setToast(data)

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(t)
    }
  }, [toast])

  const Toast = () => (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
        >
          <div
            className={clsx(
              "flex items-center gap-2 rounded-md px-4 py-3 shadow-lg text-white",
              toast.type === "error" ? "bg-red-600" : "bg-green-600",
            )}
          >
            {toast.type === "error" ? (
              <XCircle className="w-5 h-5" />
            ) : (
              <CheckCircle className="w-5 h-5" />
            )}
            <span className="text-sm">{toast.message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return { Toast, show }
}
