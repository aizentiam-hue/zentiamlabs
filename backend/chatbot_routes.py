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
        
        # Get the last bot message for context (to check if bot asked for name)
        messages = session.get("messages", [])
        last_bot_message = ""
        for msg in reversed(messages):
            if msg.get("sender") == "bot":
                last_bot_message = msg.get("message", "")
                break
        
        # Extract user info BEFORE generating response (with context awareness)
        extracted_info = extract_user_info(request.message, user_info, last_bot_message)
        
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

def extract_user_info(message: str, current_info: dict, last_bot_message: str = "") -> dict:
    """
    Extract user information from message with context awareness.
    Only extracts name when:
    - Bot has explicitly asked for it, OR
    - User explicitly states their name with patterns like "My name is...", "I'm...", "Call me..."
    """
    extracted = {}
    message_lower = message.lower().strip()
    
    # Extract email (most reliable - always check)
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
    
    # Extract name - ONLY when appropriate context exists
    if not current_info.get("name"):
        # Check if bot explicitly asked for name
        bot_asked_for_name = False
        if last_bot_message:
            name_ask_patterns = [
                'your name', 'may i know your name', 'what is your name',
                "what's your name", 'who am i speaking', 'who am i talking',
                'could you share your name', 'can i get your name',
                'could i get your name', 'may i have your name'
            ]
            bot_asked_for_name = any(pattern in last_bot_message.lower() for pattern in name_ask_patterns)
        
        # Check if user is explicitly providing their name
        explicit_name_patterns = [
            r"^my name is\s+(.+)$",
            r"^i am\s+(.+)$",
            r"^i'm\s+(.+)$",
            r"^this is\s+(.+)$",
            r"^call me\s+(.+)$",
            r"^it's\s+(.+)$",
            r"^name:\s*(.+)$",
            r"^(.+)\s+here$",  # "John here"
        ]
        
        explicit_name = None
        for pattern in explicit_name_patterns:
            match = re.match(pattern, message_lower.strip())
            if match:
                explicit_name = match.group(1).strip()
                break
        
        # If bot asked for name OR user explicitly provided name, try to extract
        if bot_asked_for_name or explicit_name:
            # If explicit name pattern matched, use that
            if explicit_name:
                name_candidate = explicit_name
            else:
                name_candidate = message.strip()
            
            # Validate the name candidate
            name = _validate_and_extract_name(name_candidate)
            if name:
                extracted["name"] = name
    
    return extracted


def _validate_and_extract_name(text: str) -> str:
    """
    Validate and clean a potential name string.
    Returns cleaned name or empty string if invalid.
    """
    # Comprehensive list of phrases that are NOT names
    excluded_phrases = [
        # Common greetings and fillers
        'hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening',
        'thanks', 'thank you', 'please', 'okay', 'ok', 'sure', 'yes', 'no', 'yeah', 'yep', 'nope',
        
        # Help-related phrases
        'i need', 'i want', 'i have', 'i am looking', 'i would like', 'i\'d like',
        'help', 'help me', 'help with', 'question', 'questions', 'query',
        'assistance', 'support', 'information', 'info', 'details',
        
        # Service-related phrases
        'pricing', 'cost', 'price', 'quote', 'demo', 'consultation', 'consult',
        'ai services', 'ai solutions', 'services', 'products', 'solutions',
        'automation', 'chatbot', 'machine learning', 'data', 'analytics',
        
        # Question starters
        'what', 'how', 'why', 'when', 'where', 'which', 'who', 'can you', 'could you',
        'do you', 'does', 'is there', 'are there', 'tell me',
        
        # Action phrases
        'looking for', 'interested in', 'want to know', 'need to know',
        'trying to', 'wondering', 'curious', 'exploring', 'checking',
        
        # Common sentence starters that aren't names
        'just', 'actually', 'basically', 'well', 'so', 'anyway', 'like',
        'something', 'anything', 'nothing', 'someone', 'anyone',
        
        # Problem descriptions
        'problem', 'issue', 'trouble', 'struggling', 'difficult', 'challenge',
        'not working', 'broken', 'error', 'bug',
        
        # General inquiries
        'general inquiry', 'inquiry', 'enquiry', 'contact', 'reach',
    ]
    
    text_lower = text.lower().strip()
    
    # Check if it's an excluded phrase
    if any(phrase in text_lower for phrase in excluded_phrases):
        return ""
    
    # Check for clear non-name patterns
    has_email = '@' in text
    has_url = 'http' in text_lower or 'www' in text_lower
    is_mostly_numbers = len(re.findall(r'\d', text)) > len(text) / 2
    has_question_mark = '?' in text
    
    # Sentences that are likely questions or statements, not names
    is_sentence = len(text.split()) > 5 or text.endswith('?') or text.endswith('!')
    
    if has_email or has_url or is_mostly_numbers or has_question_mark or is_sentence:
        return ""
    
    # Clean the text
    # Remove punctuation except hyphens and apostrophes (common in names)
    clean_name = re.sub(r"[^\w\s\-\']", '', text).strip()
    
    # Split into words
    words = clean_name.split()
    
    # Valid name should be 1-4 words
    if not (1 <= len(words) <= 4):
        return ""
    
    # Each word should start with a letter and be reasonable length
    for word in words:
        if not word or not word[0].isalpha():
            return ""
        # Names are typically 2-20 characters
        if len(word) < 2 or len(word) > 20:
            return ""
    
    # Capitalize properly (Title Case)
    formatted_name = ' '.join(word.capitalize() for word in words)
    
    return formatted_name
