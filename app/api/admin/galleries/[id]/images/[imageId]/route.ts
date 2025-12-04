import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const params = await context.params
    const supabase = await createClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Remove image from gallery
    const { error } = await supabase
      .from('gallery_images')
      .delete()
      .eq('id', params.imageId)

    if (error) {
      console.error('Error removing image from gallery:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/admin/galleries/[id]/images/[imageId]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
