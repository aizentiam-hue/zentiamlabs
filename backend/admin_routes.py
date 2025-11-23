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
db = client[os.environ['DB_NAME']]

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
        # Get recent consultations
        consultations = await db.consultations.find().sort("created_at", -1).limit(limit).to_list(limit)
        
        # Get recent chat sessions with messages
        chat_sessions = await db.chat_sessions.find(
            {"messages": {"$exists": True, "$ne": []}}
        ).sort("updated_at", -1).limit(limit).to_list(limit)
        
        # Get recent subscribers
        subscribers = await db.newsletter_subscribers.find(
            {"status": "active"}
        ).sort("subscribed_at", -1).limit(limit).to_list(limit)
        
        return {
            "consultations": consultations,
            "chat_sessions": chat_sessions,
            "subscribers": subscribers
        }
    except Exception as e:
        logger.error(f"Error getting recent activity: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch recent activity")
