"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || ""

interface User {
  id: number
  email: string
}

interface AuthContextValue {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (data: { email?: string; password?: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("token")
    if (stored) {
      setToken(stored)
      fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${stored}` },
      })
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((data) => {
          setUser(data)
          setLoading(false)
        })
        .catch(() => {
          localStorage.removeItem("token")
          setToken(null)
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || "Giriş yapılamadı")
    }
    const data = await res.json()
    localStorage.setItem("token", data.token)
    setToken(data.token)
    const profile = await fetch(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${data.token}` },
    }).then((r) => r.json())
    setUser(profile)
  }

  const register = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || "Kayıt başarısız")
    }
    const data = await res.json()
    localStorage.setItem("token", data.token)
    setToken(data.token)
    setUser(await fetch(`${API_BASE}/api/auth/me`, { headers: { Authorization: `Bearer ${data.token}` } }).then((r) => r.json()))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
  }

  const updateProfile = async (d: { email?: string; password?: string }) => {
    if (!token) return
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(d),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || "Güncelleme başarısız")
    }
    const data = await res.json()
    setUser(data)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
