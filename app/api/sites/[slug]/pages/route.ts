import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const supabase = await createClient()

  try {
    // First get the site ID
    const { data: site, error: siteError } = await supabase
      .from('sites')
      .select('id')
      .eq('domain', slug)
      .single()

    if (siteError) throw siteError

    // Then get all published pages for this site
    const { data: pages, error: pagesError } = await supabase
      .from('pages')
      .select('*')
      .eq('site_id', site.id)
      .eq('published', true)
      .order('nav_order')

    if (pagesError) throw pagesError

    return NextResponse.json({ pages })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 404 }
    )
  }
}
