import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bdyxvwdtqogjerbjdtgb.supabase.co'
const supabaseAnonKey = 'sb_secret_jdAHBH7CGvQN7WeDkF8VRA_57hGMdgS'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkRLS() {
  console.log('Checking RLS status...\n')

  // Try to fetch entries
  const { data, error } = await supabase
    .from('entries')
    .select('count', { count: 'exact', head: true })

  console.log('Entries count:', data)
  if (error) {
    console.log('Error:', error.message)
    console.log('Code:', error.code)
  }
}

checkRLS()
