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
      console.log('   ❌ Error:', error.message)
      console.log('   Code:', error.code)
    } else {
      console.log('   ✅ Table exists')
      console.log('   Sample entry:', JSON.stringify(data?.[0] || {}, null, 2))
    }
  } catch (e) {
    console.log('   ❌ Exception:', e.message)
  }

  // 2. Check agent_commands table
  console.log('\n2. AGENT_COMMANDS TABLE')
  try {
    const { data, error } = await supabase
      .from('agent_commands')
      .select('*')
      .limit(1)

    if (error) {
      console.log('   ❌ Error:', error.message)
    } else {
      console.log('   ✅ Table exists')
      console.log('   Sample:', data?.[0] || 'empty')
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
      console.log('   ✅ Buckets:', buckets.map(b => b.id).join(', '))
      
      // Check ssh-keys bucket
      const sshBucket = buckets.find(b => b.id === 'ssh-keys')
      if (sshBucket) {
        console.log('   ✅ ssh-keys bucket exists (public:', sshBucket.public + ')')
      } else {
        console.log('   ❌ ssh-keys bucket NOT found')
      }
    }
  } catch (e) {
    console.log('   ❌ Exception:', e.message)
  }

  // 4. Test RLS by trying to insert
  console.log('\n4. RLS TEST (INSERT)')
  try {
    const { error } = await supabase
      .from('entries')
      .insert({
        domain: 'test-check-' + Date.now(),
        wp_user: 'test',
        wp_password: 'test'
      })

    if (error) {
      console.log('   ❌ Insert failed:', error.message)
      console.log('   Code:', error.code)
    } else {
      console.log('   ✅ RLS allows insert')
    }
  } catch (e) {
    console.log('   ❌ Exception:', e.message)
  }

  // 5. Check tables in schema
  console.log('\n5. SCHEMA TABLES')
  const { data: tables, error: tablesError } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
    .order('table_name')

  if (tablesError) {
    console.log('   ❌ Error:', tablesError.message)
  } else {
    console.log('   ✅ Tables:', tables?.map(t => t.table_name).join(', '))
  }

  console.log('\n=== CHECK COMPLETE ===')
}

checkDatabase()
