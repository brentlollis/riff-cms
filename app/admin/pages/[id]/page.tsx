'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import TiptapEditor from '@/components/TiptapEditor'

interface Site {
  id: string
  name: string
  domain: string
}

interface PageData {
  id: string
  site_id: string
  title: string
  slug: string
  content: string
  published: boolean
  nav_order: number
}

export default function EditPagePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sites, setSites] = useState<Site[]>([])
  const [formData, setFormData] = useState<PageData>({
    id: '',
    site_id: '',
    title: '',
    slug: '',
    content: '',
    published: false,
    nav_order: 0
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch sites
        const sitesResponse = await fetch('/api/admin/sites')
        const sitesData = await sitesResponse.json()
        setSites(sitesData)

        // Fetch page
        const pageResponse = await fetch(`/api/admin/pages/${params.id}`)
        if (!pageResponse.ok) throw new Error('Failed to fetch page')

        const pageData = await pageResponse.json()
        setFormData(pageData)
      } catch (error) {
        console.error('Error fetching data:', error)
        alert('Failed to load page')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/admin/pages/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Failed to update page')

      router.push('/admin/pages')
      router.refresh()
    } catch (error) {
      console.error('Error updating page:', error)
      alert('Failed to update page. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Edit Page" action={undefined}>
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title={`Edit Page: ${formData.title}`} action={undefined}>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 max-w-4xl">
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="site_id" className="block text-sm font-medium text-gray-700 mb-1">
                Site *
              </label>
              <select
                id="site_id"
                required
                value={formData.site_id}
                onChange={(e) => setFormData({ ...formData, site_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Page Title *
              </label>
              <input
                type="text"
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                Slug *
              </label>
              <input
                type="text"
                id="slug"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">URL-friendly version of the title</p>
            </div>

            <div>
              <label htmlFor="nav_order" className="block text-sm font-medium text-gray-700 mb-1">
                Navigation Order
              </label>
              <input
                type="number"
                id="nav_order"
                value={formData.nav_order}
                onChange={(e) => setFormData({ ...formData, nav_order: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Content Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <TiptapEditor
              content={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
            />
          </div>

          {/* Published Toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
              Published
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </AdminLayout>
  )
}
