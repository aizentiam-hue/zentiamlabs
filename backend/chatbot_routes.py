from fastapi import APIRouter, UploadFile, File, HTTPException
from chatbot.models import ChatRequest, ChatResponse, ChatSession
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

# Import both AI services - enhanced with fallback to basic
try:
    from chatbot.enhanced_ai_service import enhanced_ai_service
    ai_service = enhanced_ai_service
    USE_ENHANCED = True
    logger.info("✅ Using Enhanced AI Service")
except Exception as e:
    logger.warning(f"⚠️ Enhanced AI Service not available, using basic: {e}")
    from chatbot.ai_service import ai_service
    USE_ENHANCED = False

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
        
        # Extract user info BEFORE generating response
        extracted_info = extract_user_info(request.message, user_info)
        
        # Track what was just extracted
        just_got_name = "name" in extracted_info
        just_got_email = "email" in extracted_info
        just_got_phone = "phone" in extracted_info
        
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
        
        # Check if user is declining to provide phone
        decline_phrases = [
            "don't want to", "dont want to", "no thanks", "skip", 
            "i'd rather not", "id rather not", "prefer not to",
            "not share", "not comfortable", "pass on that"
        ]
        message_lower = request.message.lower()
        is_declining_phone = any(phrase in message_lower for phrase in decline_phrases)
        
        # If user declined phone but we have name + email, trigger closure
        if is_declining_phone and user_info.get("name") and user_info.get("email") and not user_info.get("phone"):
            # Mark phone as skipped
            await db.chat_sessions.update_one(
                {"session_id": request.session_id},
                {
                    "$set": {
                        "user_phone": "skipped",
                        "info_collected": True,
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            show_closure = True
        else:
            # Check if we just completed info collection (got phone and have name + email)
            show_closure = (just_got_phone and user_info.get("name") and user_info.get("email"))
        
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
            conversation_history=session.get("messages", []),
            show_closure=show_closure
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
    
    # Extract email (most reliable)
    if not current_info.get("email"):
        email_pattern = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
        match = re.search(email_pattern, message)
        if match:
            extracted["email"] = match.group(0)
    
    # Extract phone (check for various formats)
    if not current_info.get("phone"):
        # Remove spaces and special characters for checking
        clean_message = re.sub(r'[^\d+]', '', message)
        if len(clean_message) >= 10:  # At least 10 digits
            phone_pattern = r"[\d\s\-\+\(\)]{10,}"
            match = re.search(phone_pattern, message)
            if match:
                extracted["phone"] = match.group(0).strip()
    
    # Extract name - accept any reasonable text ONLY when bot explicitly asked for name
    if not current_info.get("name"):
        # Check if message looks like a name (not an email, not just numbers, has letters)
        has_email = '@' in message
        has_url = 'http' in message.lower() or 'www' in message.lower()
        is_mostly_numbers = len(re.findall(r'\d', message)) > len(message) / 2
        
        if not has_email and not has_url and not is_mostly_numbers:
            # Clean the message - remove common prefixes
            clean_name = re.sub(r'(?i)^(my name is|i am|i\'m|this is|call me)\s+', '', message.strip())
            clean_name = re.sub(r'[^\w\s]', '', clean_name).strip()
            
            # If it's 1-4 words and each word starts with a letter, consider it a name
            words = clean_name.split()
            if 1 <= len(words) <= 4 and all(word[0].isalpha() for word in words if word):
                # Capitalize properly
                extracted["name"] = ' '.join(word.capitalize() for word in words)
    
    return extracted
