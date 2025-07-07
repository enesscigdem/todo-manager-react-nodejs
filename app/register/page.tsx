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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-sky-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow w-full max-w-md space-y-4">
        <h1 className="text-2xl font-semibold text-center">Kayıt Ol</h1>
        <div>
          <label htmlFor="email" className="block text-sm mb-1">Email</label>
          <input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm mb-1">Şifre</label>
          <input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required className="w-full px-3 py-2 border rounded-md" />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-md">Kayıt Ol</button>
        <p className="text-sm text-center">Zaten hesabınız var mı? <Link href="/login" className="text-blue-600 hover:underline">Giriş Yap</Link></p>
      </form>
    </div>
  )
}
