import { createClient } from '@/utils/supabase/server'
import { type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const body = await request.json()
  const { username, password } = body

  if (!username || !password) {
    return Response.json({ detail: 'Missing username or password' }, { status: 400 })
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: username,
    password,
  })

  if (error || !data.user) {
    return Response.json({ detail: 'Invalid credentials' }, { status: 401 })
  }

  return Response.json({ success: true })
}
