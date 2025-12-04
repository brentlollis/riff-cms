export type UserRole = 'super_admin' | 'site_admin' | 'client_editor'

export interface Site {
  id: string
  name: string
  domain: string
  settings: {
    logo?: string
    colors?: {
      primary: string
      secondary: string
    }
    contact?: {
      email: string
      phone: string
      address?: string
    }
  }
  created_at: string
}

export interface User {
  id: string
  role: UserRole
  site_id: string | null
  profile: {
    name: string
    email: string
  }
}

export interface Page {
  id: string
  site_id: string
  slug: string
  title: string
  content: any // JSON block-based content
  parent_id: string | null
  nav_order: number
  published: boolean
  created_at: string
  updated_at: string
}

export interface Media {
  id: string
  site_id: string
  filename: string
  storage_path: string
  alt_text: string | null
  uploaded_at: string
}

export interface Gallery {
  id: string
  site_id: string
  name: string
  created_at: string
}

export interface GalleryImage {
  id: string
  gallery_id: string
  media_id: string
  order: number
  caption: string | null
}
