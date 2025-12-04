'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'

interface SiteFormData {
  name: string
  domain: string
  settings: {
    logo?: string
    colors: {
      primary: string
      secondary: string
    }
    contact: {
      email: string
      phone: string
      address: string
    }
  }
}

export default function EditSitePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<SiteFormData>({
    name: '',
    domain: '',
    settings: {
      logo: '',
      colors: {
        primary: '#3B82F6',
        secondary: '#1F2937'
      },
      contact: {
        email: '',
        phone: '',
        address: ''
      }
    }
  })

  useEffect(() => {
    const fetchSite = async () => {
      try {
        const response = await fetch(`/api/admin/sites/${params.id}`)
        if (!response.ok) throw new Error('Failed to fetch site')

        const site = await response.json()
        setFormData({
          name: site.name,
          domain: site.domain,
          settings: {
            logo: site.settings?.logo || '',
            colors: {
              primary: site.settings?.colors?.primary || '#3B82F6',
              secondary: site.settings?.colors?.secondary || '#1F2937'
            },
            contact: {
              email: site.settings?.contact?.email || '',
              phone: site.settings?.contact?.phone || '',
              address: site.settings?.contact?.address || ''
            }
          }
        })
      } catch (error) {
        console.error('Error fetching site:', error)
        alert('Failed to load site')
      } finally {
        setLoading(false)
      }
    }

    fetchSite()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/admin/sites/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Failed to update site')

      router.push('/admin/sites')
      router.refresh()
    } catch (error) {
      console.error('Error updating site:', error)
      alert('Failed to update site. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Edit Site" action={undefined}>
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title={`Edit Site: ${formData.name}`} action={undefined}>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 max-w-2xl">
        <div className="space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Site Name *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1">
                  Domain *
                </label>
                <input
                  type="text"
                  id="domain"
                  required
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Theme Colors */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Theme Colors</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Color
                </label>
                <input
                  type="color"
                  id="primaryColor"
                  value={formData.settings.colors.primary}
                  onChange={(e) => setFormData({
                    ...formData,
                    settings: {
                      ...formData.settings,
                      colors: { ...formData.settings.colors, primary: e.target.value }
                    }
                  })}
                  className="w-full h-10 rounded-md border border-gray-300"
                />
              </div>

              <div>
                <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700 mb-1">
                  Secondary Color
                </label>
                <input
                  type="color"
                  id="secondaryColor"
                  value={formData.settings.colors.secondary}
                  onChange={(e) => setFormData({
                    ...formData,
                    settings: {
                      ...formData.settings,
                      colors: { ...formData.settings.colors, secondary: e.target.value }
                    }
                  })}
                  className="w-full h-10 rounded-md border border-gray-300"
                />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.settings.contact.email}
                  onChange={(e) => setFormData({
                    ...formData,
                    settings: {
                      ...formData.settings,
                      contact: { ...formData.settings.contact, email: e.target.value }
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.settings.contact.phone}
                  onChange={(e) => setFormData({
                    ...formData,
                    settings: {
                      ...formData.settings,
                      contact: { ...formData.settings.contact, phone: e.target.value }
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  id="address"
                  value={formData.settings.contact.address}
                  onChange={(e) => setFormData({
                    ...formData,
                    settings: {
                      ...formData.settings,
                      contact: { ...formData.settings.contact, address: e.target.value }
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
            </div>
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
