'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function SettingsPage() {
  const [killFilezilla, setKillFilezilla] = useState(false)
  const [loading, setLoading] = useState(false)
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
      loadSettings()
    }

    checkUser()
  }, [router])

  const loadSettings = () => {
    const saved = localStorage.getItem('pm_settings')
    if (saved) {
      try {
        const settings = JSON.parse(saved)
        setKillFilezilla(settings.killFilezilla || false)
      } catch {
        // Ignore
      }
    }
  }

  const saveSettings = async () => {
    setLoading(true)
    const settings = { killFilezilla }
    localStorage.setItem('pm_settings', JSON.stringify(settings))
    setLoading(false)
    alert('Settings saved!')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0]">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <div className="bg-[#12121a] border border-[#2a2a3c] rounded-lg p-6 space-y-6">
          {/* FileZilla Settings */}
          <div>
            <h2 className="text-lg font-semibold text-[#7c5cfc] mb-3">FileZilla</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={killFilezilla}
                onChange={(e) => setKillFilezilla(e.target.checked)}
                className="w-5 h-5 accent-[#7c5cfc]"
              />
              <span className="text-sm text-[#9898b0]">Kill all FileZilla instances before opening a new one</span>
            </label>
          </div>

          <div className="pt-4 border-t border-[#2a2a3c]">
            <button
              onClick={saveSettings}
              disabled={loading}
              className="px-6 py-2 bg-[#7c5cfc] rounded-lg hover:bg-[#6d4aed] disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
            
            <button
              onClick={() => router.push('/dashboard')}
              className="ml-4 px-6 py-2 bg-[#1a1a26] border border-[#2a2a3c] rounded-lg hover:bg-[#1e1e2e]"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
