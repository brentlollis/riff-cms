import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            riff-cms Dashboard
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Quick links */}
            <a
              href="/admin/sites"
              className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold mb-2">Sites</h3>
              <p className="text-gray-600 text-sm">Manage client websites</p>
            </a>

            <a
              href="/admin/pages"
              className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold mb-2">Pages</h3>
              <p className="text-gray-600 text-sm">Edit content and pages</p>
            </a>

            <a
              href="/admin/media"
              className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold mb-2">Media</h3>
              <p className="text-gray-600 text-sm">Upload and manage files</p>
            </a>

            <a
              href="/admin/galleries"
              className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold mb-2">Galleries</h3>
              <p className="text-gray-600 text-sm">Manage photo galleries</p>
            </a>

            <a
              href="/admin/users"
              className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold mb-2">Users</h3>
              <p className="text-gray-600 text-sm">Manage access and roles</p>
            </a>

            <a
              href="/admin/settings"
              className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold mb-2">Settings</h3>
              <p className="text-gray-600 text-sm">Configure site settings</p>
            </a>
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              Welcome to riff-cms
            </h2>
            <p className="text-blue-700 text-sm">
              Your content management system is ready. Start by creating a site or managing existing content.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
