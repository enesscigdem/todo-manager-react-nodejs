// app/profile/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-provider"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import clsx from "clsx"
import { useAuthToast } from "@/hooks/use-auth-toast"

export default function ProfilePage() {
  const { user, updateProfile, loading } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { Toast, show } = useAuthToast()

  useEffect(() => {
    if (user) setEmail(user.email)
  }, [user])

  if (!loading && !user) {
    router.push("/login")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProfile({ email, password: password || undefined })
      setPassword("")
      show({ message: "Bilgiler güncellendi", type: "success" })
    } catch (err: any) {
      show({ message: err.message, type: "error" })
    }
  }

  const MotionButton = motion(Button)

  return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-white rounded-xl p-10 shadow-xl"
        >
          <h1 className="text-2xl font-extrabold mb-6 text-center">Profil</h1>

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                E-posta
              </label>
              <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Yeni Şifre
              </label>
              <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={clsx(
                      "w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white",
                      password && "ring-1 ring-indigo-500"
                  )}
              />
            </div>
          </div>

          <MotionButton
              type="submit"
              className="w-full mt-6 bg-indigo-500 text-white py-4 rounded-lg font-semibold hover:bg-indigo-600 transition"
              whileTap={{ scale: 0.95 }}
          >
            Güncelle
          </MotionButton>

          <Toast />
        </form>
      </div>
  )
}
