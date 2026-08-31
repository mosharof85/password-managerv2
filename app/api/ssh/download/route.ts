import { createClient } from '@/utils/supabase/server'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const key_ref = searchParams.get('key_ref')

  if (!key_ref || !key_ref.startsWith('drive://')) {
    return Response.json({ detail: 'Invalid key reference' }, { status: 400 })
  }

  const keyName = key_ref.replace('drive://', '')

  try {
    // Download from storage
    const { data, error } = await supabase.storage
      .from('ssh-keys')
      .download(`public/${keyName}`)

    if (error) {
      console.error('Download error:', error)
      return Response.json({ detail: 'SSH key not found' }, { status: 404 })
    }

    if (!data) {
      return Response.json({ detail: 'SSH key not found' }, { status: 404 })
    }

    // Read file as buffer
    const buffer = await data.arrayBuffer()
    const uint8Array = new Uint8Array(buffer)

    // Return as attachment
    const headers = new Headers()
    headers.set('Content-Disposition', `attachment; filename="${keyName}"`)
    headers.set('Content-Type', 'application/octet-stream')

    return new Response(uint8Array, { headers })
  } catch (error) {
    console.error('Download error:', error)
    return Response.json({ detail: 'SSH key not found' }, { status: 404 })
  }
}
