'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'

interface Site {
  id: string
  name: string
}

export default function NewGalleryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [sites, setSites] = useState<Site[]>([])
  const [formData, setFormData] = useState({
    site_id: '',
    name: ''
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
      const response = await fetch('/api/admin/galleries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Failed to create gallery')

      const gallery = await response.json()
      router.push(`/admin/galleries/${gallery.id}`)
      router.refresh()
    } catch (error) {
      console.error('Error creating gallery:', error)
      alert('Failed to create gallery. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout title="Create New Gallery" action={undefined}>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 max-w-2xl">
        <div className="space-y-6">
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
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Gallery Name *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Before & After Photos"
            />
          </div>

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
              {loading ? 'Creating...' : 'Create Gallery'}
            </button>
          </div>
        </div>
      </form>
    </AdminLayout>
  )
}
