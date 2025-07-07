"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/auth-provider"
import { AuthLayout } from "@/components/AuthLayout"
import { Button } from "@/components/ui/button"
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
    <AuthLayout title="Giriş Yap" description="Görevlerinizi yönetin">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
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
        <MotionButton type="submit" className="w-full" whileTap={{ scale: 0.95 }}>
          Giriş Yap
        </MotionButton>
        <p className="text-sm text-center">
          Hesabınız yok mu?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Kayıt Ol
          </Link>
        </p>
      </motion.form>
      <Toast />
    </AuthLayout>
  )
}
