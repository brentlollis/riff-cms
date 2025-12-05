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

## Session 2: Admin Interface Build & Deployment (December 4, 2025)

### Objective
Build complete admin interface for riff-cms, deploy to server, and establish Flash Painting integration.

### What Was Built

**Admin Pages:**
- Sites manager (list, create, edit at /admin/sites)
- Page editor with Tiptap WYSIWYG (/admin/pages)
- Media library with upload to Supabase Storage (/admin/media)
- Gallery manager with image selection (/admin/galleries)
- Reusable AdminLayout component

**API Routes (25 total):**
- Sites CRUD: /api/admin/sites, /api/admin/sites/[id]
- Pages CRUD: /api/admin/pages, /api/admin/pages/[id]
- Media CRUD: /api/admin/media, /api/admin/media/[id], /api/admin/media/upload
- Galleries CRUD: /api/admin/galleries, /api/admin/galleries/[id], /api/admin/galleries/[id]/images
- Public API: /api/sites/[slug], /api/sites/[slug]/pages
- All routes migrated to Next.js 16 async params format

**Infrastructure:**
- Fixed Supabase trigger for user profile creation
- Created storage bucket "media" via PowerShell script
- Built and deployed to port 4000 on production server
- PM2 configured with ecosystem.config.js
- Created super admin user: brent@creativestate.com

**Flash Painting Integration:**
- Created Flash Painting site record in database (ID: 1b28e803-743e-4ca1-8860-34b307068181)
- Added CMS client library to flash-painting (/lib/cms.ts)
- Updated flash-painting homepage to fetch content from riff-cms API
- Environment configured with CMS_API_URL

### Technical Decisions

| Element | Decision | Reason |
|---------|----------|--------|
| Tiptap Extensions | StarterKit + Image + Link only | Table extensions caused build errors |
| Params Format | Async params with context.params Promise | Next.js 16 requirement |
| PM2 Config | ecosystem.config.js with PORT env | Proper environment variable handling |
| User Creation | Trigger with ON CONFLICT DO NOTHING | Prevents duplicate profile errors |
| Flash Integration | API fetch with revalidate: 60s | Balance freshness with performance |

### Deployment

**Server:** tools.pipelineequipment.com
**Location:** /var/www/riff-cms
**Port:** 4000
**Access:** http://34.29.234.193:4000
**PM2 Process:** riff-cms (ID: 23)
**Status:** ✅ Running

### Database

**Tables Created:** sites, profiles, pages, media, galleries, gallery_images
**RLS Policies:** Multi-tenant security with role-based access (super_admin, site_admin, client_editor)
**Storage Bucket:** media (public, 50MB limit, images only)
**Sites:** Flash Painting & Remodeling (flashpainting.com)
**Users:** 1 super admin created

### Status: 🟡 Partially Complete

### Next Steps
1. **Component Updates** - Update flash-painting components to accept `data` props from CMS
2. **Content Creation** - Log into CMS, create "home" page with structured JSON content
3. **Testing** - Verify flash-painting displays CMS content correctly
4. **Inline Editing** - Add client-side editing capability (future enhancement)
5. **Domain Setup** - Configure Nginx for production domain (optional)
6. **Additional Features:**
   - User management UI
   - Settings page
   - Bulk media operations
   - Gallery ordering/drag-drop
   - Page preview mode

### Blockers
None - system is functional but needs content and component prop updates for full integration.

---
