from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from dotenv import load_dotenv
from pathlib import Path
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

router = APIRouter(prefix="/api/admin")

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'zentiam_db')]

@router.get("/dashboard")
async def get_dashboard_stats():
    """
    Get dashboard statistics
    """
    try:
        # Get counts
        total_consultations = await db.consultations.count_documents({})
        new_consultations = await db.consultations.count_documents({"status": "new"})
        total_subscribers = await db.newsletter_subscribers.count_documents({"status": "active"})
        total_chat_sessions = await db.chat_sessions.count_documents({})
        
        # Get recent activity (last 7 days)
        week_ago = datetime.utcnow() - timedelta(days=7)
        recent_consultations = await db.consultations.count_documents({"created_at": {"$gte": week_ago}})
        recent_subscribers = await db.newsletter_subscribers.count_documents({"subscribed_at": {"$gte": week_ago}})
        recent_chats = await db.chat_sessions.count_documents({"created_at": {"$gte": week_ago}})
        
        return {
            "total_consultations": total_consultations,
            "new_consultations": new_consultations,
            "total_subscribers": total_subscribers,
            "total_chat_sessions": total_chat_sessions,
            "recent_activity": {
                "consultations": recent_consultations,
                "subscribers": recent_subscribers,
                "chats": recent_chats
            }
        }
    except Exception as e:
        logger.error(f"Error getting dashboard stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch dashboard stats")

@router.get("/recent-activity")
async def get_recent_activity(limit: int = 20):
    """
    Get recent activity across all channels
    """
    try:
        # Get recent consultations - with field projection for performance
        consultations = await db.consultations.find(
            {},
            {"_id": 0, "id": 1, "name": 1, "email": 1, "service": 1, "status": 1, "created_at": 1, "message": 1}
        ).sort("created_at", -1).limit(limit).to_list(limit)
        
        # Get recent chat sessions - exclude large message arrays, include only summary fields
        chat_sessions = await db.chat_sessions.find(
            {"messages": {"$exists": True, "$ne": []}},
            {"_id": 0, "session_id": 1, "user_name": 1, "user_email": 1, "user_phone": 1, "created_at": 1, "updated_at": 1, "info_collected": 1}
        ).sort("updated_at", -1).limit(limit).to_list(limit)
        
        # Get recent subscribers - with field projection
        subscribers = await db.newsletter_subscribers.find(
            {"status": "active"},
            {"_id": 0, "email": 1, "subscribed_at": 1, "status": 1}
        ).sort("subscribed_at", -1).limit(limit).to_list(limit)
        
        return {
            "consultations": consultations,
            "chat_sessions": chat_sessions,
            "subscribers": subscribers
        }
    except Exception as e:
        logger.error(f"Error getting recent activity: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch recent activity")
