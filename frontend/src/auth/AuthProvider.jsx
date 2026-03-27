// --- frontend/src/auth/AuthProvider.jsx ---
import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../api'


const AuthContext = createContext()


export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(null)
const [loading, setLoading] = useState(true)


useEffect(() => {
const userJson = localStorage.getItem('userVinoteca')
if (userJson) setUser(JSON.parse(userJson))
setLoading(false)
}, [])


const login = async (email, password) => {
const res = await api.post('/users/login', { email, password })
localStorage.setItem('userVinoteca', JSON.stringify(res.data))
setUser(res.data)
return res.data
}


const register = async (username, email, password) => {
const res = await api.post('/auth/register', { username, email, password })
localStorage.setItem('eg_token', res.data.token)
localStorage.setItem('eg_user', JSON.stringify(res.data.user))
setUser(res.data.user)
return res.data
}


const logout = () => {
localStorage.removeItem('userVinoteca')
setUser(null)
}


return (
<AuthContext.Provider value={{ user, loading, login, register, logout }}>
{children}
</AuthContext.Provider>
)
}


export const useAuth = () => useContext(AuthContext)