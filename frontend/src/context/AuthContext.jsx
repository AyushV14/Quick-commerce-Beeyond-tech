import { createContext, useState, useEffect } from 'react'
import { getToken, setToken, removeToken, getUser, setUser } from '../utils/jwt'
import api from '../api/axios'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null)
  const [token, setTokenState] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = getToken()
    const storedUser = getUser()
    
    if (storedToken && storedUser) {
      setTokenState(storedToken)
      setUserState(storedUser)
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token: newToken, ...userData } = response.data
      
      setToken(newToken)
      setUser(userData)
      setTokenState(newToken)
      setUserState(userData)
      
      return userData
    } catch (error) {
      throw error
    }
  }

  const register = async (name, email, password, role) => {
    try {
      const response = await api.post('/auth/register', { name, email, password, role })
      const { token: newToken, ...userData } = response.data
      
      setToken(newToken)
      setUser(userData)
      setTokenState(newToken)
      setUserState(userData)
      
      return userData
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    removeToken()
    setTokenState(null)
    setUserState(null)
  }

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}