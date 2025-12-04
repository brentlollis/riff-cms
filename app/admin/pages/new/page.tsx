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

export default function NewPagePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [sites, setSites] = useState<Site[]>([])
  const [formData, setFormData] = useState({
    site_id: '',
    title: '',
    slug: '',
    content: '',
    published: false,
    nav_order: 0
  })

  useEffect(() => {
    const fetchSites = async () => {
      const response = await fetch('/api/admin/sites')
      const data = await response.json()
      setSites(data)
      if (data.length > 0) {
        setFormData((prev) => ({ ...prev, site_id: data[0].id }))
      }
    }
    fetchSites()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Failed to create page')

      router.push('/admin/pages')
      router.refresh()
    } catch (error) {
      console.error('Error creating page:', error)
      alert('Failed to create page. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout title="Create New Page" action={undefined}>
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
                onChange={(e) => {
                  const title = e.target.value
                  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                  setFormData({ ...formData, title, slug })
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="About Us"
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
                placeholder="about-us"
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
              Publish page immediately
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
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Page'}
            </button>
          </div>
        </div>
      </form>
    </AdminLayout>
  )
}
