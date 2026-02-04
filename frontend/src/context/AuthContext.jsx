import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check for existing token on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const response = await api.get('/auth/profile')
          setUser(response.data.data.user)
        } catch (err) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      }
      setLoading(false)
    }
    initAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const loadingToast = toast.loading('Logging in...')
      setError(null)
      const response = await api.post('/auth/login', { email, password })
      const { user, token } = response.data.data

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      setUser(user)

      toast.dismiss(loadingToast)
      toast.success(`Welcome back, ${user.name}!`)
      return { success: true }
    } catch (err) {
      toast.dismiss()
      const message = err.response?.data?.message || 'Login failed'
      setError(message)
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const register = async (name, email, password, confirmPassword) => {
    try {
      const loadingToast = toast.loading('Creating account...')
      setError(null)
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        confirmPassword
      })
      const { user, token } = response.data.data

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      setUser(user)

      toast.dismiss(loadingToast)
      toast.success('Account created successfully!')
      return { success: true }
    } catch (err) {
      toast.dismiss()
      const message = err.response?.data?.message || 'Registration failed'
      setError(message)
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    toast.success('Logged out successfully')
  }

  const clearError = () => setError(null)

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    isAdmin: user?.role === 'admin'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
