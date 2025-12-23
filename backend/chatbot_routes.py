from fastapi import APIRouter, UploadFile, File, HTTPException
from chatbot.models import ChatRequest, ChatResponse, ChatSession
from chatbot.ai_service import ai_service
from chatbot.knowledge_base import knowledge_base
from chatbot.sheets_service import sheets_service
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from datetime import datetime
import re
from dotenv import load_dotenv
from pathlib import Path

logger = logging.getLogger(__name__)

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

router = APIRouter(prefix="/api/chatbot")

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

@router.post("/init")
async def initialize_chatbot():
    """Initialize chatbot and crawl website"""
    try:
        # Crawl the frontend website
        frontend_url = os.environ.get('REACT_APP_BACKEND_URL', '').replace('/api', '')
        if not frontend_url:
            frontend_url = "http://localhost:3000"
        
        success = knowledge_base.crawl_website(frontend_url)
        
        return {
            "success": success,
            "message": "Chatbot initialized and website crawled" if success else "Failed to crawl website"
        }
    except Exception as e:
        logger.error(f"Error initializing chatbot: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/session")
async def create_session():
    """Create a new chat session"""
    try:
        session = ChatSession()
        await db.chat_sessions.insert_one(session.dict())
        return {"session_id": session.session_id}
    except Exception as e:
        logger.error(f"Error creating session: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Process chat message"""
    try:
        # Get session
        session = await db.chat_sessions.find_one({"session_id": request.session_id})
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Extract user info from message if present
        user_info = {
            "name": session.get("user_name"),
            "email": session.get("user_email"),
            "phone": session.get("user_phone")
        }
        
        # Check for natural info sharing in message
        extracted_info = extract_user_info(request.message, user_info)
        if extracted_info:
            user_info.update(extracted_info)
            # Update session
            await db.chat_sessions.update_one(
                {"session_id": request.session_id},
                {
                    "$set": {
                        "user_name": user_info.get("name"),
                        "user_email": user_info.get("email"),
                        "user_phone": user_info.get("phone"),
                        "info_collected": all([user_info.get("name"), user_info.get("email"), user_info.get("phone")]),
                        "updated_at": datetime.utcnow()
                    }
                }
            )
        
        # Add user message to session
        await db.chat_sessions.update_one(
            {"session_id": request.session_id},
            {
                "$push": {
                    "messages": {
                        "sender": "user",
                        "message": request.message,
                        "timestamp": datetime.utcnow()
                    }
                },
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        
        # Generate AI response
        response_data = await ai_service.generate_response(
            session_id=request.session_id,
            user_message=request.message,
            user_info=user_info,
            conversation_history=session.get("messages", [])
        )
        
        # Add bot response to session
        await db.chat_sessions.update_one(
            {"session_id": request.session_id},
            {
                "$push": {
                    "messages": {
                        "sender": "bot",
                        "message": response_data["response"],
                        "timestamp": datetime.utcnow()
                    }
                },
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        
        # Track answered/unanswered questions
        if "?" in request.message:
            field = "answered_questions" if response_data.get("is_answered") else "unanswered_questions"
            await db.chat_sessions.update_one(
                {"session_id": request.session_id},
                {"$push": {field: request.message}}
            )
        
        # Log to Google Sheets if info is collected
        if user_info.get("name") and user_info.get("email"):
            session_updated = await db.chat_sessions.find_one({"session_id": request.session_id})
            sheets_service.log_conversation(session_updated)
        
        return ChatResponse(
            session_id=request.session_id,
            response=response_data["response"],
            needs_info=response_data.get("needs_info", False),
            info_type=response_data.get("info_type")
        )
        
    except Exception as e:
        logger.error(f"Error in chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    """Upload document to knowledge base"""
    try:
        content = await file.read()
        
        if file.filename.endswith('.pdf'):
            success = knowledge_base.add_pdf(content, file.filename)
        elif file.filename.endswith('.pptx'):
            success = knowledge_base.add_pptx(content, file.filename)
        elif file.filename.endswith('.txt'):
            text = content.decode('utf-8')
            success = knowledge_base.add_document(f"txt_{file.filename}", text, {"source": "upload", "filename": file.filename})
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type")
        
        if success:
            return {"message": f"Document {file.filename} uploaded successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to process document")
    
    except Exception as e:
        logger.error(f"Error uploading document: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sessions")
async def get_sessions(limit: int = 50):
    """Get all chat sessions"""
    try:
        # Only get sessions that have at least one message
        sessions = await db.chat_sessions.find(
            {"messages.0": {"$exists": True}},
            {"_id": 0}
        ).sort("created_at", -1).limit(limit).to_list(limit)
        return {"sessions": sessions}
    except Exception as e:
        logger.error(f"Error getting sessions: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/session/{session_id}")
async def get_session(session_id: str):
    """Get specific session details"""
    try:
        session = await db.chat_sessions.find_one(
            {"session_id": session_id},
            {"_id": 0}
        )
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        return session
    except Exception as e:
        logger.error(f"Error getting session: {e}")
        raise HTTPException(status_code=500, detail=str(e))

def extract_user_info(message: str, current_info: dict) -> dict:
    """Extract user information from message"""
    extracted = {}
    
    # Extract name
    if not current_info.get("name"):
        name_patterns = [
            r"(?:my name is|i'm|i am|this is|call me)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)",
            r"^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)$"  # Just a name
        ]
        for pattern in name_patterns:
            match = re.search(pattern, message, re.IGNORECASE)
            if match:
                extracted["name"] = match.group(1).strip()
                break
    
    # Extract email
    if not current_info.get("email"):
        email_pattern = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
        match = re.search(email_pattern, message)
        if match:
            extracted["email"] = match.group(0)
    
    # Extract phone
    if not current_info.get("phone"):
        phone_patterns = [
            r"\+?\d[\d\s\-\(\)]{8,}\d",
            r"\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}"
        ]
        for pattern in phone_patterns:
            match = re.search(pattern, message)
            if match:
                extracted["phone"] = match.group(0).strip()
                break
    
    return extracted
