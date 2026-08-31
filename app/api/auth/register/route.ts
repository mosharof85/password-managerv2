import { createClient } from '@/utils/supabase/server'
import { type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const body = await request.json()
  const { email, password } = body

  if (!email || !password) {
    return Response.json({ detail: 'Missing email or password' }, { status: 400 })
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error || !data.user) {
    return Response.json({ detail: 'Registration failed' }, { status: 400 })
  }

  return Response.json({ success: true, message: 'Registration successful' })
}
