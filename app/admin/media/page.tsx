'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import Image from 'next/image'

interface Media {
  id: string
  filename: string
  storage_path: string
  alt_text: string | null
  uploaded_at: string
  sites: {
    name: string
  }
}

interface Site {
  id: string
  name: string
}

export default function MediaPage() {
  const [media, setMedia] = useState<Media[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [selectedSite, setSelectedSite] = useState('')
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch sites
      const sitesResponse = await fetch('/api/admin/sites')
      const sitesData = await sitesResponse.json()
      setSites(sitesData)
      if (sitesData.length > 0) setSelectedSite(sitesData[0].id)

      // Fetch media
      const mediaResponse = await fetch('/api/admin/media')
      const mediaData = await mediaResponse.json()
      setMedia(mediaData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0 || !selectedSite) return

    setUploading(true)

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('site_id', selectedSite)

        const response = await fetch('/api/admin/media/upload', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) throw new Error('Upload failed')
      }

      await fetchData()
      e.target.value = '' // Reset input
    } catch (error) {
      console.error('Error uploading:', error)
      alert('Failed to upload files')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media file?')) return

    try {
      const response = await fetch(`/api/admin/media/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Delete failed')

      await fetchData()
    } catch (error) {
      console.error('Error deleting:', error)
      alert('Failed to delete file')
    }
  }

  const getPublicUrl = (storagePath: string) => {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${storagePath}`
  }

  if (loading) {
    return (
      <AdminLayout title="Media Library" action={undefined}>
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Media Library" action={undefined}>
      <div className="space-y-6">
        {/* Upload Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Upload Media</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="site" className="block text-sm font-medium text-gray-700 mb-1">
                Site
              </label>
              <select
                id="site"
                value={selectedSite}
                onChange={(e) => setSelectedSite(e.target.value)}
                className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="file-upload"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
              >
                {uploading ? 'Uploading...' : 'Choose Files'}
              </label>
              <input
                id="file-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading || !selectedSite}
                className="hidden"
              />
              <p className="text-sm text-gray-500 mt-2">
                Upload images (JPG, PNG, GIF, WEBP)
              </p>
            </div>
          </div>
        </div>

        {/* Media Grid */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Media Files</h2>

          {media.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No media files uploaded yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {media.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-square relative bg-gray-100">
                    <Image
                      src={getPublicUrl(item.storage_path)}
                      alt={item.alt_text || item.filename}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.filename}
                    </p>
                    <p className="text-xs text-gray-500 mb-2">{item.sites.name}</p>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
