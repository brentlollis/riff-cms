// Setup Supabase Storage Bucket for Media
const { createClient } = require('@supabase/supabase-js')

async function setupStorage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials in .env.local')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  console.log('🔧 Setting up Supabase storage...')

  // Create media bucket
  const { data: bucket, error } = await supabase.storage.createBucket('media', {
    public: true,
    fileSizeLimit: 52428800, // 50MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  })

  if (error) {
    if (error.message.includes('already exists')) {
      console.log('✅ Bucket "media" already exists')
    } else {
      console.error('❌ Error creating bucket:', error.message)
      process.exit(1)
    }
  } else {
    console.log('✅ Created bucket "media"')
  }

  console.log('✅ Storage setup complete!')
}

setupStorage().catch(console.error)
