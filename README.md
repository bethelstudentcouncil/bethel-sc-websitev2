# Bethel International School — Student Council Website

Official website for the Bethel International School Student Council in Palo, Leyte, Philippines.

## Project files

- `index.html` — public website for news, events, gallery, programs, officers, mission/vision, testimonials, and contact details.
- `admin.html` — authenticated content-management dashboard.
- `config.js` — Supabase project URL and browser-safe publishable key.
- `js/supabase-client.js` — initializes the Supabase browser client.
- `images/logo.png` — fallback school logo.
- `supabase/database.sql` — database schema, row-level security policies, image bucket policies, and published-content RPC.
- `wrangler.jsonc` — Cloudflare Workers static-asset configuration.
- `SETUP.md` — setup, deployment, and troubleshooting instructions.

## Content flow

The admin dashboard stores editable content in `public.site_content`. The public homepage retrieves only the published JSON document using `public.get_published_site_content()`, so anonymous visitors do not need access to the draft field. Admin changes currently publish immediately when saved.

## Security

The Supabase publishable key may be used in browser code when row-level security is configured correctly. Never expose a Supabase secret/service-role key, database password, or administrator credentials in this repository.

## Deployment

The site is configured for Cloudflare Workers static assets. See `SETUP.md` for the one-time Supabase policy/RPC update and production verification checklist.
