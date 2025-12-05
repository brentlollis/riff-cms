# riff-cms - Session Handoff

**Last Updated:** December 4, 2025
**Status:** 🟡 Functional but incomplete integration

---

## Quick Status

### What's Working ✅
- riff-cms deployed on port 4000 (http://34.29.234.193:4000)
- Database schema complete (sites, profiles, pages, media, galleries, gallery_images)
- Admin interface functional (Sites, Pages, Media, Galleries)
- Flash Painting site record created in database
- flash-painting fetching from CMS API (but no content created yet)
- Super admin user: brent@creativestate.com / R!FF7177

### What's Not Working ❌
- No actual content pages created in CMS yet
- flash-painting components not updated to handle `data` props
- Homepage will render empty/undefined until content is created

---

## Current Architecture

### Multi-Tenant CMS Flow
```
riff-cms (port 4000)
  ↓ API
flash-painting → fetches content → http://34.29.234.193:4000/api/sites/flashpainting.com/pages
  ↓
page.tsx → getPageBySlug('home') → passes content.hero, content.tagline, etc to components
```

### Key Files

**CMS API Routes:**
- `/api/sites/[slug]/route.ts` - Fetch site by domain
- `/api/sites/[slug]/pages/route.ts` - Fetch published pages for site

**Flash Painting Integration:**
- [flash-painting/src/lib/cms.ts](../../flash-painting/src/lib/cms.ts) - API client
- [flash-painting/src/app/page.tsx](../../flash-painting/src/app/page.tsx#L11) - Fetches home page content
- [flash-painting/.env.local](../../flash-painting/.env.local#L2) - CMS_API_URL configuration

---

## Immediate Next Steps

1. **Create Content in CMS**
   - Log in to http://34.29.234.193:4000/auth/login
   - Navigate to Pages → Create New Page
   - Slug: `home`
   - Site: Flash Painting & Remodeling
   - Content structure needed:
   ```json
   {
     "hero": { "title": "...", "subtitle": "...", "cta": "..." },
     "tagline": { "text": "..." },
     "process": { "steps": [...] },
     "services": { "items": [...] },
     "gallery": { "images": [...] },
     "testimonials": { "items": [...] }
   }
   ```

2. **Update flash-painting Components**
   - Modify Hero.tsx, Tagline.tsx, etc to accept optional `data` prop
   - Provide fallback values when data is undefined
   - Example:
   ```typescript
   export default function Hero({ data }: { data?: any }) {
     const title = data?.title || "Flash Painting & Remodeling";
     // ...
   }
   ```

3. **Test Integration**
   - Create content in CMS
   - Verify flash-painting displays content
   - Check revalidation (60s cache)

---

## Database

**Supabase Project:** dtuzljwxuqqlehkrcvnj
**Tables:** sites, profiles, pages, media, galleries, gallery_images
**RLS:** Enabled with role-based policies (super_admin, site_admin, client_editor)
**Storage:** `media` bucket (public, 50MB limit, images only)

**Sites in Database:**
- Flash Painting & Remodeling (domain: flashpainting.com, ID: 1b28e803-743e-4ca1-8860-34b307068181)

---

## Deployment

**Server:** tools.pipelineequipment.com
**Location:** /var/www/riff-cms
**Port:** 4000
**PM2:** Process ID 23 (riff-cms)
**GitHub:** git@github.com:brentlollis/riff-cms.git

**Deploy Command:**
```powershell
ssh brent@tools.pipelineequipment.com 'cd /var/www/riff-cms ; git pull ; npm install ; npm run build ; pm2 restart riff-cms'
```

---

## Known Issues

1. **Components Not CMS-Ready**
   - flash-painting components expect hardcoded data
   - Need to update all 6 components (Hero, Tagline, Process, Services, Gallery, Testimonials)
   - Need fallback values for when CMS returns null

2. **No Content Created**
   - Database has site record but no pages
   - Homepage will fail to render meaningful content until "home" page is created

3. **Tiptap Table Support Removed**
   - Table extensions caused build errors
   - Editor only supports: StarterKit, Image, Link
   - May need alternative for table content

---

## Technical Decisions Made

| Decision | Reason |
|----------|--------|
| Async params format | Next.js 16 requirement |
| ON CONFLICT DO NOTHING in trigger | Prevents duplicate profile errors |
| Table extensions removed | Build errors with @tiptap/extension-table |
| 60s revalidation | Balance between freshness and performance |
| Port 4000 | Creative State range (4000-4999) |

---

## Reference Commands

**Check CMS Status:**
```powershell
ssh brent@tools.pipelineequipment.com 'pm2 status riff-cms'
```

**View Logs:**
```powershell
ssh brent@tools.pipelineequipment.com 'pm2 logs riff-cms --lines 50'
```

**Restart After Changes:**
```powershell
ssh brent@tools.pipelineequipment.com 'cd /var/www/riff-cms ; git pull ; npm run build ; pm2 restart riff-cms'
```

---

**For full chronological history, see [BUILD_PROGRESS.md](BUILD_PROGRESS.md)**
