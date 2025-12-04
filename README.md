# riff-cms

**Lightweight CMS for small-to-medium business websites**

---

## Overview

| Property | Value |
|----------|-------|
| **Type** | Content Management System |
| **Framework** | Next.js |
| **Database** | Supabase (PostgreSQL) |
| **Storage** | Supabase Storage |
| **Auth** | Supabase Auth |
| **Port** | 4000 (prod) / 4001 (staging) |
| **Status** | 🔄 In Development |

---

## Vision

A simple, AI-friendly CMS that powers multiple client websites. Not enterprise-complex — just the essentials done well.

**Design Principles:**
- Easy for clients to edit their own content
- Easy for developers to build and maintain
- Easy for AI to assist with development
- Multi-tenant (one CMS, many sites)

---

## Features

### Phase 1 (MVP)
- [ ] User authentication (admin vs client roles)
- [ ] Page management with WYSIWYG editor
- [ ] Photo gallery management
- [ ] Media library (images, files)
- [ ] Basic site settings (logo, colors, contact info)

### Phase 2
- [ ] Inline editing on live site (client-facing)
- [ ] Contact form builder + submissions
- [ ] Navigation management
- [ ] Sub-page creation

### Phase 3
- [ ] Reusable content blocks/modules
- [ ] Multiple sites per account
- [ ] Analytics dashboard
- [ ] Backup/restore

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      riff-cms                           │
│                   (Next.js App)                         │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Admin     │  │    API      │  │   Client    │     │
│  │  Dashboard  │  │   Routes    │  │  Auth/Edit  │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                     Supabase                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  Database   │  │   Storage   │  │    Auth     │     │
│  │ (PostgreSQL)│  │  (Images)   │  │   (Users)   │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                   Client Sites                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   flash-    │  │   future-   │  │   future-   │     │
│  │  painting   │  │   client    │  │   client    │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
```

---

## User Roles

| Role | Permissions |
|------|-------------|
| **Super Admin** | Full access to all sites, CMS settings |
| **Site Admin** | Full access to assigned site(s) |
| **Client Editor** | Edit content, pages, galleries on their site only |

---

## Client Sites Integration

Each client site (like flash-painting):
- Is its own Next.js app
- Fetches content from riff-cms API
- Shows edit controls when client is logged in
- Saves changes back to riff-cms/Supabase

---

## Database Schema (Planned)

```
sites
├── id
├── name
├── domain
├── settings (JSON)
└── created_at

users
├── id (Supabase Auth)
├── role
├── site_id (nullable for super admin)
└── profile

pages
├── id
├── site_id
├── slug
├── title
├── content (JSON - block-based)
├── parent_id (for sub-pages)
├── nav_order
└── published

media
├── id
├── site_id
├── filename
├── storage_path
├── alt_text
└── uploaded_at

galleries
├── id
├── site_id
├── name
└── created_at

gallery_images
├── id
├── gallery_id
├── media_id
├── order
└── caption
```

---

## Repository

**GitHub:** git@github.com:brentlollis/riff-cms.git (private)

---

## Deployment

```powershell
# Production
ssh brent@tools.pipelineequipment.com 'cd /var/www/riff-cms ; git pull ; npm install ; pm2 restart riff-cms'

# Staging
ssh brent@tools.pipelineequipment.com 'cd /var/www/riff-cms-staging ; git pull ; npm install ; pm2 restart riff-cms-staging'
```

---

## Client Sites

| Site | Port | Domain | Status |
|------|------|--------|--------|
| flash-painting | 4002/4003 | TBD | 🔄 In Development |

---

**Created:** December 2, 2025
