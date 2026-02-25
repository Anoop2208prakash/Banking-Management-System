from prisma import Prisma

# Global client instance
db = Prisma()

async def connect_db():
    """Connect to MongoDB if not already connected."""
    if not db.is_connected():
        await db.connect()

async def disconnect_db():
    """Safely disconnect from MongoDB."""
    if db.is_connected():
        await db.disconnect()