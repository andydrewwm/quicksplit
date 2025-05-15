from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
import asyncio

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

try:
    client = AsyncIOMotorClient(
        MONGO_URI,
        serverSelectionTimeoutMS=5000  # 5 second timeout
    )

    # Connection test function
    async def test_connection():
        try:
            await client.admin.command('ping')
            print("MongoDB connection successful!")
        except Exception as e:
            print(f"MongoDB connection failed: {str(e)}")

    # Run the test
    asyncio.create_task(test_connection())

    db = client.QuickSplit  # Database name
    receipts_collection = db.receipts  # Collection name

except Exception as e:
    print(f"Error initializing MongoDB client: {str(e)}")
