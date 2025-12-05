// Create Super Admin User for riff-cms
const { createClient } = require('@supabase/supabase-js')

async function createAdminUser() {
  const supabaseUrl = 'https://dtuzljwxuqqlehkrcvnj.supabase.co'
  const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0dXpsand4dXFxbGVoa3Jjdm5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDcwMTgwMCwiZXhwIjoyMDgwMjc3ODAwfQ.dESOT2q1jx6BhKhBbDg9MTDEnp4xIyiLmeWnjqxzIXY'

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  console.log('Creating super admin user...')

  // Create user with admin API
  const { data: user, error: createError } = await supabase.auth.admin.createUser({
    email: 'brent@creativestate.com',
    password: 'R!FF7177',
    email_confirm: true
  })

  if (createError) {
    console.error('❌ Error creating user:', createError.message)
    process.exit(1)
  }

  console.log('✅ User created:', user.user.email)
  console.log('   User ID:', user.user.id)

  // Update profile to super_admin and set name
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      role: 'super_admin',
      name: 'Brent Lollis'
    })
    .eq('id', user.user.id)

  if (updateError) {
    console.error('❌ Error updating profile role:', updateError.message)
    console.error('   Details:', updateError)
    process.exit(1)
  }

  console.log('✅ Profile updated to super_admin')
  console.log('\n🎉 Super admin user created successfully!')
  console.log('   Email: brent@creativestate.com')
  console.log('   Login at: http://34.29.234.193:4000')
}

createAdminUser().catch(console.error)
