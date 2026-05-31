import resend
from contextlib import asynccontextmanager
from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import razorpay

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

razorpay_client = razorpay.Client(
    auth=(
        os.environ.get("RAZORPAY_KEY_ID", "rzp_test_StJwGj5ruwAviX"),
        os.environ.get("RAZORPAY_KEY_SECRET", "")
    )
)

def send_email(to_email: str, subject: str, html_body: str):
    try:
        api_key = os.environ.get("RESEND_API_KEY")
        if not api_key:
            logger.warning("RESEND_API_KEY not set — skipping email")
            return
        response = requests.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            json={
                "from": "ELARA Atelier <onboarding@resend.dev>",
                "to": [to_email],
                "subject": subject,
                "html": html_body
            }
        )
        if response.status_code == 200:
            logger.info(f"Email sent to {to_email}")
        else:
            logger.error(f"Email failed: {response.status_code} {response.text}")
    except Exception as e:
        logger.error(f"Email failed: {e}")

class NewsletterCreate(BaseModel):
    email: str
    name: Optional[str] = None

class NewsletterSubscriber(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ReviewCreate(BaseModel):
    name: str
    rating: int = Field(ge=1, le=5)
    text: str
    location: Optional[str] = None
    photo_url: Optional[str] = None
    product: Optional[str] = None

class Review(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    product_id: Optional[str] = None
    name: str
    email: Optional[str] = None
    rating: int
    text: str
    location: Optional[str] = None
    photo_url: Optional[str] = None
    product: Optional[str] = None
    verified: bool = False
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ProductReviewCreate(BaseModel):
    name: str
    email: str
    rating: int = Field(ge=1, le=5)
    text: str
    photo_url: Optional[str] = None

class OrderCreate(BaseModel):
    items: list
    total: float
    email: str
    shipping: dict
    payment_method: str = "card"
    status: str = "pending"

class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    order_number: int = 1001
    items: list
    total: float
    email: str
    shipping: dict
    payment_method: str = "card"
    status: str = "pending"
    tracking_number: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class CouponCreate(BaseModel):
    code: str
    discount_type: str = "percent"
    discount_value: float
    min_order: float = 0
    max_uses: int = 100
    active: bool = True

class Coupon(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    code: str
    discount_type: str = "percent"
    discount_value: float
    min_order: float = 0
    max_uses: int = 100
    uses: int = 0
    active: bool = True
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class UserRegister(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: str

class UserLogin(BaseModel):
    email: str
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    first_name: str
    last_name: str
    hashed_password: str
    phone: Optional[str] = None
    address: Optional[dict] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[dict] = None

class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    brand: str
    price: float
    category: str
    description: str = ""
    sizes: list[str] = []
    image: str = ""
    stock: int = 100
    featured: bool = False
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    model_config = ConfigDict(extra="ignore")


SECRET_KEY = os.environ.get("SECRET_KEY", "elara-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 30
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

def hash_password(password: str) -> str:
    return pwd_context.hash(password[:72])

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain[:72], hashed)

def create_token(data: dict) -> str:
    expire = datetime.now(timezone.utc) + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    return jwt.encode({**data, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    if not token:
        return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            return None
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        return user
    except JWTError:
        return None


SEED_REVIEWS = [
    {"name": "Aurelie Marchand", "location": "Paris, France", "rating": 5,
     "text": "ELARA's curation is unmatched. My Aquazzura mules arrived in petal-soft packaging — pure poetry.",
     "photo_url": "https://images.unsplash.com/photo-1545912452-8aea7e25a3d3?w=400&q=80",
     "product": "Aquazzura Sunflower Mule"},
    {"name": "Beatrice Hollander", "location": "London, UK", "rating": 5,
     "text": "I've shopped luxury for two decades. Nothing rivals ELARA's editorial taste — every pair feels storied.",
     "photo_url": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
     "product": "Manolo Blahnik Hangisi"},
    {"name": "Yui Nakamura", "location": "Tokyo, Japan", "rating": 5,
     "text": "The bridal Valentino slingbacks I ordered for my wedding moved me to tears. Beyond beautiful.",
     "photo_url": "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80",
     "product": "Valentino Rockstud Slingback"},
    {"name": "Camille Aubert", "location": "Lyon, France", "rating": 4,
     "text": "Fast delivery, exquisite presentation. The Bottega cassette flats run slightly small — size up.",
     "photo_url": "https://images.unsplash.com/photo-1502323777036-f29e3972d82f?w=400&q=80",
     "product": "Bottega Veneta Lido Flat"},
    {"name": "Sofia Caruso", "location": "Milan, Italy", "rating": 5,
     "text": "ELARA understands the art of dressing. The Gucci horsebit loafers are a love letter to my wardrobe.",
     "photo_url": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
     "product": "Gucci Horsebit Loafer"},
    {"name": "Eloise Beaumont", "location": "Geneva, Switzerland", "rating": 5,
     "text": "The Jimmy Choo Romy heel I purchased felt like a campaign delivered to my door. Worth every franc.",
     "photo_url": "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=400&q=80",
     "product": "Jimmy Choo Romy 100"},
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    count = await db.reviews.count_documents({})
    if count == 0:
        docs = [Review(**r).model_dump() for r in SEED_REVIEWS]
        if docs:
            await db.reviews.insert_many(docs)
    yield
    client.close()


app = FastAPI(title="ELARA API", lifespan=lifespan)
api_router = APIRouter(prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@api_router.get("/")
async def root():
    return {"brand": "ELARA", "tagline": "Where flowers bloom underfoot"}

@api_router.get("/health")
async def health():
    try:
        await db.command("ping")
        return {"status": "ok", "mongo": "connected"}
    except Exception as e:
        return {"status": "error", "mongo": str(e)}


@api_router.post("/auth/register")
async def register(payload: UserRegister):
    try:
        email = payload.email.strip().lower()
        if "@" not in email:
            raise HTTPException(status_code=400, detail="Invalid email")
        if len(payload.password) < 6:
            raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
        existing = await db.users.find_one({"email": email})
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
        user = User(
            email=email,
            first_name=payload.first_name.strip(),
            last_name=payload.last_name.strip(),
            hashed_password=hash_password(payload.password)
        )
        await db.users.insert_one(user.model_dump())
        token = create_token({"sub": user.id})
        return {"token": token, "user": {"id": user.id, "email": user.email, "first_name": user.first_name, "last_name": user.last_name}}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Register error: {type(e).__name__}: {e}")
        raise HTTPException(status_code=500, detail=f"{type(e).__name__}: {str(e)}")

@api_router.post("/auth/login")
async def login(payload: UserLogin):
    email = payload.email.strip().lower()
    user = await db.users.find_one({"email": email}, {"_id": 0})
    if not user or not verify_password(payload.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_token({"sub": user["id"]})
    return {"token": token, "user": {"id": user["id"], "email": user["email"], "first_name": user["first_name"], "last_name": user["last_name"]}}

@api_router.get("/auth/me")
async def get_me(current_user=Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return {"id": current_user["id"], "email": current_user["email"], "first_name": current_user["first_name"],
            "last_name": current_user["last_name"], "phone": current_user.get("phone"),
            "address": current_user.get("address"), "created_at": current_user["created_at"]}

@api_router.patch("/auth/profile")
async def update_profile(payload: UserUpdate, current_user=Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    await db.users.update_one({"id": current_user["id"]}, {"$set": update_data})
    return {"message": "Profile updated"}

@api_router.get("/auth/orders")
async def get_my_orders(current_user=Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    orders = await db.orders.find({"email": current_user["email"]}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return orders


@api_router.post("/newsletter", response_model=NewsletterSubscriber)
async def subscribe_newsletter(payload: NewsletterCreate):
    email = payload.email.strip().lower()
    if "@" not in email or "." not in email:
        raise HTTPException(status_code=400, detail="Invalid email")
    existing = await db.newsletter.find_one({"email": email}, {"_id": 0})
    if existing:
        return NewsletterSubscriber(**existing)
    sub = NewsletterSubscriber(email=email, name=payload.name)
    await db.newsletter.insert_one(sub.model_dump())
    html = f"""
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #faf6f0; padding: 40px;">
      <h1 style="color: #364023; font-style: italic; font-size: 42px; margin-bottom: 8px;">Elara</h1>
      <p style="color: #c9a96e; font-size: 11px; letter-spacing: 4px; text-transform: uppercase;">Atelier · Where flowers bloom underfoot</p>
      <hr style="border: none; border-top: 1px solid #e6b1c4; margin: 30px 0;">
      <h2 style="color: #364023; font-weight: 300; font-size: 28px;">Welcome to the garden, {payload.name or 'dear friend'}.</h2>
      <p style="color: #6a823e; line-height: 1.8;">You've joined a quiet circle of those who believe a shoe is not merely worn — it is remembered.</p>
      <p style="color: #364023; line-height: 1.8;">Expect editorial reflections, private previews, and the occasional poem. Curated thrice a season.</p>
      <hr style="border: none; border-top: 1px solid #e6b1c4; margin: 30px 0;">
      <a href="https://elara-site-rho.vercel.app/collections?cat=all"
        style="background: #364023; color: #faf6f0; padding: 14px 32px; border-radius: 999px;
               text-decoration: none; font-size: 11px; letter-spacing: 3px; text-transform: uppercase;">
        Enter the Atelier
      </a>
      <p style="color: #9c9f69; font-size: 11px; margin-top: 30px;">© ELARA Atelier. Unsubscribe anytime.</p>
    </div>
    """
    send_email(email, "Welcome to ELARA — A petal for you 🌸", html)
    return sub

@api_router.get("/newsletter/count")
async def newsletter_count():
    n = await db.newsletter.count_documents({})
    return {"count": n}


@api_router.get("/products")
async def get_products():
    products = await db.products.find({}, {"_id": 0}).to_list(1000)
    return products

@api_router.get("/products/{product_id}")
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@api_router.post("/products")
async def create_product(product: Product):
    await db.products.insert_one(product.model_dump())
    return product

@api_router.put("/products/{product_id}")
async def update_product(product_id: str, product: Product):
    result = await db.products.update_one(
        {"id": product_id},
        {"$set": product.model_dump()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str):
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted", "id": product_id}


@api_router.get("/products/{product_id}/reviews")
async def get_product_reviews(product_id: str):
    reviews = await db.reviews.find(
        {"product_id": product_id}, {"_id": 0}
    ).sort("created_at", -1).to_list(1000)
    if not reviews:
        return {"reviews": [], "summary": None}
    ratings = [r.get("rating", 0) for r in reviews]
    avg = sum(ratings) / len(ratings)
    summary = {
        "average": round(avg, 1),
        "total": len(reviews),
        "breakdown": {str(n): sum(1 for r in ratings if r == n) for n in range(5, 0, -1)},
    }
    return {"reviews": reviews, "summary": summary}

@api_router.post("/products/{product_id}/reviews")
async def create_product_review(product_id: str, payload: ProductReviewCreate):
    product = await db.products.find_one({"id": product_id}, {"_id": 0, "name": 1})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    review = Review(
        product_id=product_id,
        name=payload.name,
        email=payload.email,
        rating=payload.rating,
        text=payload.text,
        photo_url=payload.photo_url or "",
        product=product.get("name"),
    )
    await db.reviews.insert_one(review.model_dump())
    return {"message": "Review submitted", "review": review.model_dump()}


@api_router.get("/reviews", response_model=List[Review])
async def list_reviews():
    items = await db.reviews.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)
    return items

@api_router.post("/reviews", response_model=Review)
async def create_review(payload: ReviewCreate):
    review = Review(**payload.model_dump())
    await db.reviews.insert_one(review.model_dump())
    return review

@api_router.get("/reviews/summary")
async def reviews_summary():
    items = await db.reviews.find({}, {"_id": 0, "rating": 1}).to_list(2000)
    total = len(items)
    if total == 0:
        return {"total": 0, "average": 0.0, "breakdown": {"5": 0, "4": 0, "3": 0, "2": 0, "1": 0}}
    breakdown = {"5": 0, "4": 0, "3": 0, "2": 0, "1": 0}
    sum_r = 0
    for it in items:
        r = int(it.get("rating", 0))
        sum_r += r
        if 1 <= r <= 5:
            breakdown[str(r)] += 1
    return {"total": total, "average": round(sum_r / total, 2), "breakdown": breakdown}


@api_router.post("/orders")
async def create_order(payload: OrderCreate):
    count = await db.orders.count_documents({})
    order = Order(
        order_number=1001 + count,
        items=payload.items,
        total=payload.total,
        email=payload.email,
        shipping=payload.shipping,
        payment_method=payload.payment_method,
        status=payload.status
    )
    await db.orders.insert_one(order.model_dump())
    html = f"""
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #faf6f0; padding: 40px;">
      <h1 style="color: #364023; font-style: italic; font-size: 36px; margin-bottom: 4px;">Elara</h1>
      <p style="color: #c9a96e; font-size: 11px; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 30px;">Atelier · Order Confirmation</p>
      <hr style="border: none; border-top: 1px solid #e6b1c4; margin: 0 0 30px 0;">
      <h2 style="color: #364023; font-weight: 300; font-size: 24px; margin-bottom: 8px;">
        Thank you, {payload.shipping.get('firstName', 'dear friend')}.
      </h2>
      <p style="color: #6a823e; line-height: 1.8; margin-bottom: 24px;">
        Your order #{1001 + count} has been received and is being prepared with care.
      </p>
      <a href="https://elara-site-rho.vercel.app/track"
        style="background: #364023; color: #faf6f0; padding: 14px 32px; border-radius: 999px;
               text-decoration: none; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; display: inline-block;">
        Track Your Order
      </a>
      <hr style="border: none; border-top: 1px solid #e6b1c4; margin: 30px 0;">
      <p style="color: #9c9f69; font-size: 11px; text-align: center;">© ELARA Atelier · Where flowers bloom underfoot</p>
    </div>
    """
    send_email(payload.email, f"Your ELARA Order #{1001 + count} is confirmed 🌸", html)
    return order

@api_router.get("/orders/stats")
async def order_stats():
    orders = await db.orders.find({}, {"_id": 0}).to_list(10000)
    revenue = sum(o.get("total", 0) for o in orders)
    return {
        "total_orders": len(orders),
        "total_revenue": round(revenue, 2),
        "pending": sum(1 for o in orders if o.get("status") == "pending"),
        "completed": sum(1 for o in orders if o.get("status") == "completed"),
    }

@api_router.get("/orders/track")
async def track_order(q: str):
    order = None
    if q.startswith("#"):
        num = int(q[1:]) if q[1:].isdigit() else 0
        order = await db.orders.find_one({"order_number": num}, {"_id": 0})
    elif q.isdigit():
        order = await db.orders.find_one({"order_number": int(q)}, {"_id": 0})
    else:
        order = await db.orders.find_one({"email": q.lower()}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@api_router.delete("/orders/reset")
async def reset_orders():
    await db.orders.delete_many({})
    return {"message": "All orders cleared."}

@api_router.get("/orders")
async def list_orders():
    orders = await db.orders.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return orders

@api_router.patch("/orders/{order_id}/status")
async def update_order_status(order_id: str, payload: dict):
    status = payload.get("status")
    tracking = payload.get("tracking_number")
    update_data = {}
    if status:
        if status not in ["pending", "confirmed", "shipped", "delivered", "completed", "cancelled"]:
            raise HTTPException(status_code=400, detail="Invalid status")
        update_data["status"] = status
    if tracking:
        update_data["tracking_number"] = tracking
    await db.orders.update_one({"id": order_id}, {"$set": update_data})
    return {"message": "Updated"}


@api_router.post("/coupons")
async def create_coupon(payload: CouponCreate):
    existing = await db.coupons.find_one({"code": payload.code.upper()})
    if existing:
        raise HTTPException(status_code=400, detail="Coupon code already exists")
    data = payload.model_dump()
    data["code"] = payload.code.upper()
    coupon = Coupon(**data)
    await db.coupons.insert_one(coupon.model_dump())
    return coupon

@api_router.get("/coupons")
async def list_coupons():
    coupons = await db.coupons.find({}, {"_id": 0}).to_list(200)
    return coupons

@api_router.post("/coupons/validate")
async def validate_coupon(payload: dict):
    code = payload.get("code", "").upper()
    order_total = payload.get("total", 0)
    coupon = await db.coupons.find_one({"code": code}, {"_id": 0})
    if not coupon:
        raise HTTPException(status_code=404, detail="Invalid coupon code")
    if not coupon.get("active"):
        raise HTTPException(status_code=400, detail="Coupon is no longer active")
    if coupon.get("uses", 0) >= coupon.get("max_uses", 100):
        raise HTTPException(status_code=400, detail="Coupon has reached its usage limit")
    if order_total < coupon.get("min_order", 0):
        raise HTTPException(status_code=400, detail=f"Minimum order required")
    if coupon["discount_type"] == "percent":
        discount = round(order_total * coupon["discount_value"] / 100, 2)
    else:
        discount = min(coupon["discount_value"], order_total)
    return {
        "valid": True, "code": code,
        "discount_type": coupon["discount_type"],
        "discount_value": coupon["discount_value"],
        "discount_amount": discount,
        "message": f"{'{}%'.format(int(coupon['discount_value'])) if coupon['discount_type'] == 'percent' else 'E{}'.format(coupon['discount_value'])} off applied!"
    }

@api_router.post("/coupons/use")
async def use_coupon(payload: dict):
    code = payload.get("code", "").upper()
    await db.coupons.update_one({"code": code}, {"$inc": {"uses": 1}})
    return {"message": "Coupon used"}

@api_router.delete("/coupons/{code}")
async def delete_coupon(code: str):
    await db.coupons.delete_one({"code": code.upper()})
    return {"message": "Deleted"}


@api_router.get("/users")
async def list_users():
    users = await db.users.find({}, {"_id": 0, "hashed_password": 0}).sort("created_at", -1).to_list(500)
    return users

@api_router.post("/admin/verify")
async def verify_admin(credentials: dict):
    admin_password = os.environ.get("ADMIN_PASSWORD", "elara2024")
    if credentials.get("password") == admin_password:
        return {"success": True, "message": "Admin authenticated"}
    else:
        raise HTTPException(status_code=401, detail="Invalid admin password")


@api_router.get("/test-email")
async def test_email():
    api_key = os.environ.get("RESEND_API_KEY")
    if not api_key:
        return {"error": "RESEND_API_KEY not set!"}
    return {"key_found": True, "key_preview": api_key[:8] + "..."}


app.include_router(api_router)