import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
import uuid
from datetime import datetime

load_dotenv()

# Products from your original data
PRODUCTS = [
    {
        "id": str(uuid.uuid4()),
        "name": "Soirée Pump",
        "brand": "Manolo Blahnik",
        "price": 1050,
        "category": "heels",
        "description": "Iconic pointed-toe pump with a sleek 105mm heel. Timeless elegance in supple leather.",
        "sizes": ["35", "36", "37", "38", "39", "40", "41"],
        "image": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400",
        "stock": 50,
        "featured": True,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Belle Mule",
        "brand": "Aquazzura",
        "price": 795,
        "category": "mules",
        "description": "Backless mule with delicate crystal embellishments. Effortless luxury.",
        "sizes": ["35", "36", "37", "38", "39", "40"],
        "image": "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=400",
        "stock": 35,
        "featured": True,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Cascade Sandal",
        "brand": "Gianvito Rossi",
        "price": 895,
        "category": "sandals",
        "description": "Strappy sandal with fluid lines and a sculpted heel. Summer sophistication.",
        "sizes": ["36", "37", "38", "39", "40", "41"],
        "image": "https://images.unsplash.com/photo-1562183241-b937e95585b6?w=400",
        "stock": 42,
        "featured": True,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Whisper Flat",
        "brand": "The Row",
        "price": 690,
        "category": "flats",
        "description": "Minimalist ballet flat in butter-soft nappa. Quiet luxury.",
        "sizes": ["35", "36", "37", "38", "39", "40"],
        "image": "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400",
        "stock": 60,
        "featured": False,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Chelsea Boot",
        "brand": "Bottega Veneta",
        "price": 1250,
        "category": "boots",
        "description": "Signature intrecciato weave on a sleek ankle boot. Italian craftsmanship.",
        "sizes": ["36", "37", "38", "39", "40", "41"],
        "image": "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400",
        "stock": 28,
        "featured": False,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Satin Slingback",
        "brand": "Jimmy Choo",
        "price": 850,
        "category": "evening",
        "description": "Crystal-adorned slingback in midnight satin. Red carpet ready.",
        "sizes": ["35", "36", "37", "38", "39", "40"],
        "image": "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400",
        "stock": 33,
        "featured": True,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Aria Pump",
        "brand": "Christian Louboutin",
        "price": 1195,
        "category": "heels",
        "description": "Classic pointed pump with signature red sole. 100mm heel.",
        "sizes": ["35", "36", "37", "38", "39", "40", "41"],
        "image": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400",
        "stock": 45,
        "featured": True,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Daisy Mule",
        "brand": "Malone Souliers",
        "price": 695,
        "category": "mules",
        "description": "Double-band mule in contrasting leather. Modern femininity.",
        "sizes": ["36", "37", "38", "39", "40"],
        "image": "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400",
        "stock": 38,
        "featured": False,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Summer Espadrille",
        "brand": "Castañer",
        "price": 195,
        "category": "sandals",
        "description": "Canvas wedge espadrille with ankle ties. Riviera classic.",
        "sizes": ["35", "36", "37", "38", "39", "40", "41"],
        "image": "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400",
        "stock": 70,
        "featured": False,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Velvet Loafer",
        "brand": "Gucci",
        "price": 790,
        "category": "flats",
        "description": "Embroidered velvet loafer with signature horsebit. Evening sophistication.",
        "sizes": ["35", "36", "37", "38", "39", "40"],
        "image": "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400",
        "stock": 52,
        "featured": False,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Knee High Boot",
        "brand": "Stuart Weitzman",
        "price": 895,
        "category": "boots",
        "description": "Stretch suede boot with a sleek silhouette. Effortless elegance.",
        "sizes": ["36", "37", "38", "39", "40", "41"],
        "image": "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400",
        "stock": 24,
        "featured": False,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Pearl Pump",
        "brand": "Nicholas Kirkwood",
        "price": 995,
        "category": "evening",
        "description": "Architectural heel adorned with pearls. Statement elegance.",
        "sizes": ["35", "36", "37", "38", "39", "40"],
        "image": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400",
        "stock": 29,
        "featured": True,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Strappy Heel",
        "brand": "Alexandre Birman",
        "price": 725,
        "category": "heels",
        "description": "Cage sandal with python-embossed leather. Bold and refined.",
        "sizes": ["36", "37", "38", "39", "40", "41"],
        "image": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400",
        "stock": 41,
        "featured": False,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Slide Sandal",
        "brand": "Ancient Greek Sandals",
        "price": 245,
        "category": "sandals",
        "description": "Handcrafted leather slide. Grecian simplicity.",
        "sizes": ["35", "36", "37", "38", "39", "40", "41"],
        "image": "https://images.unsplash.com/photo-1562183241-b937e95585b6?w=400",
        "stock": 65,
        "featured": False,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Mary Jane",
        "brand": "Prada",
        "price": 850,
        "category": "flats",
        "description": "Patent leather Mary Jane with logo plaque. Modern nostalgia.",
        "sizes": ["35", "36", "37", "38", "39", "40"],
        "image": "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400",
        "stock": 47,
        "featured": False,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Combat Boot",
        "brand": "Dr. Martens",
        "price": 180,
        "category": "boots",
        "description": "Iconic leather boot with air-cushioned sole. Rebellion refined.",
        "sizes": ["36", "37", "38", "39", "40", "41", "42"],
        "image": "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400",
        "stock": 80,
        "featured": False,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Crystal Pump",
        "brand": "Amina Muaddi",
        "price": 1095,
        "category": "evening",
        "description": "Sculptural heel with crystal-encrusted details. Modern glamour.",
        "sizes": ["35", "36", "37", "38", "39", "40"],
        "image": "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400",
        "stock": 31,
        "featured": True,
        "created_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Platform Sandal",
        "brand": "Sergio Rossi",
        "price": 795,
        "category": "heels",
        "description": "Ankle-strap platform with a bold silhouette. Statuesque elegance.",
        "sizes": ["36", "37", "38", "39", "40", "41"],
        "image": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400",
        "stock": 36,
        "featured": False,
        "created_at": datetime.utcnow().isoformat()
    }
]

async def seed_products():
    mongo_url = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
    db_name = os.environ.get("DB_NAME", "elara_db")
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    # Clear existing products
    await db.products.delete_many({})
    print("✓ Cleared existing products")
    
    # Insert all products
    await db.products.insert_many(PRODUCTS)
    print(f"✓ Inserted {len(PRODUCTS)} products")
    
    print("\n🌸 Database seeded successfully!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_products())