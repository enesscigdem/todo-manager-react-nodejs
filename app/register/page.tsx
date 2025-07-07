"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/auth-provider"

export default function RegisterPage() {
  const { register } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await register(email, password)
      router.push("/")
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-white to-emerald-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4">
      <form onSubmit={handleSubmit} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-10 rounded-xl shadow-2xl w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center">Kayıt Ol</h1>
        <div>
          <label htmlFor="email" className="block text-sm mb-1">Email</label>
          <input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm mb-1">Şifre</label>
          <input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500" />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Kayıt Ol</button>
        <p className="text-sm text-center">Zaten hesabınız var mı? <Link href="/login" className="text-blue-600 hover:underline">Giriş Yap</Link></p>
      </form>
    </div>
  )
}
