import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

export async function login(username: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: username,
    password,
  })
  return { data, error }
}

export async function register(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export async function logout() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}
