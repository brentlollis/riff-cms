import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

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

    // Fetch media based on role
    let query = supabase.from('media').select('*, sites(id, name)')

    if (profile?.role !== 'super_admin' && profile?.site_id) {
      query = query.eq('site_id', profile.site_id)
    }

    const { data: media, error } = await query.order('uploaded_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(media)
  } catch (error) {
    console.error('Error in GET /api/admin/media:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
