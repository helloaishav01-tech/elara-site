# 🌸 ELARA — Atelier of Luxury Footwear

> *\"Where flowers bloom underfoot.\"*

A botanical, editorial-grade e-commerce boutique for curated luxury footwear from the world's most storied maisons — Chanel, Manolo Blahnik, Aquazzura, Valentino, Bottega Veneta, Gucci, Jimmy Choo & Louis Vuitton.

[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com/atlas)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Deployed on Render](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render)](https://render.com)

---

## ✨ Highlights

- 🌷 **Editorial visual language** — falling petal animations, custom cursor, stained-glass SVG motifs, marquee brand strip
- 🛒 **Complete e-commerce flow** — Cart, Checkout, Order confirmation, Order tracking, Wishlist
- 🔐 **JWT authentication** — Register, Login, Profile, Order history (bcrypt-hashed passwords)
- 📊 **Admin dashboard** — order management, coupon CRUD, user list, revenue stats
- 💌 **Transactional emails** — branded Gmail SMTP HTML emails for newsletter & order confirmations
- 🎟️ **Coupon engine** — percent / fixed discounts, min-order, usage caps, code validation
- 📦 **Order tracking** — lookup by order number or email
- 🍪 **Privacy-first** — cookie consent banner, GDPR-aware
- 📱 **Fully responsive** — mobile-first, accessible, reduced-motion friendly

---

## 🏛️ Tech Stack

| Layer        | Stack                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------------ |
| **Frontend** | React 19 · React Router 7 · Tailwind CSS 3 · Radix UI · Lucide icons · Sonner toasts · Embla carousel  |
| **Backend**  | FastAPI · Uvicorn · Pydantic v2 · Motor (async MongoDB) · python-jose (JWT) · Passlib (bcrypt)         |
| **Database** | MongoDB Atlas                                                                                          |
| **Email**    | Gmail SMTP (smtplib)                                                                                   |
| **Payments** | Stripe (`@stripe/react-stripe-js`) — ready to plug                                                     |
| **Hosting**  | Backend → Render · Frontend → Vercel · DB → MongoDB Atlas · Repo → GitHub                              |
| **CI/CD**    | Auto-deploy on `git push` to `main`                                                                    |

---

## 📂 Project Structure

```text
elara-site/
├── backend/
│   ├── server.py            # FastAPI app — all routes, models, auth, email
│   ├── requirements.txt
│   └── .env                 # MONGO_URL, DB_NAME, SECRET_KEY, EMAIL_USER, EMAIL_PASS, CORS_ORIGINS
└── frontend/
    ├── public/index.html
    ├── package.json
    ├── tailwind.config.js   # ELARA palette: palm, pines, blossom, parfait, gold, cream
    ├── craco.config.js
    └── src/
        ├── App.js
        ├── App.css
        ├── index.css
        ├── index.js
        ├── components/      # Nav, Footer, ProductCard, QuickViewDialog,
        │                    # CustomCursor, Petals, StainedGlass, Reveal,
        │                    # BrandStrip, CookieBanner, SizeGuide, RelatedProducts
        │   └── ui/          # shadcn/ui primitives (dialog, button, toaster, …)
        ├── pages/           # Home, Collections, Products, About, Editorial,
        │                    # Reviews, Cart, Checkout, OrderConfirmation,
        │                    # OrderTracking, Admin, Wishlist, Login,
        │                    # Register, Profile
        ├── lib/             # api.js · AuthContext · CartContext · WishlistContext
        ├── data/products.js # Catalog (18 products, 6 categories, 8 maisons)
        └── images/          # Local botanical/floral assets
```

---

## 🎨 Brand Palette

| Token     | Hex       | Use                          |
| --------- | --------- | ---------------------------- |
| `palm`    | `#364023` | Deep botanical green (text)  |
| `pines`   | `#6a823e` | Mid green (accent)           |
| `willow`  | `#9c9f69` | Sage (labels)                |
| `parfait` | `#c7a39b` | Warm rose nude               |
| `blossom` | `#e6b1c4` | Soft petal pink              |
| `dolce`   | `#efd4dd` | Lightest pink                |
| `gold`    | `#c9a96e` | Editorial accents            |
| `cream`   | `#faf6f0` | Page background              |

**Typography:** Cormorant Garamond (serif italic) · Manrope (sans body)

---

## 🚀 Run Locally

### 1️⃣ Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate           # Windows  (mac/linux: source .venv/bin/activate)
pip install -r requirements.txt
```

Create `backend/.env`:

```env
MONGO_URL=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/?retryWrites=true&w=majority
DB_NAME=elara_db
CORS_ORIGINS=http://localhost:3000
SECRET_KEY=any-long-random-string
EMAIL_USER=youraddress@gmail.com
EMAIL_PASS=your-16-digit-gmail-app-password
```

Run:

```bash
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

### 2️⃣ Frontend

```bash
cd frontend
yarn install        # or npm install
```

Create `frontend/.env`:

```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

Run:

```bash
yarn start          # http://localhost:3000
```

---

## 🌐 Live Deployment

| Service  | URL                                              |
| -------- | ------------------------------------------------ |
| Backend  | `https://elara-backend-gn0c.onrender.com/api/`   |
| Frontend | _Coming soon — Vercel*                           |
| GitHub   | <https://github.com/helloaishav01-tech/elara-site> |

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for the full deploy playbook.

---

## 🔌 API Reference (selected)

| Method | Endpoint                          | Purpose                            |
| ------ | --------------------------------- | ---------------------------------- |
| GET    | `/api/`                           | Health check / brand info          |
| POST   | `/api/auth/register`              | Create user → returns JWT          |
| POST   | `/api/auth/login`                 | Login → returns JWT                |
| GET    | `/api/auth/me`                    | Current user profile               |
| PATCH  | `/api/auth/profile`               | Update profile                     |
| GET    | `/api/auth/orders`                | Logged-in user's orders            |
| POST   | `/api/newsletter`                 | Subscribe + welcome email          |
| GET    | `/api/reviews`                    | List reviews                       |
| POST   | `/api/reviews`                    | Add review                         |
| GET    | `/api/reviews/summary`            | Average + breakdown                |
| POST   | `/api/orders`                     | Create order + confirmation email  |
| GET    | `/api/orders`                     | Admin: all orders                  |
| GET    | `/api/orders/stats`               | Revenue + counts                   |
| GET    | `/api/orders/track?q=#1001`       | Track by # or email                |
| PATCH  | `/api/orders/{id}/status`         | Update status + tracking #         |
| POST   | `/api/coupons`                    | Create coupon                      |
| POST   | `/api/coupons/validate`           | Validate at checkout               |

---

## 👤 Author

**Aisha V.** — Designer · Full-stack developer
[github.com/helloaishav01-tech](https://github.com/helloaishav01-tech)

---

## 📜 License

© 2026 ELARA Atelier. All rights reserved. Personal portfolio / commercial-license-available.
