# 🚀 ELARA — Deployment Playbook

This document picks up **exactly where you are right now**: your backend is live on Render, and only the frontend needs Vercel.

---

## ✅ Current Status

| Step                              | Status     |
| --------------------------------- | ---------- |
| GitHub repo                       | ✅ Done    |
| MongoDB Atlas cluster             | ✅ Done    |
| Backend on Render                 | ✅ **Live** at `https://elara-backend-gn0c.onrender.com` |
| Frontend on Vercel                | ⏳ Pending |
| Backend → Frontend CORS update    | ⏳ Pending |

> **The 404 in your Render logs is NOT a bug** — it's because Render pings the root `/` to check if your service is alive, but ELARA's routes live under `/api/`. Your real endpoint is `/api/` and it works.

---

## 🩺 Step 0 — Verify backend is healthy

Open in browser:

```
https://elara-backend-gn0c.onrender.com/api/
```

You should see:

```json
{\"brand\":\"ELARA\",\"tagline\":\"Where flowers bloom underfoot\"}
```

Also test:

```
https://elara-backend-gn0c.onrender.com/api/reviews
https://elara-backend-gn0c.onrender.com/api/reviews/summary
```

If both return JSON ✅ — your backend is 100% live. Proceed.

---

## 🌐 Step 1 — Deploy frontend to Vercel

### 1.1 Sign in
Go to [vercel.com](https://vercel.com) → **Sign in with GitHub**.

### 1.2 Import the project
- Click **\"Add New Project\"** → **\"Import Git Repository\"**
- Select **`helloaishav01-tech/elara-site`**
- Click **Import**

### 1.3 Configure build

| Field                  | Value                                |
| ---------------------- | ------------------------------------ |
| **Framework Preset**   | `Create React App`                   |
| **Root Directory**     | `frontend`  ← *very important*       |
| **Build Command**      | `yarn build` (auto-detected)         |
| **Output Directory**   | `build` (auto)                       |
| **Install Command**    | `yarn install`                       |

### 1.4 Add Environment Variable

Expand **\"Environment Variables\"** and add:

| Key                       | Value                                            |
| ------------------------- | ------------------------------------------------ |
| `REACT_APP_BACKEND_URL`   | `https://elara-backend-gn0c.onrender.com`        |

> ⚠️ **No trailing slash.** Just the bare domain — your code already adds `/api`.

### 1.5 Click **Deploy**

Wait ~2 minutes. You'll get a URL like:

```
https://elara-site.vercel.app
```

🎉 **Copy this URL.** You need it for Step 2.

---

## 🔒 Step 2 — Update backend CORS to accept your Vercel domain

Right now Render allows `*` (any origin) which works but is insecure. Tighten it:

### 2.1 Open Render
Dashboard → **elara-backend** → **Environment** tab → edit `CORS_ORIGINS`.

### 2.2 Change value to:

```
https://elara-site.vercel.app,http://localhost:3000
```

(Replace `elara-site.vercel.app` with your actual Vercel URL.)

### 2.3 Save
Render will auto-redeploy in ~1 min.

---

## 🧪 Step 3 — Smoke test the live site

Open `https://elara-site.vercel.app` and walk through:

- [ ] Home page loads, petals fall, custom cursor moves
- [ ] Brand strip marquee scrolls
- [ ] Click **Collections** → categories show
- [ ] Click **Products** → grid renders, Quick View opens
- [ ] Click **Reviews** → reviews load from API ✅ (this proves frontend ↔ backend talk)
- [ ] **Register** a new account → token saved
- [ ] **Add to cart** → cart page shows item
- [ ] **Checkout** flow completes → confirmation email arrives 📨
- [ ] **Order Tracking** with order number works
- [ ] **/admin** route opens admin dashboard

If any step fails, open browser DevTools → **Network tab** → check the failing API call.

---

## 🛠️ Step 4 — Custom domain (optional, $10–15 / year)

Recommended for selling the project or pinning on your portfolio:

- Buy `elara.shop` or `elaraatelier.com` on Namecheap / Porkbun
- Vercel → Project → **Settings → Domains → Add**
- Add the A / CNAME records Vercel shows you to your domain registrar
- Wait ~10 mins for SSL cert
- Update Render's `CORS_ORIGINS` to include the new domain

---

## ⚠️ Common gotchas

| Problem                                        | Fix                                                                                  |
| ---------------------------------------------- | ------------------------------------------------------------------------------------ |
| Frontend works but API calls fail              | Check Vercel env var `REACT_APP_BACKEND_URL` — must be exact, no trailing slash      |
| `CORS blocked` in browser console              | Add your Vercel URL to Render `CORS_ORIGINS`                                         |
| Render backend takes 30+ seconds to respond    | Free tier \"spins down\" after 15 min idle. First request wakes it up. Normal.         |
| Order confirmation emails not arriving         | Gmail blocks SMTP unless you use an **App Password** — not your real Gmail password  |
| MongoDB connection error                       | Atlas → Network Access → allow `0.0.0.0/0` (everywhere)                              |
| Build fails on Vercel with \"module not found\"  | Make sure **Root Directory = `frontend`** is set in Vercel project settings          |

---

## 💸 Free-tier limits to know

| Service     | Free limit                                          | When to upgrade                       |
| ----------- | --------------------------------------------------- | ------------------------------------- |
| Render      | 750 hrs/month · spins down after 15 min idle        | If you get real traffic ($7/mo)       |
| Vercel      | 100 GB bandwidth · unlimited deploys                | Almost never for a project this size  |
| MongoDB     | 512 MB free forever (M0 cluster)                    | When you exceed ~50k orders           |
| Gmail SMTP  | 500 emails/day                                      | Use Resend (3k/mo free) or SendGrid   |

---

## 📦 Production checklist before pinning to portfolio

- [ ] Live URL works on mobile (test on phone, not just resized browser)
- [ ] Favicon visible in browser tab
- [ ] Page titles & meta descriptions set per route (use `react-helmet`)
- [ ] `noindex` on `/admin` route
- [ ] At least 3 real product images uploaded (not placeholders)
- [ ] Admin password changed from defaults
- [ ] `.env` files **not** committed to GitHub (`.gitignore` it)
- [ ] README has live demo link

---

You did it, Aisha. 🌸 You shipped a real luxury e-commerce platform.
