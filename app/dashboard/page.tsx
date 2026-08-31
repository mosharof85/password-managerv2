'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

type Entry = {
  id?: string
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
  created_at?: string
  updated_at?: string
}

export default function Dashboard() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        router.push('/')
        return
      }
      setUser(user)
      loadEntries()
    }

    checkUser()
  }, [router])

  const loadEntries = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/entries')
      if (res.status === 401) {
        router.push('/')
        return
      }
      const data = await res.json()
      setEntries(data)
    } catch (error) {
      console.error('Error loading entries:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEntries = entries.filter(entry =>
    entry.domain?.toLowerCase().includes(search.toLowerCase()) ||
    entry.hosting_url?.toLowerCase().includes(search.toLowerCase()) ||
    entry.ftp_url?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0] font-sans">
      <Header user={user} onLogout={() => router.push('/')} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#e8e8f0] to-[#a78bfa] bg-clip-text text-transparent">
            Password Manager
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/settings')}
              className="px-4 py-2 bg-[#1a1a26] border border-[#2a2a3c] rounded-lg hover:bg-[#1e1e2e] transition-colors"
            >
              Settings
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-[#ef4444] rounded-lg hover:bg-[#dc2626] transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search domains..."
          className="w-full px-4 py-3 bg-[#12121a] border border-[#2a2a3c] rounded-lg mb-6 focus:outline-none focus:border-[#7c5cfc]"
        />

        {loading ? (
          <div className="text-center py-10 text-[#9898b0]">Loading entries...</div>
        ) : filteredEntries.length === 0 ? (
          <div className="text-center py-10 text-[#9898b0]">No entries found</div>
        ) : (
          <div className="grid gap-4">
            {filteredEntries.map((entry) => (
              <EntryCard key={entry.id || entry.domain} entry={entry} />
            ))}
          </div>
        )}

        <button
          onClick={() => router.push('/entry/new')}
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-[#7c5cfc] to-[#6d4aed] rounded-full flex items-center justify-center text-white text-3xl shadow-[0_4px_24px_rgba(124,92,252,0.5)] hover:scale-110 transition-transform"
        >
          +
        </button>
      </main>
    </div>
  )
}

function Header({ user, onLogout }: { user: any; onLogout: () => void }) {
  return (
    <header className="border-b border-[#2a2a3c] py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔒</span>
            <h1 className="text-xl font-bold">Password Manager</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#9898b0]">{user?.email}</span>
            <button
              onClick={onLogout}
              className="px-3 py-1.5 bg-[#ef4444] rounded-lg text-sm hover:bg-[#dc2626] transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

function EntryCard({ entry }: { entry: Entry }) {
  return (
    <div className="bg-[#12121a] border border-[#2a2a3c] rounded-lg p-4 cursor-pointer hover:border-[#7c5cfc] transition-colors group">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-[#e8e8f0]">{entry.domain}</h3>
          <div className="flex gap-2 text-sm text-[#9898b0] mt-1">
            {entry.hosting_url && <span>Host: {entry.hosting_url}</span>}
            {entry.ftp_url && <span>FTP: {entry.ftp_url}</span>}
          </div>
        </div>
        {entry.ftp_url && (
          <button
            className="text-[#7c5cfc] hover:text-[#a78bfa] transition-colors"
            title="Open FileZilla"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
