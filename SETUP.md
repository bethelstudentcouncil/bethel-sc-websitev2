# Bethel SC Website — Setup Guide (New Repo + Netlify)

This guide assumes you already have a working Supabase project (the one
`config.js` in this package already points to) with your real content in
it — officers, mission/vision text, your gallery photo, and so on. You are
only changing *where the website is hosted and stored in GitHub* — not
starting your data over.

## Phase 1 — Create the new GitHub repository

1. Go to https://github.com/ and sign in.
2. Click **New repository**. Name it whatever you like, e.g. `bethel-sc-website-v2`.
3. Keep it **Public** (the Publishable key in config.js is safe to expose — it's protected by Row Level Security on the database side).
4. Create the repo, then upload every file in this package, keeping the folder structure:

    your-repo/
    ├── index.html
    ├── admin.html
    ├── config.js
    ├── README.md
    ├── SETUP.md
    ├── js/
    │   └── supabase-client.js
    └── supabase/
        └── database.sql

   On GitHub's web interface: click **Add file → Upload files**, drag in
   `index.html`, `admin.html`, `config.js`, `README.md`, and `SETUP.md`
   first, commit, then repeat for the `js` and `supabase` folders (GitHub
   lets you drag a folder in directly and it keeps the folder structure).

## Phase 2 — Confirm config.js

`config.js` in this package already has your real, working Supabase
Project URL and Publishable key filled in. You don't need to change
anything here unless you want to switch to a different Supabase project
later.

## Phase 3 — Create the Netlify site

1. Go to https://www.netlify.com/ and sign in (or create an account) — you can sign in with your GitHub account directly.
2. Click **Add new site → Import an existing project**.
3. Choose **Deploy with GitHub**, and authorize Netlify to access your repositories if asked.
4. Select your new repository.
5. Netlify will show build settings — for this plain HTML site, use:
   - **Build command:** leave blank
   - **Publish directory:** `.` (a single period — meaning the root of the repo)
6. Click **Deploy site**.

Netlify will give you a random address like `https://random-name-123.netlify.app`. You can rename this later under **Site settings → Change site name**, or attach a custom domain if the school has one.

## Phase 4 — Test everything

1. Open your new Netlify URL — you should see the real Bethel homepage with your officers, mission/vision, and gallery photo already showing (no re-entry needed, since it's the same Supabase project).
2. Open `https://your-site.netlify.app/admin.html` and sign in with your existing SC admin email and password.
3. Try editing something small (like the Hero subtext) and confirm it appears instantly on the public page after a refresh.

## Phase 5 — Ongoing edits

From here on, everything works the same as before:

- Every change you save in `/admin.html` goes live immediately — no separate publish step.
- Adding gallery photos: go to **Gallery**, click **+ Add Photos**, and you can select multiple images at once — they'll all upload and appear as draft entries you can then caption/categorize.
- If you ever push a code change (like a design tweak) to GitHub again, Netlify redeploys automatically within about a minute, the same way Cloudflare Pages did.

## Troubleshooting

### The public page shows a blank page or old content
- Confirm `config.js` was uploaded correctly with your real Project URL and Publishable key.
- Check your browser console (F12 → Console tab) for a red error message.

### Admin says "not authorized"
Your Supabase Auth account exists, but its ID isn't in the `admin_users` table. In Supabase, go to **Authentication → Users**, copy your User UID, then in **SQL Editor** run:

    insert into public.admin_users (user_id, email)
    values ('PASTE-YOUR-USER-UID-HERE', 'your-email@example.com')
    on conflict (user_id) do update set email = excluded.email;

### Image upload fails
Check that the `website-images` Storage bucket exists in your Supabase project (Storage tab in the dashboard). If it's missing, you can recreate it and its policies using `supabase/database.sql` in this package.

## What NOT to upload, ever

- A Supabase `sb_secret_...` key or legacy `service_role` key
- Your Supabase database password
- Any admin account password
