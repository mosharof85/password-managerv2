import { createClient } from '@/utils/supabase/server'
import { type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const body = await request.json()
  const { domain, ...rest } = body

  if (!domain) {
    return Response.json({ detail: 'Domain is required' }, { status: 400 })
  }

  const { data: existing, error: fetchError } = await supabase
    .from('entries')
    .select('domain')
    .eq('domain', domain)
    .single()

  if (fetchError && fetchError.code !== 'PGRST116') {
    return Response.json({ detail: fetchError.message }, { status: 500 })
  }

  if (existing) {
    const { error: updateError } = await supabase
      .from('entries')
      .update(rest)
      .eq('domain', domain)

    if (updateError) {
      return Response.json({ detail: updateError.message }, { status: 500 })
    }

    return Response.json({ success: true, message: 'Updated' })
  } else {
    const { error: insertError } = await supabase
      .from('entries')
      .insert([{ domain, ...rest }])

    if (insertError) {
      return Response.json({ detail: insertError.message }, { status: 500 })
    }

    return Response.json({ success: true, message: 'Created' })
  }
}
