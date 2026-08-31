import { createClient } from '@/utils/supabase/server'
import { type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const body = await request.json()
  const { file_base64, domain, filename } = body

  if (!file_base64) {
    return Response.json({ detail: 'Missing file_base64' }, { status: 400 })
  }

  // Clean domain for filename
  let cleanDomain = String(domain || '').trim().toLowerCase()
  cleanDomain = cleanDomain.replace(/^https?:\/\//i, '').replace(/^www\./i, '').split('/')[0].split(':')[0]
  const keyName = cleanDomain ? `${cleanDomain}_ssh_key` : (filename || 'ssh_key')

  // Decode and prepare file
  const fileBuffer = Buffer.from(file_base64, 'base64')

  try {
    // Upload to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from('ssh-keys')
      .upload(`public/${keyName}`, fileBuffer, {
        contentType: 'application/octet-stream',
        upsert: true,
      })

    if (uploadError) {
      return Response.json({ detail: `Upload failed: ${uploadError.message}` }, { status: 500 })
    }

    // Get file URL
    const { data: { publicUrl } } = supabase.storage
      .from('ssh-keys')
      .getPublicUrl(`public/${keyName}`)

    return Response.json({
      ssh_key_ref: `drive://${keyName}`,
      file_url: publicUrl,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return Response.json({ detail: `Upload failed: ${error}` }, { status: 500 })
  }
}
