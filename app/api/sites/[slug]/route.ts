import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const params = await context.params
  const { slug } = params
  const supabase = await createClient()

  try {
    const { data: site, error } = await supabase
      .from('sites')
      .select('*')
      .eq('domain', slug)
      .single()

    if (error) throw error

    return NextResponse.json({ site })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 404 }
    )
  }
}
