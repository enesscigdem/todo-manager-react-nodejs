"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/auth-provider"
import { Card, CardContent, CardHeader } from "shadcn/ui/card"
import { Button } from "shadcn/ui/button"
import { motion } from "framer-motion"
import clsx from "clsx"
import { useAuthToast } from "@/hooks/use-auth-toast"

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { Toast, show } = useAuthToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
      show({ message: "Giriş başarılı", type: "success" })
      setTimeout(() => router.push("/"), 600)
    } catch (err: any) {
      setError(err.message)
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
              Giriş Yap
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
                Şifre
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-md border border-input bg-background px-4 py-2 focus:ring-2 focus:ring-primary"
              />
            </div>
            {error && <p className={clsx("text-sm", error && "text-red-600")}>{error}</p>}
            <MotionButton
              type="submit"
              className="w-full"
              whileTap={{ scale: 0.95 }}
            >
              Giriş Yap
            </MotionButton>
            <p className="text-sm text-center">
              Hesabınız yok mu?{" "}
              <Link href="/register" className="text-blue-600 hover:underline">
                Kayıt Ol
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.form>
      <Toast />
    </div>
  )
}
