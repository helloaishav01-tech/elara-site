# 🌸 ELARA — Luxury E-Commerce Platform

> *Where flowers bloom underfoot.*

A complete, production-ready luxury fashion e-commerce platform built with **React 19 + FastAPI + MongoDB**. Designed for high-end footwear and apparel brands. Every detail — from the petal-soft UI to the full backend — is ready to deploy and sell.

**Live Demo:** https://elara-site-rho.vercel.app

---

## ✨ Features

### 🛍️ Storefront
- Elegant luxury UI with custom typography and gold accents
- Product catalog with category filtering (Heels, Flats, Loafers, Boots, Sandals)
- Product detail pages with size selector and image gallery
- Related products section
- Wishlist (heart/save products)
- Shopping cart with real-time totals
- Collections page with editorial layout
- Newsletter subscription with welcome email

### 💳 Checkout & Payments
- Full checkout flow with shipping details
- **Razorpay integration** — card, UPI, Google Pay support
- Cash on delivery option
- Coupon/discount code engine (percent or fixed amount)
- Order confirmation page
- Transactional emails via **Resend API**

### 👤 User Accounts
- Register / Login with JWT authentication
- User profile with order history
- Address management

### ⭐ Reviews
- Product-specific reviews with star ratings
- Photo upload support for reviews
- Review summary with rating breakdown

### 🔧 Admin Dashboard
- Password-protected admin panel
- Full product CRUD (create, edit, delete)
- Order management with status updates + tracking number
- Coupon creation and management
- Newsletter subscriber count
- CSV export of orders
- Revenue stats and order analytics

### 📧 Email System
- Welcome email on newsletter signup
- Order confirmation email on purchase
- Beautiful branded HTML email templates
- Powered by Resend API (3000 free emails/month)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router 7, Tailwind CSS |
| Backend | FastAPI (Python 3.11), Uvicorn |
| Database | MongoDB Atlas |
| Auth | JWT (python-jose) |
| Payments | Razorpay |
| Email | Resend API |
| Hosting | Vercel (frontend) + Render (backend) |

---

## 📦 What's Included

```
elara-site/
├── frontend/          # React 19 app
│   ├── src/
│   │   ├── pages/     # Home, Collections, ProductDetail, Cart,
│   │   │              # Checkout, OrderConfirmation, Login,
│   │   │              # Register, Profile, Track, Admin
│   │   ├── components/# Navbar, Footer, ProductCard, etc.
│   │   └── context/   # CartContext, WishlistContext, AuthContext
│   └── package.json
├── backend/           # FastAPI app
│   ├── server.py      # All API routes (600+ lines)
│   ├── seed_products.py # 18 luxury products seed script
│   └── requirements.txt
└── README.md
```

---

## 🚀 Setup Guide

### Prerequisites
- Node.js 18+
- Python 3.11+
- MongoDB Atlas account (free)
- Vercel account (free)
- Render account (free)
- Razorpay account (free test mode)
- Resend account (free — 3000 emails/month)

---

### Step 1 — Clone & Install

```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
pip install -r requirements.txt
```

---

### Step 2 — Environment Variables

**Backend** — create `backend/.env`:
```env
MONGO_URL=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/elara_db
DB_NAME=elara_db
SECRET_KEY=your-secret-key-here
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
ADMIN_PASSWORD=your-admin-password
```

**Frontend** — create `frontend/.env`:
```env
REACT_APP_BACKEND_URL=http://localhost:8000
REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

---

### Step 3 — Seed Products

```bash
cd backend
python seed_products.py
```
This adds 18 luxury products to your MongoDB database.

---

### Step 4 — Run Locally

```bash
# Terminal 1 — Backend
cd backend
uvicorn server:app --reload --port 8000

# Terminal 2 — Frontend
cd frontend
npm start
```

Visit `http://localhost:3000` 🌸

---

### Step 5 — Deploy to Production

**Backend → Render:**
1. Push to GitHub
2. New Web Service on Render → connect repo → set root to `backend`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn server:app --host 0.0.0.0 --port $PORT`
5. Add all environment variables from Step 2

**Frontend → Vercel:**
1. Import GitHub repo on Vercel
2. Set root to `frontend`
3. Add environment variables:
   - `REACT_APP_BACKEND_URL` = your Render URL
   - `REACT_APP_RAZORPAY_KEY_ID` = your Razorpay key

---

### Step 6 — Set Up Email (Resend)

1. Sign up at [resend.com](https://resend.com) — free
2. Create an API key
3. Add `RESEND_API_KEY` to Render environment variables
4. **For sending to any email**: verify your domain in Resend → Domains
5. Update the `"from"` field in `server.py` to use your domain:
   ```python
   "from": "Your Brand <hello@yourdomain.com>"
   ```

> ⚠️ Without a verified domain, Resend only sends to the email you signed up with. Domain verification takes ~5 minutes.

---

### Step 7 — Set Up Payments (Razorpay)

1. Sign up at [razorpay.com](https://razorpay.com)
2. Get your Key ID and Key Secret from Dashboard → Settings → API Keys
3. For live payments: complete KYC on Razorpay and switch to live keys
4. Update both frontend and backend environment variables

---

## 🔑 Admin Panel

Visit `/admin` on your deployed site.
Default password: set via `ADMIN_PASSWORD` environment variable.

**Admin can:**
- Add / edit / delete products
- Update order status and tracking
- Create and manage coupons
- View revenue stats
- Export orders as CSV

---

## 🎨 Customisation

| What | Where |
|---|---|
| Brand name | `frontend/src/components/Navbar.jsx` + Footer |
| Colors | `frontend/tailwind.config.js` |
| Products | Admin panel or `backend/seed_products.py` |
| Email templates | `backend/server.py` → `send_email` calls |
| Hero images | `frontend/public/images/` |
| Categories | `backend/server.py` + frontend filter |

---

## 📋 API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | List all products |
| GET | `/api/products/:id` | Single product |
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Current user |
| POST | `/api/orders` | Create order |
| GET | `/api/orders/track?q=` | Track order |
| POST | `/api/coupons/validate` | Validate coupon |
| POST | `/api/newsletter` | Subscribe |
| GET | `/api/health` | Health check |

---

## 💌 Support

This purchase includes **1 week of setup support**.

If you have any issues:
- Open an issue on GitHub
- Or contact via the platform you purchased from

---

## 📄 License

Single-use commercial license. You may use this code for one project/client. Reselling or redistribution of the source code is not permitted.

---

*Built with love and luxury. May your store bloom. 🌸*
