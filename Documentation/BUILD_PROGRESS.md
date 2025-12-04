# riff-cms - Build Progress

Chronological history of development. **Append only - never delete.**

---

## Session 1: Project Initialization & Foundation (December 4, 2025)

### Objective
Initialize riff-cms project structure to prepare for building multi-tenant CMS that will control flash-painting and future client sites.

### What Was Built
- **Next.js 16 Project Setup**
  - TypeScript + Tailwind CSS configured
  - Project structure: `app/` directory with admin, API routes, auth pages
  - ESLint and PostCSS configured

- **Dependencies Installed**
  - Supabase client packages (@supabase/supabase-js, @supabase/ssr)
  - Tiptap WYSIWYG editor with extensions (starter-kit, image, link, table support)
  - Total: 442 packages

- **Folder Structure Created**
  ```
  riff-cms/
  ├── app/
  │   ├── admin/page.tsx (dashboard with quick links)
  │   ├── api/sites/[slug]/ (API routes for client sites)
  │   ├── auth/login/page.tsx (authentication)
  │   └── page.tsx (root redirect)
  ├── lib/supabase/ (client & server utilities)
  ├── components/ (reusable React components)
  └── types/database.ts (TypeScript definitions)
  ```

- **Core Files Created**
  - `lib/supabase/client.ts` - Browser-side Supabase client
  - `lib/supabase/server.ts` - Server-side Supabase client with cookies
  - `types/database.ts` - Type definitions for Site, User, Page, Media, Gallery, GalleryImage
  - `app/auth/login/page.tsx` - Login page with email/password auth
  - `app/admin/page.tsx` - Admin dashboard with navigation to Sites, Pages, Media, Galleries, Users, Settings
  - `app/page.tsx` - Root page with auth-based redirect
  - `app/api/sites/[slug]/route.ts` - API endpoint to fetch site by domain
  - `app/api/sites/[slug]/pages/route.ts` - API endpoint to fetch published pages for a site
  - `.env.local.example` - Environment variable template

### Design Decisions

| Element | Value |
|---------|-------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Editor | Tiptap (flexible WYSIWYG with AI capabilities) |
| Port | 4000 (prod) / 4001 (staging) |

### Database Schema (Defined in Types)
- **sites** - Client website configurations
- **users** - User accounts with roles (super_admin, site_admin, client_editor)
- **pages** - Page content with JSON block-based structure
- **media** - File metadata for uploaded assets
- **galleries** - Photo gallery collections
- **gallery_images** - Images within galleries

### Status: 🟡 In Progress

### Next Steps
1. **Configure Supabase** - Need project URL and anon key to create `.env.local`
2. **Create Database Tables** - Run migrations for sites, users, pages, media, galleries, gallery_images
3. **Set up RLS Policies** - Row Level Security for multi-tenant data isolation
4. **Build Admin Pages** - Sites manager, Page editor with Tiptap, Media library, Gallery manager
5. **GitHub Setup** - Initialize repo and push to `git@github.com:brentlollis/riff-cms.git`
6. **Deploy to Server** - Set up on port 4000, configure PM2, test with flash-painting integration

### Blockers
- **Waiting on Supabase credentials** (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY)

---
