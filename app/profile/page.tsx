"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-provider"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-200 via-white to-emerald-200 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 p-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-deep">
          <CardHeader>
            <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent">
              Profil
            </h1>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-md border border-input bg-background px-4 py-2 focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm mb-1">
                Yeni Şifre
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={clsx(
                  "w-full rounded-md border border-input bg-background px-4 py-2 focus:ring-2 focus:ring-primary",
                  password && "ring-1 ring-primary/50",
                )}
              />
            </div>
            <MotionButton type="submit" className="w-full" whileTap={{ scale: 0.95 }}>
              Güncelle
            </MotionButton>
          </CardContent>
        </Card>
      </motion.form>
      <Toast />
    </div>
  )
}
