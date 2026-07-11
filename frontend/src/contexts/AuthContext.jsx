import { createContext, useContext, useState, useEffect } from 'react'
import authApi from '../api/authApi.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(null)

  useEffect(() => {
    // Check localStorage for persisted auth
    const savedUser = localStorage.getItem('legalease_user')
    const savedToken = localStorage.getItem('legalease_token')
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser))
      setToken(savedToken)
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await authApi.login(email, password)
      const data = response.data

      if (data.success && data.token && data.user) {
        setUser(data.user)
        setToken(data.token)
        localStorage.setItem('legalease_user', JSON.stringify(data.user))
        localStorage.setItem('legalease_token', data.token)
        return { success: true, user: data.user }
      }

      return { success: false, error: data.error || 'Login failed' }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Invalid email or password'
      return { success: false, error: message }
    }
  }

  const register = async (userData) => {
    try {
      const response = await authApi.register(userData)
      const data = response.data

      if (data.success && data.user) {
        return { success: true, user: data.user }
      }

      return { success: false, error: data.error || 'Registration failed' }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Registration failed'
      return { success: false, error: message }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('legalease_user')
    localStorage.removeItem('legalease_token')
  }

  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('legalease_user', JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export default AuthContext
