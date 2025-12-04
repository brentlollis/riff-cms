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

    const body = await request.json()
    const { site_id, name } = body

    // Create gallery
    const { data: gallery, error } = await supabase
      .from('galleries')
      .insert({
        site_id,
        name
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating gallery:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(gallery)
  } catch (error) {
    console.error('Error in POST /api/admin/galleries:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's role and site_id
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, site_id')
      .eq('id', user.id)
      .single()

    // Fetch galleries based on role
    let query = supabase.from('galleries').select('*, sites(id, name), gallery_images(id)')

    if (profile?.role !== 'super_admin' && profile?.site_id) {
      query = query.eq('site_id', profile.site_id)
    }

    const { data: galleries, error } = await query.order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(galleries)
  } catch (error) {
    console.error('Error in GET /api/admin/galleries:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
