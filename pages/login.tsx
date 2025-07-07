"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Apple, ClipboardList } from "lucide-react"
import { Layout } from "@/components/Layout"
import { SocialButton } from "@/components/SocialButton"
import { DividerWithText } from "@/components/DividerWithText"
import { Card, CardContent, CardHeader } from "shadcn/ui/card"
import { Button } from "shadcn/ui/button"
import { GoogleIcon } from "@/components/icons/GoogleIcon"
import clsx from "clsx"
import { useAuth } from "@/context/auth-provider"
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

  const MotionCard = motion(Card)

  return (
    <Layout
      marketing={{
        icon: <ClipboardList className="w-10 h-10" />,
        title: "Todo Manager",
        points: [
          "Organize your tasks",
          "Track progress",
          "Collaborate easily",
        ],
      }}
    >
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#1F2937] rounded-2xl shadow-2xl"
      >
        <CardHeader>
          <h1 className="text-center text-2xl font-bold text-white">Welcome back</h1>
        </CardHeader>
        <CardContent className="space-y-4">
          <SocialButton icon={<GoogleIcon className="w-5 h-5" />} text="Log in with Google" />
          <SocialButton icon={<Apple className="w-5 h-5" />} text="Log in with Apple" />
          <DividerWithText>or</DividerWithText>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm mb-1 text-white">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg bg-[#374151] px-4 py-2 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm mb-1 text-white">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg bg-[#374151] px-4 py-2 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="********"
              />
            </div>
            {error && <p className={clsx("text-sm text-red-500")}>{error}</p>}
            <div className="flex items-center justify-between text-sm text-gray-300">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded bg-[#374151] border-gray-600 text-blue-600 focus:ring-blue-500" />
                Remember me
              </label>
              <Link href="#" className="hover:underline">
                Forgot password?
              </Link>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-semibold">
                Sign in
              </Button>
            </motion.div>
          </form>
          <p className="text-sm text-center text-gray-300">
            Don’t have an account?{' '}
            <Link href="/register" className="text-blue-400 hover:underline">
              Sign up here
            </Link>
          </p>
        </CardContent>
      </MotionCard>
      <Toast />
    </Layout>
  )
}
