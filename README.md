# Bethel International School — Student Council Website

Official website for the Bethel International School Student Council, Palo, Leyte.

Start with `SETUP.md` for exact step-by-step deployment instructions.

## Files

- `index.html` — the public website
- `admin.html` — the admin dashboard (sign in at `/admin.html`)
- `config.js` — your Supabase Project URL + Publishable key (safe to expose in the browser)
- `js/supabase-client.js` — initializes the Supabase client from config.js
- `supabase/database.sql` — reference copy of the database schema (you likely don't need to run this — see the file itself)

## How content works

- Your Supabase project stores all editable content (hero text, officers, news, events, gallery, programs, testimonials, contact info) as one row in the `site_content` table.
- Editing anything in `/admin.html` saves it live immediately — there is no separate "draft" step to remember.
- The public `index.html` reads that same data on every page load, so what you edit in Admin is what visitors see, on every device.

## Security

Never commit or expose:
- A Supabase **Secret** or **Service Role** key
- Your Supabase database password
- Admin account passwords

Only the **Publishable key** belongs in `config.js` — it's protected by Row Level Security on the database side, not by being secret.
