from motor.motor_asyncio import AsyncIOMotorClient

from config import MONGO_URI

if not MONGO_URI:
    raise ValueError("MONGO_URI environment variable is not set")

client = AsyncIOMotorClient(MONGO_URI)
