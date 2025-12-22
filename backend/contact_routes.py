from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr, Field
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from datetime import datetime
from dotenv import load_dotenv
from pathlib import Path
from email_service import email_service

logger = logging.getLogger(__name__)

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

router = APIRouter(prefix="/api/contact")

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Models
class ConsultationRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    company: str = Field(default="", max_length=100)
    phone: str = Field(default="", max_length=20)
    service: str = Field(..., min_length=1)
    message: str = Field(..., min_length=10, max_length=2000)

class NewsletterSubscription(BaseModel):
    email: EmailStr

class ConsultationResponse(BaseModel):
    success: bool
    message: str
    submission_id: str

class NewsletterResponse(BaseModel):
    success: bool
    message: str

# Routes
@router.post("/consultation", response_model=ConsultationResponse)
async def submit_consultation(request: ConsultationRequest):
    """
    Handle consultation booking form submissions
    """
    try:
        # Create consultation document with unique ID
        from uuid import uuid4
        consultation_id = str(uuid4())
        consultation_doc = {
            "id": consultation_id,
            "name": request.name,
            "email": request.email,
            "company": request.company,
            "phone": request.phone,
            "service": request.service,
            "message": request.message,
            "status": "new",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Insert into database
        result = await db.consultations.insert_one(consultation_doc)
        
        logger.info(f"New consultation request from {request.email}")
        
        # Send confirmation email (async, don't wait)
        try:
            await email_service.send_consultation_confirmation(consultation_doc)
        except Exception as e:
            logger.error(f"Failed to send email: {e}")
        
        return ConsultationResponse(
            success=True,
            message="Thank you! We'll get back to you within 24 hours.",
            submission_id=str(result.inserted_id)
        )
        
    except Exception as e:
        logger.error(f"Error submitting consultation: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit consultation request")

@router.post("/newsletter", response_model=NewsletterResponse)
async def subscribe_newsletter(subscription: NewsletterSubscription):
    """
    Handle newsletter subscriptions
    """
    try:
        # Check if email already exists
        existing = await db.newsletter_subscribers.find_one({"email": subscription.email})
        
        if existing:
            if existing.get("status") == "unsubscribed":
                # Reactivate subscription
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
            else:
                return NewsletterResponse(
                    success=True,
                    message="You're already subscribed to our newsletter!"
                )
        
        # Create new subscription
        subscriber_doc = {
            "email": subscription.email,
            "status": "active",
            "subscribed_at": datetime.utcnow(),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        await db.newsletter_subscribers.insert_one(subscriber_doc)
        
        logger.info(f"New newsletter subscription: {subscription.email}")
        
        return NewsletterResponse(
            success=True,
            message="Thanks for subscribing! Check your inbox for updates."
        )
        
    except Exception as e:
        logger.error(f"Error subscribing to newsletter: {e}")
        raise HTTPException(status_code=500, detail="Failed to subscribe to newsletter")

@router.get("/consultations")
async def get_consultations(limit: int = 50, status: str = None):
    """
    Get all consultation requests (admin endpoint)
    """
    try:
        query = {}
        if status:
            query["status"] = status
        
        consultations = await db.consultations.find(query, {"_id": 0}).sort("created_at", -1).limit(limit).to_list(limit)
        return {"consultations": consultations, "count": len(consultations)}
    except Exception as e:
        logger.error(f"Error getting consultations: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch consultations")

@router.get("/newsletter/subscribers")
async def get_subscribers(limit: int = 100, status: str = "active"):
    """
    Get newsletter subscribers (admin endpoint)
    """
    try:
        query = {"status": status}
        subscribers = await db.newsletter_subscribers.find(query, {"_id": 0}).sort("subscribed_at", -1).limit(limit).to_list(limit)
        return {"subscribers": subscribers, "count": len(subscribers)}
    except Exception as e:
        logger.error(f"Error getting subscribers: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch subscribers")

@router.patch("/consultations/{consultation_id}/status")
async def update_consultation_status(consultation_id: str, status: str):
    """
    Update consultation status (admin endpoint)
    """
    try:
        result = await db.consultations.update_one(
            {"id": consultation_id},
            {
                "$set": {
                    "status": status,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Consultation not found")
        
        return {"success": True, "message": "Status updated successfully"}
    except Exception as e:
        logger.error(f"Error updating consultation status: {e}")
        raise HTTPException(status_code=500, detail="Failed to update status")
