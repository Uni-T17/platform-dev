# Deployment Guide — BookEx

This project has three parts, each deployed to a free host:

| Part | Folder | Host | Result URL (example) |
|------|--------|------|----------------------|
| Database (PostgreSQL) | — | **Neon** | `postgresql://...@...neon.tech/...` |
| Backend (Express API) | `backend/` | **Render** | `https://bookex-backend.onrender.com` |
| Frontend (Next.js) | `frontend/` | **Vercel** | `https://bookex.vercel.app` |

Deploy in this order: **Database → Backend → Frontend**, then connect them.

> **Free-tier note:** Render's free backend "sleeps" after ~15 min of no traffic and takes ~50s to wake on the next request. Neon's compute also sleeps but wakes in ~1s. This is normal for free hosting.

---

## Step 0 — Push the code to GitHub

Vercel and Render deploy from your GitHub repo, so your latest code must be on GitHub first.

```bash
git add -A
git commit -m "Prepare for Vercel + Render + Neon deployment"
git push origin main
```

(If Claude already committed/pushed for you, skip this.)

---

## Step 1 — Database on Neon

1. Go to https://neon.tech and sign up (GitHub login is easiest).
2. Click **Create Project**. Name it `bookex`, pick the region closest to you, click **Create**.
3. On the project dashboard, open **Connect** (or "Connection Details").
4. Copy the connection string. Use the plain Postgres string; make sure it ends with `?sslmode=require`. It looks like:
   ```
   postgresql://USER:PASSWORD@ep-xxxx.region.aws.neon.tech/bookex?sslmode=require
   ```
5. **Save this string** — it's your `DATABASE_URL` for the backend.

You don't need to create tables manually. The backend runs `prisma migrate deploy` on startup and builds them for you.

---

## Step 2 — Backend on Render

The repo already includes a [`render.yaml`](render.yaml) blueprint that configures everything.

1. Go to https://render.com and sign up with GitHub.
2. Click **New → Blueprint**.
3. Select this repository. Render reads `render.yaml` and shows a service called `bookex-backend`.
4. Before clicking **Apply**, fill in the environment variables it asks for:
   | Variable | Value |
   |----------|-------|
   | `DATABASE_URL` | the Neon string from Step 1 |
   | `CORS_ORIGINS` | leave blank for now — you'll add the Vercel URL in Step 4 |
   | `CLOUDINARY_CLOUD_NAME` | from your Cloudinary dashboard |
   | `CLOUDINARY_API_KEY` | from your Cloudinary dashboard |
   | `CLOUDINARY_API_SECRET` | from your Cloudinary dashboard |
   | `ACCESS_TOKEN_SECRET` | click "Generate" (Render fills a random value) |
   | `REFRESH_TOKEN_SECRET` | click "Generate" |
   | `NODE_ENV` | already set to `production` by the blueprint |
5. Click **Apply**. Render builds the Docker image and deploys.
6. Watch the **Logs** tab. A healthy start prints:
   ```
   Server is running on port:10000
   ```
   and the deploy shows **Live**. Migrations run automatically during boot.
7. Copy your backend URL from the top of the service page, e.g.
   `https://bookex-backend.onrender.com`
8. Test it: open `https://bookex-backend.onrender.com/health` in a browser. You should see:
   ```json
   {"status":"ok"}
   ```

> **Cloudinary** (image uploads): if you don't have an account, sign up free at https://cloudinary.com and copy the three values from the dashboard. If you skip these, the app runs but book-cover uploads will fail.

---

## Step 3 — Frontend on Vercel

1. Go to https://vercel.com and sign up with GitHub.
2. Click **Add New → Project** and import this repository.
3. **Important — this is a monorepo.** In the import screen, set:
   - **Root Directory** → `frontend`
   - Framework Preset → **Next.js** (auto-detected)
   - Build/Output settings → leave as default
4. Add an **Environment Variable**:
   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_API_URL` | your Render backend URL, **no trailing slash**, e.g. `https://bookex-backend.onrender.com` |
5. Click **Deploy**. When it finishes, copy your frontend URL, e.g.
   `https://bookex.vercel.app`

> **Why no trailing slash?** The API client builds request URLs as `${NEXT_PUBLIC_API_URL}/api/v1/...`. A trailing slash would create `//api/v1/...` and break requests.

---

## Step 4 — Connect frontend and backend (CORS)

Your backend must explicitly allow your Vercel URL, or the browser will block API calls.

1. Go back to **Render → bookex-backend → Environment**.
2. Set `CORS_ORIGINS` to your Vercel URL (no trailing slash):
   ```
   CORS_ORIGINS=https://bookex.vercel.app
   ```
   (Multiple URLs allowed, comma-separated: `https://a.vercel.app,https://b.vercel.app`.)
3. Save. Render redeploys automatically.

---

## Step 5 — Verify the whole thing

1. Open your Vercel URL.
2. Register a new account, then log in.
3. Confirm books load and you can create/exchange a book.

If something fails, open the browser **DevTools → Network** tab and check the failing request. See troubleshooting below.

---

## Troubleshooting

**Login works but you're logged out on refresh / cookies not saved**
Cross-site cookies require `NODE_ENV=production` on Render (sets `SameSite=None; Secure`). Confirm it's set. Both sites must be HTTPS (Vercel and Render both are).

**All API calls fail with a CORS error**
`CORS_ORIGINS` on Render must exactly match your Vercel URL (scheme + host, no trailing slash, no path). Redeploy after changing it.

**API calls go to `undefined/api/v1/...`**
`NEXT_PUBLIC_API_URL` wasn't set at build time on Vercel. Add it and **redeploy** (it's baked in at build, so a redeploy is required).

**Backend deploy fails on Prisma / database**
Check `DATABASE_URL` is the Neon string and ends with `?sslmode=require`. Check Render logs for the exact error.

**First request after idle is very slow (~50s)**
Normal — the Render free instance was asleep and is waking up. Subsequent requests are fast.

---

## Local development (unchanged)

Run everything locally with Docker Compose:

```bash
docker compose up --build
```

Or run each app directly — see `backend/envExample.txt` for the required environment variables (copy it to `backend/.env` and fill in the values).
