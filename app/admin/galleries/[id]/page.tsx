'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import Image from 'next/image'

interface Media {
  id: string
  filename: string
  storage_path: string
  alt_text: string | null
}

interface GalleryImage {
  id: string
  media_id: string
  order: number
  caption: string | null
  media: Media
}

interface Gallery {
  id: string
  name: string
  site_id: string
}

export default function EditGalleryPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [gallery, setGallery] = useState<Gallery | null>(null)
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [availableMedia, setAvailableMedia] = useState<Media[]>([])
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    fetchGallery()
  }, [params.id])

  const fetchGallery = async () => {
    try {
      // Fetch gallery details
      const galleryResponse = await fetch(`/api/admin/galleries/${params.id}`)
      const galleryData = await galleryResponse.json()
      setGallery(galleryData)

      // Fetch gallery images
      const imagesResponse = await fetch(`/api/admin/galleries/${params.id}/images`)
      const imagesData = await imagesResponse.json()
      setGalleryImages(imagesData)

      // Fetch available media for this site
      const mediaResponse = await fetch('/api/admin/media')
      const mediaData = await mediaResponse.json()
      const siteMedia = mediaData.filter((m: any) => m.site_id === galleryData.site_id)
      setAvailableMedia(siteMedia)
    } catch (error) {
      console.error('Error fetching gallery:', error)
      alert('Failed to load gallery')
    } finally {
      setLoading(false)
    }
  }

  const handleAddImage = async (mediaId: string) => {
    try {
      const response = await fetch(`/api/admin/galleries/${params.id}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          media_id: mediaId,
          order: galleryImages.length
        })
      })

      if (!response.ok) throw new Error('Failed to add image')

      await fetchGallery()
      setShowAddModal(false)
    } catch (error) {
      console.error('Error adding image:', error)
      alert('Failed to add image')
    }
  }

  const handleRemoveImage = async (imageId: string) => {
    if (!confirm('Remove this image from the gallery?')) return

    try {
      const response = await fetch(`/api/admin/galleries/${params.id}/images/${imageId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to remove image')

      await fetchGallery()
    } catch (error) {
      console.error('Error removing image:', error)
      alert('Failed to remove image')
    }
  }

  const getPublicUrl = (storagePath: string) => {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${storagePath}`
  }

  if (loading) {
    return (
      <AdminLayout title="Edit Gallery" action={undefined}>
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </AdminLayout>
    )
  }

  const usedMediaIds = new Set(galleryImages.map((gi) => gi.media_id))
  const unusedMedia = availableMedia.filter((m) => !usedMediaIds.has(m.id))

  return (
    <AdminLayout title={`Edit Gallery: ${gallery?.name}`} action={undefined}>
      <div className="space-y-6">
        {/* Gallery Images */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Gallery Images</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Images
            </button>
          </div>

          {galleryImages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No images in this gallery yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryImages.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <div className="aspect-square relative bg-gray-100">
                    <Image
                      src={getPublicUrl(item.media.storage_path)}
                      alt={item.caption || item.media.filename}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-sm text-gray-900 truncate mb-2">
                      {item.media.filename}
                    </p>
                    <button
                      onClick={() => handleRemoveImage(item.id)}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Images Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Add Images to Gallery</h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                {unusedMedia.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p>No available media. All images are already in this gallery.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {unusedMedia.map((media) => (
                      <div
                        key={media.id}
                        className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:border-blue-500"
                        onClick={() => handleAddImage(media.id)}
                      >
                        <div className="aspect-square relative bg-gray-100">
                          <Image
                            src={getPublicUrl(media.storage_path)}
                            alt={media.alt_text || media.filename}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-2">
                          <p className="text-xs text-gray-900 truncate">
                            {media.filename}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
