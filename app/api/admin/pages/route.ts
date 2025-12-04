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
    const { site_id, title, slug, content, published, nav_order } = body

    // Create page
    const { data: page, error } = await supabase
      .from('pages')
      .insert({
        site_id,
        title,
        slug,
        content: content || '',
        published: published || false,
        nav_order: nav_order || 0
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating page:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(page)
  } catch (error) {
    console.error('Error in POST /api/admin/pages:', error)
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

    // Fetch pages based on role
    let query = supabase.from('pages').select('*, sites(id, name, domain)')

    if (profile?.role !== 'super_admin' && profile?.site_id) {
      query = query.eq('site_id', profile.site_id)
    }

    const { data: pages, error } = await query.order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(pages)
  } catch (error) {
    console.error('Error in GET /api/admin/pages:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
