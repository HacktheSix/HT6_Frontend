import { useState, useEffect } from 'react'
import { supabase, getUserByAuth0Id, testConnection } from '@/lib/supabase'

interface User {
  id: string
  auth0_id: string
  email: string
  name?: string
  picture?: string
  email_verified?: boolean
  created_at: string
  updated_at: string
}

export const useSupabase = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(false)

  // Test Supabase connection
  useEffect(() => {
    const checkConnection = async () => {
      const isConnected = await testConnection()
      setConnected(isConnected)
    }
    checkConnection()
  }, [])

  // Function to load user data by Auth0 ID
  const loadUser = async (auth0Id: string) => {
    setLoading(true)
    try {
      const userData = await getUserByAuth0Id(auth0Id)
      setUser(userData)
    } catch (error) {
      console.error('Error loading user:', error)
    } finally {
      setLoading(false)
    }
  }

  // Function to get all users (for admin purposes)
  const getAllUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching all users:', error)
      return []
    }
  }

  // Function to get user stats
  const getUserStats = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, created_at, email_verified')
      
      if (error) throw error
      
      const totalUsers = data.length
      const verifiedUsers = data.filter(user => user.email_verified).length
      const recentUsers = data.filter(user => {
        const createdAt = new Date(user.created_at)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return createdAt > weekAgo
      }).length

      return {
        totalUsers,
        verifiedUsers,
        recentUsers,
        verificationRate: totalUsers > 0 ? (verifiedUsers / totalUsers) * 100 : 0
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
      return {
        totalUsers: 0,
        verifiedUsers: 0,
        recentUsers: 0,
        verificationRate: 0
      }
    }
  }

  return {
    user,
    loading,
    connected,
    loadUser,
    getAllUsers,
    getUserStats
  }
}
