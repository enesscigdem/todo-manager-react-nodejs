"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-provider"

export default function ProfilePage() {
  const { user, updateProfile, logout, loading } = useAuth()
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-sky-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow w-full max-w-md space-y-4">
        <h1 className="text-2xl font-semibold text-center">Profil</h1>
        <div>
          <label htmlFor="email" className="block text-sm mb-1">Email</label>
          <input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm mb-1">Yeni Şifre</label>
          <input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
        </div>
        {message && <p className="text-sm text-center text-green-600">{message}</p>}
        <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-md">Güncelle</button>
        <button type="button" onClick={()=>{logout();router.push('/')}} className="w-full px-4 py-2 bg-gray-500 text-white rounded-md">Çıkış Yap</button>
      </form>
    </div>
  )
}
