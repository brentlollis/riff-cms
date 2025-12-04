import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const site_id = formData.get('site_id') as string

    if (!file || !site_id) {
      return NextResponse.json({ error: 'Missing file or site_id' }, { status: 400 })
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const storagePath = `media/${site_id}/${fileName}`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Create media record in database
    const { data: media, error: dbError } = await supabase
      .from('media')
      .insert({
        site_id,
        filename: file.name,
        storage_path: storagePath,
        alt_text: null
      })
      .select()
      .single()

    if (dbError) {
      // If DB insert fails, try to delete the uploaded file
      await supabase.storage.from('media').remove([storagePath])
      console.error('Database insert error:', dbError)
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    return NextResponse.json(media)
  } catch (error) {
    console.error('Error in POST /api/admin/media/upload:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
