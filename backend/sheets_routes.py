from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict
import os
import base64
import json
import logging
from motor.motor_asyncio import AsyncIOMotorClient
from chatbot.google_sheets_service import google_sheets_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/admin/sheets")

# Database connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'zentiam_db')]

class SheetsConfigRequest(BaseModel):
    credentials_json: str
    spreadsheet_id: str

class SyncRequest(BaseModel):
    session_ids: Optional[List[str]] = None  # If None, sync all unsent

@router.get("/status")
async def get_sheets_status():
    """Get Google Sheets integration status"""
    try:
        # Get config from database
        config = await db.settings.find_one({"type": "google_sheets"})
        
        if not config:
            return {
                "configured": False,
                "connected": False,
                "spreadsheet_id": None,
                "last_sync": None
            }
        
        # Test connection
        test_result = google_sheets_service.test_connection()
        
        return {
            "configured": True,
            "connected": test_result.get("success", False),
            "spreadsheet_id": config.get("spreadsheet_id"),
            "last_sync": config.get("last_sync"),
            "total_synced": config.get("total_synced", 0),
            "error": test_result.get("error") if not test_result.get("success") else None
        }
    except Exception as e:
        logger.error(f"Error getting sheets status: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/configure")
async def configure_sheets(config: SheetsConfigRequest):
    """Configure Google Sheets integration"""
    try:
        # Validate JSON
        try:
            creds_dict = json.loads(config.credentials_json)
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid JSON credentials")
        
        # Extract spreadsheet ID from URL if full URL provided
        spreadsheet_id = config.spreadsheet_id
        if 'docs.google.com' in spreadsheet_id:
            # Extract ID from URL
            import re
            match = re.search(r'/d/([a-zA-Z0-9-_]+)', spreadsheet_id)
            if match:
                spreadsheet_id = match.group(1)
        
        # Configure the service
        success = google_sheets_service.configure(config.credentials_json, spreadsheet_id)
        
        if not success:
            raise HTTPException(status_code=400, detail="Failed to configure Google Sheets")
        
        # Test connection
        test_result = google_sheets_service.test_connection()
        if not test_result.get("success"):
            raise HTTPException(status_code=400, detail=f"Connection test failed: {test_result.get('error')}")
        
        # Save config to database (credentials encoded)
        encoded_creds = base64.b64encode(config.credentials_json.encode()).decode()
        
        await db.settings.update_one(
            {"type": "google_sheets"},
            {
                "$set": {
                    "type": "google_sheets",
                    "credentials_encoded": encoded_creds,
                    "spreadsheet_id": spreadsheet_id,
                    "configured_at": __import__('datetime').datetime.utcnow(),
                    "total_synced": 0
                }
            },
            upsert=True
        )
        
        # Also set environment variables for the current session
        os.environ['GOOGLE_SHEETS_CREDENTIALS_JSON'] = encoded_creds
        os.environ['GOOGLE_SHEETS_SPREADSHEET_ID'] = spreadsheet_id
        
        return {
            "success": True,
            "message": "Google Sheets configured successfully",
            "spreadsheet_id": spreadsheet_id
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error configuring sheets: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/sync")
async def sync_sessions(request: SyncRequest = None):
    """Sync chat sessions to Google Sheets"""
    try:
        if not google_sheets_service.is_configured:
            raise HTTPException(status_code=400, detail="Google Sheets not configured")
        
        # Get sessions to sync
        query = {"synced_to_sheets": {"$ne": True}}
        if request and request.session_ids:
            query["session_id"] = {"$in": request.session_ids}
        
        sessions = await db.chat_sessions.find(query).to_list(100)
        
        synced_count = 0
        errors = []
        
        for session in sessions:
            try:
                success = google_sheets_service.log_chat_session(session)
                if success:
                    # Mark as synced
                    await db.chat_sessions.update_one(
                        {"session_id": session["session_id"]},
                        {"$set": {"synced_to_sheets": True, "synced_at": __import__('datetime').datetime.utcnow()}}
                    )
                    synced_count += 1
                else:
                    errors.append(f"Failed to sync session {session.get('session_id')}")
            except Exception as e:
                errors.append(f"Error syncing {session.get('session_id')}: {str(e)}")
        
        # Update total synced count
        await db.settings.update_one(
            {"type": "google_sheets"},
            {
                "$inc": {"total_synced": synced_count},
                "$set": {"last_sync": __import__('datetime').datetime.utcnow()}
            }
        )
        
        return {
            "success": True,
            "synced_count": synced_count,
            "total_sessions": len(sessions),
            "errors": errors if errors else None
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error syncing sessions: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/recent-logs")
async def get_recent_logs(limit: int = 10):
    """Get recent logs from Google Sheets"""
    try:
        if not google_sheets_service.is_configured:
            return {"logs": [], "error": "Not configured"}
        
        logs = google_sheets_service.get_recent_logs(limit)
        return {"logs": logs}
    except Exception as e:
        logger.error(f"Error getting recent logs: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/test-connection")
async def test_connection():
    """Test the Google Sheets connection"""
    try:
        result = google_sheets_service.test_connection()
        return result
    except Exception as e:
        logger.error(f"Error testing connection: {e}")
        return {"success": False, "error": str(e)}
