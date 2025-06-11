from motor.motor_asyncio import AsyncIOMotorClient
from config.config import MONGODB_URI, DB_NAME

def get_db():
    """Get a new database connection for each request"""
    client = AsyncIOMotorClient(MONGODB_URI)
    return client[DB_NAME]
