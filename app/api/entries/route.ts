import { createClient } from '@/utils/supabase/server'

export async function GET() {
  const supabase = await createClient()

  const { data: entries, error } = await supabase
    .from('entries')
    .select('*')
    .order('domain', { ascending: true })

  if (error) {
    return Response.json({ detail: error.message }, { status: 500 })
  }

  return Response.json(entries)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()
  const { domain, ...rest } = body

  if (!domain) {
    return Response.json({ detail: 'Domain is required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('entries')
    .insert([{ domain, ...rest }])

  if (error) {
    if (error.code === '23505') {
      return Response.json({ detail: 'Domain already exists' }, { status: 400 })
    }
    return Response.json({ detail: error.message }, { status: 500 })
  }

  return Response.json({ success: true })
}
