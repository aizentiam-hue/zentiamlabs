from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from dotenv import load_dotenv
from pathlib import Path

logger = logging.getLogger(__name__)

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

router = APIRouter(prefix="/api/admin/settings")

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

class EmailConfig(BaseModel):
    provider: str
    apiKey: str
    fromEmail: EmailStr
    fromName: str

class GoogleSheetConfig(BaseModel):
    url: str

@router.get("")
async def get_settings():
    """
    Get current settings
    """
    try:
        settings = await db.settings.find_one({"type": "system"})
        
        if not settings:
            return {
                "email_config": {
                    "provider": "resend",
                    "apiKey": "",
                    "fromEmail": "noreply@zentiam.com",
                    "fromName": "Zentiam"
                },
                "google_sheet_url": ""
            }
        
        return {
            "email_config": settings.get("email_config", {}),
            "google_sheet_url": settings.get("google_sheet_url", "")
        }
    except Exception as e:
        logger.error(f"Error getting settings: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch settings")

@router.post("/email")
async def save_email_config(config: EmailConfig):
    """
    Save email configuration
    """
    try:
        # Update or create settings document
        await db.settings.update_one(
            {"type": "system"},
            {
                "$set": {
                    "email_config": config.dict()
                }
            },
            upsert=True
        )
        
        logger.info("Email configuration saved")
        return {"success": True, "message": "Email settings saved successfully"}
    except Exception as e:
        logger.error(f"Error saving email config: {e}")
        raise HTTPException(status_code=500, detail="Failed to save email settings")

@router.post("/google-sheet")
async def save_google_sheet_url(config: GoogleSheetConfig):
    """
    Save Google Sheet URL
    """
    try:
        # Update or create settings document
        await db.settings.update_one(
            {"type": "system"},
            {
                "$set": {
                    "google_sheet_url": config.url
                }
            },
            upsert=True
        )
        
        # Also update environment variable
        env_path = ROOT_DIR / '.env'
        with open(env_path, 'r') as f:
            lines = f.readlines()
        
        # Update GOOGLE_SHEET_URL line
        found = False
        for i, line in enumerate(lines):
            if line.startswith('GOOGLE_SHEET_URL='):
                lines[i] = f'GOOGLE_SHEET_URL={config.url}\n'
                found = True
                break
        
        if not found:
            lines.append(f'GOOGLE_SHEET_URL={config.url}\n')
        
        with open(env_path, 'w') as f:
            f.writelines(lines)
        
        logger.info("Google Sheet URL saved")
        return {"success": True, "message": "Google Sheet URL saved successfully"}
    except Exception as e:
        logger.error(f"Error saving Google Sheet URL: {e}")
        raise HTTPException(status_code=500, detail="Failed to save Google Sheet URL")
