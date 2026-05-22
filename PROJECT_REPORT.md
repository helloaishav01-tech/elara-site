# ELARA — Atelier of Luxury Footwear

**A Full-Stack E-Commerce Case Study**

*Author:* **Aisha V.**
*Repository:* https://github.com/helloaishav01-tech/elara-site
*Live Backend:* https://elara-backend-gn0c.onrender.com
*Year:* 2026

---

## 1. Executive Summary

ELARA is an editorial-grade luxury footwear e-commerce platform built from scratch as an independent full-stack engineering project. It combines a hand-crafted visual identity — falling petals, a custom cursor, stained-glass SVG motifs, and a botanical color system — with a production-grade backend featuring JWT authentication, MongoDB persistence, transactional emails, a coupon engine, an admin dashboard, and a Stripe-ready checkout flow.

The project was designed, scoped, coded, debugged, and deployed by a single developer, and represents approximately three weeks of dedicated work across frontend, backend, infrastructure, and visual design.

---

## 2. Problem Statement

Most boutique footwear brands either (a) sell exclusively through social media DMs, losing scale and analytics, or (b) use generic e-commerce templates that flatten their visual identity into the same Shopify aesthetic as every other store.

ELARA answers a specific question: **what would an online shoe boutique feel like if it were designed like an editorial perfume campaign rather than a SaaS dashboard?**

The brief, in one sentence:
> *Build a luxury footwear boutique that feels like walking through a flower shop, with the operational rigour of a real e-commerce platform underneath.*

---

## 3. Design Philosophy

The visual language is built on three deliberate decisions:

1. **A botanical palette over the AI-generic purple-and-white** — palm green (`#364023`), blossom pink (`#e6b1c4`), antique gold (`#c9a96e`), warm cream (`#faf6f0`). The combination is uncommon for e-commerce and instantly recognizable.

2. **Cormorant Garamond (italic) paired with Manrope** — a serif/sans pairing that reads as editorial print rather than digital product. Most shops default to Inter or Roboto.

3. **Motion as decoration, not utility** — falling petals (CSS keyframes, GPU-accelerated `translate3d`), a custom cursor that follows pointer with lag interpolation, intersection-observer reveal animations, and a marquee brand strip. Every interaction has an earned animation, but reduced-motion preferences are respected.

The result is a site that is *visually committed* in a way most React e-commerce projects are not.

---

## 4. Architecture Overview

```
┌────────────────────────────────────────────────────────────┐
│                      USER BROWSER                          │
│  React 19 SPA · Tailwind CSS · Radix UI primitives         │
│  Context providers: Auth, Cart, Wishlist                   │
└──────────────────────────────┬─────────────────────────────┘
                               │ HTTPS · Axios
                               │ Bearer JWT in Authorization header
                               ▼
┌────────────────────────────────────────────────────────────┐
│                  VERCEL EDGE CDN                           │
│  Static React build · auto-deploy on git push              │
└──────────────────────────────┬─────────────────────────────┘
                               │ REACT_APP_BACKEND_URL
                               ▼
┌────────────────────────────────────────────────────────────┐
│           FastAPI · Uvicorn  (Render — Python 3.11)        │
│  · /api/auth/*   — register, login, profile, orders        │
│  · /api/reviews  — list, create, summary                   │
│  · /api/orders   — create, track, admin list, status       │
│  · /api/coupons  — CRUD + validate                         │
│  · /api/newsletter — subscribe + welcome email             │
│  Middleware: CORS · JWT decode · async lifespan seed       │
└──────────┬──────────────────────────────────┬──────────────┘
           │                                  │
           │ Motor async driver               │ smtplib
           ▼                                  ▼
┌──────────────────────────┐       ┌──────────────────────────┐
│   MongoDB Atlas (M0)     │       │   Gmail SMTP             │
│   collections:           │       │   Transactional HTML     │
│   users, reviews,        │       │   emails (welcome +      │
│   orders, coupons,       │       │   order confirmation)    │
│   newsletter             │       └──────────────────────────┘
└──────────────────────────┘
```

### 4.1 Frontend stack

| Concern              | Library                                    |
| -------------------- | ------------------------------------------ |
| UI framework         | React 19                                   |
| Routing              | React Router 7                             |
| Styling              | Tailwind CSS 3.4 + custom keyframes        |
| Component primitives | Radix UI (`@radix-ui/react-*`)             |
| Icons                | Lucide React                               |
| Toasts               | Sonner                                     |
| Carousel             | Embla                                      |
| Forms                | React Hook Form + Zod                      |
| HTTP                 | Axios                                      |
| Payments             | `@stripe/react-stripe-js` (integration-ready) |
| Build                | CRACO (Create React App + overrides)       |

### 4.2 Backend stack

| Concern              | Library                                    |
| -------------------- | ------------------------------------------ |
| HTTP framework       | FastAPI 0.115                              |
| ASGI server          | Uvicorn 0.30                               |
| Validation           | Pydantic v2 (`ConfigDict(extra=\"ignore\")`) |
| DB driver            | Motor 3.6 (async MongoDB)                  |
| Auth                 | `python-jose` (JWT, HS256, 30-day expiry)  |
| Password hashing     | Passlib + bcrypt                           |
| Email                | `smtplib` + Gmail App Password (SSL 465)   |
| Config               | `python-dotenv`                            |

---

## 5. Feature Matrix

| Domain              | Feature                                                              | Status |
| ------------------- | -------------------------------------------------------------------- | :----: |
| **Catalog**         | 18 curated products across 6 categories and 8 maisons                |   ✅   |
| **Catalog**         | Quick View dialog with full product detail                           |   ✅   |
| **Catalog**         | Brand filter + free-text search                                      |   ✅   |
| **Catalog**         | Size guide modal                                                     |   ✅   |
| **Catalog**         | Related products carousel                                            |   ✅   |
| **Auth**            | Register with email + password (bcrypt-hashed)                       |   ✅   |
| **Auth**            | Login → JWT issued, stored client-side, attached to requests         |   ✅   |
| **Auth**            | Authenticated profile page + edit                                    |   ✅   |
| **Auth**            | \"My orders\" — per-user order history                                 |   ✅   |
| **Commerce**        | Persistent cart (Context API + localStorage)                         |   ✅   |
| **Commerce**        | Wishlist with toggle                                                 |   ✅   |
| **Commerce**        | Multi-step checkout (shipping → payment → review)                    |   ✅   |
| **Commerce**        | Order created server-side with auto-incrementing order numbers       |   ✅   |
| **Commerce**        | Order confirmation page + branded HTML email                         |   ✅   |
| **Commerce**        | Order tracking page (lookup by #order or email)                      |   ✅   |
| **Promotions**      | Coupon engine — % or flat, min-order, max-uses, expiry-aware         |   ✅   |
| **Engagement**      | Newsletter subscription + welcome HTML email                         |   ✅   |
| **Engagement**      | Reviews with 1–5 star ratings + breakdown stats                      |   ✅   |
| **Engagement**      | Petal animation with parallax pointer-tracking                       |   ✅   |
| **Engagement**      | Custom cursor with hover-state interpolation                         |   ✅   |
| **Admin**           | Order list with status updates and tracking number entry             |   ✅   |
| **Admin**           | Coupon CRUD                                                          |   ✅   |
| **Admin**           | Revenue + order count statistics                                     |   ✅   |
| **Admin**           | User list                                                            |   ✅   |
| **Privacy**         | Cookie consent banner                                                |   ✅   |
| **Privacy**         | Reduced-motion respected for animations                              |   ✅   |
| **DevOps**          | GitHub repo with clean commit history                                |   ✅   |
| **DevOps**          | Render backend deployment (Python 3.11)                              |   ✅   |
| **DevOps**          | MongoDB Atlas (M0 cluster)                                           |   ✅   |
| **DevOps**          | Vercel frontend deployment                                           |   ⏳   |
| **Payments**        | Stripe SDK integrated, awaiting live keys                            |   ⏳   |

---

## 6. Notable Engineering Decisions

### 6.1 UUID strings instead of MongoDB ObjectIds

Every model uses `uuid.uuid4()` as its `id` field, and every query excludes `_id` with `{\"_id\": 0}`. This avoids the entire class of \"BSON ObjectId is not JSON serializable\" bugs and lets responses go straight from `find()` to JSON without a serialization step.

### 6.2 Pydantic v2 with `extra=\"ignore\"`

All models use `model_config = ConfigDict(extra=\"ignore\")` so additional fields returned by the database (e.g. legacy columns from migrations) don't break the response. This is a small thing that prevents an entire class of \"ValidationError on read\" failures in long-lived systems.

### 6.3 FastAPI lifespan event for seed data

Rather than running a separate seed script, the FastAPI `lifespan` context manager checks for an empty `reviews` collection on startup and seeds it idempotently. New deployments come up populated.

### 6.4 Route ordering on FastAPI

A subtle FastAPI gotcha: a `/orders/track` route must be declared *before* `/orders/{order_id}`, otherwise the literal `track` is captured as an order id. ELARA's router places all specific paths before parametrised ones — a comment in `server.py` documents this for future maintainers.

### 6.5 Petals built without Three.js

A 3D-feeling parallax effect implemented with CSS `transform: translate3d()` and a single `requestAnimationFrame` listener for pointer position. Three.js would have been ~150 KB; the CSS version is ~3 KB.

### 6.6 Custom cursor that respects pointer type

Only enabled on `(hover: hover) and (pointer: fine)` — meaning touchscreens are untouched. Many \"custom cursor\" libraries break mobile UX. ELARA's doesn't.

---

## 7. Visual Identity

| Token       | Hex       | Role                                |
| ----------- | --------- | ----------------------------------- |
| `palm`      | `#364023` | Primary text                        |
| `pines`     | `#6a823e` | Mid-green accent                    |
| `willow`    | `#9c9f69` | Sage labels                         |
| `parfait`   | `#c7a39b` | Warm rose nude                      |
| `blossom`   | `#e6b1c4` | Soft petal pink                     |
| `dolce`     | `#efd4dd` | Lightest pink                       |
| `gold`      | `#c9a96e` | Editorial accents                   |
| `cream`     | `#faf6f0` | Page background                     |

**Typefaces:** Cormorant Garamond (serif italic display) + Manrope (sans body).
**Iconography:** Lucide React — chosen for its hairline weight which matches the editorial feel.

---

## 8. Challenges & Solutions

| Challenge                                                          | Solution                                                                   |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| Render defaulted to Python 3.14, which broke pydantic-core build   | Added `PYTHON_VERSION=3.11.0` to Render environment, locked `pydantic==2.10.0` |
| Motor / PyMongo version mismatch                                   | Pinned `motor==3.6.0` paired with `pymongo` (transitive) on Python 3.11    |
| MongoDB ObjectId serialization                                     | UUID strings + `{\"_id\": 0}` projection on every read                       |
| Gmail SMTP rejecting Render's IP                                   | Gmail App Password + `smtplib.SMTP_SSL(\"smtp.gmail.com\", 465)`             |
| FastAPI route shadowing on `/orders/track` vs `/orders/{id}`       | Declared specific paths before parametrised ones                           |
| Free Render tier \"cold start\" 30s lag                              | Documented in DEPLOYMENT.md; accepted for personal-scale traffic           |
| Avoiding the \"AI slop\" purple-gradient look                        | Hand-picked botanical palette, asymmetric layouts, custom keyframes        |

---

## 9. Repository Hygiene

- `.env` files are gitignored. Secrets live only on Render's encrypted environment.
- All API endpoints are namespaced under `/api` to play nicely with Kubernetes/CDN ingress rules.
- Frontend always reads the backend URL from `process.env.REACT_APP_BACKEND_URL`. No hardcoded hosts.
- Backend always reads MongoDB credentials from `os.environ['MONGO_URL']`. No defaults that would silently connect to the wrong DB.

---

## 10. Future Roadmap

- [ ] Vercel frontend deployment + custom domain
- [ ] Replace mock product images with real photography from licensed sources
- [ ] Stripe Checkout live integration
- [ ] Inventory tracking (decrement stock on order, prevent overselling)
- [ ] Search-as-you-type with Algolia or MongoDB Atlas Search
- [ ] User-uploaded review photos via Cloudinary
- [ ] WhatsApp order notifications for owners (via Twilio)
- [ ] PWA install prompt + offline cart
- [ ] Rate limiting on auth endpoints (slowapi)
- [ ] Sentry error tracking
- [ ] Hindi / French localization

---

## 11. What This Project Demonstrates

For anyone evaluating ELARA — a recruiter, a client, or a buyer — this single repository is concrete evidence of:

- End-to-end product thinking (design → architecture → deployment)
- Comfort across React, Python, async I/O, NoSQL, and authentication systems
- Production deployment skills across multiple cloud providers
- Visual design judgement that is *not* template-driven
- The discipline to ship something complete, not just start something interesting

---

## 12. Author

**Aisha V.**

Designer · Full-stack developer
**GitHub:** [@helloaishav01-tech](https://github.com/helloaishav01-tech)

ELARA was conceived, designed, coded, and deployed as a solo project. All trademarks of luxury maisons referenced in the catalog data are property of their respective owners and are used here for illustrative product-catalog purposes within an unreleased portfolio demonstration.

---

*© 2026 ELARA Atelier — Where flowers bloom underfoot.*
