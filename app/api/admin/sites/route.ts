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

    // Get user's role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    // Only super_admin can create sites
    if (profile?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { name, domain, settings } = body

    // Create site
    const { data: site, error } = await supabase
      .from('sites')
      .insert({
        name,
        domain,
        settings: settings || {}
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating site:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(site)
  } catch (error) {
    console.error('Error in POST /api/admin/sites:', error)
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

    // Fetch sites based on role
    let query = supabase.from('sites').select('*')

    if (profile?.role !== 'super_admin' && profile?.site_id) {
      query = query.eq('id', profile.site_id)
    }

    const { data: sites, error } = await query.order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(sites)
  } catch (error) {
    console.error('Error in GET /api/admin/sites:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
