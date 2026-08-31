'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

type Entry = {
  domain: string
  wp_user?: string
  wp_password?: string
  login_url?: string
  notes?: string
  hosting_url?: string
  hosting_user?: string
  hosting_password?: string
  ftp_url?: string
  ftp_user?: string
  ftp_password?: string
  port?: string
  ftp_directory?: string
  private_key?: string
  local_directory?: string
  ssh_host?: string
  ssh_port?: string
  ssh_user?: string
  ssh_pass?: string
  ssh_key_ref?: string
}

export default function NewEntryPage() {
  const [entry, setEntry] = useState<Entry>({
    domain: '',
    wp_user: '',
    wp_password: '',
    login_url: '',
    notes: '',
    hosting_url: '',
    hosting_user: '',
    hosting_password: '',
    ftp_url: '',
    ftp_user: '',
    ftp_password: '',
    port: '',
    ftp_directory: '',
    private_key: '',
    local_directory: '',
    ssh_host: '',
    ssh_port: '',
    ssh_user: '',
    ssh_pass: '',
    ssh_key_ref: '',
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (field: keyof Entry, value: string) => {
    setEntry(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      })

      if (res.status === 401) {
        router.push('/')
        return
      }

      if (res.ok) {
        router.push('/dashboard')
        router.refresh()
      } else {
        const data = await res.json()
        alert(data.detail || 'Error saving entry')
      }
    } catch (error) {
      console.error('Error saving entry:', error)
      alert('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0]">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">New Entry</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Domain" value={entry.domain} onChange={(v) => handleChange('domain', v)} required />
            <Field label="Login URL" value={entry.login_url} onChange={(v) => handleChange('login_url', v)} />
            <Field label="WP User" value={entry.wp_user} onChange={(v) => handleChange('wp_user', v)} />
            <Field label="WP Password" value={entry.wp_password} onChange={(v) => handleChange('wp_password', v)} />
            <Field label="Hosting URL" value={entry.hosting_url} onChange={(v) => handleChange('hosting_url', v)} />
            <Field label="Hosting User" value={entry.hosting_user} onChange={(v) => handleChange('hosting_user', v)} />
            <Field label="Hosting Password" value={entry.hosting_password} onChange={(v) => handleChange('hosting_password', v)} />
            <Field label="FTP URL" value={entry.ftp_url} onChange={(v) => handleChange('ftp_url', v)} />
            <Field label="FTP User" value={entry.ftp_user} onChange={(v) => handleChange('ftp_user', v)} />
            <Field label="FTP Password" value={entry.ftp_password} onChange={(v) => handleChange('ftp_password', v)} />
            <Field label="Port" value={entry.port} onChange={(v) => handleChange('port', v)} />
            <Field label="FTP Directory" value={entry.ftp_directory} onChange={(v) => handleChange('ftp_directory', v)} />
            <Field label="Local Directory" value={entry.local_directory} onChange={(v) => handleChange('local_directory', v)} />
            <Field label="SSH Host" value={entry.ssh_host} onChange={(v) => handleChange('ssh_host', v)} />
            <Field label="SSH Port" value={entry.ssh_port} onChange={(v) => handleChange('ssh_port', v)} />
            <Field label="SSH User" value={entry.ssh_user} onChange={(v) => handleChange('ssh_user', v)} />
            <Field label="SSH Password" value={entry.ssh_pass} onChange={(v) => handleChange('ssh_pass', v)} />
            <Field label="SSH Key Ref" value={entry.ssh_key_ref} onChange={(v) => handleChange('ssh_key_ref', v)} />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              value={entry.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="w-full px-4 py-2 bg-[#12121a] border border-[#2a2a3c] rounded-lg focus:outline-none focus:border-[#7c5cfc]"
              rows={4}
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#7c5cfc] rounded-lg hover:bg-[#6d4aed] disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Create'}
            </button>
            
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="px-6 py-2 bg-[#1a1a26] border border-[#2a2a3c] rounded-lg hover:bg-[#1e1e2e]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, required = false }: { label: string; value?: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label} {required && <span className="text-[#ef4444]">*</span>}
      </label>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 bg-[#12121a] border border-[#2a2a3c] rounded-lg focus:outline-none focus:border-[#7c5cfc]"
      />
    </div>
  )
}
