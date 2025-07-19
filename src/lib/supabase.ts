import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xoodnuckjmlmejeyyneg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhvb2RudWNram1sbWVqZXl5bmVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MTQwNTQsImV4cCI6MjA2ODQ5MDA1NH0.tu12RS2PsuKvewIEaCXI2eMyLMOYuZi8gSBe6nIPN2s'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Function to get user data by Auth0 ID
export const getUserByAuth0Id = async (auth0Id: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth0_id', auth0Id)
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

// Function to create or update user
export const upsertUser = async (userData: {
  auth0_id: string
  email: string
  name?: string
  picture?: string
  email_verified?: boolean
}) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .upsert({
        ...userData,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error upserting user:', error)
    return null
  }
}

// Function to test Supabase connection
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('users').select('count')
    if (error) throw error
    return true
  } catch (error) {
    console.error('Supabase connection failed:', error)
    return false
  }
}
