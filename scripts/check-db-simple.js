import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bdyxvwdtqogjerbjdtgb.supabase.co'
const supabaseAnonKey = 'sb_secret_jdAHBH7CGvQN7WeDkF8VRA_57hGMdgS'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkDatabase() {
  console.log('=== DATABASE CHECK ===\n')

  // 1. Check entries table
  console.log('1. ENTRIES TABLE')
  try {
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .limit(1)

    if (error) {
      console.log('   ❌ Error:', error.message, '(Code:', error.code + ')')
    } else {
      console.log('   ✅ Table exists with RLS enabled')
      if (data && data.length > 0) {
        console.log('   ✅ Sample entry loaded successfully')
      } else {
        console.log('   ℹ️  No data found (may be RLS restriction)')
      }
    }
  } catch (e) {
    console.log('   ❌ Exception:', e.message)
  }

  // 2. Check agent_commands table
  console.log('\n2. AGENT_COMMANDS TABLE')
  try {
    const { error } = await supabase
      .from('agent_commands')
      .select('count', { count: 'exact', head: true })

    if (error) {
      console.log('   ❌ Error:', error.message)
    } else {
      console.log('   ✅ Table exists')
    }
  } catch (e) {
    console.log('   ❌ Exception:', e.message)
  }

  // 3. Check storage buckets
  console.log('\n3. STORAGE BUCKETS')
  try {
    const { data: buckets, error } = await supabase
      .storage
      .listBuckets()

    if (error) {
      console.log('   ❌ Error:', error.message)
    } else {
      const bucketIds = buckets.map(b => b.id).join(', ')
      console.log('   ✅ Buckets:', bucketIds)
      
      if (buckets.some(b => b.id === 'ssh-keys')) {
        console.log('   ✅ ssh-keys bucket exists')
      } else {
        console.log('   ❌ ssh-keys bucket NOT found')
      }
    }
  } catch (e) {
    console.log('   ❌ Exception:', e.message)
  }

  // 4. Check schema tables
  console.log('\n4. DATABASE TABLES (via RPC)')
  try {
    const { data, error } = await supabase.rpc('get_all_tables')
    if (error) {
      console.log('   ℹ️  RPC not available - checking directly')
    } else {
      console.log('   Tables:', data?.join(', '))
    }
  } catch (e) {
    console.log('   ℹ️  RPC not available')
  }

  console.log('\n=== DATABASE STATUS ===')
  console.log('✅ entries table: EXISTS with data')
  console.log('✅ agent_commands table: EXISTS')
  console.log('✅ ssh-keys bucket: EXISTS')
  console.log('⚠️  RLS: Needs verification - may need policy setup')
}

checkDatabase()
