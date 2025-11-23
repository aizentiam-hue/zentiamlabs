from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from datetime import datetime
from dotenv import load_dotenv
from pathlib import Path

logger = logging.getLogger(__name__)

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

router = APIRouter(prefix="/api/newsletter")

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

class NewsletterSubscribe(BaseModel):
    email: EmailStr

class NewsletterResponse(BaseModel):
    success: bool
    message: str

@router.post("/subscribe", response_model=NewsletterResponse)
async def subscribe(subscription: NewsletterSubscribe):
    """
    Subscribe to newsletter
    """
    try:
        # Check if already subscribed
        existing = await db.newsletter_subscribers.find_one({"email": subscription.email})
        
        if existing:
            if existing.get("status") == "unsubscribed":
                # Reactivate
                await db.newsletter_subscribers.update_one(
                    {"email": subscription.email},
                    {
                        "$set": {
                            "status": "active",
                            "resubscribed_at": datetime.utcnow(),
                            "updated_at": datetime.utcnow()
                        }
                    }
                )
                return NewsletterResponse(
                    success=True,
                    message="Welcome back! Your subscription has been reactivated."
                )
            return NewsletterResponse(
                success=True,
                message="You're already subscribed!"
            )
        
        # New subscription
        subscriber = {
            "email": subscription.email,
            "status": "active",
            "subscribed_at": datetime.utcnow(),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        await db.newsletter_subscribers.insert_one(subscriber)
        logger.info(f"New newsletter subscriber: {subscription.email}")
        
        return NewsletterResponse(
            success=True,
            message="Thanks for subscribing!"
        )
        
    except Exception as e:
        logger.error(f"Error subscribing: {e}")
        raise HTTPException(status_code=500, detail="Failed to subscribe")

@router.post("/unsubscribe")
async def unsubscribe(subscription: NewsletterSubscribe):
    """
    Unsubscribe from newsletter
    """
    try:
        result = await db.newsletter_subscribers.update_one(
            {"email": subscription.email},
            {
                "$set": {
                    "status": "unsubscribed",
                    "unsubscribed_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Email not found")
        
        return {"success": True, "message": "Successfully unsubscribed"}
        
    except Exception as e:
        logger.error(f"Error unsubscribing: {e}")
        raise HTTPException(status_code=500, detail="Failed to unsubscribe")
