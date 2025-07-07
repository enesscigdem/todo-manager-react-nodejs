"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-provider"

export default function ProfilePage() {
  const { user, updateProfile, loading } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

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
      setMessage("Bilgiler güncellendi")
    } catch (err: any) {
      setMessage(err.message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-white to-emerald-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4">
      <form onSubmit={handleSubmit} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-10 rounded-xl shadow-2xl w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center">Profil</h1>
        <div>
          <label htmlFor="email" className="block text-sm mb-1">Email</label>
          <input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm mb-1">Yeni Şifre</label>
          <input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500" />
        </div>
        {message && <p className="text-sm text-center text-green-600">{message}</p>}
        <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Güncelle</button>
      </form>
    </div>
  )
}
