import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const supabase = await createClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get gallery images with media details
    const { data: images, error } = await supabase
      .from('gallery_images')
      .select(`
        *,
        media (
          id,
          filename,
          storage_path,
          alt_text
        )
      `)
      .eq('gallery_id', params.id)
      .order('order', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(images)
  } catch (error) {
    console.error('Error in GET /api/admin/galleries/[id]/images:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const supabase = await createClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { media_id, order, caption } = body

    // Add image to gallery
    const { data: galleryImage, error } = await supabase
      .from('gallery_images')
      .insert({
        gallery_id: params.id,
        media_id,
        order: order || 0,
        caption: caption || null
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding image to gallery:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(galleryImage)
  } catch (error) {
    console.error('Error in POST /api/admin/galleries/[id]/images:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
