# Bethel SC Website — Setup and Maintenance Guide

This repository contains the Bethel International School Student Council public website and admin dashboard. It uses plain HTML/CSS/JavaScript, Supabase for authentication, content, and image storage, and Cloudflare Workers static assets for hosting.

## Files

- `index.html` — public website. Loads published content through the Supabase RPC function `get_published_site_content`.
- `admin.html` — admin dashboard (`/admin.html`).
- `config.js` — Supabase project URL and browser-safe publishable key. Never put a Supabase secret/service-role key here.
- `js/supabase-client.js` — initializes the Supabase browser client.
- `images/logo.png` — local fallback school logo.
- `supabase/database.sql` — schema, access policies, and the public-content RPC.
- `wrangler.jsonc` — Cloudflare Workers static asset configuration.

## Important: one-time Supabase update

The public page reads only the `published` JSON document through `public.get_published_site_content()`. This prevents anonymous visitors from reading the `draft` field. To apply the updated access policies and RPC to the existing Supabase project:

1. Sign in to the Supabase dashboard for the same project used by `config.js`.
2. Open **SQL Editor** and create a new query.
3. Copy the contents of `supabase/database.sql` into the editor and review it before running.
4. Run the script. It does not drop the existing content tables or delete the current site content.
5. Verify the existing admin account still appears in `public.admin_users` and the `website-images` bucket exists.

Do not run this SQL against a different Supabase project. Never use a secret/service-role key in frontend code.

## Admin dashboard

1. Open `https://YOUR-WORKERS-DOMAIN/admin.html`.
2. Sign in using an existing Supabase Auth user listed in `public.admin_users`.
3. Use the sections to manage content. Save operations currently publish changes immediately; the separate Publish Changes button confirms the same live state rather than maintaining a separate draft workflow.
4. Uploaded images are stored in the public `website-images` bucket so public visitors can see published photos.

## Cloudflare deployment

`wrangler.jsonc` serves static files from the repository root. If this Worker is connected to a GitHub-driven deployment workflow, commits may trigger deployment automatically. Otherwise, deploy through the existing Cloudflare workflow used for this Worker; do not create a second production Worker unless intentionally migrating hosting.

After deployment, verify the public homepage, `/images/logo.png`, and `/admin.html` load directly, that the homepage displays current published Supabase content, and that an admin can sign in, upload an image, and save a content change.

## Troubleshooting

### The public page shows built-in fallback content

Open browser developer tools (F12 → Console). Check the Supabase request and confirm the `get_published_site_content` function exists. If the function is missing, apply the updated `supabase/database.sql` in the correct project.

### Admin says the account is not authorized

In Supabase, open **Authentication → Users**, copy the user's UID, and verify it has a matching row in `public.admin_users`. Do not share passwords or secret keys.

### Image upload fails

Confirm the `website-images` bucket exists, is public for reading, and the signed-in account's UID is listed in `public.admin_users`.

### A logo does not update

Upload the official logo in **Admin → Logo & Branding**, save the section, and refresh the public page. If no custom logo is saved, the site uses `images/logo.png` as its fallback.

## Never commit

- Supabase `sb_secret_...` keys or legacy `service_role` keys
- Database passwords
- Admin passwords or recovery codes
