from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConfigurationError

from config import MONGO_URI

if not MONGO_URI:
    raise ValueError("MONGO_URI environment variable is not set")

client = AsyncIOMotorClient(MONGO_URI)

try:
    db = client.get_default_database()
except ConfigurationError:
    db = client["rabbit_hole_explorer"]
