# riff-cms - Session Handoff

**Last Updated:** December 4, 2025
**Session:** 1
**Status:** 🟡 Foundation Complete - Awaiting Supabase Credentials

---

## Current State

Project initialized with Next.js 16, TypeScript, Tailwind, Supabase client, and Tiptap editor. Basic authentication flow and admin dashboard structure created. API routes defined for client site integration.

### What Exists
- Next.js 16 + TypeScript + Tailwind project
- Supabase client utilities (browser & server-side)
- Tiptap WYSIWYG editor packages installed
- Login page (`/auth/login`)
- Admin dashboard (`/admin`) with quick links
- API routes for sites and pages
- Type definitions for database schema
- Environment variable template (`.env.local.example`)

### What's Working
- Project builds successfully
- Folder structure matches planned architecture
- Auth flow redirects (root → login or admin based on session)
- API routes ready to connect to Supabase once configured

---

## Files Created This Session

```
riff-cms/
├── Documentation/
│   ├── BUILD_PROGRESS.md
│   └── SESSION_HANDOFF.md
├── app/
│   ├── admin/page.tsx
│   ├── api/sites/[slug]/
│   │   ├── route.ts
│   │   └── pages/route.ts
│   ├── auth/login/page.tsx
│   └── page.tsx
├── lib/supabase/
│   ├── client.ts
│   └── server.ts
├── types/database.ts
└── .env.local.example
```

---

## Technology Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Editor | Tiptap |
| Deployment | PM2 on port 4000 |

---

## Database Schema (Planned)

```
sites         → Client website configs (name, domain, settings JSON)
users         → User accounts with roles (super_admin, site_admin, client_editor)
pages         → Page content with JSON blocks (site_id, slug, title, content, published)
media         → File metadata (site_id, filename, storage_path, alt_text)
galleries     → Photo collections (site_id, name)
gallery_images → Images in galleries (gallery_id, media_id, order, caption)
```

---

## Blockers / Next Steps

### Immediate Next Step
**Provide Supabase credentials** to create `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (optional, for admin operations)

### After Credentials
1. Create `.env.local` file
2. Create Supabase database tables (migrations)
3. Set up Row Level Security policies
4. Build admin pages:
   - Sites manager
   - Page editor with Tiptap
   - Media library uploader
   - Gallery manager
5. Deploy to server at port 4000
6. Test API integration with flash-painting

---

## GitHub

**Repo:** https://github.com/brentlollis/riff-cms (private)
**Remote URL:** https://brentlollis@github.com/brentlollis/riff-cms.git
**Status:** ✅ Initialized and pushed
**Note:** Uses HTTPS with username in URL (for multi-account credential separation)

---

## Deployment

**Development Access:** http://34.29.234.193:4000 (planned, port not yet verified)
**Production Access:** (Pending Nginx configuration)

### Deploy Command (Future)
```powershell
# Production
ssh brent@tools.pipelineequipment.com 'cd /var/www/riff-cms ; git pull ; npm install ; pm2 restart riff-cms'

# Staging
ssh brent@tools.pipelineequipment.com 'cd /var/www/riff-cms-staging ; git pull ; npm install ; pm2 restart riff-cms-staging'
```

**Note:** Must verify port 4000 is available before deployment.

---

## Commands

```powershell
# Run dev server (after .env.local created)
cd riff-cms ; npm run dev

# Stop dev server
Get-Process -Name "node" | Stop-Process -Force

# Push to GitHub (after repo initialized)
cd riff-cms ; git add . ; git commit -m "message" ; git push
```

---

## Context for Next AI Session

riff-cms project foundation is complete. Next.js app is initialized with:
- Authentication pages (login redirects to admin dashboard)
- Admin dashboard with navigation placeholders
- API routes for client sites to fetch content
- Supabase client utilities ready to use
- Tiptap editor packages installed

**Critical blocker:** Need Supabase credentials to proceed with database setup and testing.

**Architecture reminder:** riff-cms will be a multi-tenant CMS that controls flash-painting and future client sites. Each client site makes API calls to riff-cms to fetch content (pages, galleries, media). Admin users manage content through the dashboard.

**User roles:** Super Admin (all sites), Site Admin (assigned sites), Client Editor (content only for their site).

---
