import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bdyxvwdtqogjerbjdtgb.supabase.co'
const supabaseAnonKey = 'sb_secret_jdAHBH7CGvQN7WeDkF8VRA_57hGMdgS'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkTables() {
  console.log('Checking existing tables...\n')

  // Check entries table
  console.log('1. Checking entries table...')
  const { data: entries, error: entriesError } = await supabase
    .from('entries')
    .select('count', { count: 'exact', head: true })

  if (entriesError) {
    console.log('   ❌ entries table does NOT exist')
  } else {
    console.log(`   ✅ entries table exists with ${entries} records`)
  }

  // Check agent_commands table
  console.log('2. Checking agent_commands table...')
  const { data: commands, error: commandsError } = await supabase
    .from('agent_commands')
    .select('count', { count: 'exact', head: true })

  if (commandsError) {
    console.log('   ❌ agent_commands table does NOT exist')
  } else {
    console.log(`   ✅ agent_commands table exists with ${commands} records`)
  }

  // Check ssh-keys bucket
  console.log('3. Checking ssh-keys storage bucket...')
  const { data: buckets, error: bucketsError } = await supabase
    .storage
    .listBuckets()

  if (bucketsError) {
    console.log('   ❌ Error checking buckets:', bucketsError.message)
  } else {
    const hasSshBucket = buckets.some(b => b.id === 'ssh-keys')
    if (hasSshBucket) {
      console.log('   ✅ ssh-keys bucket exists')
    } else {
      console.log('   ❌ ssh-keys bucket does NOT exist - need to create')
    }
  }
}

checkTables()
